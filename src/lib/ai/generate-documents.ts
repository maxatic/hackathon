import {
  CV_STRUCTURED_SCHEMA,
  buildCvLatexFromStructured,
  buildCvPlainFromStructured,
  parseCvStructured,
} from "@/lib/ai/cv-template";
import { generateJsonText } from "@/lib/ai/llm-client";

/** Internal hint after PDF analysis: second page had too little text — force a one-page CV. */
export type CvLayoutHint = "compress_second_page";

export type GenerateInput = {
  locale: "de" | "en";
  masterProfile: Record<string, unknown>;
  company: string;
  roleTitle: string;
  jdText: string;
  /** Set by the server after a sparse two-page PDF; triggers stronger compress instructions. */
  cvLayoutHint?: CvLayoutHint;
};

export type GeneratedPair = {
  cv_latex: string;
  cover_letter_latex: string;
  cv_plain: string;
  cover_letter_plain: string;
};

function buildPrompt(input: GenerateInput): string {
  const lang = input.locale === "de" ? "German" : "English";
  const formal =
    input.locale === "de"
      ? "Use formal Sie-form where appropriate for the cover letter."
      : "Use professional, formal tone for the cover letter.";

  const profileJson = JSON.stringify(input.masterProfile, null, 2);

  return `You are an expert career writer for job seekers in Germany, Austria, and Switzerland (DACH).

Target language for all user-facing text in the CV: ${lang}.
${formal}

The CV layout (LaTeX preamble, section order, resume macros, header with photo minipage, signature footer) is fixed in application code — you must NOT invent a custom CV LaTeX class or alternate section list.
You only provide structured JSON in "cv_structured" so the app can fill the canonical template (same design as the reference resume: Summary, Professional Experience, Education, Selected Projects, Skills, Certifications, then date line).

Master profile (JSON — may be partial or empty; infer reasonably):
${profileJson}

Job context:
- Company: ${input.company || "(unknown)"}
- Role: ${input.roleTitle || "(unknown)"}
- Job description (source of truth for tailoring):
"""
${input.jdText || "(no description provided)"}
"""

Return ONLY valid JSON with these exact top-level keys (no markdown fences):
{
${CV_STRUCTURED_SCHEMA},
  "cover_letter_latex": "Full LaTeX source for a formal ${input.locale === "de" ? "Anschreiben" : "cover letter"} (letter class or article), addressed to the company, referencing the role and 2–3 concrete JD requirements.",
  "cover_letter_plain": "Plain text version of the cover letter only (no LaTeX), with greeting, body paragraphs, closing."
}

Rules:
- Fill cv_structured from the master profile and tailor bullets to the job description; do not invent employers or degrees not implied by the profile.
- Keep arrays present (use [] if a section has no items).
- cover_letter_latex: self-contained and compilable in principle (common packages only if needed).

CV length (fixed template — you control only how much text goes into each section):
- Aim for EITHER one dense page OR two full pages. Avoid a second page that is only a small tail of content (a few lines or a short block); that reads poorly in PDF.
- If the profile is light or mid-length, compress to one page: shorter summary, fewer bullets per role (often 2–3), trim older or less relevant roles/projects, tighter wording.
- If the profile is rich and needs two pages, commit to two pages: enough bullets and detail on page 2 that the second page is substantially filled (not a sliver).
- Do not pad with fluff; prioritize relevance to the job description.${input.cvLayoutHint === "compress_second_page" ? `

CRITICAL — layout fix: The previous PDF had two pages but the second page was too sparse. Merge to ONE page: shorten bullets, reduce bullet count per role, tighten the summary, drop lowest-priority items or older roles only when still supported by the master profile. Do not invent facts.` : ""}`;
}

export async function generateDocuments(
  input: GenerateInput,
): Promise<GeneratedPair> {
  const text = await generateJsonText(buildPrompt(input), {
    temperature: 0.35,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned non-JSON output");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("cv_structured" in parsed) ||
    !("cover_letter_latex" in parsed) ||
    !("cover_letter_plain" in parsed)
  ) {
    throw new Error(
      "AI JSON missing required keys (cv_structured, cover_letter_latex, cover_letter_plain)",
    );
  }

  const o = parsed as Record<string, unknown>;

  let cvStructured;
  try {
    cvStructured = parseCvStructured(o.cv_structured);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid cv_structured";
    throw new Error(msg);
  }

  return {
    cv_latex: buildCvLatexFromStructured(cvStructured),
    cv_plain: buildCvPlainFromStructured(cvStructured),
    cover_letter_latex: fixLatexEscaping(String(o.cover_letter_latex ?? "")),
    cover_letter_plain: String(o.cover_letter_plain ?? ""),
  };
}

/**
 * AI models frequently emit `\[…pt]` when they mean `\\[…pt]` (line break
 * with vertical spacing), because the JSON→string decode eats one layer of
 * backslash. Likewise `$\vcenter…$` can lose its backslash in labelitemii.
 * This function patches the most common breakage patterns.
 */
function fixLatexEscaping(tex: string): string {
  let out = tex;

  // AI emits \[Xpt] (math display) instead of \\[Xpt] (line break + vspace).
  out = out.replace(/(?<!\\)\\\[(\d+pt)\]/g, "\\\\[$1]");

  // AI drops the $…$ math-mode wrapper around \vcenter in labelitemii.
  // Template: $\vcenter{\hbox{\tiny$\bullet$}}$
  out = out.replace(
    /\\renewcommand\\labelitemii\{\\vcenter\{\\hbox\{\\tiny\$\\bullet\$\}\}\}/g,
    "\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}",
  );

  return out;
}

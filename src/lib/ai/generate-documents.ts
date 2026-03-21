import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  CV_STRUCTURED_SCHEMA,
  buildCvLatexFromStructured,
  buildCvPlainFromStructured,
  parseCvStructured,
} from "@/lib/ai/cv-template";

export type GenerateInput = {
  locale: "de" | "en";
  masterProfile: Record<string, unknown>;
  company: string;
  roleTitle: string;
  jdText: string;
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
- cover_letter_latex: self-contained and compilable in principle (common packages only if needed).`;
}

export async function generateDocuments(
  input: GenerateInput,
): Promise<GeneratedPair> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash";
  const model = genAI.getGenerativeModel({
    model: modelName,
  });

  let result;
  try {
    result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.35,
      },
    });
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    if (
      raw.includes("429") ||
      raw.includes("Too Many Requests") ||
      raw.includes("quota") ||
      raw.includes("Quota")
    ) {
      throw new Error(
        `Gemini quota or rate limit (${modelName}). Wait 1–2 minutes and try again. If this persists, open Google AI Studio → enable billing or create a new API key, or set GOOGLE_AI_MODEL in .env.local to another model (see .env.example). Raw: ${raw.slice(0, 400)}`,
      );
    }
    throw err;
  }

  const text = result.response.text();
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

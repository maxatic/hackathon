import { readFileSync } from "node:fs";
import path from "node:path";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

let cachedCvTemplate: string | null = null;

function loadCvLatexTemplate(): string {
  if (cachedCvTemplate !== null) {
    return cachedCvTemplate;
  }
  const filePath = path.join(process.cwd(), "templates", "cv-main.tex");
  try {
    cachedCvTemplate = readFileSync(filePath, "utf8");
  } catch {
    throw new Error(
      `Missing CV template at templates/cv-main.tex (copy your main.tex there).`,
    );
  }
  return cachedCvTemplate;
}

function buildPrompt(input: GenerateInput): string {
  const lang = input.locale === "de" ? "German" : "English";
  const formal =
    input.locale === "de"
      ? "Use formal Sie-form where appropriate for the cover letter."
      : "Use professional, formal tone for the cover letter.";

  const profileJson = JSON.stringify(input.masterProfile, null, 2);
  const cvTemplate = loadCvLatexTemplate();

  return `You are an expert career writer for job seekers in Germany, Austria, and Switzerland (DACH).

Target language for all user-facing text in the CV: ${lang}.
${formal}

Master profile (JSON — may be partial or empty; infer reasonably):
${profileJson}

Job context:
- Company: ${input.company || "(unknown)"}
- Role: ${input.roleTitle || "(unknown)"}
- Job description (source of truth for tailoring):
"""
${input.jdText || "(no description provided)"}
"""

--- REFERENCE CV LaTeX TEMPLATE (design + outline only) ---
The following file defines the REQUIRED layout, packages, macros, and section order for cv_latex.
You must COPY this structure (preamble, environments, commands, spacing), NOT the example biographical content inside it.

${cvTemplate}
--- END REFERENCE TEMPLATE ---

Return ONLY valid JSON with these exact string keys (no markdown fences):
{
  "cv_latex": "...",
  "cover_letter_latex": "...",
  "cv_plain": "...",
  "cover_letter_plain": "..."
}

=== cv_latex (strict) ===
1. From \\documentclass through the last \\newcommand before \\begin{document} (the entire preamble + macro definitions), reproduce the reference template VERBATIM — same packages, lengths, \\titleformat, and every \\newcommand (\\resumeItem … \\resumeItemListEnd) exactly as in the template. Do not swap article for another class or remove packages.
2. From \\begin{document} to \\end{document}: keep the SAME visual structure and section order as the template:
   - Header: left minipage with \\includegraphics[width=\\linewidth]{Photo 1.png} (keep this line as-is), right minipage with {\\fontsize{26pt}{28pt}\\selectfont\\scshape <Name>}, then address block, \\href{mailto:…}{…}, optional website/LinkedIn lines, phone, optional birth line if present in profile — all filled ONLY from the master profile, never from the template’s example text.
   - \\section{Summary} using the same itemize wrapper as the template.
   - \\section{Professional Experience} with \\resumeSubHeadingListStart, repeated blocks of \\resumeSubheading{Title}{dates}{Company}{Location}, \\resumeItemListStart, one or more \\resumeItem{…}, \\resumeItemListEnd, then \\resumeSubHeadingListEnd.
   - \\section{Education} with the same \\resumeSubheading / \\resumeItem pattern.
   - \\section{Selected Projects} only if the profile implies projects; otherwise omit this entire section (no empty \\section). When included, use \\resumeProjectHeading{\\textbf{Name} $|$ \\emph{subtitle}}{dates} like the template (math-mode pipe between title and subtitle).
   - \\section{Skills} using the same single itemize with \\small{\\item{ ... \\textbf{Category}{: items} \\}} pattern as the template (adapt category names to the profile).
   - \\section{Certifications} only if the profile has certifications; otherwise omit the whole section. Use \\resumeProjectHeading with \\href when URLs exist; otherwise plain text.
   - Closing: \\vfill, \\begin{center} <city from profile or location>, \\today \\end{center} — mirror the template’s signature block, not the template’s city if it differs from profile.
3. CRITICAL: Do NOT copy any names, employers, dates, bullets, metrics, URLs, project titles, or certificate titles from the reference template. Every fact must come from the master profile (and job tailoring where relevant). If the profile lacks a field, omit that line or subsection rather than inventing or reusing template filler.
4. Escape LaTeX special characters in user-derived strings: backslash, $, %, #, _, {, }, ~, ^, &.
5. Output one complete compilable .tex document string (the full file).

=== cv_plain (strict) ===
Mirror the SAME outline and hierarchy as the LaTeX CV above, in plain text only (no LaTeX, no markdown):
- Header block: name (prominent), address lines, email, links if in profile, phone, optional birth — same order as the template header.
- Blank line, then SUMMARY (section title in Title Case or ALL CAPS), then paragraph(s).
- PROFESSIONAL EXPERIENCE: for each role, a title line, company/location line, dates, then lines starting with " - " for bullets.
- EDUCATION: same pattern.
- SELECTED PROJECTS: only if profile supports it.
- SKILLS: grouped lines like "TECHNICAL: …" / "LANGUAGES: …" matching the template’s category style.
- CERTIFICATIONS: only if in profile.
- Footer line: "<City>, <current month year>" similar to the template closing.
Again: zero wording copied from the template example; only profile-derived (and JD-tailored) content.

=== cover_letter_latex / cover_letter_plain ===
Unchanged expectation: formal ${input.locale === "de" ? "Anschreiben" : "cover letter"} to the company, referencing the role and 2–3 concrete JD requirements. Letter may use a simple letter/article class; it does NOT need to match the CV preamble.

General rules:
- Tailor to the job description where a JD is provided; do not invent employers or degrees not implied by the profile.
- JSON string values must escape backslashes and quotes as required by JSON.`;
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
    !("cv_latex" in parsed) ||
    !("cover_letter_latex" in parsed) ||
    !("cv_plain" in parsed) ||
    !("cover_letter_plain" in parsed)
  ) {
    throw new Error("AI JSON missing required keys");
  }

  const o = parsed as Record<string, unknown>;
  return {
    cv_latex: fixLatexEscaping(String(o.cv_latex ?? "")),
    cover_letter_latex: fixLatexEscaping(String(o.cover_letter_latex ?? "")),
    cv_plain: String(o.cv_plain ?? ""),
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

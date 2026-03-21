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

function buildPrompt(input: GenerateInput): string {
  const lang = input.locale === "de" ? "German" : "English";
  const formal =
    input.locale === "de"
      ? "Use formal Sie-form where appropriate for the cover letter."
      : "Use professional, formal tone for the cover letter.";

  const profileJson = JSON.stringify(input.masterProfile, null, 2);

  return `You are an expert career writer for job seekers in Germany, Austria, and Switzerland (DACH).

Target language for all user-facing text: ${lang}.
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

Return ONLY valid JSON with these exact string keys (no markdown fences):
{
  "cv_latex": "Full LaTeX source for a compact ATS-friendly CV using article class, standard fonts (no exotic packages). Sections: summary, experience, education, skills, languages.",
  "cover_letter_latex": "Full LaTeX source for a formal ${input.locale === "de" ? "Anschreiben" : "cover letter"} (letter class or article), addressed to the company, referencing the role and 2–3 concrete JD requirements.",
  "cv_plain": "Plain text version of the CV content only (no LaTeX), suitable for PDF rendering. Use clear section headings in CAPS or Title Case and bullet lines with - .",
  "cover_letter_plain": "Plain text version of the cover letter only (no LaTeX), with greeting, body paragraphs, closing."
}

Rules:
- Tailor content to the job description; do not invent employers or degrees not implied by the profile.
- Keep LaTeX self-contained and compilable in principle (use only common packages if any: inputenc, geometry).`;
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
    cv_latex: String(o.cv_latex ?? ""),
    cover_letter_latex: String(o.cover_letter_latex ?? ""),
    cv_plain: String(o.cv_plain ?? ""),
    cover_letter_plain: String(o.cover_letter_plain ?? ""),
  };
}

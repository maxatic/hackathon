import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminClient } from "@/lib/supabase/server";
import {
  CV_STRUCTURED_SCHEMA,
  parseCvStructured,
  type CvStructuredContent,
} from "@/lib/ai/cv-template";

export const maxDuration = 120;
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function buildParsePrompt(): string {
  return `You are a precise CV/resume data-extraction engine.

You will receive a PDF of someone's CV or resume.
Extract ALL information from the document and return it as valid JSON matching this exact schema (no markdown fences, no extra keys):

{
${CV_STRUCTURED_SCHEMA}
}

Rules:
- Extract every piece of information visible in the PDF — do not summarize or omit bullets.
- Use the exact field names shown above (camelCase).
- If a section has no data, use an empty array [] or omit optional string fields.
- For dateRange, use the format shown in the PDF (e.g. "08/2025 -- 02/2026" or "October 2021").
- For skills, combine related items into comma-separated strings per category. If a category does not apply, omit it.
- Return ONLY the JSON object, nothing else.`;
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_GENERATIVE_AI_API_KEY" },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Request must be multipart/form-data with a 'file' field" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing 'file' field or not a file" },
      { status: 400 },
    );
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File too large (max 10 MB)" },
      { status: 400 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const base64 = Buffer.from(bytes).toString("base64");

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash-lite";
  const model = genAI.getGenerativeModel({ model: modelName });

  let result;
  try {
    result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: "application/pdf", data: base64 } },
            { text: buildParsePrompt() },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    const status =
      raw.includes("429") || raw.includes("quota") || raw.includes("Quota")
        ? 429
        : 502;
    return NextResponse.json(
      { error: `Gemini error: ${raw.slice(0, 400)}` },
      { status },
    );
  }

  const text = result.response.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "AI returned non-JSON output" },
      { status: 502 },
    );
  }

  const outer =
    typeof parsed === "object" &&
    parsed !== null &&
    "cv_structured" in parsed
      ? (parsed as Record<string, unknown>).cv_structured
      : parsed;

  let structured: CvStructuredContent;
  try {
    structured = parseCvStructured(outer);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid structured data";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const supabase = createAdminClient();
  const { error: dbError } = await supabase
    .from("master_profiles")
    .upsert(
      { user_id: auth.userId, profile: structured as unknown as Record<string, unknown> },
      { onConflict: "user_id" },
    );

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ profile: structured });
}

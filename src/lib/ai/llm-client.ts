import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-haiku-4-5";

/** Model id stored in generated_documents.meta and used for logging. */
export function getResolvedModelName(): string {
  return process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}

function extractJsonText(raw: string): string {
  const t = raw.trim();
  const fence = /^```(?:json)?\s*\n?([\s\S]*?)```$/m.exec(t);
  if (fence) return fence[1].trim();
  return t;
}

function anthropicMessageText(msg: Anthropic.Messages.Message): string {
  return msg.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export type GenerateJsonTextOptions = {
  temperature: number;
  /** Defaults to JSON-only system prompt when omitted. */
  system?: string;
};

/**
 * Single user text prompt → model text (expected to be JSON).
 */
export async function generateJsonText(
  prompt: string,
  options: GenerateJsonTextOptions,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }
  const model = getResolvedModelName();
  const client = new Anthropic({ apiKey });
  let msg: Anthropic.Messages.Message;
  const system =
    options.system ??
    "You are a JSON API. Return ONLY valid JSON — no markdown fences, no commentary.";
  try {
    msg = await client.messages.create({
      model,
      max_tokens: 8192,
      temperature: options.temperature,
      system,
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err: unknown) {
    throw anthropicError(err, model);
  }
  return extractJsonText(anthropicMessageText(msg));
}

export type GenerateJsonFromPdfOptions = {
  temperature: number;
  /** Defaults to JSON-only system prompt when omitted. */
  system?: string;
};

/**
 * PDF (base64) + text prompt → model text (expected to be JSON).
 */
export async function generateJsonFromPdf(
  pdfBase64: string,
  textPrompt: string,
  options: GenerateJsonFromPdfOptions,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }
  const model = getResolvedModelName();
  const client = new Anthropic({ apiKey });
  let msg: Anthropic.Messages.Message;
  const system =
    options.system ??
    "You are a JSON API. Return ONLY valid JSON — no markdown fences, no commentary.";
  try {
    msg = await client.messages.create({
      model,
      max_tokens: 8192,
      temperature: options.temperature,
      system,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            { type: "text", text: textPrompt },
          ],
        },
      ],
    });
  } catch (err: unknown) {
    throw anthropicError(err, model);
  }
  return extractJsonText(anthropicMessageText(msg));
}

function anthropicError(err: unknown, model: string): Error {
  const raw = err instanceof Error ? err.message : String(err);
  if (
    raw.includes("429") ||
    raw.includes("rate_limit") ||
    raw.includes("Rate limit")
  ) {
    return new Error(
      `Anthropic rate limit (${model}). Wait briefly and retry, or check your plan and API key. Raw: ${raw.slice(0, 400)}`,
    );
  }
  return err instanceof Error ? err : new Error(raw);
}

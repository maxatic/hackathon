import { NextResponse } from "next/server";
import {
  generateJsonFromMessages,
  type ChatTurn,
} from "@/lib/ai/llm-client";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminClient } from "@/lib/supabase/server";

export const maxDuration = 60;
export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_CONTENT_PER_MESSAGE = 12_000;
const MAX_PROFILE_JSON = 80_000;

const PROFILE_KEYS = new Set([
  "fullName",
  "email",
  "phone",
  "location",
  "summary",
  "skills",
  "experience",
  "education",
  "languages",
  "photoStoragePath",
]);

type ChatResponseBody = {
  reply: string;
  profilePatch?: Record<string, unknown>;
};

function isChatTurn(x: unknown): x is ChatTurn {
  if (typeof x !== "object" || x === null) return false;
  const o = x as { role?: unknown; content?: unknown };
  return (
    (o.role === "user" || o.role === "assistant") &&
    typeof o.content === "string"
  );
}

function sanitizeProfilePatch(
  patch: unknown,
): Record<string, unknown> | undefined {
  if (typeof patch !== "object" || patch === null || Array.isArray(patch)) {
    return undefined;
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (!PROFILE_KEYS.has(k)) continue;
    if (k === "skills") {
      if (Array.isArray(v)) {
        out[k] = v.map((s) => String(s)).filter(Boolean);
      } else if (typeof v === "string") {
        out[k] = v
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      continue;
    }
    if (typeof v === "string") {
      out[k] = v;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export async function POST(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const b = body as {
      messages?: unknown;
      profile?: unknown;
    };

    if (!Array.isArray(b.messages) || b.messages.length === 0) {
      return NextResponse.json(
        { error: "Body must include a non-empty messages array" },
        { status: 400 },
      );
    }

    if (b.messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: `At most ${MAX_MESSAGES} messages allowed` },
        { status: 400 },
      );
    }

    const messages: ChatTurn[] = [];
    for (const m of b.messages) {
      if (!isChatTurn(m)) {
        return NextResponse.json(
          { error: "Each message must be { role: user|assistant, content: string }" },
          { status: 400 },
        );
      }
      if (m.content.length > MAX_CONTENT_PER_MESSAGE) {
        return NextResponse.json(
          { error: `Each message must be at most ${MAX_CONTENT_PER_MESSAGE} characters` },
          { status: 400 },
        );
      }
      messages.push(m);
    }

    if (messages[0].role !== "user") {
      return NextResponse.json(
        { error: "Conversation must start with a user message" },
        { status: 400 },
      );
    }

    for (let i = 0; i < messages.length; i++) {
      const expected: "user" | "assistant" = i % 2 === 0 ? "user" : "assistant";
      if (messages[i].role !== expected) {
        return NextResponse.json(
          {
            error:
              "Messages must alternate user / assistant, starting with user",
          },
          { status: 400 },
        );
      }
    }

    if (
      typeof b.profile !== "object" ||
      b.profile === null ||
      Array.isArray(b.profile)
    ) {
      return NextResponse.json(
        { error: "Body must include profile: { ... } object" },
        { status: 400 },
      );
    }

    const profile = { ...(b.profile as Record<string, unknown>) };

    const supabase = createAdminClient();
    const { data: existing } = await supabase
      .from("master_profiles")
      .select("profile")
      .eq("user_id", auth.userId)
      .maybeSingle();

    const existingProfile = (existing?.profile ?? {}) as Record<string, unknown>;
    if (!profile.photoStoragePath && existingProfile.photoStoragePath) {
      profile.photoStoragePath = existingProfile.photoStoragePath;
    }

    const profileJson = JSON.stringify(profile);
    if (profileJson.length > MAX_PROFILE_JSON) {
      return NextResponse.json(
        { error: "Profile payload too large" },
        { status: 400 },
      );
    }

    const system = `You are a concise CV / résumé editing assistant. The user is improving their master profile in a web form.
Rules:
- Be professional, helpful, and concise.
- Do not invent employers, degrees, dates, or contact details; if something is missing, say so in reply.
- You may suggest rewrites for clarity and impact; optional concrete edits go in profilePatch.
- Output MUST be a single JSON object only, no markdown fences, no commentary outside JSON.
Schema:
{
  "reply": string (markdown allowed inside the string for bullets),
  "profilePatch": optional object with only keys you want to change from: fullName, email, phone, location, summary, skills, experience, education, languages.
  - skills: string array OR comma-separated skills string.
  - Other string fields: plain text as stored in the form (experience/education are multi-line plain text).
}

Current profile JSON:
${profileJson}`;

    const raw = await generateJsonFromMessages(messages, {
      system,
      temperature: 0.4,
      max_tokens: 4096,
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Model returned invalid JSON" },
        { status: 502 },
      );
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as { reply?: unknown }).reply !== "string"
    ) {
      return NextResponse.json(
        { error: "Model response missing reply string" },
        { status: 502 },
      );
    }

    const reply = (parsed as { reply: string }).reply.trim();
    const profilePatch = sanitizeProfilePatch(
      (parsed as { profilePatch?: unknown }).profilePatch,
    );

    const out: ChatResponseBody = { reply };
    if (profilePatch) out.profilePatch = profilePatch;

    return NextResponse.json(out);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unexpected error in chat";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

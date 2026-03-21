import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createAdminClient } from "@/lib/supabase/server";
import type { Application, ApplicationLocale, ApplicationStatus } from "@/types/database";

const LOCALES: ApplicationLocale[] = ["de", "en"];
const STATUSES: ApplicationStatus[] = [
  "draft",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

function parseApplicationBody(
  raw: unknown,
): { ok: true; value: Record<string, unknown> } | { ok: false; response: NextResponse } {
  if (typeof raw !== "object" || raw === null) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 }),
    };
  }
  return { ok: true, value: raw as Record<string, unknown> };
}

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications: data as Application[] });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseApplicationBody(raw);
  if (!parsed.ok) return parsed.response;
  const body = parsed.value;

  const company = typeof body.company === "string" ? body.company : "";
  const role_title = typeof body.role_title === "string" ? body.role_title : "";
  const jd_text = typeof body.jd_text === "string" ? body.jd_text : "";
  const notes = typeof body.notes === "string" || body.notes === null ? body.notes : null;

  const locale =
    typeof body.locale === "string" && LOCALES.includes(body.locale as ApplicationLocale)
      ? (body.locale as ApplicationLocale)
      : "de";

  const status =
    typeof body.status === "string" && STATUSES.includes(body.status as ApplicationStatus)
      ? (body.status as ApplicationStatus)
      : "draft";

  const applied_at =
    typeof body.applied_at === "string" ? body.applied_at : null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("applications")
    .insert({
      user_id: auth.userId,
      company,
      role_title,
      jd_text,
      locale,
      status,
      notes,
      applied_at,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application: data as Application }, { status: 201 });
}

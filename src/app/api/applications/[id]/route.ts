import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
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

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ application: data as Application });
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof raw !== "object" || raw === null) {
    return NextResponse.json({ error: "Body must be a JSON object" }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const patch: Record<string, unknown> = {};

  if (typeof body.company === "string") patch.company = body.company;
  if (typeof body.role_title === "string") patch.role_title = body.role_title;
  if (typeof body.jd_text === "string") patch.jd_text = body.jd_text;
  if (typeof body.notes === "string" || body.notes === null) patch.notes = body.notes;

  if (typeof body.locale === "string") {
    if (!LOCALES.includes(body.locale as ApplicationLocale)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }
    patch.locale = body.locale;
  }

  if (typeof body.status === "string") {
    if (!STATUSES.includes(body.status as ApplicationStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = body.status;
  }

  if (typeof body.applied_at === "string" || body.applied_at === null) {
    patch.applied_at = body.applied_at;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .update(patch)
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ application: data as Application });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id } = await context.params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data?.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}

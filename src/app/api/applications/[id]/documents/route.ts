import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { createClient } from "@/lib/supabase/server";
import type { DocumentKind, GeneratedDocument } from "@/types/database";

const KINDS: DocumentKind[] = ["cv", "cover_letter", "bundle"];

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id: applicationId } = await context.params;

  const supabase = await createClient();

  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("id")
    .eq("id", applicationId)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (appError) {
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("generated_documents")
    .select("*")
    .eq("application_id", applicationId)
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: data as GeneratedDocument[] });
}

/**
 * Stub: records a generated document row. Wire AI + Tectonic here later.
 */
export async function POST(request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id: applicationId } = await context.params;

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
  const kind =
    typeof body.kind === "string" && KINDS.includes(body.kind as DocumentKind)
      ? (body.kind as DocumentKind)
      : null;

  if (!kind) {
    return NextResponse.json(
      { error: "kind must be one of: cv, cover_letter, bundle" },
      { status: 400 },
    );
  }

  const latex_source = typeof body.latex_source === "string" ? body.latex_source : null;
  const pdf_storage_path =
    typeof body.pdf_storage_path === "string" ? body.pdf_storage_path : null;
  const meta =
    typeof body.meta === "object" && body.meta !== null && !Array.isArray(body.meta)
      ? (body.meta as Record<string, unknown>)
      : {};

  const supabase = await createClient();

  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("id")
    .eq("id", applicationId)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (appError) {
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("generated_documents")
    .insert({
      user_id: auth.user.id,
      application_id: applicationId,
      kind,
      latex_source,
      pdf_storage_path,
      meta,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ document: data as GeneratedDocument }, { status: 201 });
}

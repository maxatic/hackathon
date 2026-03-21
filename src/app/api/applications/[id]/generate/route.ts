import { NextResponse } from "next/server";
import { generateDocuments } from "@/lib/ai/generate-documents";
import { requireUser } from "@/lib/auth/require-user";
import { textToPdfBytes } from "@/lib/pdf/text-to-pdf";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApplicationLocale, GeneratedDocument } from "@/types/database";

export const maxDuration = 120;
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id: applicationId } = await context.params;

  const supabase = createAdminClient();

  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (appError) {
    return NextResponse.json({ error: appError.message }, { status: 500 });
  }

  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("master_profiles")
    .select("profile")
    .eq("user_id", auth.userId)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const masterProfile =
    profileRow?.profile &&
    typeof profileRow.profile === "object" &&
    !Array.isArray(profileRow.profile)
      ? (profileRow.profile as Record<string, unknown>)
      : {};

  let generated: Awaited<ReturnType<typeof generateDocuments>>;
  try {
    generated = await generateDocuments({
      locale: (app.locale as ApplicationLocale) ?? "de",
      masterProfile,
      company: app.company ?? "",
      roleTitle: app.role_title ?? "",
      jdText: app.jd_text ?? "",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    const isQuota =
      message.includes("429") ||
      message.includes("quota") ||
      message.includes("Quota") ||
      message.includes("rate limit");
    const status = message.includes("Missing GOOGLE_GENERATIVE_AI_API_KEY")
      ? 503
      : isQuota
        ? 429
        : 500;
    return NextResponse.json({ error: message }, { status });
  }

  const ts = Date.now();
  const base = `${auth.userId}/${applicationId}`;

  const cvPdfBytes = await textToPdfBytes({
    title: `CV — ${app.role_title || "Application"}`,
    body: generated.cv_plain,
  });
  const coverPdfBytes = await textToPdfBytes({
    title: `Anschreiben — ${app.company || app.role_title || "Application"}`,
    body: generated.cover_letter_plain,
  });

  const cvPath = `${base}/cv-${ts}.pdf`;
  const coverPath = `${base}/cover-${ts}.pdf`;

  const upCv = await supabase.storage
    .from("generated-pdfs")
    .upload(cvPath, cvPdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (upCv.error) {
    return NextResponse.json(
      { error: `Storage (cv): ${upCv.error.message}` },
      { status: 500 },
    );
  }

  const upCover = await supabase.storage
    .from("generated-pdfs")
    .upload(coverPath, coverPdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (upCover.error) {
    return NextResponse.json(
      { error: `Storage (cover): ${upCover.error.message}` },
      { status: 500 },
    );
  }

  const metaBase = {
    model: process.env.GOOGLE_AI_MODEL ?? "gemini-2.5-flash",
    locale: app.locale,
  };

  const { data: docCv, error: insCv } = await supabase
    .from("generated_documents")
    .insert({
      user_id: auth.userId,
      application_id: applicationId,
      kind: "cv",
      latex_source: generated.cv_latex,
      pdf_storage_path: cvPath,
      meta: { ...metaBase, type: "cv" },
    })
    .select("*")
    .single();

  if (insCv) {
    return NextResponse.json({ error: insCv.message }, { status: 500 });
  }

  const { data: docCover, error: insCover } = await supabase
    .from("generated_documents")
    .insert({
      user_id: auth.userId,
      application_id: applicationId,
      kind: "cover_letter",
      latex_source: generated.cover_letter_latex,
      pdf_storage_path: coverPath,
      meta: { ...metaBase, type: "cover_letter" },
    })
    .select("*")
    .single();

  if (insCover) {
    return NextResponse.json({ error: insCover.message }, { status: 500 });
  }

  const signedTtl = 3600;
  const urlCv = await supabase.storage
    .from("generated-pdfs")
    .createSignedUrl(cvPath, signedTtl);
  const urlCover = await supabase.storage
    .from("generated-pdfs")
    .createSignedUrl(coverPath, signedTtl);

  return NextResponse.json({
    documents: [docCv, docCover] as GeneratedDocument[],
    signedUrls: {
      cv: urlCv.data?.signedUrl ?? null,
      coverLetter: urlCover.data?.signedUrl ?? null,
      expiresIn: signedTtl,
    },
  });
}

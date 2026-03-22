import type { SupabaseClient } from "@supabase/supabase-js";
import { generateDocuments } from "@/lib/ai/generate-documents";
import { getResolvedModelName } from "@/lib/ai/llm-client";
import { MASTER_CV_COMPANY } from "@/lib/generation/master-application";
import { tryCompileLatexToPdf } from "@/lib/pdf/latex-to-pdf";
import { textToPdfBytes } from "@/lib/pdf/text-to-pdf";
import type { ApplicationLocale, GeneratedDocument } from "@/types/database";

export type ApplicationGenerateResult = {
  documents: GeneratedDocument[];
  signedUrls: {
    cv: string | null;
    coverLetter: string | null;
    expiresIn: number;
  };
};

export type ApplicationGenerateFailure = {
  status: number;
  error: string;
};

export async function runApplicationGenerate(params: {
  supabase: SupabaseClient;
  userId: string;
  applicationId: string;
}): Promise<
  | { ok: true; data: ApplicationGenerateResult }
  | { ok: false; data: ApplicationGenerateFailure }
> {
  const { supabase, userId, applicationId } = params;

  const { data: app, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .eq("user_id", userId)
    .maybeSingle();

  if (appError) {
    return {
      ok: false,
      data: { status: 500, error: appError.message },
    };
  }

  if (!app) {
    return { ok: false, data: { status: 404, error: "Not found" } };
  }

  const { data: profileRow, error: profileError } = await supabase
    .from("master_profiles")
    .select("profile")
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    return {
      ok: false,
      data: { status: 500, error: profileError.message },
    };
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
    const status = message.includes("Missing ANTHROPIC_API_KEY")
      ? 503
      : isQuota
        ? 429
        : 500;
    return { ok: false, data: { status, error: message } };
  }

  const ts = Date.now();
  const base = `${userId}/${applicationId}`;

  const isMasterSlot = app.company === MASTER_CV_COMPANY;
  const cvTitle = isMasterSlot
    ? "CV — Master profile"
    : `CV — ${app.role_title || "Application"}`;
  const coverTitle = isMasterSlot
    ? "Anschreiben — Master profile (general)"
    : `Anschreiben — ${app.company || app.role_title || "Application"}`;

  const cvLatex = generated.cv_latex.trim();
  const coverLatex = generated.cover_letter_latex.trim();

  // Fetch user photo from Supabase Storage if available
  let latexImages: Record<string, Buffer> | undefined;
  const photoPath =
    typeof masterProfile.photoStoragePath === "string"
      ? masterProfile.photoStoragePath
      : null;
  if (photoPath) {
    try {
      const { data: photoData, error: photoErr } = await supabase.storage
        .from("user-photos")
        .download(photoPath);
      if (photoErr) {
        console.warn("[generate] Photo download error:", photoErr.message);
      }
      if (photoData) {
        const buf = Buffer.from(await photoData.arrayBuffer());
        console.log(`[generate] Photo loaded: ${buf.length} bytes from ${photoPath}`);
        latexImages = { "cv-photo.png": buf };
      }
    } catch (e) {
      console.warn("[generate] Photo fetch failed:", e instanceof Error ? e.message : e);
    }
  } else {
    console.log("[generate] No photoStoragePath in profile, keys:", Object.keys(masterProfile));
  }

  const cvCompiled =
    cvLatex.length > 0 ? tryCompileLatexToPdf(cvLatex, "cv", latexImages) : null;
  const cvPdfBytes = cvCompiled
    ? cvCompiled.pdf
    : await textToPdfBytes({
        title: cvTitle,
        body: generated.cv_plain,
      });

  const coverCompiled =
    coverLatex.length > 0
      ? tryCompileLatexToPdf(coverLatex, "cover", latexImages)
      : null;
  const coverPdfBytes = coverCompiled
    ? coverCompiled.pdf
    : await textToPdfBytes({
        title: coverTitle,
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
    return {
      ok: false,
      data: { status: 500, error: `Storage (cv): ${upCv.error.message}` },
    };
  }

  const upCover = await supabase.storage
    .from("generated-pdfs")
    .upload(coverPath, coverPdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (upCover.error) {
    return {
      ok: false,
      data: { status: 500, error: `Storage (cover): ${upCover.error.message}` },
    };
  }

  const metaBase = {
    model: getResolvedModelName(),
    locale: app.locale,
  };

  const { data: docCv, error: insCv } = await supabase
    .from("generated_documents")
    .insert({
      user_id: userId,
      application_id: applicationId,
      kind: "cv",
      latex_source: generated.cv_latex,
      pdf_storage_path: cvPath,
      meta: {
        ...metaBase,
        type: "cv",
        pdf_render: cvCompiled
          ? (`latex-${cvCompiled.engine}` as const)
          : ("plaintext" as const),
      },
    })
    .select("*")
    .single();

  if (insCv) {
    return { ok: false, data: { status: 500, error: insCv.message } };
  }

  const { data: docCover, error: insCover } = await supabase
    .from("generated_documents")
    .insert({
      user_id: userId,
      application_id: applicationId,
      kind: "cover_letter",
      latex_source: generated.cover_letter_latex,
      pdf_storage_path: coverPath,
      meta: {
        ...metaBase,
        type: "cover_letter",
        pdf_render: coverCompiled
          ? (`latex-${coverCompiled.engine}` as const)
          : ("plaintext" as const),
      },
    })
    .select("*")
    .single();

  if (insCover) {
    return { ok: false, data: { status: 500, error: insCover.message } };
  }

  const signedTtl = 3600;
  const urlCv = await supabase.storage
    .from("generated-pdfs")
    .createSignedUrl(cvPath, signedTtl);
  const urlCover = await supabase.storage
    .from("generated-pdfs")
    .createSignedUrl(coverPath, signedTtl);

  return {
    ok: true,
    data: {
      documents: [docCv, docCover] as GeneratedDocument[],
      signedUrls: {
        cv: urlCv.data?.signedUrl ?? null,
        coverLetter: urlCover.data?.signedUrl ?? null,
        expiresIn: signedTtl,
      },
    },
  };
}

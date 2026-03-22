import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { getOrCreateMasterApplication } from "@/lib/generation/master-application";
import { createAdminClient } from "@/lib/supabase/server";
import type { GeneratedDocument } from "@/types/database";

const SIGNED_TTL = 3600;

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;

    const supabase = createAdminClient();
    const masterApp = await getOrCreateMasterApplication(supabase, auth.userId);

    if (masterApp.error || !masterApp.data) {
      return NextResponse.json({
        cv: null,
        coverLetter: null,
        expiresIn: SIGNED_TTL,
      });
    }

    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("application_id", masterApp.data.id)
      .eq("user_id", auth.userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const docs = (data ?? []) as GeneratedDocument[];
    let latestCv: GeneratedDocument | undefined;
    let latestCover: GeneratedDocument | undefined;

    for (const d of docs) {
      if (d.kind === "cv" && !latestCv) latestCv = d;
      else if (d.kind === "cover_letter" && !latestCover) latestCover = d;
      if (latestCv && latestCover) break;
    }

    let cvUrl: string | null = null;
    let coverUrl: string | null = null;

    if (latestCv?.pdf_storage_path) {
      const { data: urlData } = await supabase.storage
        .from("generated-pdfs")
        .createSignedUrl(latestCv.pdf_storage_path, SIGNED_TTL);
      cvUrl = urlData?.signedUrl ?? null;
    }

    if (latestCover?.pdf_storage_path) {
      const { data: urlData } = await supabase.storage
        .from("generated-pdfs")
        .createSignedUrl(latestCover.pdf_storage_path, SIGNED_TTL);
      coverUrl = urlData?.signedUrl ?? null;
    }

    return NextResponse.json({
      cv: cvUrl,
      coverLetter: coverUrl,
      expiresIn: SIGNED_TTL,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unexpected error loading preview URLs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

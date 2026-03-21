import type { SupabaseClient } from "@supabase/supabase-js";
import type { Application } from "@/types/database";

/** Sentinel application: one per user for “master profile” PDFs (no manual UUID). */
export const MASTER_CV_COMPANY = "__master_cv__";
export const MASTER_CV_ROLE = "Master profile";

/**
 * Returns the application row used for Master CV PDF generation (creates if missing).
 */
export async function getOrCreateMasterApplication(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ data: Application; error: null } | { data: null; error: string }> {
  const { data: existing, error: findErr } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .eq("company", MASTER_CV_COMPANY)
    .maybeSingle();

  if (findErr) {
    return { data: null, error: findErr.message };
  }

  if (existing) {
    return { data: existing as Application, error: null };
  }

  const { data: created, error: insErr } = await supabase
    .from("applications")
    .insert({
      user_id: userId,
      company: MASTER_CV_COMPANY,
      role_title: MASTER_CV_ROLE,
      jd_text: "",
      locale: "de",
      status: "draft",
    })
    .select("*")
    .single();

  if (insErr || !created) {
    return { data: null, error: insErr?.message ?? "Insert failed" };
  }

  return { data: created as Application, error: null };
}

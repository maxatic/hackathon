import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { getOrCreateMasterApplication } from "@/lib/generation/master-application";
import { runApplicationGenerate } from "@/lib/generation/run-application-generate";
import { createAdminClient } from "@/lib/supabase/server";
import type { MasterProfile } from "@/types/database";

export const maxDuration = 120;
export const runtime = "nodejs";

export async function GET() {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("master_profiles")
      .select("user_id, profile, updated_at")
      .eq("user_id", auth.userId)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      const empty: MasterProfile = {
        user_id: auth.userId,
        profile: {},
        updated_at: null,
      };
      return NextResponse.json(empty);
    }

    return NextResponse.json(data as MasterProfile);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unexpected error loading profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireUser();
    if (auth.error) return auth.error;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("profile" in body) ||
      typeof (body as { profile: unknown }).profile !== "object" ||
      (body as { profile: unknown }).profile === null ||
      Array.isArray((body as { profile: unknown }).profile)
    ) {
      return NextResponse.json(
        { error: "Body must include a JSON object: { profile: { ... } }" },
        { status: 400 },
      );
    }

    const profile = (body as { profile: Record<string, unknown> }).profile;
    const generateAfter =
      typeof body === "object" &&
      body !== null &&
      "generate" in body &&
      (body as { generate?: unknown }).generate === false
        ? false
        : true;

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("master_profiles")
      .upsert(
        { user_id: auth.userId, profile },
        { onConflict: "user_id" },
      )
      .select("user_id, profile, updated_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const saved = data as MasterProfile;

    if (!generateAfter) {
      return NextResponse.json(saved);
    }

    const masterApp = await getOrCreateMasterApplication(supabase, auth.userId);
    if (masterApp.error || !masterApp.data) {
      return NextResponse.json({
        ...saved,
        generate: {
          ok: false as const,
          error: `Could not open master application: ${masterApp.error ?? "Unknown"}`,
        },
      });
    }

    const gen = await runApplicationGenerate({
      supabase,
      userId: auth.userId,
      applicationId: masterApp.data.id,
    });

    if (gen.ok) {
      return NextResponse.json({
        ...saved,
        generate: {
          ok: true as const,
          signedUrls: gen.data.signedUrls,
        },
      });
    }

    return NextResponse.json({
      ...saved,
      generate: {
        ok: false as const,
        error: gen.data.error,
      },
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unexpected error saving profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

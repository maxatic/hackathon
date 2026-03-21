import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { runApplicationGenerate } from "@/lib/generation/run-application-generate";
import { createAdminClient } from "@/lib/supabase/server";
import type { GeneratedDocument } from "@/types/database";

export const maxDuration = 120;
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { id: applicationId } = await context.params;

  const supabase = createAdminClient();

  const result = await runApplicationGenerate({
    supabase,
    userId: auth.userId,
    applicationId,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.data.error },
      { status: result.data.status },
    );
  }

  return NextResponse.json({
    documents: result.data.documents as GeneratedDocument[],
    signedUrls: result.data.signedUrls,
  });
}

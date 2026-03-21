import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "syz-api",
    env: {
      clerkPublishableKeySet: Boolean(
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      ),
      clerkSecretKeySet: Boolean(process.env.CLERK_SECRET_KEY),
      supabaseUrlSet: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseServiceRoleSet: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      googleAiKeySet: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
    },
  });
}

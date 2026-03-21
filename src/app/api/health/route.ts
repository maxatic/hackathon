import { spawnSync } from "node:child_process";
import { NextResponse } from "next/server";

function commandOnPath(cmd: string): boolean {
  const which = process.platform === "win32" ? "where" : "which";
  const r = spawnSync(which, [cmd], { encoding: "utf8" });
  return r.status === 0;
}

export async function GET() {
  const latexDisabled = process.env.DISABLE_LATEX_PDF === "1";

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
    latexPdf: latexDisabled
      ? { disabled: true as const, note: "DISABLE_LATEX_PDF=1" }
      : {
          disabled: false as const,
          tectonicOnPath: commandOnPath("tectonic"),
          pdflatexOnPath: commandOnPath("pdflatex"),
          hint: "Install tectonic (brew install tectonic) for CV PDFs that match templates/cv-main.tex",
        },
  });
}

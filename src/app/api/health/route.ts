import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { NextResponse } from "next/server";

function commandAvailable(cmd: string): boolean {
  const candidates = [
    join(homedir(), "bin", cmd),
    `/usr/local/bin/${cmd}`,
    `/opt/homebrew/bin/${cmd}`,
  ];
  return candidates.some((p) => existsSync(p));
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
      anthropicApiKeySet: Boolean(process.env.ANTHROPIC_API_KEY),
    },
    latexPdf: latexDisabled
      ? { disabled: true as const, note: "DISABLE_LATEX_PDF=1" }
      : {
          disabled: false as const,
          tectonicAvailable: commandAvailable("tectonic"),
          pdflatexAvailable: commandAvailable("pdflatex"),
          hint: "Install tectonic (brew install tectonic) for CV PDFs that match templates/cv-main.tex",
        },
  });
}

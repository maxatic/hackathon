import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Matches \\includegraphics in templates/cv-main.tex when no real photo is uploaded. */
const PHOTO_FILENAME = "Photo 1.png";

/** Minimal valid 1×1 PNG (transparent). */
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

export type LatexPdfEngine = "tectonic" | "pdflatex";

function runEngine(
  cmd: string,
  args: string[],
  cwd: string,
): { ok: true } | { ok: false; detail: string } {
  const r = spawnSync(cmd, args, {
    cwd,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (r.status === 0) {
    return { ok: true };
  }
  const detail = [r.stderr, r.stdout, r.error?.message]
    .filter(Boolean)
    .join("\n")
    .trim()
    .slice(0, 4000);
  return { ok: false, detail: detail || `exit ${r.status ?? "unknown"}` };
}

/**
 * Compile a full LaTeX document to PDF (matches your resume template layout).
 * Requires `tectonic` (brew install tectonic) or `pdflatex` (MacTeX / TeX Live) on PATH.
 * Returns null if disabled, missing engines, or compile failure — caller should fall back to plain-text PDF.
 */
export function tryCompileLatexToPdf(
  texSource: string,
  basename: string,
): { pdf: Uint8Array; engine: LatexPdfEngine } | null {
  if (process.env.DISABLE_LATEX_PDF === "1") {
    return null;
  }

  const workDir = mkdtempSync(join(tmpdir(), "syz-latex-"));
  const texName = `${basename}.tex`;
  const pdfName = `${basename}.pdf`;
  const texPath = join(workDir, texName);

  try {
    writeFileSync(texPath, texSource, "utf8");
    writeFileSync(join(workDir, PHOTO_FILENAME), PLACEHOLDER_PNG);

    const prefer = process.env.LATEX_PDF_ENGINE?.toLowerCase();

    type Engine = { name: LatexPdfEngine; cmd: string; args: string[] };
    const tectonic: Engine = {
      name: "tectonic",
      cmd: "tectonic",
      args: [texName, "--outdir", workDir],
    };
    const pdflatex: Engine = {
      name: "pdflatex",
      cmd: "pdflatex",
      args: [
        "-interaction=nonstopmode",
        "-halt-on-error",
        `-output-directory=${workDir}`,
        texName,
      ],
    };

    const order: Engine[] =
      prefer === "pdflatex" ? [pdflatex, tectonic] : [tectonic, pdflatex];

    let lastErr = "";
    for (const { name, cmd, args } of order) {
      const run = runEngine(cmd, args, workDir);
      if (!run.ok) {
        lastErr = run.detail;
        continue;
      }
      const pdfPath = join(workDir, pdfName);
      if (existsSync(pdfPath)) {
        return { pdf: readFileSync(pdfPath), engine: name };
      }
      lastErr = "PDF file not produced after successful exit";
    }

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[latex-to-pdf] Compile failed, using plain PDF fallback:\n",
        lastErr,
      );
    }
    return null;
  } finally {
    try {
      rmSync(workDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

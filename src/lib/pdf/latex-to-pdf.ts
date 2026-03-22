import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

/** Minimal valid 1×1 white PNG — used as placeholder for any \\includegraphics references. */
const PLACEHOLDER_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC",
  "base64",
);

/** Extract all image filenames from \\includegraphics[…]{filename} in the tex source. */
function extractImageFilenames(tex: string): string[] {
  const re = /\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(tex)) !== null) {
    names.push(m[1]);
  }
  return [...new Set(names)];
}

export type LatexPdfEngine = "tectonic" | "pdflatex";

/**
 * Strip pdfTeX-only primitives that break XeTeX (tectonic).
 * Keeps the template compilable under both engines.
 */
function patchForXetex(tex: string): string {
  return tex
    .replace(/^\\input\{glyphtounicode\}\s*$/m, "% (removed for XeTeX) \\input{glyphtounicode}")
    .replace(/^\\pdfgentounicode\s*=\s*\d+\s*$/m, "% (removed for XeTeX) \\pdfgentounicode=1");
}

/**
 * Resolve a command to an absolute path. Next.js Turbopack workers sometimes
 * run with a stripped PATH, so ~/bin or /usr/local/bin may not be visible.
 */
function resolveCmd(name: string): string {
  const candidates = [
    join(homedir(), "bin", name),
    `/usr/local/bin/${name}`,
    `/opt/homebrew/bin/${name}`,
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return name;
}

function runEngine(
  cmd: string,
  args: string[],
  cwd: string,
): { ok: true } | { ok: false; detail: string } {
  const resolved = resolveCmd(cmd);
  const r = spawnSync(resolved, args, {
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
  images?: Record<string, Buffer>,
): { pdf: Uint8Array; engine: LatexPdfEngine } | null {
  if (process.env.DISABLE_LATEX_PDF === "1") {
    return null;
  }

  const workDir = mkdtempSync(join(tmpdir(), "syz-latex-"));
  const texName = `${basename}.tex`;
  const pdfName = `${basename}.pdf`;
  const texPath = join(workDir, texName);

  try {
    // Write provided images under their given name AND with alternate
    // extensions (.png / .jpg) so the engine finds the file regardless
    // of the extension used in \includegraphics.
    if (images) {
      for (const [name, buf] of Object.entries(images)) {
        const base = name.replace(/\.\w+$/, "");
        writeFileSync(join(workDir, `${base}.png`), buf);
        writeFileSync(join(workDir, `${base}.jpg`), buf);
        writeFileSync(join(workDir, `${base}.jpeg`), buf);
        writeFileSync(join(workDir, name), buf);
        console.log(`[latex-to-pdf] Wrote photo ${name} (${buf.length} bytes) as ${base}.{png,jpg,jpeg}`);
      }
    }
    for (const img of extractImageFilenames(texSource)) {
      const imgPath = join(workDir, img);
      if (!existsSync(imgPath)) writeFileSync(imgPath, PLACEHOLDER_PNG);
    }

    const prefer = process.env.LATEX_PDF_ENGINE?.toLowerCase();

    type Engine = {
      name: LatexPdfEngine;
      cmd: string;
      args: string[];
      patch?: (src: string) => string;
    };
    const tectonic: Engine = {
      name: "tectonic",
      cmd: "tectonic",
      args: [texName, "--outdir", workDir],
      patch: patchForXetex,
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

    const errors: string[] = [];
    for (const { name, cmd, args, patch } of order) {
      const src = patch ? patch(texSource) : texSource;
      writeFileSync(texPath, src, "utf8");

      const run = runEngine(cmd, args, workDir);
      if (!run.ok) {
        errors.push(`[${name}] ${run.detail}`);
        continue;
      }
      const pdfPath = join(workDir, pdfName);
      if (existsSync(pdfPath)) {
        const pdfBytes = readFileSync(pdfPath);
        console.log(`[latex-to-pdf] ${basename} compiled OK with ${name} (${pdfBytes.length} bytes)`);
        return { pdf: pdfBytes, engine: name };
      }
      errors.push(`[${name}] PDF file not produced after successful exit`);
    }

    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[latex-to-pdf] Compile failed, using plain PDF fallback:\n",
        errors.join("\n---\n"),
      );
      const debugPath = join(workDir, `${basename}-debug.tex`);
      try {
        const debugCopy = join(
          process.cwd(),
          `_debug-last-${basename}.tex`,
        );
        writeFileSync(debugCopy, texSource, "utf8");
        console.warn("[latex-to-pdf] Saved failing source to:", debugCopy);
      } catch { /* ignore */ }
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

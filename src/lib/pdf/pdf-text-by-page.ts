import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  getDocument,
  GlobalWorkerOptions,
} from "pdfjs-dist/legacy/build/pdf.mjs";

/** Tunable: second page text vs first page (extracted char length proxy). */
const SPARSE_RATIO_THRESHOLD = 0.35;
/** Tunable: absolute floor — very little text on page 2. */
const MIN_SECOND_PAGE_CHARS = 500;

let workerConfigured = false;

function ensurePdfjsWorker(): void {
  if (workerConfigured) return;
  // pdfjs requires a worker URL in Node — point at the shipped worker file.
  GlobalWorkerOptions.workerSrc = pathToFileURL(
    join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"),
  ).href;
  workerConfigured = true;
}

export type PdfTextByPageResult = {
  pageCount: number;
  /** Character count from extracted text per page (heuristic density proxy). */
  charCounts: number[];
};

/**
 * Sums extracted string lengths per page. LaTeX PDFs may extract less text than
 * visually present; still useful to detect an almost-empty second page.
 */
export async function getPdfTextCharCountsByPage(
  pdfBytes: Uint8Array,
): Promise<PdfTextByPageResult | null> {
  try {
    ensurePdfjsWorker();
    const loadingTask = getDocument({
      data: pdfBytes,
      disableFontFace: true,
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    const charCounts: number[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      let n = 0;
      for (const item of content.items) {
        if (
          item &&
          typeof item === "object" &&
          "str" in item &&
          typeof (item as { str: unknown }).str === "string"
        ) {
          n += (item as { str: string }).str.length;
        }
      }
      charCounts.push(n);
    }

    return { pageCount, charCounts };
  } catch (e) {
    console.warn(
      "[pdf-text-by-page] Failed to analyze PDF:",
      e instanceof Error ? e.message : e,
    );
    return null;
  }
}

/**
 * True when the PDF is exactly two pages and page 2 looks like a thin tail
 * (low extracted text vs page 1 and below an absolute floor).
 */
export function isSparseTwoPageCv(charCounts: number[]): boolean {
  if (charCounts.length !== 2) return false;
  const p1 = charCounts[0] ?? 0;
  const p2 = charCounts[1] ?? 0;
  const denom = Math.max(p1, 1);
  return p2 / denom < SPARSE_RATIO_THRESHOLD && p2 < MIN_SECOND_PAGE_CHARS;
}

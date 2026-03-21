import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

const PAGE_MARGIN = 56;
const FONT_SIZE = 11;
const LINE_HEIGHT = 14;
const TITLE_SIZE = 16;

function wrapLine(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const w = font.widthOfTextAtSize(test, fontSize);
    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function wrapParagraphs(
  body: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
): string[] {
  const out: string[] = [];
  for (const para of body.split(/\n\n+/)) {
    const single = para.replace(/\n/g, " ").trim();
    if (!single) continue;
    for (const line of wrapLine(single, maxWidth, font, fontSize)) {
      out.push(line);
    }
    out.push("");
  }
  return out;
}

export async function textToPdfBytes(options: {
  title: string;
  body: string;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const maxWidth = 595.28 - PAGE_MARGIN * 2;
  let page = doc.addPage([595.28, 841.89]);
  let y = 841.89 - PAGE_MARGIN;

  const titleLines = wrapLine(options.title, maxWidth, bold, TITLE_SIZE);
  for (const line of titleLines) {
    if (y < PAGE_MARGIN + 40) {
      page = doc.addPage([595.28, 841.89]);
      y = 841.89 - PAGE_MARGIN;
    }
    page.drawText(line, {
      x: PAGE_MARGIN,
      y: y - TITLE_SIZE,
      size: TITLE_SIZE,
      font: bold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= TITLE_SIZE + 8;
  }
  y -= 12;

  const lines = wrapParagraphs(options.body, maxWidth, font, FONT_SIZE);
  for (const line of lines) {
    if (y < PAGE_MARGIN + LINE_HEIGHT) {
      page = doc.addPage([595.28, 841.89]);
      y = 841.89 - PAGE_MARGIN;
    }
    page.drawText(line, {
      x: PAGE_MARGIN,
      y: y - FONT_SIZE,
      size: FONT_SIZE,
      font,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= LINE_HEIGHT;
  }

  return doc.save();
}

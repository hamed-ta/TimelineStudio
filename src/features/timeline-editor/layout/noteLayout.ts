export type NoteRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type NoteBubbleLayout = NoteRect & {
  tipX: number;
  anchorX: number;
  tipSide?: "top" | "bottom";
};

export type NoteBubblePathOptions = {
  tipHeight: number;
  tipHalfWidth: number;
  tipMaxLean: number;
  pad?: number;
};

export type NoteTextLayoutOptions = {
  tipHeight: number;
  verticalPadding: number;
  baselineOffset: number;
  lineHeight: number;
  measureText: (text: string) => number;
};

export type NoteTextBaselineLayout = {
  y: number;
  height: number;
  lines: string[];
  tipSide?: "top" | "bottom";
};

export type NoteResizeHandleLayout = {
  x: number;
  y: number;
};

export function findAvailableNoteY(
  rect: NoteRect,
  placedLayouts: NoteRect[],
  baseY: number,
  gap: number,
): number {
  const candidate = { ...rect, y: baseY };
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const blocker = placedLayouts.find((layout) => noteRectsOverlap(candidate, layout, gap));
    if (!blocker) return candidate.y;
    candidate.y = blocker.y + blocker.height + gap;
  }
  return candidate.y;
}

export function noteCanvasTop(layouts: Iterable<NoteRect>, padding: number): number {
  const safePadding = Math.max(0, Number(padding) || 0);
  let top = 0;
  for (const layout of layouts) {
    top = Math.min(top, Number(layout.y) - safePadding);
  }
  return top;
}

export function noteRectsOverlap(a: NoteRect, b: NoteRect, gap: number): boolean {
  return a.x < b.x + b.width + gap
    && a.x + a.width + gap > b.x
    && a.y < b.y + b.height + gap
    && a.y + a.height + gap > b.y;
}

export function noteBubblePath(layout: NoteBubbleLayout, options: NoteBubblePathOptions): string {
  if (layout.tipSide === "bottom") return bottomTipNoteBubblePath(layout, options);
  return topTipNoteBubblePath(layout, options);
}

function topTipNoteBubblePath(layout: NoteBubbleLayout, options: NoteBubblePathOptions): string {
  const pad = options.pad ?? 0;
  const x = layout.x - pad;
  const y = layout.y - pad;
  const width = layout.width + pad * 2;
  const height = layout.height + pad * 2;
  const right = x + width;
  const bottom = y + height;
  const tipHeight = options.tipHeight + pad;
  const tipHalf = options.tipHalfWidth + pad / 2;
  const bodyY = y + tipHeight;
  const radius = Math.min(14 + pad / 2, width / 4, Math.max(4, (height - tipHeight) / 3));
  const tipApexX = clampNumber(layout.tipX, x + radius + tipHalf, right - radius - tipHalf);
  const tipLean = clampNumber((layout.anchorX - tipApexX) * 0.18, -options.tipMaxLean, options.tipMaxLean);
  const tipBaseX = clampNumber(tipApexX - tipLean, x + radius + tipHalf, right - radius - tipHalf);
  const tipLeft = tipBaseX - tipHalf;
  const tipRight = tipBaseX + tipHalf;

  return [
    `M ${x + radius} ${bodyY}`,
    `H ${tipLeft}`,
    `L ${tipApexX} ${y}`,
    `L ${tipRight} ${bodyY}`,
    `H ${right - radius}`,
    `Q ${right} ${bodyY} ${right} ${bodyY + radius}`,
    `V ${bottom - radius}`,
    `Q ${right} ${bottom} ${right - radius} ${bottom}`,
    `H ${x + radius}`,
    `Q ${x} ${bottom} ${x} ${bottom - radius}`,
    `V ${bodyY + radius}`,
    `Q ${x} ${bodyY} ${x + radius} ${bodyY}`,
    "Z",
  ].join(" ");
}

export function noteTextFirstBaseline(
  layout: NoteTextBaselineLayout,
  options: NoteTextLayoutOptions,
): number {
  const bodyY = layout.tipSide === "bottom" ? layout.y : layout.y + options.tipHeight;
  const bodyHeight = Math.max(0, layout.height - options.tipHeight);
  const blockHeight = Math.max(options.lineHeight, layout.lines.length * options.lineHeight);
  const blockTop = bodyY + Math.max(options.verticalPadding, (bodyHeight - blockHeight) / 2);
  return blockTop + options.baselineOffset;
}

export function noteResizeHandlePosition(
  layout: NoteBubbleLayout,
  handleSize: number,
  tipHeight: number,
): NoteResizeHandleLayout {
  const bodyBottom = layout.tipSide === "bottom" ? layout.y + layout.height - tipHeight : layout.y + layout.height;
  return {
    x: layout.x + layout.width - handleSize - 1,
    y: bodyBottom - handleSize - 1,
  };
}

function bottomTipNoteBubblePath(layout: NoteBubbleLayout, options: NoteBubblePathOptions): string {
  const pad = options.pad ?? 0;
  const x = layout.x - pad;
  const y = layout.y - pad;
  const width = layout.width + pad * 2;
  const height = layout.height + pad * 2;
  const right = x + width;
  const bottom = y + height;
  const tipHeight = options.tipHeight + pad;
  const tipHalf = options.tipHalfWidth + pad / 2;
  const bodyBottom = bottom - tipHeight;
  const radius = Math.min(14 + pad / 2, width / 4, Math.max(4, (height - tipHeight) / 3));
  const tipApexX = clampNumber(layout.tipX, x + radius + tipHalf, right - radius - tipHalf);
  const tipLean = clampNumber((layout.anchorX - tipApexX) * 0.18, -options.tipMaxLean, options.tipMaxLean);
  const tipBaseX = clampNumber(tipApexX - tipLean, x + radius + tipHalf, right - radius - tipHalf);
  const tipLeft = tipBaseX - tipHalf;
  const tipRight = tipBaseX + tipHalf;

  return [
    `M ${x + radius} ${y}`,
    `H ${right - radius}`,
    `Q ${right} ${y} ${right} ${y + radius}`,
    `V ${bodyBottom - radius}`,
    `Q ${right} ${bodyBottom} ${right - radius} ${bodyBottom}`,
    `H ${tipRight}`,
    `L ${tipApexX} ${bottom}`,
    `L ${tipLeft} ${bodyBottom}`,
    `H ${x + radius}`,
    `Q ${x} ${bodyBottom} ${x} ${bodyBottom - radius}`,
    `V ${y + radius}`,
    `Q ${x} ${y} ${x + radius} ${y}`,
    "Z",
  ].join(" ");
}

export function wrapNoteText(
  text: string,
  maxWidth: number,
  height: number,
  options: NoteTextLayoutOptions,
): string[] {
  const lines = wrapNoteTextLines(text, maxWidth, options.measureText);
  const bodyHeight = Math.max(0, height - options.tipHeight);
  const usableHeight = Math.max(options.lineHeight, bodyHeight - options.verticalPadding * 2);
  const maxLines = Math.max(1, Math.floor(usableHeight / options.lineHeight));
  if (lines.length <= maxLines) return lines;
  const visible = lines.slice(0, maxLines);
  visible[visible.length - 1] = fitNoteText(`${visible[visible.length - 1]}...`, maxWidth, options.measureText);
  return visible;
}

export function wrapNoteTextLines(
  text: string,
  maxWidth: number,
  measureText: (text: string) => number,
): string[] {
  return String(text || "")
    .split(/\r?\n/)
    .flatMap((line) => wrapNoteLine(line, maxWidth, measureText));
}

export function fitNoteText(
  text: string,
  maxWidth: number,
  measureText: (text: string) => number,
): string {
  const value = String(text || "");
  if (maxWidth <= 0) return "";
  if (measureText(value) <= maxWidth) return value;
  const suffix = "...";
  let output = value;
  while (output.length > 1 && measureText(`${output}${suffix}`) > maxWidth) {
    output = output.slice(0, -1);
  }
  return `${output}${suffix}`;
}

export function textDirectionFor(text: string): "ltr" | "rtl" {
  const value = String(text || "");
  for (const char of value) {
    if (/[\u0590-\u08FF\uFB1D-\uFEFC]/u.test(char)) return "rtl";
    if (/[A-Za-z\u00C0-\u024F]/u.test(char)) return "ltr";
  }
  return "ltr";
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function wrapNoteLine(
  line: string,
  maxWidth: number,
  measureText: (text: string) => number,
): string[] {
  const value = String(line || "");
  if (!value.trim()) return [" "];
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    if (!current) {
      current = word;
      return;
    }
    const next = `${current} ${word}`;
    if (measureText(next) <= maxWidth) {
      current = next;
    } else {
      lines.push(...splitLongNoteWord(current, maxWidth, measureText));
      current = word;
    }
  });
  if (current) lines.push(...splitLongNoteWord(current, maxWidth, measureText));
  return lines.length ? lines : [" "];
}

function splitLongNoteWord(
  word: string,
  maxWidth: number,
  measureText: (text: string) => number,
): string[] {
  const value = String(word || "");
  if (measureText(value) <= maxWidth) return [value];
  const chunks: string[] = [];
  let current = "";
  Array.from(value).forEach((char) => {
    const next = `${current}${char}`;
    if (current && measureText(next) > maxWidth) {
      chunks.push(current);
      current = char;
    } else {
      current = next;
    }
  });
  if (current) chunks.push(current);
  return chunks;
}

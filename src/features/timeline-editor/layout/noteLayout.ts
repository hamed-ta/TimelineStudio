export type NoteRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type NoteBubbleLayout = NoteRect & {
  tipX: number;
  anchorX: number;
};

export type NoteBubblePathOptions = {
  tipHeight: number;
  tipHalfWidth: number;
  tipMaxLean: number;
  pad?: number;
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

export function noteRectsOverlap(a: NoteRect, b: NoteRect, gap: number): boolean {
  return a.x < b.x + b.width + gap
    && a.x + a.width + gap > b.x
    && a.y < b.y + b.height + gap
    && a.y + a.height + gap > b.y;
}

export function noteBubblePath(layout: NoteBubbleLayout, options: NoteBubblePathOptions): string {
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

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

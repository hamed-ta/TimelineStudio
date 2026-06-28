export type NoteRect = {
  x: number;
  y: number;
  width: number;
  height: number;
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

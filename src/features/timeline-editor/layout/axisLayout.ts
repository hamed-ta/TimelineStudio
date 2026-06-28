export type AxisLabelPlacement = {
  centerX: number;
  width: number;
  lastLabelEnd: number;
  gap: number;
};

export function canPlaceAxisLabel({
  centerX,
  width,
  lastLabelEnd,
  gap,
}: AxisLabelPlacement): boolean {
  return centerX - width / 2 >= lastLabelEnd + gap;
}

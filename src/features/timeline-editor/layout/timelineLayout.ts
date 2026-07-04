import {
  addDaysIso,
  addMonthsIso,
  addYearsIso,
  clamp,
  compareIso,
  daysBetween,
  isoDay,
  isoFromParts,
  isoMonth,
  isoYear,
  monthsBetween,
  normalizeDateInput,
  normalizeSnap,
  yearStartIso,
  type TimelineSnap,
} from "../../../timeline/dates.ts";

export type TimelineFitZoomOptions = {
  startDate: string;
  endDate: string;
  viewportWidth: number;
  leftGutter: number;
  rightGutter: number;
  minZoom: number;
  maxZoom: number;
};

export type LaneSide = "above" | "below";

export type CentralTimelineGeometryOptions = {
  laneCount: number;
  rowHeight: number;
  axisHeight: number;
  topPadding: number;
  footerHeight: number;
};

export type CentralTimelineGeometry = {
  axisY: number;
  axisBandTop: number;
  axisHeight: number;
  trackTop: number;
  trackBottom: number;
  lanesAbove: number;
  lanesBelow: number;
  contentHeightWithoutNotes: number;
};

export type TimelineAxisDetail = {
  monthBands: boolean;
  monthGrid: boolean;
  dayGrid: boolean;
  dayTicks: boolean;
  dayLabels: boolean;
};

export type TimelineWheelInput = {
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  getModifierState?: (key: string) => boolean;
};

export type TimelineWheelAction = "timeline-area" | "row-height" | "none";

export function timelinePixelsPerDay(zoom: number, avgDaysPerMonth: number): number {
  return zoom / avgDaysPerMonth;
}

export function timelineDateToX(
  isoDate: string,
  startDate: string,
  leftGutter: number,
  pixelsPerDay: number,
): number {
  return leftGutter + daysBetween(startDate, isoDate) * pixelsPerDay;
}

export function timelineXToDate(
  x: number,
  startDate: string,
  leftGutter: number,
  pixelsPerDay: number,
): string {
  return addDaysIso(startDate, Math.round((Number(x) - leftGutter) / pixelsPerDay));
}

export function axisDetailForZoom(zoom: number, avgDaysPerMonth = 365.2425 / 12): TimelineAxisDetail {
  const safeZoom = Math.max(0, Number(zoom) || 0);
  const pixelsPerDay = timelinePixelsPerDay(safeZoom, avgDaysPerMonth);
  return {
    monthBands: safeZoom >= 72,
    monthGrid: safeZoom >= 42,
    dayGrid: pixelsPerDay >= 8,
    dayTicks: pixelsPerDay >= 9,
    dayLabels: pixelsPerDay >= 9,
  };
}

export function timelineWheelAction(input: TimelineWheelInput): TimelineWheelAction {
  const hasAlt = Boolean(input.altKey || input.getModifierState?.("Alt") || input.getModifierState?.("Option"));
  const hasPrimaryModifier = Boolean(
    input.ctrlKey
    || input.metaKey
    || input.getModifierState?.("Control")
    || input.getModifierState?.("Meta")
    || input.getModifierState?.("OS"),
  );
  if (hasAlt && hasPrimaryModifier) return "timeline-area";
  if (hasPrimaryModifier) return "row-height";
  return "none";
}

export function laneSide(laneIndex: number): LaneSide {
  return Math.max(0, Math.floor(laneIndex)) % 2 === 0 ? "above" : "below";
}

export function laneTrackNumber(laneIndex: number): number {
  return Math.floor(Math.max(0, Math.floor(laneIndex)) / 2) + 1;
}

export function laneDisplayLabel(laneIndex: number, storedLabel = ""): string {
  const normalizedLabel = String(storedLabel || "").trim();
  const legacyDefault = `Line ${Math.max(0, Math.floor(laneIndex)) + 1}`;
  const sign = laneSide(laneIndex) === "above" ? "+" : "-";
  const centralDefault = `Line ${sign}${laneTrackNumber(laneIndex)}`;
  if (
    normalizedLabel
    && normalizedLabel !== legacyDefault
    && !/^Line [+-]\d+$/.test(normalizedLabel)
  ) {
    return normalizedLabel;
  }
  return centralDefault;
}

export function laneVisualOrder(laneCount: number): number[] {
  const safeLaneCount = Math.max(1, Math.floor(laneCount));
  const above: number[] = [];
  const below: number[] = [];
  for (let lane = 0; lane < safeLaneCount; lane += 1) {
    if (laneSide(lane) === "above") {
      above.unshift(lane);
    } else {
      below.push(lane);
    }
  }
  return above.concat(below);
}

export function laneSourceMapForVisualMove(
  laneCount: number,
  fromIndex: number,
  toIndex: number,
): number[] {
  const order = laneVisualOrder(laneCount);
  const identity = Array.from({ length: order.length }, (_value, index) => index);
  const fromLane = Math.floor(fromIndex);
  const toLane = Math.floor(toIndex);
  const fromVisualIndex = order.indexOf(fromLane);
  const toVisualIndex = order.indexOf(toLane);
  if (fromVisualIndex < 0 || toVisualIndex < 0 || fromVisualIndex === toVisualIndex) {
    return identity;
  }

  const movedOrder = order.slice();
  const [movedLane] = movedOrder.splice(fromVisualIndex, 1);
  movedOrder.splice(toVisualIndex, 0, movedLane);

  const sourceByDestination = identity.slice();
  order.forEach((destinationLane, visualIndex) => {
    sourceByDestination[destinationLane] = movedOrder[visualIndex];
  });
  return sourceByDestination;
}

export function centralTimelineGeometry({
  laneCount,
  rowHeight,
  axisHeight,
  topPadding,
  footerHeight,
}: CentralTimelineGeometryOptions): CentralTimelineGeometry {
  const safeLaneCount = Math.max(1, Math.floor(laneCount));
  const safeRowHeight = Math.max(1, rowHeight);
  const safeAxisHeight = Math.max(1, axisHeight);
  const lanesAbove = Math.ceil(safeLaneCount / 2);
  const lanesBelow = Math.floor(safeLaneCount / 2);
  const trackTop = Math.max(0, topPadding);
  const axisBandTop = trackTop + lanesAbove * safeRowHeight;
  const axisY = axisBandTop + safeAxisHeight / 2;
  const trackBottom = axisBandTop + safeAxisHeight + lanesBelow * safeRowHeight;
  return {
    axisY,
    axisBandTop,
    axisHeight: safeAxisHeight,
    trackTop,
    trackBottom,
    lanesAbove,
    lanesBelow,
    contentHeightWithoutNotes: trackBottom + Math.max(0, footerHeight),
  };
}

export function laneRowTop(
  laneIndex: number,
  geometry: CentralTimelineGeometry,
  rowHeight: number,
): number {
  const track = laneTrackNumber(laneIndex);
  if (laneSide(laneIndex) === "above") {
    return geometry.axisBandTop - track * rowHeight;
  }
  return geometry.axisBandTop + geometry.axisHeight + (track - 1) * rowHeight;
}

export function laneCenterY(
  laneIndex: number,
  geometry: CentralTimelineGeometry,
  rowHeight: number,
): number {
  return laneRowTop(laneIndex, geometry, rowHeight) + rowHeight / 2;
}

export function nearestLaneIndexForY(
  y: number,
  geometry: CentralTimelineGeometry,
  rowHeight: number,
  laneCount: number,
): number {
  const safeLaneCount = Math.max(1, Math.floor(laneCount));
  let nearestLane = 0;
  let nearestDistance = Infinity;
  for (let lane = 0; lane < safeLaneCount; lane += 1) {
    const distance = Math.abs(y - laneCenterY(lane, geometry, rowHeight));
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestLane = lane;
    }
  }
  return nearestLane;
}

export function fitZoomForTimeline({
  startDate,
  endDate,
  viewportWidth,
  leftGutter,
  rightGutter,
  minZoom,
  maxZoom,
}: TimelineFitZoomOptions): number {
  const months = Math.max(1, monthsBetween(startDate, addDaysIso(endDate, 1)));
  const available = Math.max(200, viewportWidth - leftGutter - rightGutter - 24);
  return clamp(available / months, minZoom, maxZoom);
}

export function snapTimelineDate(
  isoDate: string,
  startDate: string,
  snapValue: TimelineSnap,
): string {
  const date = normalizeDateInput(isoDate, startDate);
  const snap = normalizeSnap(snapValue);
  if (snap === "year") {
    const currentYear = isoYear(date);
    const midYear = `${currentYear}-07-02`;
    return yearStartIso(compareIso(date, midYear) < 0 ? currentYear : currentYear + 1);
  }
  if (snap === "month") {
    const year = isoYear(date);
    const month = isoMonth(date);
    const day = isoDay(date);
    return isoFromParts(month === 11 && day >= 16 ? year + 1 : year, day >= 16 ? (month + 1) % 12 : month, 1);
  }
  if (snap === "week") {
    const days = daysBetween(startDate, date);
    return addDaysIso(startDate, Math.round(days / 7) * 7);
  }
  return addDaysIso(startDate, daysBetween(startDate, date));
}

export function minDurationDaysForSnap(snap: TimelineSnap): number {
  if (snap === "year") return 365;
  if (snap === "month") return 28;
  if (snap === "week") return 7;
  return 1;
}

export function defaultEndDateForSnap(startDate: string, snap: TimelineSnap): string {
  if (snap === "year") return addYearsIso(startDate, 1);
  if (snap === "week") return addDaysIso(startDate, 7);
  if (snap === "day") return addDaysIso(startDate, 1);
  return addMonthsIso(startDate, 1);
}

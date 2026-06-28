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

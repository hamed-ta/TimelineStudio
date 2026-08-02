import { dateFromIso } from "./dates.ts";
import {
  hasDisplayCalendar,
  normalizeDisplayCalendars,
  type TimelineDisplayCalendar,
} from "./calendars.ts";
import {
  formatCalendarDate,
  formatCalendarMonthName,
  formatCalendarParts,
} from "./calendarRegistry.ts";

const EN_DATE_FORMAT = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const EN_MONTH_FORMAT = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});

export function formatDisplayDate(isoDate: string): string {
  return EN_DATE_FORMAT.format(dateFromIso(isoDate));
}

export function formatIranianDate(isoDate: string): string {
  return formatCalendarDate(isoDate, "iranian");
}

export function formatDatePair(isoDate: string): string {
  return `${formatDisplayDate(isoDate)} / ${formatIranianDate(isoDate)}`;
}

export function formatDateForCalendars(
  isoDate: string,
  displayCalendars: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"],
): string {
  return normalizeDisplayCalendars(displayCalendars)
    .map((calendar) => (calendar === "gregorian" ? formatDisplayDate(isoDate) : formatCalendarDate(isoDate, calendar)))
    .join(" / ");
}

export function hasGregorianDisplay(displayCalendars: readonly TimelineDisplayCalendar[] | unknown): boolean {
  return hasDisplayCalendar(displayCalendars, "gregorian");
}

export function hasIranianDisplay(displayCalendars: readonly TimelineDisplayCalendar[] | unknown): boolean {
  return hasDisplayCalendar(displayCalendars, "iranian");
}

export function formatZoomValue(value: number): string {
  return value >= 10 ? String(Math.round(value)) : value.toFixed(1).replace(/\.0$/, "");
}

export function monthName(isoDate: string): string {
  return EN_MONTH_FORMAT.format(dateFromIso(isoDate));
}

export function iranianYear(isoDate: string): string {
  return formatCalendarParts(isoDate, "iranian").year;
}

export function iranianDay(isoDate: string): string {
  return formatCalendarParts(isoDate, "iranian").day;
}

export function iranianDateParts(isoDate: string): { year: number; month: number; day: number } {
  const parts = formatCalendarParts(isoDate, "iranian");
  return {
    year: Number(parts.year),
    month: Number(parts.numericMonth),
    day: Number(parts.day),
  };
}

export function iranianMonthName(isoDate: string): string {
  return formatCalendarMonthName(isoDate, "iranian");
}

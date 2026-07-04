import { dateFromIso } from "./dates.ts";
import {
  hasDisplayCalendar,
  normalizeDisplayCalendars,
  type TimelineDisplayCalendar,
} from "./calendars.ts";

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
const IRANIAN_DATE_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const IRANIAN_YEAR_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  year: "numeric",
  timeZone: "UTC",
});
const IRANIAN_DAY_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  day: "numeric",
  timeZone: "UTC",
});
const IRANIAN_MONTH_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  month: "short",
  timeZone: "UTC",
});
const IRANIAN_NUMERIC_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDisplayDate(isoDate: string): string {
  return EN_DATE_FORMAT.format(dateFromIso(isoDate));
}

export function formatIranianDate(isoDate: string): string {
  const parts = IRANIAN_DATE_FORMAT
    .formatToParts(dateFromIso(isoDate))
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal" && part.type !== "era") result[part.type] = part.value;
      return result;
    }, {});
  return `${parts.day} ${parts.month} ${parts.year}`;
}

export function formatDatePair(isoDate: string): string {
  return `${formatDisplayDate(isoDate)} / ${formatIranianDate(isoDate)}`;
}

export function formatDateForCalendars(
  isoDate: string,
  displayCalendars: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"],
): string {
  return normalizeDisplayCalendars(displayCalendars)
    .map((calendar) => (calendar === "gregorian" ? formatDisplayDate(isoDate) : formatIranianDate(isoDate)))
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
  const parts = IRANIAN_YEAR_FORMAT
    .formatToParts(dateFromIso(isoDate))
    .find((part) => part.type === "year");
  return parts?.value || IRANIAN_YEAR_FORMAT.format(dateFromIso(isoDate)).replace(/\s*AP$/, "");
}

export function iranianDay(isoDate: string): string {
  return IRANIAN_DAY_FORMAT.format(dateFromIso(isoDate));
}

export function iranianDateParts(isoDate: string): { year: number; month: number; day: number } {
  const parts = IRANIAN_NUMERIC_FORMAT
    .formatToParts(dateFromIso(isoDate))
    .reduce<Record<string, string>>((result, part) => {
      if (part.type === "year" || part.type === "month" || part.type === "day") result[part.type] = part.value;
      return result;
    }, {});
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  };
}

export function iranianMonthName(isoDate: string): string {
  return IRANIAN_MONTH_FORMAT.format(dateFromIso(isoDate));
}

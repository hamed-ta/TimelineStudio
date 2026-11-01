import { currentLanguage, currentLocale, formatNumber } from "../i18n/index.ts";
import { dateFromIso } from "./dates.ts";
import {
  hasDisplayCalendar,
  normalizeDisplayCalendars,
  type TimelineDisplayCalendar,
  type TimelineSecondaryCalendar,
} from "./calendars.ts";
import {
  CALENDAR_REGISTRY,
  formatCalendarDate,
  formatCalendarMonthName,
  formatCalendarParts,
} from "./calendarRegistry.ts";

const DISPLAY_FORMATTERS = new Map<string, Intl.DateTimeFormat>();
function displayFormatter(calendar: TimelineDisplayCalendar, mode: "full" | "month" | "parts") {
  const { locale, numberingSystem } = currentLocale();
  const key = `${locale}|${numberingSystem}|${calendar}|${mode}`;
  let formatter = DISPLAY_FORMATTERS.get(key);
  if (!formatter) {
    const definition = calendar === "gregorian" ? null : CALENDAR_REGISTRY[calendar];
    formatter = new Intl.DateTimeFormat(locale, {
      calendar: definition?.intlCalendar ?? "gregory", numberingSystem, timeZone: "UTC",
      month: mode === "parts" ? "numeric" : mode === "month" || calendar === "gregorian" ? "short" : "long",
      ...(mode !== "month" ? { day: "numeric", year: "numeric", ...(definition?.requiresEra ? { era: "short" } : {}) } : {}),
    });
    DISPLAY_FORMATTERS.set(key, formatter);
  }
  return formatter;
}
function displayPart(isoDate: string, calendar: TimelineSecondaryCalendar, type: Intl.DateTimeFormatPartTypes): string {
  return displayFormatter(calendar, "parts").formatToParts(dateFromIso(isoDate)).find(part => part.type === type)?.value ?? "";
}
function calendarDate(isoDate: string, calendar: TimelineSecondaryCalendar): string {
  // Preserve established English spellings/era behavior for compatibility wrappers.
  return currentLanguage() === "en" ? formatCalendarDate(isoDate, calendar) : displayFormatter(calendar, "full").format(dateFromIso(isoDate));
}

export function formatDisplayDate(isoDate: string): string {
  return displayFormatter("gregorian", "full").format(dateFromIso(isoDate));
}

export function formatIranianDate(isoDate: string): string {
  return calendarDate(isoDate, "iranian");
}

export function formatDatePair(isoDate: string): string {
  return `${formatDisplayDate(isoDate)} / ${formatIranianDate(isoDate)}`;
}

export function formatDateForCalendars(
  isoDate: string,
  displayCalendars: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"],
): string {
  return normalizeDisplayCalendars(displayCalendars)
    .map((calendar) => (calendar === "gregorian" ? formatDisplayDate(isoDate) : calendarDate(isoDate, calendar)))
    .join(" / ");
}

export function hasGregorianDisplay(displayCalendars: readonly TimelineDisplayCalendar[] | unknown): boolean {
  return hasDisplayCalendar(displayCalendars, "gregorian");
}

export function hasIranianDisplay(displayCalendars: readonly TimelineDisplayCalendar[] | unknown): boolean {
  return hasDisplayCalendar(displayCalendars, "iranian");
}

export function formatZoomValue(value: number): string {
  return formatNumber(value >= 10 ? Math.round(value) : value, { maximumFractionDigits: value >= 10 ? 0 : 1 });
}

export function monthName(isoDate: string): string {
  return displayFormatter("gregorian", "month").format(dateFromIso(isoDate));
}

export function calendarYearLabel(isoDate: string, calendar: TimelineSecondaryCalendar): string {
  return currentLanguage() === "en" ? formatCalendarParts(isoDate, calendar).yearKey : [displayPart(isoDate, calendar, "year"), CALENDAR_REGISTRY[calendar].requiresEra ? displayPart(isoDate, calendar, "era") : ""].filter(Boolean).join(" ");
}

export function calendarMonthLabel(isoDate: string, calendar: TimelineSecondaryCalendar): string {
  return currentLanguage() === "en" ? formatCalendarMonthName(isoDate, calendar) : displayFormatter(calendar, "month").formatToParts(dateFromIso(isoDate)).find(part => part.type === "month")?.value ?? "";
}

export function calendarDayLabel(isoDate: string, calendar: TimelineSecondaryCalendar): string {
  return displayPart(isoDate, calendar, "day");
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

// Structural value for tick selection; never parse a localized day label.
export function calendarDayValue(isoDate: string, calendar: TimelineSecondaryCalendar): number {
  return Number(formatCalendarParts(isoDate, calendar).day);
}

import { type TimelineDisplayCalendar, type TimelineSecondaryCalendar, isSecondaryCalendar, normalizeDisplayCalendars } from "./calendars.ts";
import { dateFromIso } from "./dates.ts";

type CalendarDefinition = Readonly<{
  id: TimelineSecondaryCalendar;
  label: string;
  intlCalendar: string;
  requiresEra: boolean;
}>;

type CalendarFormatters = Readonly<{
  full: Intl.DateTimeFormat;
  numeric: Intl.DateTimeFormat;
  month: Intl.DateTimeFormat;
}>;

export type CalendarDateParts = Readonly<{
  day: string;
  month: string;
  numericMonth: string;
  year: string;
  era: string;
  yearKey: string;
  monthKey: string;
}>;

export const CALENDAR_REGISTRY: Readonly<Record<TimelineSecondaryCalendar, CalendarDefinition>> = Object.freeze({
  iranian: Object.freeze({ id: "iranian", label: "Persian / Solar Hijri", intlCalendar: "persian", requiresEra: false }),
  "islamic-umalqura": Object.freeze({ id: "islamic-umalqura", label: "Islamic (Umm al-Qura)", intlCalendar: "islamic-umalqura", requiresEra: true }),
  hebrew: Object.freeze({ id: "hebrew", label: "Hebrew", intlCalendar: "hebrew", requiresEra: true }),
  buddhist: Object.freeze({ id: "buddhist", label: "Buddhist", intlCalendar: "buddhist", requiresEra: true }),
  japanese: Object.freeze({ id: "japanese", label: "Japanese", intlCalendar: "japanese", requiresEra: true }),
  indian: Object.freeze({ id: "indian", label: "Indian National", intlCalendar: "indian", requiresEra: true }),
});

const FORMATTERS = new Map<TimelineSecondaryCalendar, CalendarFormatters>();

function createFormatters(definition: CalendarDefinition): CalendarFormatters {
  const locale = `en-US-u-ca-${definition.intlCalendar}-nu-latn`;
  const options = { timeZone: "UTC" } as const;
  return {
    full: new Intl.DateTimeFormat(locale, { ...options, day: "numeric", month: "long", year: "numeric", era: "short" }),
    numeric: new Intl.DateTimeFormat(locale, { ...options, day: "numeric", month: "numeric", year: "numeric" }),
    month: new Intl.DateTimeFormat(locale, { ...options, month: "short" }),
  };
}

function formattersFor(calendar: TimelineSecondaryCalendar): CalendarFormatters {
  const existing = FORMATTERS.get(calendar);
  if (existing) return existing;
  const formatters = createFormatters(CALENDAR_REGISTRY[calendar]);
  FORMATTERS.set(calendar, formatters);
  return formatters;
}

function partsFor(formatter: Intl.DateTimeFormat, isoDate: string): Record<string, string> {
  return formatter.formatToParts(dateFromIso(isoDate)).reduce<Record<string, string>>((parts, part) => {
    if (part.type !== "literal") parts[part.type] = part.value;
    return parts;
  }, {});
}

function normalizeText(value: string): string {
  return value.replace("Śaka", "Saka");
}

export function formatCalendarParts(isoDate: string, calendar: TimelineSecondaryCalendar): CalendarDateParts {
  const formatters = formattersFor(calendar);
  const full = partsFor(formatters.full, isoDate);
  const numeric = partsFor(formatters.numeric, isoDate);
  const era = normalizeText(full.era ?? "");
  const year = normalizeText(full.year);
  const month = normalizeText(full.month);
  const day = normalizeText(full.day);
  return {
    day,
    month,
    numericMonth: normalizeText(numeric.month),
    year,
    era,
    yearKey: [year, era].filter(Boolean).join(" "),
    monthKey: [year, numeric.month, month, era].filter(Boolean).join(" "),
  };
}

export function formatCalendarDate(isoDate: string, calendar: TimelineSecondaryCalendar): string {
  const definition = CALENDAR_REGISTRY[calendar];
  const { day, month, year, era } = formatCalendarParts(isoDate, calendar);
  return [day, month, year, definition.requiresEra ? era : ""].filter(Boolean).join(" ");
}

export function formatCalendarMonthName(isoDate: string, calendar: TimelineSecondaryCalendar): string {
  const part = formattersFor(calendar).month.formatToParts(dateFromIso(isoDate)).find(({ type }) => type === "month");
  return normalizeText(part?.value ?? "");
}

export function isCalendarSupported(calendar: TimelineSecondaryCalendar): boolean {
  const definition = CALENDAR_REGISTRY[calendar];
  try {
    return formattersFor(calendar).full.resolvedOptions().calendar === definition.intlCalendar;
  } catch {
    return false;
  }
}

export function effectiveDisplayCalendars(
  displayCalendars: readonly TimelineDisplayCalendar[] | unknown,
  supportsCalendar: (calendar: TimelineSecondaryCalendar) => boolean = isCalendarSupported,
): TimelineDisplayCalendar[] {
  const calendars = normalizeDisplayCalendars(displayCalendars);
  const secondary = calendars.find(isSecondaryCalendar);
  return secondary && !supportsCalendar(secondary) ? ["gregorian"] : calendars;
}

export type TimelineDisplayCalendar = "gregorian" | "iranian";

export const DISPLAY_CALENDARS: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"];
export const DEFAULT_DISPLAY_CALENDARS: readonly TimelineDisplayCalendar[] = DISPLAY_CALENDARS;

export function isDisplayCalendar(value: unknown): value is TimelineDisplayCalendar {
  return value === "gregorian" || value === "iranian";
}

export function normalizeDisplayCalendars(value: unknown): TimelineDisplayCalendar[] {
  const rawValues = Array.isArray(value) ? value : [value];
  const calendars = rawValues.filter(isDisplayCalendar);
  const uniqueCalendars = DISPLAY_CALENDARS.filter((calendar) => calendars.includes(calendar));
  return uniqueCalendars.length > 0 ? uniqueCalendars : [...DEFAULT_DISPLAY_CALENDARS];
}

export function hasDisplayCalendar(value: unknown, calendar: TimelineDisplayCalendar): boolean {
  return normalizeDisplayCalendars(value).includes(calendar);
}

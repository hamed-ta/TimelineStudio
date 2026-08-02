export type TimelineSecondaryCalendar =
  | "iranian"
  | "islamic-umalqura"
  | "hebrew"
  | "buddhist"
  | "japanese"
  | "indian";

export type TimelineDisplayCalendar = "gregorian" | TimelineSecondaryCalendar;

export type CalendarControlState = {
  showGregorian: boolean;
  secondary: TimelineSecondaryCalendar | null;
  gregorianDisabled: boolean;
};

export const SECONDARY_CALENDAR_IDS: readonly TimelineSecondaryCalendar[] = [
  "iranian",
  "islamic-umalqura",
  "hebrew",
  "buddhist",
  "japanese",
  "indian",
];

export const DISPLAY_CALENDARS: readonly TimelineDisplayCalendar[] = [
  "gregorian",
  ...SECONDARY_CALENDAR_IDS,
];
export const DEFAULT_DISPLAY_CALENDARS: readonly TimelineDisplayCalendar[] = ["gregorian"];

export function isSecondaryCalendar(value: unknown): value is TimelineSecondaryCalendar {
  return SECONDARY_CALENDAR_IDS.includes(value as TimelineSecondaryCalendar);
}

export function isDisplayCalendar(value: unknown): value is TimelineDisplayCalendar {
  return value === "gregorian" || isSecondaryCalendar(value);
}

export function normalizeDisplayCalendars(value: unknown): TimelineDisplayCalendar[] {
  const values = Array.isArray(value) ? value : [value];
  const showGregorian = values.includes("gregorian");
  const secondary = values.find(isSecondaryCalendar) ?? null;
  if (!secondary) return ["gregorian"];
  return showGregorian ? ["gregorian", secondary] : [secondary];
}

export function calendarControlState(value: unknown): CalendarControlState {
  const calendars = normalizeDisplayCalendars(value);
  const secondary = calendars.find(isSecondaryCalendar) ?? null;
  return {
    showGregorian: calendars.includes("gregorian"),
    secondary,
    gregorianDisabled: secondary === null,
  };
}

export function displayCalendarsFromControls(
  showGregorian: boolean,
  secondary: TimelineSecondaryCalendar | null,
): TimelineDisplayCalendar[] {
  if (!secondary) return ["gregorian"];
  return showGregorian ? ["gregorian", secondary] : [secondary];
}

export function hasDisplayCalendar(value: unknown, calendar: TimelineDisplayCalendar): boolean {
  return normalizeDisplayCalendars(value).includes(calendar);
}

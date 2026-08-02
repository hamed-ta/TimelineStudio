import { type TimelineSecondaryCalendar } from "./calendars.ts";
import { formatCalendarParts } from "./calendarRegistry.ts";
import { addDaysIso } from "./dates.ts";

type CalendarBoundaryUnit = "month" | "year";

const BOUNDARY_CACHE = new Map<string, string[]>();

export function calendarBoundaryDates(
  calendar: TimelineSecondaryCalendar,
  startDate: string,
  endDate: string,
  unit: CalendarBoundaryUnit,
): string[] {
  const cacheKey = `${calendar}|${unit}|${startDate}|${endDate}`;
  const cached = BOUNDARY_CACHE.get(cacheKey);
  if (cached) return [...cached];

  const boundaries: string[] = [];
  let currentDate = startDate;
  let previousKey = boundaryKey(calendar, addDaysIso(currentDate, -1), unit);

  while (currentDate <= endDate) {
    const currentKey = boundaryKey(calendar, currentDate, unit);
    if (currentKey !== previousKey) boundaries.push(currentDate);
    previousKey = currentKey;
    currentDate = addDaysIso(currentDate, 1);
  }

  BOUNDARY_CACHE.set(cacheKey, boundaries);
  return [...boundaries];
}

function boundaryKey(calendar: TimelineSecondaryCalendar, isoDate: string, unit: CalendarBoundaryUnit): string {
  const parts = formatCalendarParts(isoDate, calendar);
  return unit === "month" ? parts.monthKey : parts.yearKey;
}

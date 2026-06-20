import { dateFromIso } from "./dates";

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
const IRANIAN_MONTH_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  month: "short",
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

export function formatZoomValue(value: number): string {
  return value >= 10 ? String(Math.round(value)) : value.toFixed(1).replace(/\.0$/, "");
}

export function monthName(isoDate: string): string {
  return EN_MONTH_FORMAT.format(dateFromIso(isoDate));
}

export function iranianMonthName(isoDate: string): string {
  return IRANIAN_MONTH_FORMAT.format(dateFromIso(isoDate));
}

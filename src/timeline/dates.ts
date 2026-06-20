export type TimelineSnap = "year" | "month" | "week" | "day";

const DAY_MS = 24 * 60 * 60 * 1000;

export function toNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function normalizeDateInput(value: unknown, fallback: unknown): string {
  const fallbackIso = isIsoDate(fallback) ? fallback : todayIso();
  if (value instanceof Date && !Number.isNaN(value.getTime())) return isoFromDate(value);
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text) && isValidIsoDate(text)) return text;
  const parsedTextDate = parseDateText(text);
  if (parsedTextDate) return parsedTextDate;
  if (/^\d{4}$/.test(text)) return `${text}-01-01`;
  return fallbackIso;
}

export function normalizeSnap(value: unknown): TimelineSnap {
  if (["year", "month", "week", "day"].includes(String(value))) return value as TimelineSnap;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "month";
  if (numeric >= 1) return "year";
  if (numeric >= 0.25) return "month";
  if (numeric >= 0.02) return "week";
  return "day";
}

export function monthsBetween(startIso: unknown, endIso: unknown): number {
  const startYear = isoYear(startIso);
  const startMonth = isoMonth(startIso);
  const endYear = isoYear(endIso);
  const endMonth = isoMonth(endIso);
  return Math.max(1, (endYear - startYear) * 12 + endMonth - startMonth + 1);
}

export function daysBetween(startIso: unknown, endIso: unknown): number {
  return Math.round((dateFromIso(endIso).getTime() - dateFromIso(startIso).getTime()) / DAY_MS);
}

export function compareIso(a: unknown, b: unknown): number {
  return normalizeDateInput(a, todayIso()).localeCompare(normalizeDateInput(b, todayIso()));
}

export function clampIso(value: string, min: string, max: string): string {
  if (compareIso(value, min) < 0) return min;
  if (compareIso(value, max) > 0) return max;
  return value;
}

export function addDaysIso(isoDate: string, days: number): string {
  const date = dateFromIso(isoDate);
  date.setUTCDate(date.getUTCDate() + Math.round(days));
  return isoFromDate(date);
}

export function addMonthsIso(isoDate: string, months: number): string {
  const date = dateFromIso(isoDate);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const maxDay = daysInMonth(date.getUTCFullYear(), date.getUTCMonth());
  date.setUTCDate(Math.min(day, maxDay));
  return isoFromDate(date);
}

export function addYearsIso(isoDate: string, years: number): string {
  return addMonthsIso(isoDate, years * 12);
}

export function yearStartIso(year: number): string {
  return `${String(Math.round(year)).padStart(4, "0")}-01-01`;
}

export function yearEndIso(year: number): string {
  return `${String(Math.round(year)).padStart(4, "0")}-12-31`;
}

export function isoFromYearValue(value: number): string {
  const year = Math.floor(value);
  const fraction = value - year;
  if (fraction <= 0) return yearStartIso(year);
  return addDaysIso(yearStartIso(year), Math.round(fraction * daysInYear(year)));
}

export function isoFromParts(year: number, monthIndex: number, day: number): string {
  return isoFromDate(new Date(Date.UTC(year, monthIndex, day)));
}

export function todayIso(): string {
  const today = new Date();
  return isoFromYmd(today.getFullYear(), today.getMonth() + 1, today.getDate()) || isoFromDate(today);
}

export function dateFromIso(isoDate: unknown): Date {
  const [year, month, day] = normalizeDateInput(isoDate, todayIso()).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isoFromDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && isValidIsoDate(value);
}

export function isValidIsoDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isoYear(isoDate: unknown): number {
  return Number(normalizeDateInput(isoDate, todayIso()).slice(0, 4));
}

export function isoMonth(isoDate: unknown): number {
  return Number(normalizeDateInput(isoDate, todayIso()).slice(5, 7)) - 1;
}

export function isoDay(isoDate: unknown): number {
  return Number(normalizeDateInput(isoDate, todayIso()).slice(8, 10));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseDateText(text: string): string | null {
  const isoLike = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoLike) return isoFromYmd(Number(isoLike[1]), Number(isoLike[2]), Number(isoLike[3]));

  const slashDate = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (slashDate) return isoFromYmd(Number(slashDate[3]), Number(slashDate[1]), Number(slashDate[2]));

  return null;
}

function isoFromYmd(year: number, month: number, day: number): string | null {
  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return isValidIsoDate(iso) ? iso : null;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function daysInYear(year: number): number {
  return daysBetween(yearStartIso(year), yearStartIso(year + 1));
}

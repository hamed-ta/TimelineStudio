import { t, formatNumber } from "../i18n/index.ts";
import { spanUnit, joinSpan } from "../i18n/presentation.ts";
export type DateSpanParts = {
  years: number;
  months: number;
  days: number;
};

export function formatAgeAtDate(birthDate: string, targetDate: string): string {
  if (targetDate < birthDate) return t("before_birth");
  return t("age", { value: formatCompactDateSpan(birthDate, targetDate) });
}

export function formatDetailedAgeAtDate(birthDate: string, targetDate: string): string {
  if (targetDate < birthDate) return t("before_birth");
  return t("age", { value: formatDetailedDateSpan(birthDate, targetDate) });
}

export function formatDetailedAgeValueAtDate(birthDate: string, targetDate: string): string {
  if (targetDate < birthDate) return t("before_birth_value");
  return formatDetailedDateSpan(birthDate, targetDate);
}

export function formatCompactDateSpan(startDate: string, endDate: string): string {
  if (endDate < startDate) return t("before");
  const span = getDateSpanParts(startDate, endDate);
  const parts: string[] = [];
  if (span.years) parts.push(t("compact_years", { value: formatNumber(span.years) }));
  if (span.months) parts.push(t("compact_months", { value: formatNumber(span.months) }));
  if (span.days || parts.length === 0) parts.push(t("compact_days", { value: formatNumber(span.days) }));
  return parts.join(" ");
}

export function formatDetailedDateSpan(startDate: string, endDate: string): string {
  if (endDate < startDate) return t("before");
  const span = getDateSpanParts(startDate, endDate);
  const parts: string[] = [];
  if (span.years) parts.push(spanUnit("years", span.years));
  if (span.months) parts.push(spanUnit("months", span.months));
  if (span.days || parts.length === 0) parts.push(spanUnit("days", span.days));
  return joinSpan(parts);
}

export function getDateSpanParts(startDate: string, endDate: string): DateSpanParts {
  const start = isoParts(startDate);
  const end = isoParts(endDate);
  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;
  if (days < 0) {
    months -= 1;
    days += daysInIsoMonth(end.year, end.month - 1);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}

function isoParts(isoDate: string): { year: number; month: number; day: number } {
  const [year, month, day] = String(isoDate).split("-").map(Number);
  return {
    year: Number.isFinite(year) ? year : 0,
    month: Number.isFinite(month) ? month - 1 : 0,
    day: Number.isFinite(day) ? day : 1,
  };
}

function daysInIsoMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

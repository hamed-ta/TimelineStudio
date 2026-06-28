export type DateSpanParts = {
  years: number;
  months: number;
  days: number;
};

export function formatAgeAtDate(birthDate: string, targetDate: string): string {
  if (targetDate < birthDate) return "Before birth";
  return `Age ${formatCompactDateSpan(birthDate, targetDate)}`;
}

export function formatDetailedAgeAtDate(birthDate: string, targetDate: string): string {
  if (targetDate < birthDate) return "Before birth";
  return `Age ${formatDetailedDateSpan(birthDate, targetDate)}`;
}

export function formatDetailedAgeValueAtDate(birthDate: string, targetDate: string): string {
  if (targetDate < birthDate) return "before birth";
  return formatDetailedDateSpan(birthDate, targetDate);
}

export function formatCompactDateSpan(startDate: string, endDate: string): string {
  if (endDate < startDate) return "before";
  const span = getDateSpanParts(startDate, endDate);
  const parts: string[] = [];
  if (span.years) parts.push(`${span.years}y`);
  if (span.months) parts.push(`${span.months}m`);
  if (span.days || parts.length === 0) parts.push(`${span.days}d`);
  return parts.join(" ");
}

export function formatDetailedDateSpan(startDate: string, endDate: string): string {
  if (endDate < startDate) return "before";
  const span = getDateSpanParts(startDate, endDate);
  const parts: string[] = [];
  if (span.years) parts.push(`${span.years} ${span.years === 1 ? "year" : "years"}`);
  if (span.months) parts.push(`${span.months} ${span.months === 1 ? "month" : "months"}`);
  if (span.days || parts.length === 0) parts.push(`${span.days} ${span.days === 1 ? "day" : "days"}`);
  return parts.join(", ");
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

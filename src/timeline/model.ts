const DEFAULT_ROW_HEIGHT = 68;
const DAY_MS = 24 * 60 * 60 * 1000;

export const TYPE_COLORS: Record<TimelineItemType, string> = {
  event: "#d97706",
  period: "#2563eb",
  line: "#be123c",
  text: "#7c3aed",
};

export type TimelineItemType = "event" | "period" | "line" | "text";
export type TimelineSnap = "year" | "month" | "week" | "day";

export interface TimelineSettings {
  title: string;
  startDate: string;
  endDate: string;
  autoEndDate: boolean;
  itemsLocked: boolean;
  snap: TimelineSnap;
  rowHeight: number;
  laneLabels: string[];
}

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  lane: number;
  startDate: string;
  endDate: string;
  title: string;
  color: string;
  notes: string;
}

export interface TimelineDocument {
  version: 2;
  settings: TimelineSettings;
  items: TimelineItem[];
}

interface LegacyTimelineInput {
  settings?: Partial<TimelineSettings> & {
    startYear?: unknown;
    endYear?: unknown;
    birthDate?: unknown;
    birthYear?: unknown;
    shOffset?: unknown;
  };
  items?: unknown;
}

interface LegacyItemInput {
  id?: unknown;
  type?: unknown;
  lane?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  startYear?: unknown;
  endYear?: unknown;
  title?: unknown;
  color?: unknown;
  notes?: unknown;
}

export function createEmptyTimeline(): TimelineDocument {
  const year = new Date().getFullYear();
  const today = todayIso();
  return {
    version: 2,
    settings: {
      title: "New Timeline",
      startDate: yearStartIso(year),
      endDate: today,
      autoEndDate: true,
      itemsLocked: false,
      snap: "month",
      rowHeight: DEFAULT_ROW_HEIGHT,
      laneLabels: ["Line 1", "Line 2", "Line 3", "Line 4", "Line 5"],
    },
    items: [],
  };
}

export function normalizeTimeline(input: unknown): TimelineDocument {
  const source = isObject(input) ? (input as LegacyTimelineInput) : {};
  const fallback = createEmptyTimeline();
  fallback.settings.autoEndDate = false;
  const rawSettings = isObject(source.settings) ? source.settings : {};
  const settings = {
    ...fallback.settings,
    ...rawSettings,
  };

  settings.title = String(settings.title || "New Timeline");
  settings.startDate = normalizeDateInput(
    settings.startDate,
    rawSettings.startYear === undefined ? fallback.settings.startDate : yearStartIso(toNumber(rawSettings.startYear, isoYear(fallback.settings.startDate))),
  );
  settings.endDate = normalizeDateInput(
    settings.endDate,
    rawSettings.endYear === undefined ? fallback.settings.endDate : yearEndIso(toNumber(rawSettings.endYear, isoYear(fallback.settings.endDate))),
  );
  settings.autoEndDate = settings.autoEndDate === true;
  settings.itemsLocked = settings.itemsLocked === true;
  if (settings.autoEndDate) {
    settings.endDate = todayIso();
  }
  if (compareIso(settings.endDate, settings.startDate) < 0) {
    settings.endDate = settings.startDate;
  }
  delete rawSettings.birthDate;
  delete rawSettings.birthYear;
  delete rawSettings.shOffset;
  settings.snap = normalizeSnap(settings.snap);
  settings.rowHeight = clamp(toNumber(settings.rowHeight, DEFAULT_ROW_HEIGHT), 48, 120);
  settings.laneLabels = Array.isArray(settings.laneLabels)
    ? settings.laneLabels.map((label) => String(label))
    : fallback.settings.laneLabels;

  const rawItems = Array.isArray(source.items) ? source.items : fallback.items;
  const items = rawItems
    .map((item) => normalizeItem(item, settings.startDate))
    .filter((item): item is TimelineItem => Boolean(item));

  return {
    version: 2,
    settings,
    items,
  };
}

export function normalizeItem(item: unknown, defaultStartDate = todayIso()): TimelineItem | null {
  if (!isObject(item)) return null;
  const source = item as LegacyItemInput;
  const type = isTimelineItemType(source.type) ? source.type : "event";
  const startDate = normalizeDateInput(
    source.startDate,
    source.startYear === undefined ? defaultStartDate : isoFromYearValue(toNumber(source.startYear, isoYear(defaultStartDate))),
  );
  let endDate = normalizeDateInput(
    source.endDate,
    source.endYear === undefined ? startDate : isoFromYearValue(toNumber(source.endYear, isoYear(startDate))),
  );
  if (hasEndYear(type) && compareIso(endDate, startDate) <= 0) {
    endDate = addDaysIso(startDate, 1);
  }
  if (!hasEndYear(type)) {
    endDate = startDate;
  }

  return {
    id: String(source.id || createId(type)),
    type,
    lane: clamp(Math.round(toNumber(source.lane, 0)), 0, 20),
    startDate,
    endDate,
    title: String(source.title || titleForType(type)),
    color: normalizeColor(source.color || TYPE_COLORS[type]),
    notes: String(source.notes || ""),
  };
}

export function hasEndYear(type: unknown): boolean {
  return type === "period" || type === "line";
}

export function titleForType(type: unknown): string {
  return {
    event: "New event",
    period: "New period",
    line: "New line",
    text: "New text",
  }[String(type)] || "New item";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTimelineItemType(value: unknown): value is TimelineItemType {
  return ["event", "period", "line", "text"].includes(String(value));
}

function normalizeColor(value: unknown): string {
  const text = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text : "#2563eb";
}

function normalizeDateInput(value: unknown, fallback: unknown): string {
  const fallbackIso = isIsoDate(fallback) ? fallback : todayIso();
  if (value instanceof Date && !Number.isNaN(value.getTime())) return isoFromDate(value);
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text) && isValidIsoDate(text)) return text;
  const parsedTextDate = parseDateText(text);
  if (parsedTextDate) return parsedTextDate;
  if (/^\d{4}$/.test(text)) return `${text}-01-01`;
  return fallbackIso;
}

function parseDateText(text: string): string | null {
  const isoLike = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (isoLike) return isoFromYmd(Number(isoLike[1]), Number(isoLike[2]), Number(isoLike[3]));

  const slashDate = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (slashDate) return isoFromYmd(Number(slashDate[3]), Number(slashDate[1]), Number(slashDate[2]));

  return null;
}

function normalizeSnap(value: unknown): TimelineSnap {
  if (["year", "month", "week", "day"].includes(String(value))) return value as TimelineSnap;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "month";
  if (numeric >= 1) return "year";
  if (numeric >= 0.25) return "month";
  if (numeric >= 0.02) return "week";
  return "day";
}

function toNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function compareIso(a: unknown, b: unknown): number {
  return normalizeDateInput(a, todayIso()).localeCompare(normalizeDateInput(b, todayIso()));
}

function addDaysIso(isoDate: string, days: number): string {
  const date = dateFromIso(isoDate);
  date.setUTCDate(date.getUTCDate() + Math.round(days));
  return isoFromDate(date);
}

function yearStartIso(year: number): string {
  return `${String(Math.round(year)).padStart(4, "0")}-01-01`;
}

function yearEndIso(year: number): string {
  return `${String(Math.round(year)).padStart(4, "0")}-12-31`;
}

function isoFromYearValue(value: number): string {
  const year = Math.floor(value);
  const fraction = value - year;
  if (fraction <= 0) return yearStartIso(year);
  return addDaysIso(yearStartIso(year), Math.round(fraction * daysInYear(year)));
}

function isoFromYmd(year: number, month: number, day: number): string | null {
  const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return isValidIsoDate(iso) ? iso : null;
}

function todayIso(): string {
  const today = new Date();
  return isoFromYmd(today.getFullYear(), today.getMonth() + 1, today.getDate()) || isoFromDate(today);
}

function dateFromIso(isoDate: string): Date {
  const [year, month, day] = normalizeDateInput(isoDate, todayIso()).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function isoFromDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && isValidIsoDate(value);
}

function isValidIsoDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function isoYear(isoDate: string): number {
  return Number(normalizeDateInput(isoDate, todayIso()).slice(0, 4));
}

function daysInYear(year: number): number {
  return Math.round((dateFromIso(yearStartIso(year + 1)).getTime() - dateFromIso(yearStartIso(year)).getTime()) / DAY_MS);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function createId(prefix: string): string {
  if (window.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

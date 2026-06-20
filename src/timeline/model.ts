import {
  addDaysIso,
  clamp,
  compareIso,
  isoFromYearValue,
  isoYear,
  normalizeDateInput,
  normalizeSnap,
  todayIso,
  toNumber,
  yearEndIso,
  yearStartIso,
  type TimelineSnap,
} from "./dates";

const DEFAULT_ROW_HEIGHT = 68;

export const TYPE_COLORS: Record<TimelineItemType, string> = {
  event: "#d97706",
  period: "#2563eb",
  line: "#be123c",
  text: "#7c3aed",
};

export type TimelineItemType = "event" | "period" | "line" | "text";
export type { TimelineSnap };

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

function createId(prefix: string): string {
  if (window.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

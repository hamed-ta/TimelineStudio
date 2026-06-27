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

export const ITEM_COLOR_PALETTE = [
  { name: "Red", value: "#ef4444" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Pink", value: "#ec4899" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Green", value: "#22c55e" },
  { name: "Lime", value: "#84cc16" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
  { name: "Slate", value: "#64748b" },
  { name: "Zinc", value: "#71717a" },
  { name: "Stone", value: "#78716c" },
] as const;

export const TYPE_COLORS: Record<TimelineItemType, string> = {
  birth: "#dc2626",
  event: "#d97706",
  marker: "#0f766e",
  note: "#0891b2",
  period: "#2563eb",
  line: "#be123c",
  text: "#7c3aed",
};

export type TimelineItemType = "birth" | "event" | "marker" | "note" | "period" | "line" | "text";
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
  laneColors: string[];
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
  locked: boolean;
  showAgeLabels: boolean;
  showDurationLabel: boolean;
  textColor?: string;
  noteOffsetX?: number;
  noteOffsetY?: number;
  noteWidth?: number;
  noteHeight?: number;
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
  locked?: unknown;
  showAgeLabels?: unknown;
  showDurationLabel?: unknown;
  textColor?: unknown;
  noteOffsetX?: unknown;
  noteOffsetY?: unknown;
  noteWidth?: unknown;
  noteHeight?: unknown;
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
      laneColors: ["", "", "", "", ""],
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
  const legacyBirthDate = rawSettings.birthDate;
  const legacyBirthYear = rawSettings.birthYear;
  delete rawSettings.birthDate;
  delete rawSettings.birthYear;
  delete rawSettings.shOffset;
  settings.snap = normalizeSnap(settings.snap);
  settings.rowHeight = clamp(toNumber(settings.rowHeight, DEFAULT_ROW_HEIGHT), 48, 120);
  settings.laneLabels = Array.isArray(settings.laneLabels)
    ? settings.laneLabels.map((label) => String(label))
    : fallback.settings.laneLabels;
  settings.laneColors = Array.isArray(settings.laneColors)
    ? settings.laneColors.map(normalizeOptionalColor)
    : fallback.settings.laneColors;
  while (settings.laneColors.length < settings.laneLabels.length) {
    settings.laneColors.push("");
  }
  if (settings.laneColors.length > settings.laneLabels.length) {
    settings.laneColors.length = settings.laneLabels.length;
  }

  const rawItems = Array.isArray(source.items) ? source.items : fallback.items;
  const items = rawItems
    .map((item) => normalizeItem(item, settings.startDate))
    .filter((item): item is TimelineItem => Boolean(item));
  if (!items.some((item) => item.type === "birth") && (legacyBirthDate !== undefined || legacyBirthYear !== undefined)) {
    const legacyBirthItem = normalizeItem({
      id: "birth-legacy",
      type: "birth",
      startDate: legacyBirthDate,
      startYear: legacyBirthYear,
      title: titleForType("birth"),
      color: TYPE_COLORS.birth,
    }, settings.startDate);
    if (legacyBirthItem) items.push(legacyBirthItem);
  }

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

  const normalized: TimelineItem = {
    id: String(source.id || createId(type)),
    type,
    lane: isGlobalTimelineItemType(type) ? 0 : clamp(Math.round(toNumber(source.lane, 0)), 0, 20),
    startDate,
    endDate,
    title: String(source.title || titleForType(type)),
    color: normalizeColor(source.color || TYPE_COLORS[type]),
    notes: String(source.notes || ""),
    locked: source.locked === true,
    showAgeLabels: source.showAgeLabels !== false,
    showDurationLabel: source.showDurationLabel !== false,
  };
  if (type === "note") {
    const textColor = normalizeOptionalColor(source.textColor);
    if (textColor) normalized.textColor = textColor;
    assignOptionalNumber(normalized, "noteOffsetX", source.noteOffsetX, -2000, 2000);
    assignOptionalNumber(normalized, "noteOffsetY", source.noteOffsetY, 0, 2000);
    assignOptionalNumber(normalized, "noteWidth", source.noteWidth, 84, 420);
    assignOptionalNumber(normalized, "noteHeight", source.noteHeight, 44, 280);
  }
  return normalized;
}

export function hasEndYear(type: unknown): boolean {
  return type === "period" || type === "line";
}

export function isGlobalTimelineItemType(type: unknown): boolean {
  return type === "birth" || type === "marker";
}

export function titleForType(type: unknown): string {
  return {
    birth: "Birthdate",
    event: "New event",
    marker: "New marker",
    note: "New note",
    period: "New period",
    line: "New line",
    text: "New text",
  }[String(type)] || "New item";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTimelineItemType(value: unknown): value is TimelineItemType {
  return ["birth", "event", "marker", "note", "period", "line", "text"].includes(String(value));
}

function normalizeColor(value: unknown): string {
  const text = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text : ITEM_COLOR_PALETTE[6].value;
}

function normalizeOptionalColor(value: unknown): string {
  const text = String(value || "").trim();
  return /^#[0-9a-fA-F]{6}$/.test(text) ? text : "";
}

function assignOptionalNumber<T extends keyof TimelineItem>(
  item: TimelineItem,
  key: T,
  value: unknown,
  min: number,
  max: number,
): void {
  if (value === undefined || value === null || value === "") return;
  const number = toNumber(value, Number.NaN);
  if (Number.isFinite(number)) {
    item[key] = clamp(number, min, max) as TimelineItem[T];
  }
}

function createId(prefix: string): string {
  if (window.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

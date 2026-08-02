import {
  formatDetailedAgeAtDate,
  formatDetailedAgeValueAtDate,
  formatDetailedDateSpan,
  getDateSpanParts,
} from "../../timeline/dateSpans.ts";
import {
  todayIso,
} from "../../timeline/dates.ts";
import {
  formatDateForCalendars,
} from "../../timeline/formatters.ts";
import {
  normalizeDisplayCalendars,
  type TimelineDisplayCalendar,
} from "../../timeline/calendars.ts";
import {
  CALENDAR_REGISTRY,
} from "../../timeline/calendarRegistry.ts";
import {
  noteDisplayText,
  noteTitleFromText,
} from "./items/noteItem.ts";
import {
  laneDisplayLabel,
} from "./layout/timelineLayout.ts";

type InfoItem = {
  type: string;
  title: string;
  lane: number;
  startDate: string;
  endDate: string;
  locked?: boolean;
  notes: string;
};

export type PointerInfoText = {
  dateLabel: string;
  iranianLabel: string;
  ageLabel: string;
};

export type CursorReadoutText = {
  agoLabel: string;
  ageLabel: string;
  dateLabel: string;
};

const FIGURE_SPACE = "\u2007";

export type SelectionInfoText = {
  itemLabel: string;
  lineLine: string;
  dateLine: string;
  endLine: string;
  durationLine: string;
  ageLine: string;
};

export function pointerInfoText(
  hoverDate: string | null,
  birthDate?: string | null,
  displayCalendars: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"],
): PointerInfoText {
  const calendars = normalizeDisplayCalendars(displayCalendars);
  if (!hoverDate) {
    return {
      dateLabel: "Hover over the timeline",
      iranianLabel: calendarPlaceholder(calendars),
      ageLabel: birthDate ? "Age appears here" : "Add a birth item to calculate age",
    };
  }

  const dateLines = pointerDateLines(hoverDate, calendars);
  return {
    dateLabel: dateLines[0],
    iranianLabel: dateLines[1] || "",
    ageLabel: birthDate ? formatDetailedAgeAtDate(birthDate, hoverDate) : "Age: add a birth item",
  };
}

export function cursorReadoutText(
  hoverDate: string | null,
  birthDate?: string | null,
  displayCalendars: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"],
  currentDate = todayIso(),
): CursorReadoutText {
  if (!hoverDate) {
    return {
      agoLabel: "",
      ageLabel: "",
      dateLabel: "",
    };
  }

  return {
    agoLabel: stabilizeReadoutNumericWidth(relativeDateLabel(hoverDate, currentDate)),
    ageLabel: stabilizeReadoutNumericWidth(birthDate ? formatDetailedAgeAtDate(birthDate, hoverDate) : "Age unavailable"),
    dateLabel: formatDateForCalendars(hoverDate, normalizeDisplayCalendars(displayCalendars)),
  };
}

export function selectionInfoText(
  item: InfoItem | null,
  birthDate?: string | null,
  displayCalendars: readonly TimelineDisplayCalendar[] = ["gregorian", "iranian"],
  laneLabels: readonly string[] = [],
): SelectionInfoText {
  const calendars = normalizeDisplayCalendars(displayCalendars);
  if (!item) {
    return {
      itemLabel: "No item selected",
      lineLine: "",
      dateLine: "Select an item to inspect dates",
      endLine: "",
      durationLine: "",
      ageLine: "",
    };
  }

  return {
    itemLabel: selectedItemTitle(item),
    lineLine: selectedItemLineLine(item, laneLabels),
    dateLine: selectedItemStartLine(item, calendars),
    endLine: selectedItemEndLine(item, calendars),
    durationLine: selectedItemDurationLine(item),
    ageLine: selectedItemAgeLine(item, birthDate),
  };
}

function relativeDateLabel(date: string, currentDate: string): string {
  if (date === currentDate) return "today";
  if (date < currentDate) return `${largestDateSpanUnit(date, currentDate)} ago`;
  return `in ${largestDateSpanUnit(currentDate, date)}`;
}

function largestDateSpanUnit(startDate: string, endDate: string): string {
  const span = getDateSpanParts(startDate, endDate);
  const parts = [];
  if (span.years) {
    parts.push(`${span.years} ${span.years === 1 ? "year" : "years"}`);
  }
  if (span.months) {
    parts.push(`${span.months} ${span.months === 1 ? "month" : "months"}`);
  }
  if (span.days || parts.length === 0) {
    parts.push(`${span.days} ${span.days === 1 ? "day" : "days"}`);
  }
  return parts.join(" ");
}

function stabilizeReadoutNumericWidth(label: string): string {
  return label.replace(/\d+/g, (digits) => {
    if (digits.length >= 2) {
      return digits;
    }
    return `${FIGURE_SPACE}${digits}`;
  });
}

export function itemTypeLabel(type: unknown): string {
  return {
    birth: "Birth",
    event: "Event",
    marker: "Marker",
    note: "Note",
    period: "Period",
    line: "Line",
    text: "Text",
  }[String(type)] || "Item";
}

function selectedItemTitle(item: InfoItem): string {
  const lockedText = item.locked ? "Locked - " : "";
  const title = item.type === "note" ? noteTitleFromText(noteDisplayText(item)) : item.title;
  return `${lockedText}${itemTypeLabel(item.type)}: ${title}`;
}

function selectedItemLineLine(item: InfoItem, laneLabels: readonly string[]): string {
  if (isGlobalTimelineItemType(item.type) || item.type === "note") return "";
  return `Line: ${laneDisplayLabel(item.lane, laneLabels[item.lane])}`;
}

function selectedItemStartLine(item: InfoItem, displayCalendars: readonly TimelineDisplayCalendar[]): string {
  const start = formatDateForCalendars(item.startDate, displayCalendars);
  return hasEndDate(item.type) ? `Start: ${start}` : `Date: ${start}`;
}

function selectedItemEndLine(item: InfoItem, displayCalendars: readonly TimelineDisplayCalendar[]): string {
  if (!hasEndDate(item.type)) return "";
  const end = formatDateForCalendars(item.endDate, displayCalendars);
  return `End: ${end}`;
}

function selectedItemDurationLine(item: InfoItem): string {
  if (!hasEndDate(item.type)) return "";
  return `Duration: ${formatDetailedDateSpan(item.startDate, item.endDate)}`;
}

function selectedItemAgeLine(item: InfoItem, birthDate?: string | null): string {
  if (item.type === "birth") return "Age source";
  if (!birthDate) return "";
  if (hasEndDate(item.type)) {
    return `Age: ${formatDetailedAgeValueAtDate(birthDate, item.startDate)} to ${formatDetailedAgeValueAtDate(birthDate, item.endDate)}`;
  }
  return `Age: ${formatDetailedAgeValueAtDate(birthDate, item.startDate)}`;
}

function hasEndDate(type: unknown): boolean {
  return type === "period" || type === "line";
}

function isGlobalTimelineItemType(type: unknown): boolean {
  return type === "birth" || type === "marker";
}

function pointerDateLines(hoverDate: string, displayCalendars: readonly TimelineDisplayCalendar[]): string[] {
  return displayCalendars.map((calendar) => formatDateForCalendars(hoverDate, [calendar]));
}

function calendarPlaceholder(displayCalendars: readonly TimelineDisplayCalendar[]): string {
  const labels = displayCalendars.map((calendar) => (
    calendar === "gregorian" ? "Gregorian" : CALENDAR_REGISTRY[calendar].label
  ));
  return labels.length === 1 ? `${labels[0]} date` : `${labels[0]} and ${labels[1]} dates`;
}

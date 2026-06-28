import {
  formatDetailedAgeAtDate,
  formatDetailedAgeValueAtDate,
  formatDetailedDateSpan,
} from "../../timeline/dateSpans.ts";
import {
  formatDisplayDate,
  formatIranianDate,
} from "../../timeline/formatters.ts";
import {
  noteDisplayText,
  noteTitleFromText,
} from "./items/noteItem.ts";

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

export type SelectionInfoText = {
  itemLabel: string;
  dateLine: string;
  endLine: string;
  durationLine: string;
  ageLine: string;
};

export function pointerInfoText(hoverDate: string | null, birthDate?: string | null): PointerInfoText {
  if (!hoverDate) {
    return {
      dateLabel: "Hover over the timeline",
      iranianLabel: "Gregorian and Iranian dates",
      ageLabel: birthDate ? "Age appears here" : "Add a birth item to calculate age",
    };
  }

  return {
    dateLabel: formatDisplayDate(hoverDate),
    iranianLabel: formatIranianDate(hoverDate),
    ageLabel: birthDate ? formatDetailedAgeAtDate(birthDate, hoverDate) : "Age: add a birth item",
  };
}

export function selectionInfoText(item: InfoItem | null, birthDate?: string | null): SelectionInfoText {
  if (!item) {
    return {
      itemLabel: "No item selected",
      dateLine: "Select an item to inspect dates",
      endLine: "",
      durationLine: "",
      ageLine: "",
    };
  }

  return {
    itemLabel: selectedItemTitle(item),
    dateLine: selectedItemStartLine(item),
    endLine: selectedItemEndLine(item),
    durationLine: selectedItemDurationLine(item),
    ageLine: selectedItemAgeLine(item, birthDate),
  };
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
  const lineText = isGlobalTimelineItemType(item.type) || item.type === "note" ? "" : ` - Line ${item.lane + 1}`;
  const lockedText = item.locked ? "Locked - " : "";
  const title = item.type === "note" ? noteTitleFromText(noteDisplayText(item)) : item.title;
  return `${lockedText}${itemTypeLabel(item.type)}: ${title}${lineText}`;
}

function selectedItemStartLine(item: InfoItem): string {
  const start = `${formatDisplayDate(item.startDate)} / ${formatIranianDate(item.startDate)}`;
  return hasEndDate(item.type) ? `Start: ${start}` : `Date: ${start}`;
}

function selectedItemEndLine(item: InfoItem): string {
  if (!hasEndDate(item.type)) return "";
  const end = `${formatDisplayDate(item.endDate)} / ${formatIranianDate(item.endDate)}`;
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

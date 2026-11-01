import { t } from "../../i18n/index.ts";
import { calendarLabel, spanUnit, joinSpan, isolate, itemTypeLabel } from "../../i18n/presentation.ts";
export { itemTypeLabel } from "../../i18n/presentation.ts";
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
      dateLabel: t("hover_timeline"),
      iranianLabel: calendarPlaceholder(calendars),
      ageLabel: birthDate ? t("age_here") : t("add_birth_age"),
    };
  }

  const dateLines = pointerDateLines(hoverDate, calendars);
  return {
    dateLabel: dateLines[0],
    iranianLabel: dateLines[1] || "",
    ageLabel: birthDate ? formatDetailedAgeAtDate(birthDate, hoverDate) : t("age_add_birth"),
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
    ageLabel: stabilizeReadoutNumericWidth(birthDate ? formatDetailedAgeAtDate(birthDate, hoverDate) : t("age_unavailable")),
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
      itemLabel: t("no_item"),
      lineLine: "",
      dateLine: t("inspect_dates"),
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
  if (date === currentDate) return t("today");
  if (date < currentDate) return t("ago", { value: largestDateSpanUnit(date, currentDate) });
  return t("in_time", { value: largestDateSpanUnit(currentDate, date) });
}

function largestDateSpanUnit(startDate: string, endDate: string): string {
  const span = getDateSpanParts(startDate, endDate);
  const parts = [];
  if (span.years) {
    parts.push(spanUnit("years", span.years));
  }
  if (span.months) {
    parts.push(spanUnit("months", span.months));
  }
  if (span.days || parts.length === 0) {
    parts.push(spanUnit("days", span.days));
  }
  return joinSpan(parts, false);
}

function stabilizeReadoutNumericWidth(label: string): string {
  return label.replace(/[\p{Decimal_Number}]+/gu, (digits) => {
    if (digits.length >= 2) {
      return digits;
    }
    return `${FIGURE_SPACE}${digits}`;
  });
}


function selectedItemTitle(item: InfoItem): string {
  const title = item.type === "note" ? noteTitleFromText(noteDisplayText(item)) : item.title;
  const label = t("item_title", { type: itemTypeLabel(item.type), title: isolate(title) });
  return item.locked ? t("locked_title", { value: label }) : label;
}

function selectedItemLineLine(item: InfoItem, laneLabels: readonly string[]): string {
  if (isGlobalTimelineItemType(item.type) || item.type === "note") return "";
  return t("line_detail", { value: isolate(laneDisplayLabel(item.lane, laneLabels[item.lane])) });
}

function selectedItemStartLine(item: InfoItem, displayCalendars: readonly TimelineDisplayCalendar[]): string {
  const start = formatDateForCalendars(item.startDate, displayCalendars);
  return t(hasEndDate(item.type) ? "start_detail" : "date_detail", { value: isolate(start) });
}

function selectedItemEndLine(item: InfoItem, displayCalendars: readonly TimelineDisplayCalendar[]): string {
  if (!hasEndDate(item.type)) return "";
  const end = formatDateForCalendars(item.endDate, displayCalendars);
  return t("end_detail", { value: isolate(end) });
}

function selectedItemDurationLine(item: InfoItem): string {
  if (!hasEndDate(item.type)) return "";
  return t("duration_detail", { value: formatDetailedDateSpan(item.startDate, item.endDate) });
}

function selectedItemAgeLine(item: InfoItem, birthDate?: string | null): string {
  if (item.type === "birth") return t("age_source");
  if (!birthDate) return "";
  if (hasEndDate(item.type)) {
    return t("age_detail", { value: t("range", { start: formatDetailedAgeValueAtDate(birthDate, item.startDate), end: formatDetailedAgeValueAtDate(birthDate, item.endDate) }) });
  }
  return t("age_detail", { value: formatDetailedAgeValueAtDate(birthDate, item.startDate) });
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
    calendarLabel(calendar)
  ));
  return labels.length === 1 ? t("calendar_date", { calendar: labels[0] }) : t("calendar_dates", { first: labels[0], second: labels[1] });
}

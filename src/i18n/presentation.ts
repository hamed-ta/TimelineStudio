import { currentLanguage, currentLocale, formatNumber, t, type MessageKey } from "./index.ts";
import { createEmptyTimeline } from "../timeline/model.ts";
import type { TimelineDisplayCalendar } from "../timeline/calendars.ts";

const calendarKeys: Record<TimelineDisplayCalendar, MessageKey> = {
  gregorian: "calendar_gregorian", iranian: "calendar_iranian", "islamic-umalqura": "calendar_islamic_umalqura",
  hebrew: "calendar_hebrew", buddhist: "calendar_buddhist", japanese: "calendar_japanese", indian: "calendar_indian",
};
const itemKeys: Record<string, MessageKey> = { birth: "birth", event: "event", period: "period", marker: "marker", note: "note", line: "line", text: "text" };
const newItemKeys: Record<string, MessageKey> = { birth: "new_birth", event: "new_event", period: "new_period", marker: "new_marker", note: "new_note", line: "new_line", text: "new_text" };
export function calendarLabel(calendar: TimelineDisplayCalendar): string { return t(calendarKeys[calendar]); }
export function itemTypeLabel(type: unknown): string { return t(itemKeys[String(type)] ?? "item"); }
export function newItemTitle(type: unknown): string { return t(newItemKeys[String(type)] ?? "new_item"); }
export function lineName(number: number): string { return t("line_number", { value: formatNumber(number) }); }
export function nextLineName(labels: readonly string[]): string {
  let number = labels.length + 1;
  while (labels.includes(lineName(number))) number += 1;
  return lineName(number);
}
export function localizedEmptyTimeline() {
  const timeline = createEmptyTimeline();
  timeline.settings.title = t("new_timeline");
  timeline.settings.displayCalendars = [currentLocale().defaultCalendar];
  timeline.settings.laneLabels = [3, 4, 2, 5, 1, 6].map(lineName);
  return timeline;
}
export function spanUnit(unit: "years" | "months" | "days" | "items", count: number): string {
  return t(unit, { count, value: formatNumber(count) });
}
export function joinSpan(parts: string[], detailed = true): string {
  return parts.join(detailed ? t("span_separator") : " ");
}
// Isolates are for generated plain-text messages. Saved user strings stay untouched.
export function isolate(value: string): string {
  return currentLanguage() === "en" ? value : `\u2068${value}\u2069`;
}

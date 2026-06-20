import { normalizeTimeline, type TimelineDocument } from "./model";

export const TIMELINE_JSON_MIME = "application/json";

export interface ExportedTimelineDocument extends TimelineDocument {
  exportedAt: string;
}

export function serializeTimelineJson(
  timeline: TimelineDocument,
  exportedAt = new Date().toISOString(),
): string {
  const payload: ExportedTimelineDocument = {
    ...timeline,
    exportedAt,
  };
  return JSON.stringify(payload, null, 2);
}

export function parseTimelineJson(text: string): TimelineDocument {
  return normalizeTimeline(JSON.parse(text));
}

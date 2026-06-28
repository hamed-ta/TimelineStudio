import { useReducer } from "react";
import {
  createEmptyTimeline,
  normalizeTimeline,
  type TimelineDocument,
} from "../../timeline/model";
import {
  timelineReducer,
  type TimelineEditorState,
} from "./timelineReducer";

export function createTimelineEditorState(timeline: TimelineDocument = createEmptyTimeline()): TimelineEditorState {
  return {
    timeline: normalizeTimeline(timeline),
    selectedId: null,
    copiedItem: null,
    hasUnsavedChanges: false,
  };
}

export function useTimelineEditor(initialTimeline: TimelineDocument = createEmptyTimeline()) {
  return useReducer(timelineReducer, initialTimeline, createTimelineEditorState);
}

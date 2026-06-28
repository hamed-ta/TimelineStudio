import type {
  TimelineDocument,
  TimelineItem,
} from "../../timeline/model";
import type { TimelineEditorState } from "./timelineReducer";

export function selectItemById(timeline: TimelineDocument, itemId: string | null): TimelineItem | null {
  if (!itemId) return null;
  return timeline.items.find((item) => item.id === itemId) || null;
}

export function selectSelectedItem(state: TimelineEditorState): TimelineItem | null {
  return selectItemById(state.timeline, state.selectedId);
}

export function selectPrimaryBirthItem(timeline: TimelineDocument): TimelineItem | null {
  return timeline.items
    .filter((item) => item.type === "birth")
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] || null;
}

export function selectLaneCount(timeline: TimelineDocument): number {
  return Math.max(
    1,
    timeline.settings.laneLabels.length,
    ...timeline.items.map((item) => Math.max(0, Number(item.lane) + 1)),
  );
}

export function selectCanCreateOrPasteItems(state: TimelineEditorState): boolean {
  return !state.timeline.settings.itemsLocked;
}

export function selectIsItemReadOnly(state: TimelineEditorState, item: TimelineItem | null): boolean {
  return state.timeline.settings.itemsLocked || item?.locked === true;
}

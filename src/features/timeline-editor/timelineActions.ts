import type {
  TimelineItem,
  TimelineSettings,
} from "../../timeline/model";
import type { TimelineEditorAction } from "./timelineReducer";

export const timelineActions = {
  selectItem: (itemId: string | null): TimelineEditorAction => ({
    type: "selectItem",
    itemId,
  }),
  copyItem: (itemId: string): TimelineEditorAction => ({
    type: "copyItem",
    itemId,
  }),
  clearClipboard: (): TimelineEditorAction => ({
    type: "clearClipboard",
  }),
  updateSettings: (settings: Partial<TimelineSettings>): TimelineEditorAction => ({
    type: "updateSettings",
    settings,
  }),
  setItemsLocked: (locked: boolean): TimelineEditorAction => ({
    type: "setItemsLocked",
    locked,
  }),
  addItem: (item: TimelineItem, select = true): TimelineEditorAction => ({
    type: "addItem",
    item,
    select,
  }),
  updateItem: (itemId: string, changes: Partial<TimelineItem>): TimelineEditorAction => ({
    type: "updateItem",
    itemId,
    changes,
  }),
  deleteItem: (itemId: string): TimelineEditorAction => ({
    type: "deleteItem",
    itemId,
  }),
  duplicateItem: (item: TimelineItem, select = true): TimelineEditorAction => ({
    type: "duplicateItem",
    item,
    select,
  }),
  reorderLane: (fromIndex: number, toIndex: number): TimelineEditorAction => ({
    type: "reorderLane",
    fromIndex,
    toIndex,
  }),
  removeLane: (laneIndex: number): TimelineEditorAction => ({
    type: "removeLane",
    laneIndex,
  }),
} as const;

import type {
  TimelineDocument,
  TimelineItem,
  TimelineSettings,
} from "../../timeline/model";

export type TimelineEditorState = {
  timeline: TimelineDocument;
  selectedId: string | null;
  copiedItem: TimelineItem | null;
  hasUnsavedChanges: boolean;
};

export type TimelineEditorAction =
  | { type: "selectItem"; itemId: string | null }
  | { type: "copyItem"; itemId: string }
  | { type: "clearClipboard" }
  | { type: "updateSettings"; settings: Partial<TimelineSettings> }
  | { type: "setItemsLocked"; locked: boolean }
  | { type: "addItem"; item: TimelineItem; select?: boolean }
  | { type: "updateItem"; itemId: string; changes: Partial<TimelineItem> }
  | { type: "deleteItem"; itemId: string }
  | { type: "duplicateItem"; item: TimelineItem; select?: boolean }
  | { type: "reorderLane"; fromIndex: number; toIndex: number }
  | { type: "removeLane"; laneIndex: number };

export function timelineReducer(
  state: TimelineEditorState,
  action: TimelineEditorAction,
): TimelineEditorState {
  switch (action.type) {
    case "selectItem":
      return { ...state, selectedId: action.itemId };
    case "copyItem":
      return copyItem(state, action.itemId);
    case "clearClipboard":
      return { ...state, copiedItem: null };
    case "updateSettings":
      return markDirty(state, {
        ...state.timeline,
        settings: {
          ...state.timeline.settings,
          ...action.settings,
        },
      });
    case "setItemsLocked":
      return markDirty(state, {
        ...state.timeline,
        settings: {
          ...state.timeline.settings,
          itemsLocked: action.locked,
        },
      });
    case "addItem":
      return markDirty(
        state,
        {
          ...state.timeline,
          items: [...state.timeline.items, action.item],
        },
        action.select === false ? state.selectedId : action.item.id,
      );
    case "updateItem":
      return updateItem(state, action.itemId, action.changes);
    case "deleteItem":
      return deleteItem(state, action.itemId);
    case "duplicateItem":
      return markDirty(
        state,
        {
          ...state.timeline,
          items: [...state.timeline.items, action.item],
        },
        action.select === false ? state.selectedId : action.item.id,
      );
    case "reorderLane":
      return reorderLane(state, action.fromIndex, action.toIndex);
    case "removeLane":
      return removeLane(state, action.laneIndex);
    default:
      return state;
  }
}

function copyItem(state: TimelineEditorState, itemId: string): TimelineEditorState {
  const item = state.timeline.items.find((candidate) => candidate.id === itemId);
  if (!item) return state;
  return {
    ...state,
    copiedItem: { ...item },
  };
}

function updateItem(
  state: TimelineEditorState,
  itemId: string,
  changes: Partial<TimelineItem>,
): TimelineEditorState {
  let changed = false;
  const items = state.timeline.items.map((item) => {
    if (item.id !== itemId) return item;
    changed = true;
    return { ...item, ...changes };
  });
  if (!changed) return state;
  return markDirty(state, {
    ...state.timeline,
    items,
  });
}

function deleteItem(state: TimelineEditorState, itemId: string): TimelineEditorState {
  const items = state.timeline.items.filter((item) => item.id !== itemId);
  if (items.length === state.timeline.items.length) return state;
  return markDirty(
    state,
    {
      ...state.timeline,
      items,
    },
    state.selectedId === itemId ? null : state.selectedId,
  );
}

function reorderLane(
  state: TimelineEditorState,
  fromIndex: number,
  toIndex: number,
): TimelineEditorState {
  const laneCount = state.timeline.settings.laneLabels.length;
  if (!isValidLaneIndex(fromIndex, laneCount) || !isValidLaneIndex(toIndex, laneCount) || fromIndex === toIndex) {
    return state;
  }

  const settings = state.timeline.settings;
  const laneLabels = moveArrayItem(settings.laneLabels, fromIndex, toIndex);
  const laneColors = moveArrayItem(settings.laneColors, fromIndex, toIndex);
  const items = state.timeline.items.map((item) => ({
    ...item,
    lane: remapLaneAfterMove(item.lane, fromIndex, toIndex),
  }));

  return markDirty(state, {
    ...state.timeline,
    settings: {
      ...settings,
      laneLabels,
      laneColors,
    },
    items,
  });
}

function removeLane(state: TimelineEditorState, laneIndex: number): TimelineEditorState {
  const laneCount = state.timeline.settings.laneLabels.length;
  if (!isValidLaneIndex(laneIndex, laneCount) || laneCount <= 1) return state;

  const removedSelectedItem = state.timeline.items.some((item) => (
    item.id === state.selectedId && item.lane === laneIndex
  ));
  const items = state.timeline.items
    .filter((item) => item.lane !== laneIndex)
    .map((item) => ({
      ...item,
      lane: item.lane > laneIndex ? item.lane - 1 : item.lane,
    }));

  return markDirty(
    state,
    {
      ...state.timeline,
      settings: {
        ...state.timeline.settings,
        laneLabels: state.timeline.settings.laneLabels.filter((_, index) => index !== laneIndex),
        laneColors: state.timeline.settings.laneColors.filter((_, index) => index !== laneIndex),
      },
      items,
    },
    removedSelectedItem ? null : state.selectedId,
  );
}

function markDirty(
  state: TimelineEditorState,
  timeline: TimelineDocument,
  selectedId = state.selectedId,
): TimelineEditorState {
  return {
    ...state,
    timeline,
    selectedId,
    hasUnsavedChanges: true,
  };
}

function moveArrayItem<T>(values: T[], fromIndex: number, toIndex: number): T[] {
  const next = values.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

function remapLaneAfterMove(lane: number, fromIndex: number, toIndex: number): number {
  if (lane === fromIndex) return toIndex;
  if (fromIndex < toIndex && lane > fromIndex && lane <= toIndex) return lane - 1;
  if (fromIndex > toIndex && lane >= toIndex && lane < fromIndex) return lane + 1;
  return lane;
}

function isValidLaneIndex(index: number, laneCount: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < laneCount;
}

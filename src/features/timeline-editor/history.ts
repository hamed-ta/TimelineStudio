export const TIMELINE_HISTORY_LIMIT = 25;

export type TimelineHistoryEntry = {
  snapshot: string;
  selectedId: string | null;
};

export type TimelineHistoryState = {
  undoStack: TimelineHistoryEntry[];
  redoStack: TimelineHistoryEntry[];
  savedSnapshot: string;
};

export function createTimelineHistoryEntry(snapshot: string, selectedId: string | null): TimelineHistoryEntry {
  return {
    snapshot,
    selectedId,
  };
}

export function createTimelineHistory(savedSnapshot: string): TimelineHistoryState {
  return {
    undoStack: [],
    redoStack: [],
    savedSnapshot,
  };
}

export function resetTimelineHistory(savedSnapshot: string): TimelineHistoryState {
  return createTimelineHistory(savedSnapshot);
}

export function markTimelineSaved(
  history: TimelineHistoryState,
  savedSnapshot: string,
): TimelineHistoryState {
  return {
    ...history,
    savedSnapshot,
  };
}

export function hasUnsavedTimelineChanges(
  history: TimelineHistoryState,
  currentSnapshot: string,
): boolean {
  return currentSnapshot !== history.savedSnapshot;
}

export function recordTimelineChange(
  history: TimelineHistoryState,
  previousEntry: TimelineHistoryEntry,
  limit = TIMELINE_HISTORY_LIMIT,
): TimelineHistoryState {
  return {
    ...history,
    undoStack: pushHistoryEntry(history.undoStack, previousEntry, limit),
    redoStack: [],
  };
}

export function undoTimelineChange(
  history: TimelineHistoryState,
  currentEntry: TimelineHistoryEntry,
  limit = TIMELINE_HISTORY_LIMIT,
): { history: TimelineHistoryState; entry: TimelineHistoryEntry | null } {
  const entry = history.undoStack.at(-1) || null;
  if (!entry) return { history, entry: null };

  return {
    entry,
    history: {
      ...history,
      undoStack: history.undoStack.slice(0, -1),
      redoStack: pushHistoryEntry(history.redoStack, currentEntry, limit),
    },
  };
}

export function redoTimelineChange(
  history: TimelineHistoryState,
  currentEntry: TimelineHistoryEntry,
  limit = TIMELINE_HISTORY_LIMIT,
): { history: TimelineHistoryState; entry: TimelineHistoryEntry | null } {
  const entry = history.redoStack.at(-1) || null;
  if (!entry) return { history, entry: null };

  return {
    entry,
    history: {
      ...history,
      undoStack: pushHistoryEntry(history.undoStack, currentEntry, limit),
      redoStack: history.redoStack.slice(0, -1),
    },
  };
}

function pushHistoryEntry(
  stack: TimelineHistoryEntry[],
  entry: TimelineHistoryEntry,
  limit: number,
): TimelineHistoryEntry[] {
  const next = [...stack, entry];
  if (next.length <= limit) return next;
  return next.slice(next.length - limit);
}

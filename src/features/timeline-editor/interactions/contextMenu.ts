export type ContextMenuAction =
  | "add-menu"
  | "undo"
  | "redo"
  | "copy"
  | "paste"
  | "duplicate"
  | "delete"
  | "lock-item"
  | "unlock-item";

export type ContextMenuActionState = {
  disabled: boolean;
  hidden?: boolean;
};

export type TimelineContextMenuState = {
  addItemsDisabled: boolean;
  actions: Record<ContextMenuAction, ContextMenuActionState>;
};

export type TimelineContextMenuStateInput = {
  hasSelection: boolean;
  allItemsLocked: boolean;
  selectedItemLocked: boolean;
  hasCopiedItem: boolean;
  canUndo: boolean;
  canRedo: boolean;
};

export function deriveTimelineContextMenuState({
  hasSelection,
  allItemsLocked,
  selectedItemLocked,
  hasCopiedItem,
  canUndo,
  canRedo,
}: TimelineContextMenuStateInput): TimelineContextMenuState {
  const canAdd = !allItemsLocked;
  const canModifySelection = hasSelection && !allItemsLocked && !selectedItemLocked;

  return {
    addItemsDisabled: !canAdd,
    actions: {
      "add-menu": { disabled: !canAdd },
      undo: { disabled: !canUndo },
      redo: { disabled: !canRedo },
      copy: { disabled: !hasSelection },
      paste: { disabled: !hasCopiedItem || allItemsLocked },
      duplicate: { disabled: !canModifySelection },
      delete: { disabled: !canModifySelection },
      "lock-item": {
        disabled: !hasSelection,
        hidden: selectedItemLocked,
      },
      "unlock-item": {
        disabled: !hasSelection,
        hidden: !selectedItemLocked,
      },
    },
  };
}

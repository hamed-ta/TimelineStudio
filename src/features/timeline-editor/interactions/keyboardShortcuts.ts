export const EDITABLE_SHORTCUT_TARGET_SELECTOR = "input, textarea, select, [contenteditable='true']";

type ClosestTarget = {
  closest?: (selector: string) => unknown;
};

type ShortcutEvent = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

export function isEditableShortcutTarget(target: EventTarget | ClosestTarget | null): boolean {
  const maybeElement = target as ClosestTarget | null;
  if (typeof maybeElement?.closest !== "function") return false;
  return Boolean(maybeElement.closest(EDITABLE_SHORTCUT_TARGET_SELECTOR));
}

export function hasShortcutModifier(event: ShortcutEvent): boolean {
  return Boolean((event.ctrlKey || event.metaKey) && !event.altKey);
}

export function isUndoShortcut(event: ShortcutEvent): boolean {
  return hasShortcutModifier(event) && !event.shiftKey && event.key.toLowerCase() === "z";
}

export function isRedoShortcut(event: ShortcutEvent): boolean {
  return hasShortcutModifier(event) && !event.shiftKey && event.key.toLowerCase() === "y";
}

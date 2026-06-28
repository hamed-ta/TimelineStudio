export const EDITABLE_SHORTCUT_TARGET_SELECTOR = "input, textarea, select, [contenteditable='true']";

type ClosestTarget = {
  closest?: (selector: string) => unknown;
};

export function isEditableShortcutTarget(target: EventTarget | ClosestTarget | null): boolean {
  const maybeElement = target as ClosestTarget | null;
  if (typeof maybeElement?.closest !== "function") return false;
  return Boolean(maybeElement.closest(EDITABLE_SHORTCUT_TARGET_SELECTOR));
}

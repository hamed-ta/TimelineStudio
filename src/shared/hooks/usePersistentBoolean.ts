import { useEffect, useState } from "react";

export function usePersistentBoolean(key: string, defaultValue = false) {
  const [value, setValue] = useState(() => readStoredBoolean(key, defaultValue));

  useEffect(() => {
    storeBoolean(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}

function readStoredBoolean(key: string, defaultValue: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? defaultValue : value === "true";
  } catch {
    return defaultValue;
  }
}

function storeBoolean(key: string, value: boolean) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Layout preference is cosmetic; ignore unavailable browser storage.
  }
}

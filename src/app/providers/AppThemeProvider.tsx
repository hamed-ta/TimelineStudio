import { ConfigProvider, theme as antTheme } from "antd";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type ThemeMode = "system" | "light" | "dark";
type ResolvedThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "timeline-studio-theme";
const THEME_ORDER: ThemeMode[] = ["system", "light", "dark"];
const THEME_LABELS: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const APP_FONT_STACK =
  '"Vazirmatn", "Noto Sans Arabic", "Noto Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, Arial, sans-serif';

type AppThemeContextValue = {
  themeMode: ThemeMode;
  nextMode: ThemeMode;
  themeLabel: string;
  nextThemeLabel: string;
  cycleTheme: () => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredTheme);
  const systemTheme = useSystemTheme();
  const resolvedTheme: ResolvedThemeMode = themeMode === "system" ? systemTheme : themeMode;
  const nextMode = nextThemeMode(themeMode);
  const antConfigTheme = useMemo(
    () => ({
      algorithm: resolvedTheme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: "#1677ff",
        borderRadius: 8,
        fontFamily: APP_FONT_STACK,
      },
      components: {
        Button: {
          controlHeight: 34,
          borderRadius: 8,
        },
        Card: {
          borderRadiusLG: 8,
        },
      },
    }),
    [resolvedTheme],
  );

  useEffect(() => {
    applyTheme(themeMode, resolvedTheme);
    storeTheme(themeMode);
  }, [themeMode, resolvedTheme]);

  const value = useMemo<AppThemeContextValue>(
    () => ({
      themeMode,
      nextMode,
      themeLabel: THEME_LABELS[themeMode],
      nextThemeLabel: THEME_LABELS[nextMode],
      cycleTheme: () => setThemeMode(nextMode),
    }),
    [nextMode, themeMode],
  );

  return (
    <ConfigProvider theme={antConfigTheme}>
      <AppThemeContext value={value}>{children}</AppThemeContext>
    </ConfigProvider>
  );
}

export function useAppTheme(): AppThemeContextValue {
  const value = useContext(AppThemeContext);
  if (!value) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return value;
}

function readStoredTheme(): ThemeMode {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function readSystemDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function applyTheme(mode: ThemeMode, resolvedMode: ResolvedThemeMode) {
  document.documentElement.dataset.theme = mode;
  document.documentElement.dataset.resolvedTheme = resolvedMode;
}

function storeTheme(mode: ThemeMode) {
  try {
    if (mode === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  } catch {
    // Theme preference is cosmetic; ignore unavailable browser storage.
  }
}

function nextThemeMode(mode: ThemeMode): ThemeMode {
  return THEME_ORDER[(THEME_ORDER.indexOf(mode) + 1) % THEME_ORDER.length];
}

function useSystemTheme(): ResolvedThemeMode {
  const [systemDark, setSystemDark] = useState(readSystemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemDark(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return systemDark ? "dark" : "light";
}

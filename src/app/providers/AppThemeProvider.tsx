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
  '"Inter Variable", "Vazirmatn Variable", "Noto Sans Arabic", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, sans-serif';

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
        colorPrimary: "#663af3",
        colorInfo: "#663af3",
        colorBgBase: resolvedTheme === "dark" ? "#05060f" : "#eef2f8",
        colorBgContainer: resolvedTheme === "dark" ? "#101522" : "#f8faff",
        colorBgElevated: resolvedTheme === "dark" ? "#0b0e19" : "#ffffff",
        colorText: resolvedTheme === "dark" ? "#d1e4fa" : "#17243b",
        colorTextSecondary: resolvedTheme === "dark" ? "#c7d3ea" : "#465775",
        colorTextTertiary: resolvedTheme === "dark" ? "#9da7ba" : "#576780",
        colorTextPlaceholder: resolvedTheme === "dark" ? "#9da7ba" : "#576780",
        colorTextDisabled: resolvedTheme === "dark" ? "#8190a8" : "#697892",
        colorBorder: resolvedTheme === "dark" ? "#66748b" : "#8292ac",
        colorBorderSecondary: resolvedTheme === "dark" ? "rgba(186,215,247,0.12)" : "rgba(47,65,94,0.18)",
        colorError: resolvedTheme === "dark" ? "#f49b9b" : "#b93835",
        borderRadius: 6,
        borderRadiusLG: 16,
        fontSize: 14,
        fontFamily: APP_FONT_STACK,
      },
      components: {
        Button: {
          controlHeight: 34,
          borderRadius: 999,
          defaultBg: resolvedTheme === "dark" ? "rgba(186,214,247,0.06)" : "rgba(255,255,255,0.6)",
          defaultColor: resolvedTheme === "dark" ? "#d1e4fa" : "#17243b",
          defaultBorderColor: resolvedTheme === "dark" ? "rgba(186,215,247,0.12)" : "rgba(47,65,94,0.18)",
          defaultHoverColor: resolvedTheme === "dark" ? "#d8ecf8" : "#17243b",
          defaultHoverBg: resolvedTheme === "dark" ? "rgba(186,214,247,0.12)" : "#e4eaf3",
          defaultHoverBorderColor: resolvedTheme === "dark" ? "rgba(186,215,247,0.24)" : "rgba(47,65,94,0.42)",
          fontWeight: 500,
        },
        Card: {
          borderRadiusLG: 16,
          colorBgContainer: resolvedTheme === "dark" ? "rgba(186,214,247,0.03)" : "rgba(255,255,255,0.78)",
          headerFontSize: 16,
          headerHeight: 48,
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

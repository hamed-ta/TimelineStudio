import { createInstance, type TOptions } from "i18next";
import en from "./locales/en.json" with { type: "json" };
import es from "./locales/es.json" with { type: "json" };
import fr from "./locales/fr.json" with { type: "json" };
import fa from "./locales/fa.json" with { type: "json" };
import ar from "./locales/ar.json" with { type: "json" };

export const LANGUAGE_STORAGE_KEY = "timeline-studio-language";
export const localeConfig = {
  en: { name: "English", direction: "ltr", locale: "en-US", numberingSystem: "latn", defaultCalendar: "gregorian" },
  es: { name: "Español", direction: "ltr", locale: "es-ES", numberingSystem: "latn", defaultCalendar: "gregorian" },
  fr: { name: "Français", direction: "ltr", locale: "fr-FR", numberingSystem: "latn", defaultCalendar: "gregorian" },
  fa: { name: "فارسی", direction: "rtl", locale: "fa-IR", numberingSystem: "arabext", defaultCalendar: "iranian" },
  ar: { name: "العربية", direction: "rtl", locale: "ar-EG", numberingSystem: "arab", defaultCalendar: "islamic-umalqura" },
} as const;
export type Language = keyof typeof localeConfig;
export type MessageKey = keyof typeof en | "years" | "months" | "days" | "items";
export const resources = { en: { translation: en }, es: { translation: es }, fr: { translation: fr }, fa: { translation: fa }, ar: { translation: ar } };

function supportedLanguage(value: unknown): Language | undefined {
  if (typeof value !== "string") return undefined;
  const language = value.toLowerCase().split(/[-_]/)[0];
  return Object.hasOwn(localeConfig, language) ? language as Language : undefined;
}

export function resolveLanguage(saved: unknown, browserLanguages: readonly string[] = []): Language {
  return supportedLanguage(saved) ?? browserLanguages.map(supportedLanguage).find(Boolean) ?? "en";
}

// Bundled resources initialize synchronously. Browser preference is applied by bootstrap,
// keeping Node tests and model normalization independent of the host's language.
export const i18n = createInstance();
export const ready = i18n.init({
  resources,
  lng: "en",
  fallbackLng: "en",
  supportedLngs: Object.keys(localeConfig),
  initAsync: false,
  keySeparator: false,
  interpolation: { escapeValue: false }, // All consumers use React text or DOM textContent.
});

export function t(key: MessageKey, options?: TOptions): string {
  return String(i18n.t(key, options));
}

export function currentLanguage(): Language {
  return supportedLanguage(i18n.resolvedLanguage) ?? "en";
}

export function currentLocale() {
  return localeConfig[currentLanguage()];
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  const { locale, numberingSystem } = currentLocale();
  return new Intl.NumberFormat(locale, { numberingSystem, useGrouping: false, ...options }).format(value);
}

export async function setLanguage(language: string, persist = true): Promise<void> {
  const resolved = resolveLanguage(language);
  await i18n.changeLanguage(resolved);
  if (typeof document !== "undefined") {
    document.documentElement.lang = resolved;
    document.documentElement.dir = localeConfig[resolved].direction;
    try { if (persist) window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolved); } catch { /* Preference storage is optional. */ }
  }
}

export async function initializeBrowserLanguage(): Promise<void> {
  let saved: string | null = null;
  try { saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY); } catch { /* Private/blocked storage. */ }
  await ready;
  await setLanguage(resolveLanguage(saved, navigator.languages), false);
}

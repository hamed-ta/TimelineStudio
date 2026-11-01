import { useLayoutEffect, type ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { currentLanguage, i18n, localeConfig, setLanguage, t } from "../../i18n";

export function AppLocaleProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18n}><LocaleEffects />{children}</I18nextProvider>;
}

function LocaleEffects() {
  const { language } = useAppLocale();
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = localeConfig[language].direction;
    // Refresh imperative text after React's commit, without syncing form values.
    document.dispatchEvent(new Event("timeline-language-changed"));
  }, [language]);
  return null;
}

export function useAppLocale() {
  useTranslation();
  const language = currentLanguage();
  return { language, ...localeConfig[language], setLanguage, t };
}

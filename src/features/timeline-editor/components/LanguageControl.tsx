import { GlobalOutlined } from "@ant-design/icons";
import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
import { localeConfig } from "../../../i18n";

export function LanguageControl() {
  const { language, setLanguage, t } = useAppLocale();
  return (
    <label className="language-control">
      <GlobalOutlined aria-hidden="true" />
      <select aria-label={t("language")} value={language} onChange={(event) => void setLanguage(event.target.value)}>
        {Object.entries(localeConfig).map(([id, locale]) => (
          <option key={id} value={id} lang={id} dir={locale.direction}>{locale.name}</option>
        ))}
      </select>
    </label>
  );
}

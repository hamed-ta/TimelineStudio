import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
import { Typography } from "antd";
import { BrandMark } from "../../../shared/brand/BrandMark";

export function TimelineHeader() {
  const { t } = useAppLocale();
  return (
    <header className="topbar">
      <div className="brand">
        <BrandMark className="brand-mark" />
        <div>
          <Typography.Title level={1}>Timeline Studio</Typography.Title>
          <Typography.Text id="statusText" aria-live="polite" type="secondary">
            {t("ready")}
          </Typography.Text>
        </div>
      </div>

      <div className="timeline-context">
        <Typography.Title level={2} id="stageTitle">
          {t("new_timeline")}
        </Typography.Title>
        <span className="separator" aria-hidden="true"></span>
        <Typography.Text id="stageMeta" type="secondary">
          {t("create_load")}
        </Typography.Text>
        <span className="separator" aria-hidden="true"></span>
        <p className="file-state" id="fileState" aria-live="polite">
          <span id="fileNameLabel">{t("no_file")}</span>
          <span className="dirty-indicator" id="dirtyIndicator" hidden>
            {t("unsaved")}
          </span>
        </p>
      </div>
    </header>
  );
}

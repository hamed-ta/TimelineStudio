import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
import { InfoCircleOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { Button } from "antd";

export function TimelineInfoPanel({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  const { t } = useAppLocale();
  return (
    <div className="timeline-info-panel" id="timelineInfoPanel" data-collapsed={collapsed ? "true" : "false"} aria-live="polite">
      <div className="timeline-info-header">
        <span className="timeline-info-title">
          <InfoCircleOutlined aria-hidden="true" />
          {t("info")}
        </span>
        <Button
          htmlType="button"
          className="icon-button timeline-info-toggle"
          aria-expanded={!collapsed}
          aria-controls="timelineInfoContent"
          aria-label={collapsed ? t("expand_info") : t("collapse_info")}
          title={collapsed ? t("expand_info") : t("collapse_info")}
          onClick={onToggleCollapsed}
          icon={collapsed ? <VerticalAlignTopOutlined /> : <VerticalAlignBottomOutlined />}
        />
      </div>
      <div className="timeline-info-content" id="timelineInfoContent">
        <div className="timeline-info-block">
          <span className="timeline-info-kicker">{t("selection")}</span>
          <strong id="selectedItemLabel">{t("no_item")}</strong>
          <span id="selectedItemLineLabel" hidden></span>
          <span id="selectedItemDateLabel">{t("inspect_dates")}</span>
          <span id="selectedItemEndLabel" hidden></span>
          <span id="selectedItemDurationLabel" hidden></span>
          <span id="selectedItemAgeLabel" hidden></span>
        </div>
      </div>
    </div>
  );
}

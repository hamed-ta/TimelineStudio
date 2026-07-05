import { InfoCircleOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { Button } from "antd";

export function TimelineInfoPanel({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <div className="timeline-info-panel" id="timelineInfoPanel" data-collapsed={collapsed ? "true" : "false"} aria-live="polite">
      <div className="timeline-info-header">
        <span className="timeline-info-title">
          <InfoCircleOutlined aria-hidden="true" />
          Info
        </span>
        <Button
          htmlType="button"
          className="icon-button timeline-info-toggle"
          aria-expanded={!collapsed}
          aria-controls="timelineInfoContent"
          aria-label={collapsed ? "Expand timeline information" : "Collapse timeline information"}
          title={collapsed ? "Expand timeline information" : "Collapse timeline information"}
          onClick={onToggleCollapsed}
          icon={collapsed ? <VerticalAlignTopOutlined /> : <VerticalAlignBottomOutlined />}
        />
      </div>
      <div className="timeline-info-content" id="timelineInfoContent">
        <div className="timeline-info-block">
          <span className="timeline-info-kicker">Selection</span>
          <strong id="selectedItemLabel">No item selected</strong>
          <span id="selectedItemLineLabel" hidden></span>
          <span id="selectedItemDateLabel">Select an item to inspect dates</span>
          <span id="selectedItemEndLabel" hidden></span>
          <span id="selectedItemDurationLabel" hidden></span>
          <span id="selectedItemAgeLabel" hidden></span>
        </div>
      </div>
    </div>
  );
}

import {
  AimOutlined,
  CalendarOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  FontSizeOutlined,
  FormOutlined,
  LockOutlined,
  MinusOutlined,
  SaveOutlined,
  SmileOutlined,
  UnlockOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import { ToolbarButton } from "./ToolbarButton";

export function TimelineToolbar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <div className="tool-dock" data-collapsed={collapsed ? "true" : "false"}>
      <div className="tool-dock-header">
        <strong>Actions</strong>
        <Space size={6} className="tool-dock-actions">
          <Button
            htmlType="button"
            className="icon-button lock-toggle-button"
            id="itemsLockedButton"
            aria-pressed="false"
            aria-label="Read only"
            title="Read only"
          >
            <span className="toggle-icon-stack" aria-hidden="true">
              <UnlockOutlined className="toggle-icon-state" data-lock-state="unlocked" data-active="true" />
              <LockOutlined className="toggle-icon-state" data-lock-state="locked" data-active="false" />
            </span>
          </Button>
          <Button
            htmlType="button"
            className="icon-button panel-toggle-button"
            data-collapsed={collapsed ? "true" : "false"}
            aria-expanded={!collapsed}
            aria-controls="timelineActionToolbar"
            aria-label={collapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
            title={collapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
            onClick={onToggleCollapsed}
          >
            <span className="toggle-icon-stack" aria-hidden="true">
              <VerticalAlignTopOutlined className="toggle-icon-state" data-active={!collapsed} />
              <VerticalAlignBottomOutlined className="toggle-icon-state is-open" data-active={collapsed} />
            </span>
          </Button>
        </Space>
      </div>

      <div id="timelineActionToolbar" className="toolbar" role="toolbar" aria-label="Timeline actions">
        <input id="itemsLockedInput" type="checkbox" hidden />
        <div className="toolbar-group" aria-label="Create items">
          <span className="toolbar-group-title">Create</span>
          <div className="toolbar-group-actions">
            <ToolbarButton tone="event" addType="event" title="Add event" icon={<AimOutlined />}>Event</ToolbarButton>
            <ToolbarButton tone="period" addType="period" title="Add period" icon={<CalendarOutlined />}>Period</ToolbarButton>
            <ToolbarButton tone="note" addType="note" title="Add note" icon={<FormOutlined />}>Note</ToolbarButton>
            <ToolbarButton tone="marker" addType="marker" title="Add marker" icon={<FlagOutlined />}>Marker</ToolbarButton>
            <ToolbarButton tone="birth" addType="birth" title="Add birthdate" icon={<SmileOutlined />}>Birth</ToolbarButton>
            <ToolbarButton tone="line" addType="line" title="Add line item" icon={<MinusOutlined />}>Line</ToolbarButton>
            <ToolbarButton tone="text" addType="text" title="Add text" icon={<FontSizeOutlined />}>Text</ToolbarButton>
          </div>
        </div>
        <div className="toolbar-group" aria-label="File actions">
          <span className="toolbar-group-title">File</span>
          <div className="toolbar-group-actions">
            <ToolbarButton tone="save" id="saveJsonButton" title="Save JSON" icon={<SaveOutlined />}>Save</ToolbarButton>
            <ToolbarButton tone="load" id="loadJsonButton" title="Load JSON" icon={<FolderOpenOutlined />}>Load</ToolbarButton>
          </div>
        </div>
        <div className="toolbar-group" aria-label="Export actions">
          <span className="toolbar-group-title">Export</span>
          <div className="toolbar-group-actions">
            <ToolbarButton tone="svg" id="exportSvgButton" title="Export SVG" icon={<FileOutlined />}>SVG</ToolbarButton>
            <ToolbarButton tone="png" id="exportPngButton" title="Export PNG" icon={<FileImageOutlined />}>PNG</ToolbarButton>
            <ToolbarButton tone="pdf" id="exportPdfButton" title="Export PDF" icon={<FilePdfOutlined />}>PDF</ToolbarButton>
          </div>
        </div>
      </div>
    </div>
  );
}

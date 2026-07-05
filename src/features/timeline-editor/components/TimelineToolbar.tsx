import {
  AimOutlined,
  CalendarOutlined,
  ColumnHeightOutlined,
  DesktopOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  FontSizeOutlined,
  FormOutlined,
  FullscreenOutlined,
  LockOutlined,
  MoonOutlined,
  MinusOutlined,
  RedoOutlined,
  SaveOutlined,
  SmileOutlined,
  SunOutlined,
  UndoOutlined,
  UnlockOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { useAppTheme, type ThemeMode } from "../../../app/providers/AppThemeProvider";
import { ToolbarButton } from "./ToolbarButton";

export function TimelineToolbar() {
  return (
    <div className="tool-dock">
      <div id="timelineActionToolbar" className="toolbar" role="toolbar" aria-label="Timeline actions">
        <input id="itemsLockedInput" type="checkbox" hidden />
        <div className="toolbar-action-groups">
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
        <div className="toolbar-group toolbar-view-group" aria-label="View actions">
          <span className="toolbar-group-title">View</span>
          <div className="toolbar-group-actions view-actions">
            <Button
              htmlType="button"
              className="icon-button"
              id="undoButton"
              aria-label="Undo"
              title="Undo"
              icon={<UndoOutlined />}
              disabled
            />
            <Button
              htmlType="button"
              className="icon-button"
              id="redoButton"
              aria-label="Redo"
              title="Redo"
              icon={<RedoOutlined />}
              disabled
            />
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
            <Button htmlType="button" className="secondary-button fit-button" id="fitButton" icon={<FullscreenOutlined />}>
              Fit
            </Button>
            <div className="range-control">
              <Button
                htmlType="button"
                className="range-control-button"
                id="zoomControlButton"
                aria-expanded="false"
                aria-controls="zoomControlPanel"
                title="Adjust zoom"
                icon={<ZoomInOutlined />}
              >
                <span>Zoom</span>
                <span className="range-control-value" id="zoomLabel">18 px/month</span>
              </Button>
              <div className="range-popover-panel" id="zoomControlPanel" hidden>
                <div className="range-popover-title">Zoom</div>
                <div className="range-popover-row">
                  <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomOutButton" aria-label="Zoom out" title="Zoom out" icon={<ZoomOutOutlined />} />
                  <label className="range-only-label" htmlFor="zoomRange">Timeline zoom</label>
                  <input id="zoomRange" className="ant-range-bridge" type="range" min="6" max="360" step="0.5" defaultValue="18" />
                  <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomInButton" aria-label="Zoom in" title="Zoom in" icon={<ZoomInOutlined />} />
                </div>
              </div>
            </div>
            <div className="range-control">
              <Button
                htmlType="button"
                className="range-control-button"
                id="timelineHeightControlButton"
                aria-expanded="false"
                aria-controls="timelineHeightControlPanel"
                title="Adjust timeline height"
                icon={<ColumnHeightOutlined />}
              >
                <span>Height</span>
                <span className="range-control-value" id="timelineHeightLabel">Auto</span>
              </Button>
              <div className="range-popover-panel" id="timelineHeightControlPanel" hidden>
                <div className="range-popover-title">Timeline height</div>
                <div className="range-popover-row">
                  <label className="range-only-label" htmlFor="timelineHeightRange">Timeline height</label>
                  <input id="timelineHeightRange" className="ant-range-bridge timeline-height-range" type="range" min="0" max="900" step="24" defaultValue="0" />
                </div>
              </div>
            </div>
            <ThemeToolbarControl />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeToolbarControl() {
  const { themeMode, themeLabel, nextThemeLabel, cycleTheme } = useAppTheme();

  return (
    <button
      type="button"
      className="theme-toggle-button"
      data-theme-mode={themeMode}
      aria-label={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}.`}
      title={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}.`}
      onClick={cycleTheme}
    >
      {themeIcon(themeMode)}
      <span>{themeLabel}</span>
    </button>
  );
}

function themeIcon(mode: ThemeMode) {
  if (mode === "light") return <SunOutlined />;
  if (mode === "dark") return <MoonOutlined />;
  return <DesktopOutlined />;
}

import {
  ColumnHeightOutlined,
  DesktopOutlined,
  FullscreenOutlined,
  MoonOutlined,
  SunOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Typography } from "antd";
import { useAppTheme, type ThemeMode } from "../../../app/providers/AppThemeProvider";

export function TimelineHeader() {
  const { themeMode, themeLabel, nextThemeLabel, cycleTheme } = useAppTheme();

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true"></span>
        <div>
          <Typography.Title level={1}>Timeline Studio</Typography.Title>
          <Typography.Text id="statusText" aria-live="polite" type="secondary">
            Ready
          </Typography.Text>
        </div>
      </div>

      <div className="timeline-context">
        <div>
          <Typography.Title level={2} id="stageTitle">
            New Timeline
          </Typography.Title>
          <Typography.Text id="stageMeta" type="secondary">
            Create or load a timeline
          </Typography.Text>
          <p className="file-state" id="fileState" aria-live="polite">
            <span id="fileNameLabel">No file selected</span>
            <span className="dirty-indicator" id="dirtyIndicator" hidden>
              Unsaved changes
            </span>
          </p>
        </div>
        <Button htmlType="button" className="secondary-button fit-button" id="fitButton" icon={<FullscreenOutlined />}>
          Fit
        </Button>
      </div>

      <div className="zoom-tools">
        <Button
          htmlType="button"
          className="theme-toggle-button"
          data-theme-mode={themeMode}
          aria-label={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}.`}
          title={`Theme: ${themeLabel}. Switch to ${nextThemeLabel}.`}
          onClick={cycleTheme}
          icon={themeIcon(themeMode)}
        >
          {themeLabel}
        </Button>
        <span className="separator" aria-hidden="true"></span>
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
      </div>
    </header>
  );
}

function themeIcon(mode: ThemeMode) {
  if (mode === "light") return <SunOutlined />;
  if (mode === "dark") return <MoonOutlined />;
  return <DesktopOutlined />;
}

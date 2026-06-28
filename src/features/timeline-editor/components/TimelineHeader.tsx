import {
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
        <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomOutButton" aria-label="Zoom out" title="Zoom out" icon={<ZoomOutOutlined />} />
        <label htmlFor="zoomRange">Zoom</label>
        <input id="zoomRange" className="ant-range-bridge" type="range" min="6" max="360" step="0.5" defaultValue="18" />
        <span id="zoomLabel">18 px/month</span>
        <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomInButton" aria-label="Zoom in" title="Zoom in" icon={<ZoomInOutlined />} />
      </div>
    </header>
  );
}

function themeIcon(mode: ThemeMode) {
  if (mode === "light") return <SunOutlined />;
  if (mode === "dark") return <MoonOutlined />;
  return <DesktopOutlined />;
}

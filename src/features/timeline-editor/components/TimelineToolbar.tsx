import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
import { LanguageControl } from "./LanguageControl";
import { formatNumber } from "../../../i18n";
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
  const { t } = useAppLocale();
  return (
    <div className="tool-dock">
      <div id="timelineActionToolbar" className="toolbar" role="toolbar" aria-label={t("timeline_actions")}>
        <input id="itemsLockedInput" type="checkbox" hidden />
        <div className="toolbar-action-groups">
          <div className="toolbar-group" aria-label={t("create_items")}>
            <span className="toolbar-group-title">{t("create")}</span>
            <div className="toolbar-group-actions">
              <ToolbarButton tone="event" addType="event" title={t("add_event")} icon={<AimOutlined />}>{t("event")}</ToolbarButton>
              <ToolbarButton tone="period" addType="period" title={t("add_period")} icon={<CalendarOutlined />}>{t("period")}</ToolbarButton>
              <ToolbarButton tone="note" addType="note" title={t("add_note")} icon={<FormOutlined />}>{t("note")}</ToolbarButton>
              <ToolbarButton tone="marker" addType="marker" title={t("add_marker")} icon={<FlagOutlined />}>{t("marker")}</ToolbarButton>
              <ToolbarButton tone="birth" addType="birth" title={t("add_birth")} icon={<SmileOutlined />}>{t("birth")}</ToolbarButton>
              <ToolbarButton tone="line" addType="line" title={t("add_line_item")} icon={<MinusOutlined />}>{t("line")}</ToolbarButton>
              <ToolbarButton tone="text" addType="text" title={t("add_text")} icon={<FontSizeOutlined />}>{t("text")}</ToolbarButton>
            </div>
          </div>
          <div className="toolbar-group" aria-label={t("file_actions")}>
            <span className="toolbar-group-title">{t("file")}</span>
            <div className="toolbar-group-actions">
              <ToolbarButton tone="save" id="saveJsonButton" title={t("save_json")} icon={<SaveOutlined />}>{t("save")}</ToolbarButton>
              <ToolbarButton tone="load" id="loadJsonButton" title={t("load_json")} icon={<FolderOpenOutlined />}>{t("load")}</ToolbarButton>
            </div>
          </div>
          <div className="toolbar-group" aria-label={t("export_actions")}>
            <span className="toolbar-group-title">{t("export")}</span>
            <div className="toolbar-group-actions">
              <ToolbarButton tone="svg" id="exportSvgButton" title={t("export_svg")} icon={<FileOutlined />}>SVG</ToolbarButton>
              <ToolbarButton tone="png" id="exportPngButton" title={t("export_png")} icon={<FileImageOutlined />}>PNG</ToolbarButton>
              <ToolbarButton tone="pdf" id="exportPdfButton" title={t("export_pdf")} icon={<FilePdfOutlined />}>PDF</ToolbarButton>
            </div>
          </div>
        </div>
        <div className="toolbar-group toolbar-view-group" aria-label={t("view_actions")}>
          <span className="toolbar-group-title">{t("view")}</span>
          <div className="toolbar-group-actions view-actions">
            <Button
              htmlType="button"
              className="icon-button"
              id="undoButton"
              aria-label={t("undo")}
              title={t("undo")}
              icon={<UndoOutlined />}
              disabled
            />
            <Button
              htmlType="button"
              className="icon-button"
              id="redoButton"
              aria-label={t("redo")}
              title={t("redo")}
              icon={<RedoOutlined />}
              disabled
            />
            <Button
              htmlType="button"
              className="icon-button lock-toggle-button"
              id="itemsLockedButton"
              aria-pressed="false"
              aria-label={t("read_only")}
              title={t("read_only")}
            >
              <span className="toggle-icon-stack" aria-hidden="true">
                <UnlockOutlined className="toggle-icon-state" data-lock-state="unlocked" data-active="true" />
                <LockOutlined className="toggle-icon-state" data-lock-state="locked" data-active="false" />
              </span>
            </Button>
            <Button htmlType="button" className="secondary-button fit-button" id="fitButton" icon={<FullscreenOutlined />}>
              {t("fit")}
            </Button>
            <div className="range-control">
              <Button
                htmlType="button"
                className="range-control-button"
                id="zoomControlButton"
                aria-expanded="false"
                aria-controls="zoomControlPanel"
                title={t("adjust_zoom")}
                icon={<ZoomInOutlined />}
              >
                <span>{t("zoom")}</span>
                <span className="range-control-value" id="zoomLabel">{t("zoom_value", { value: formatNumber(18) })}</span>
              </Button>
              <div className="range-popover-panel" id="zoomControlPanel" hidden>
                <div className="range-popover-title">{t("zoom")}</div>
                <div className="range-popover-row">
                  <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomOutButton" aria-label={t("zoom_out")} title={t("zoom_out")} icon={<ZoomOutOutlined />} />
                  <label className="range-only-label" htmlFor="zoomRange">{t("timeline_zoom")}</label>
                  <input id="zoomRange" className="ant-range-bridge" type="range" min="6" max="360" step="0.5" defaultValue="18" />
                  <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomInButton" aria-label={t("zoom_in")} title={t("zoom_in")} icon={<ZoomInOutlined />} />
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
                title={t("adjust_height")}
                icon={<ColumnHeightOutlined />}
              >
                <span>{t("height")}</span>
                <span className="range-control-value" id="timelineHeightLabel">{t("auto")}</span>
              </Button>
              <div className="range-popover-panel" id="timelineHeightControlPanel" hidden>
                <div className="range-popover-title">{t("timeline_height")}</div>
                <div className="range-popover-row">
                  <label className="range-only-label" htmlFor="timelineHeightRange">{t("timeline_height")}</label>
                  <input id="timelineHeightRange" className="ant-range-bridge timeline-height-range" type="range" min="0" max="900" step="24" defaultValue="0" />
                </div>
              </div>
            </div>
            <LanguageControl />
            <ThemeToolbarControl />
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeToolbarControl() {
  const { t } = useAppLocale();
  const { themeMode, themeLabel, nextThemeLabel, cycleTheme } = useAppTheme();

  return (
    <button
      type="button"
      className="theme-toggle-button"
      data-theme-mode={themeMode}
      aria-label={t("theme_action", { current: themeLabel, next: nextThemeLabel })}
      title={t("theme_action", { current: themeLabel, next: nextThemeLabel })}
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

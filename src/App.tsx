import {
  AimOutlined,
  BgColorsOutlined,
  BulbOutlined,
  CalendarOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DesktopOutlined,
  FileAddOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  FontSizeOutlined,
  FormOutlined,
  FullscreenOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MinusOutlined,
  MoonOutlined,
  PlusOutlined,
  RightOutlined,
  SaveOutlined,
  SmileOutlined,
  SunOutlined,
  UnlockOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Card, ConfigProvider, Input, Space, Typography, theme as antTheme } from "antd";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type ThemeMode = "system" | "light" | "dark";
type ResolvedThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "timeline-studio-theme";
const SIDEBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-sidebar-collapsed";
const TOOLBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-toolbar-collapsed";
const THEME_ORDER: ThemeMode[] = ["system", "light", "dark"];
const THEME_LABELS: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

const APP_FONT_STACK =
  '"Vazirmatn", "Noto Sans Arabic", "Noto Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, Arial, sans-serif';

function readStoredTheme(): ThemeMode {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function readStoredBoolean(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function readSystemDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function applyTheme(mode: ThemeMode, resolvedMode: ResolvedThemeMode) {
  document.documentElement.dataset.theme = mode;
  document.documentElement.dataset.resolvedTheme = resolvedMode;
}

function storeTheme(mode: ThemeMode) {
  try {
    if (mode === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  } catch {
    // Theme preference is cosmetic; ignore unavailable browser storage.
  }
}

function storeString(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Layout preference is cosmetic; ignore unavailable browser storage.
  }
}

function storeBoolean(key: string, value: boolean) {
  storeString(key, String(value));
}

function nextThemeMode(mode: ThemeMode): ThemeMode {
  return THEME_ORDER[(THEME_ORDER.indexOf(mode) + 1) % THEME_ORDER.length];
}

function themeIcon(mode: ThemeMode) {
  if (mode === "light") return <SunOutlined />;
  if (mode === "dark") return <MoonOutlined />;
  return <DesktopOutlined />;
}

function ToneIcon({ tone, children }: { tone: string; children: ReactNode }) {
  return (
    <span className="toolbar-icon" data-tone={tone} aria-hidden="true">
      {children}
    </span>
  );
}

function ToolbarButton({
  tone,
  addType,
  id,
  title,
  icon,
  children,
}: {
  tone: string;
  addType?: string;
  id?: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Button
      id={id}
      htmlType="button"
      className="toolbar-button"
      data-tone={tone}
      data-add={addType}
      title={title}
      icon={<ToneIcon tone={tone}>{icon}</ToneIcon>}
    >
      {children}
    </Button>
  );
}

function FieldLabel({ children, id, label }: { children: ReactNode; id?: string; label: string }) {
  return (
    <label className="field-label" id={id}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function ColorPickerField({ label, prefix, paletteLabel }: { label: string; prefix: "item" | "line"; paletteLabel: string }) {
  const inputId = `${prefix}ColorInput`;
  const triggerId = `${prefix}ColorTrigger`;
  const previewId = `${prefix}ColorPreview`;
  const valueId = `${prefix}ColorValue`;
  const panelId = `${prefix}ColorPanel`;
  const planeId = `${prefix}ColorPlane`;
  const markerId = `${prefix}ColorPlaneMarker`;
  const hueId = `${prefix}ColorHueInput`;
  const hexId = `${prefix}ColorHexInput`;
  const paletteId = `${prefix}ColorPalette`;

  return (
    <div className="color-picker-field">
      <span className="field-caption">{label}</span>
      <div className="color-picker" data-color-picker={prefix}>
        <input id={inputId} type="hidden" />
        <Button
          htmlType="button"
          className="color-picker-trigger"
          id={triggerId}
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls={panelId}
          icon={<BgColorsOutlined />}
        >
          <span className="color-picker-preview" id={previewId} aria-hidden="true"></span>
          <span className="color-picker-value" id={valueId}>#2563EB</span>
        </Button>
        <div className="color-picker-panel" id={panelId} role="dialog" aria-label={`${label} picker`} hidden>
          <div
            className="color-picker-plane"
            id={planeId}
            role="slider"
            tabIndex={0}
            aria-label={`${label} saturation and brightness`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
          >
            <span className="color-picker-plane-marker" id={markerId}></span>
          </div>
          <label className="color-picker-range">
            Hue
            <input id={hueId} type="range" min={0} max={360} defaultValue={220} aria-label={`${label} hue`} />
          </label>
          <label className="color-picker-hex-row">
            Hex
            <Input id={hexId} type="text" inputMode="text" maxLength={7} spellCheck={false} aria-label={`${label} hex color`} />
          </label>
          <div className="color-swatch-grid" id={paletteId} role="group" aria-label={paletteLabel}></div>
        </div>
      </div>
    </div>
  );
}

function useSystemTheme() {
  const [systemDark, setSystemDark] = useState(readSystemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemDark(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return systemDark ? "dark" : "light";
}

export function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredTheme);
  const systemTheme = useSystemTheme();
  const resolvedTheme: ResolvedThemeMode = themeMode === "system" ? systemTheme : themeMode;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStoredBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY));
  const [toolbarCollapsed, setToolbarCollapsed] = useState(() => readStoredBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY));
  const nextMode = nextThemeMode(themeMode);
  const antConfigTheme = useMemo(
    () => ({
      algorithm: resolvedTheme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
      token: {
        colorPrimary: "#1677ff",
        borderRadius: 8,
        fontFamily: APP_FONT_STACK,
      },
      components: {
        Button: {
          controlHeight: 34,
          borderRadius: 8,
        },
        Card: {
          borderRadiusLG: 8,
        },
      },
    }),
    [resolvedTheme],
  );

  useEffect(() => {
    applyTheme(themeMode, resolvedTheme);
    storeTheme(themeMode);
  }, [themeMode, resolvedTheme]);

  useEffect(() => {
    storeBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY, sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    storeBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY, toolbarCollapsed);
  }, [toolbarCollapsed]);

  return (
    <ConfigProvider theme={antConfigTheme}>
      <div className="app-shell">
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
              aria-label={`Theme: ${THEME_LABELS[themeMode]}. Switch to ${THEME_LABELS[nextMode]}.`}
              title={`Theme: ${THEME_LABELS[themeMode]}. Switch to ${THEME_LABELS[nextMode]}.`}
              onClick={() => setThemeMode(nextMode)}
              icon={themeIcon(themeMode)}
            >
              {THEME_LABELS[themeMode]}
            </Button>
            <span className="separator" aria-hidden="true"></span>
            <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomOutButton" aria-label="Zoom out" title="Zoom out" icon={<ZoomOutOutlined />} />
            <label htmlFor="zoomRange">Zoom</label>
            <input id="zoomRange" className="ant-range-bridge" type="range" min="18" max="360" step="0.5" defaultValue="18" />
            <span id="zoomLabel">18 px/month</span>
            <Button htmlType="button" className="icon-button zoom-icon-button" id="zoomInButton" aria-label="Zoom in" title="Zoom in" icon={<ZoomInOutlined />} />
          </div>
        </header>

        <main className="workspace" data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}>
          <aside className="inspector" aria-label="Timeline editor">
            <div className="sidebar-header">
              <div className="sidebar-title">
                <span className="sidebar-title-kicker">Editor</span>
                <strong>Timeline</strong>
              </div>
              <div className="sidebar-actions">
                <Button
                  htmlType="button"
                  className="icon-button panel-toggle-button"
                  data-collapsed={sidebarCollapsed ? "true" : "false"}
                  aria-expanded={!sidebarCollapsed}
                  aria-controls="editorPanels"
                  aria-label={sidebarCollapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
                  title={sidebarCollapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
                  onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
                >
                  <span className="toggle-icon-stack" aria-hidden="true">
                    <MenuFoldIcon active={!sidebarCollapsed} />
                    <MenuUnfoldIcon active={sidebarCollapsed} />
                  </span>
                </Button>
              </div>
            </div>

            <div id="editorPanels" className="sidebar-panels">
              <Card
                className="panel"
                size="small"
                title={<Typography.Title level={2}>Timeline</Typography.Title>}
              >
                <FieldLabel label="Title">
                  <Input id="timelineTitleInput" type="text" autoComplete="off" />
                </FieldLabel>

                <div className="field-grid">
                  <FieldLabel label="Start date">
                    <Input id="startDateInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                  </FieldLabel>
                  <FieldLabel label="End date">
                    <Input id="endDateInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                  </FieldLabel>
                </div>

                <label className="check-row">
                  <input id="autoEndDateInput" className="legacy-checkbox" type="checkbox" />
                  <span>End at today</span>
                </label>

                <FieldLabel label="Drag snap">
                  <select id="snapInput" className="legacy-select">
                    <option value="year">1 year</option>
                    <option value="month">1 month</option>
                    <option value="week">1 week</option>
                    <option value="day">1 day</option>
                  </select>
                </FieldLabel>
              </Card>

              <Card
                className="panel"
                size="small"
                title={<Typography.Title level={2}>Item</Typography.Title>}
                extra={
                  <Button htmlType="button" danger type="text" className="quiet-button danger" id="deleteItemButton">
                    Delete
                  </Button>
                }
              >
                <form id="itemForm">
                  <FieldLabel label="Type">
                    <select id="itemTypeInput" className="legacy-select">
                      <option value="birth">Birth</option>
                      <option value="event">Event</option>
                      <option value="marker">Marker</option>
                      <option value="note">Note</option>
                      <option value="period">Period</option>
                      <option value="line">Line</option>
                      <option value="text">Text</option>
                    </select>
                  </FieldLabel>

                  <FieldLabel label="Title">
                    <Input id="itemTitleInput" type="text" autoComplete="off" />
                  </FieldLabel>

                  <div className="field-grid">
                    <FieldLabel label="Lane">
                      <Input id="itemLaneInput" type="number" min="0" max="20" step="1" />
                    </FieldLabel>
                    <div className="color-field">
                      <ColorPickerField label="Color" prefix="item" paletteLabel="Preset item colors" />
                    </div>
                    <FieldLabel label="Start date">
                      <Input id="itemStartInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                    </FieldLabel>
                    <FieldLabel id="itemEndField" label="End date">
                      <Input id="itemEndInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                    </FieldLabel>
                  </div>
                  <p className="calendar-preview" id="itemCalendarPreview"></p>

                  <div className="derived-label-options" id="itemDerivedLabelsField">
                    <label className="check-row">
                      <input id="itemAgeLabelsInput" className="legacy-checkbox" type="checkbox" defaultChecked />
                      <span>Show age at start and end</span>
                    </label>
                    <label className="check-row">
                      <input id="itemDurationLabelInput" className="legacy-checkbox" type="checkbox" defaultChecked />
                      <span>Show duration</span>
                    </label>
                  </div>

                  <FieldLabel label="Notes">
                    <Input.TextArea id="itemNotesInput" rows={4} />
                  </FieldLabel>

                  <div className="form-actions">
                    <Button htmlType="submit" type="primary" className="primary-button">
                      Apply
                    </Button>
                    <Button htmlType="button" className="secondary-button" id="duplicateItemButton">
                      Duplicate
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </aside>

          <section className="timeline-stage" aria-label="Timeline canvas">
            <div className="tool-dock" data-collapsed={toolbarCollapsed ? "true" : "false"}>
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
                    data-collapsed={toolbarCollapsed ? "true" : "false"}
                    aria-expanded={!toolbarCollapsed}
                    aria-controls="timelineActionToolbar"
                    aria-label={toolbarCollapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
                    title={toolbarCollapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
                    onClick={() => setToolbarCollapsed((collapsed) => !collapsed)}
                  >
                    <span className="toggle-icon-stack" aria-hidden="true">
                      <VerticalAlignTopOutlined className="toggle-icon-state" data-active={!toolbarCollapsed} />
                      <VerticalAlignBottomOutlined className="toggle-icon-state is-open" data-active={toolbarCollapsed} />
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

            <div className="timeline-viewport" id="timelineViewport" tabIndex={0}>
              <svg id="timelineSvg" role="img" aria-labelledby="stageTitle stageMeta"></svg>
              <div className="timeline-empty-state" id="timelineEmptyState" hidden>
                <div className="empty-state-mark" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <strong>No timeline items yet</strong>
                <p>Create an event, period, note, marker, birthdate, line, or text item.</p>
              </div>
            </div>
            <div className="line-editor-popover" id="lineEditorPopover" hidden>
              <form id="lineEditorForm">
                <div className="line-editor-heading">
                  <strong id="lineEditorTitle">Line</strong>
                  <Button htmlType="button" className="icon-button line-editor-close" id="lineEditorCloseButton" aria-label="Close line editor" icon={<CloseOutlined />} />
                </div>
                <FieldLabel label="Name">
                  <Input id="lineNameInput" type="text" autoComplete="off" />
                </FieldLabel>
                <ColorPickerField label="Background" prefix="line" paletteLabel="Preset line background colors" />
                <div className="line-editor-actions">
                  <Button htmlType="submit" type="primary" className="primary-button">Apply</Button>
                  <Button htmlType="button" className="secondary-button" id="lineColorClearButton">Clear color</Button>
                  <Button htmlType="button" className="secondary-button" id="lineAddBelowButton">Add below</Button>
                  <Button htmlType="button" danger type="text" className="quiet-button danger" id="lineRemoveButton">Remove</Button>
                </div>
              </form>
            </div>
            <div className="context-menu" id="timelineContextMenu" role="menu" aria-label="Timeline item actions" hidden>
              <div className="context-menu-submenu" data-context-submenu="add">
                <Button htmlType="button" role="menuitem" data-context-action="add-menu" aria-haspopup="menu" aria-expanded="false">
                  <span className="context-menu-label">
                    <PlusOutlined aria-hidden="true" />
                    <span>Add</span>
                  </span>
                  <RightOutlined aria-hidden="true" />
                </Button>
                <div className="context-submenu-panel" role="menu" aria-label="Add item type">
                  <ContextMenuButton action="birth" icon={<SmileOutlined />}>Birth</ContextMenuButton>
                  <ContextMenuButton action="event" icon={<AimOutlined />}>Event</ContextMenuButton>
                  <ContextMenuButton action="marker" icon={<FlagOutlined />}>Marker</ContextMenuButton>
                  <ContextMenuButton action="note" icon={<FormOutlined />}>Note</ContextMenuButton>
                  <ContextMenuButton action="period" icon={<CalendarOutlined />}>Period</ContextMenuButton>
                  <ContextMenuButton action="line" icon={<MinusOutlined />}>Line</ContextMenuButton>
                  <ContextMenuButton action="text" icon={<FontSizeOutlined />}>Text</ContextMenuButton>
                </div>
              </div>
              <div className="context-menu-separator" role="separator"></div>
              <ContextMenuAction action="copy" icon={<CopyOutlined />} shortcut="Ctrl/Cmd C">Copy</ContextMenuAction>
              <ContextMenuAction action="paste" icon={<FileAddOutlined />} shortcut="Ctrl/Cmd V">Paste</ContextMenuAction>
              <ContextMenuAction action="duplicate" icon={<FileTextOutlined />} shortcut="Ctrl/Cmd D">Duplicate</ContextMenuAction>
              <ContextMenuAction action="lock-item" icon={<LockOutlined />}>Lock item</ContextMenuAction>
              <ContextMenuAction action="unlock-item" icon={<UnlockOutlined />}>Unlock item</ContextMenuAction>
              <div className="context-menu-separator" role="separator"></div>
              <ContextMenuAction action="zoom-in" icon={<ZoomInOutlined />} shortcut="+">Zoom in</ContextMenuAction>
              <ContextMenuAction action="zoom-out" icon={<ZoomOutOutlined />} shortcut="-">Zoom out</ContextMenuAction>
              <ContextMenuAction action="fit" icon={<FullscreenOutlined />}>Fit</ContextMenuAction>
              <div className="context-menu-separator" role="separator"></div>
              <ContextMenuAction action="delete" icon={<DeleteOutlined />} shortcut="Del" danger>Delete</ContextMenuAction>
            </div>
            <div className="timeline-info-panel" id="timelineInfoPanel" aria-live="polite">
              <div className="timeline-info-block">
                <span className="timeline-info-kicker">Pointer</span>
                <strong id="hoverDateLabel">Hover over the timeline</strong>
                <span id="hoverIranianLabel">Gregorian and Iranian dates</span>
                <span id="hoverAgeLabel">Age appears when a birth item exists</span>
              </div>
              <div className="timeline-info-block">
                <span className="timeline-info-kicker">Selection</span>
                <strong id="selectedItemLabel">No item selected</strong>
                <span id="selectedItemDateLabel">Select an item to inspect dates</span>
                <span id="selectedItemEndLabel" hidden></span>
                <span id="selectedItemDurationLabel" hidden></span>
                <span id="selectedItemAgeLabel" hidden></span>
              </div>
            </div>
          </section>
        </main>
      </div>

      <input id="fileInput" type="file" accept="application/json,.json" hidden />
    </ConfigProvider>
  );
}

function MenuFoldIcon({ active }: { active: boolean }) {
  return <MenuFoldOutlined className="toggle-icon-state sidebar-fold-icon" data-active={active} />;
}

function MenuUnfoldIcon({ active }: { active: boolean }) {
  return <MenuUnfoldOutlined className="toggle-icon-state sidebar-unfold-icon" data-active={active} />;
}

function ContextMenuButton({ action, icon, children }: { action: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Button htmlType="button" role="menuitem" data-context-add={action}>
      <span className="context-menu-label">
        {icon}
        <span>{children}</span>
      </span>
    </Button>
  );
}

function ContextMenuAction({
  action,
  icon,
  shortcut,
  danger = false,
  children,
}: {
  action: string;
  icon: ReactNode;
  shortcut?: string;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <Button htmlType="button" role="menuitem" className={danger ? "danger" : undefined} data-context-action={action}>
      <span className="context-menu-label">
        {icon}
        <span>{children}</span>
      </span>
      {shortcut ? <kbd>{shortcut}</kbd> : <span aria-hidden="true"></span>}
    </Button>
  );
}

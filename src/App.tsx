import {
  Baby,
  Calendar,
  Clipboard,
  CircleDot,
  Copy,
  FileCode2,
  FileText,
  Flag,
  FolderOpen,
  Files,
  ImageDown,
  LockKeyhole,
  LockKeyholeOpen,
  Maximize2,
  Minus,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PanelTopClose,
  PanelTopOpen,
  Save,
  StickyNote,
  Trash2,
  Type,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "system" | "light" | "dark";

const THEME_STORAGE_KEY = "timeline-studio-theme";
const SIDEBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-sidebar-collapsed";
const TOOLBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-toolbar-collapsed";
const THEME_ORDER: ThemeMode[] = ["system", "light", "dark"];
const THEME_LABELS: Record<ThemeMode, string> = {
  system: "System",
  light: "Light",
  dark: "Dark",
};

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
        <button
          type="button"
          className="color-picker-trigger"
          id={triggerId}
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls={panelId}
        >
          <span className="color-picker-preview" id={previewId} aria-hidden="true"></span>
          <span className="color-picker-value" id={valueId}>#2563EB</span>
          <Palette size={15} aria-hidden="true" />
        </button>
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
            <input id={hexId} type="text" inputMode="text" maxLength={7} spellCheck={false} aria-label={`${label} hex color`} />
          </label>
          <div className="color-swatch-grid" id={paletteId} role="group" aria-label={paletteLabel}></div>
        </div>
      </div>
    </div>
  );
}

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

function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
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

export function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredTheme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStoredBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY));
  const [toolbarCollapsed, setToolbarCollapsed] = useState(() => readStoredBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY));
  const nextMode = nextThemeMode(themeMode);

  useEffect(() => {
    applyTheme(themeMode);
    storeTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    storeBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY, sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    storeBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY, toolbarCollapsed);
  }, [toolbarCollapsed]);

  return (
    <>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <div>
              <h1>Timeline Studio</h1>
              <p id="statusText" aria-live="polite">
                Ready
              </p>
            </div>
          </div>

          <div className="timeline-context">
            <div>
              <h2 id="stageTitle">New Timeline</h2>
              <p id="stageMeta">Create or load a timeline</p>
              <p className="file-state" id="fileState" aria-live="polite">
                <span id="fileNameLabel">No file selected</span>
                <span className="dirty-indicator" id="dirtyIndicator" hidden>
                  Unsaved changes
                </span>
              </p>
            </div>
            <button type="button" className="secondary-button fit-button" id="fitButton">
              <Maximize2 size={16} aria-hidden="true" />
              <span>Fit</span>
            </button>
          </div>

          <div className="zoom-tools">
            <button
              type="button"
              className="theme-toggle-button"
              data-theme-mode={themeMode}
              aria-label={`Theme: ${THEME_LABELS[themeMode]}. Switch to ${THEME_LABELS[nextMode]}.`}
              title={`Theme: ${THEME_LABELS[themeMode]}. Switch to ${THEME_LABELS[nextMode]}.`}
              onClick={() => setThemeMode(nextMode)}
            >
              <span className="theme-toggle-icon" aria-hidden="true"></span>
              <span>{THEME_LABELS[themeMode]}</span>
            </button>
            <span className="separator" aria-hidden="true"></span>
            <button type="button" className="icon-button zoom-icon-button" id="zoomOutButton" aria-label="Zoom out" title="Zoom out">
              <ZoomOut size={18} aria-hidden="true" />
            </button>
            <label htmlFor="zoomRange">Zoom</label>
            <input id="zoomRange" type="range" min="18" max="360" step="0.5" defaultValue="18" />
            <span id="zoomLabel">18 px/month</span>
            <button type="button" className="icon-button zoom-icon-button" id="zoomInButton" aria-label="Zoom in" title="Zoom in">
              <ZoomIn size={18} aria-hidden="true" />
            </button>
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
                <button
                  type="button"
                  className="icon-button panel-toggle-button"
                  data-collapsed={sidebarCollapsed ? "true" : "false"}
                  aria-expanded={!sidebarCollapsed}
                  aria-controls="editorPanels"
                  aria-label={sidebarCollapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
                  title={sidebarCollapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
                  onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
                >
                  <span className="toggle-icon-stack" aria-hidden="true">
                    <PanelLeftClose className="toggle-icon-state" data-active={!sidebarCollapsed} size={18} />
                    <PanelLeftOpen className="toggle-icon-state" data-active={sidebarCollapsed} size={18} />
                  </span>
                </button>
              </div>
            </div>

            <div id="editorPanels" className="sidebar-panels">
              <section className="panel">
                <div className="panel-heading">
                  <h2>Timeline</h2>
                </div>

                <label>
                  Title
                  <input id="timelineTitleInput" type="text" autoComplete="off" />
                </label>

                <div className="field-grid">
                  <label>
                    Start date
                    <input id="startDateInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                  </label>
                  <label>
                    End date
                    <input id="endDateInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                  </label>
                </div>

                <label className="check-row">
                  <input id="autoEndDateInput" type="checkbox" />
                  End at today
                </label>

                <label>
                  Drag snap
                  <select id="snapInput">
                    <option value="year">1 year</option>
                    <option value="month">1 month</option>
                    <option value="week">1 week</option>
                    <option value="day">1 day</option>
                  </select>
                </label>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <h2>Item</h2>
                  <button type="button" className="quiet-button danger" id="deleteItemButton">
                    Delete
                  </button>
                </div>

                <form id="itemForm">
                  <label>
                    Type
                    <select id="itemTypeInput">
                      <option value="birth">Birth</option>
                      <option value="event">Event</option>
                      <option value="marker">Marker</option>
                      <option value="note">Note</option>
                      <option value="period">Period</option>
                      <option value="line">Line</option>
                      <option value="text">Text</option>
                    </select>
                  </label>

                  <label>
                    Title
                    <input id="itemTitleInput" type="text" autoComplete="off" />
                  </label>

                  <div className="field-grid">
                    <label>
                      Lane
                      <input id="itemLaneInput" type="number" min="0" max="20" step="1" />
                    </label>
                    <div className="color-field">
                      <ColorPickerField label="Color" prefix="item" paletteLabel="Preset item colors" />
                    </div>
                    <label>
                      Start date
                      <input id="itemStartInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                    </label>
                    <label id="itemEndField">
                      End date
                      <input id="itemEndInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
                    </label>
                  </div>
                  <p className="calendar-preview" id="itemCalendarPreview"></p>

                  <div className="derived-label-options" id="itemDerivedLabelsField">
                    <label className="check-row">
                      <input id="itemAgeLabelsInput" type="checkbox" defaultChecked />
                      Show age at start and end
                    </label>
                    <label className="check-row">
                      <input id="itemDurationLabelInput" type="checkbox" defaultChecked />
                      Show duration
                    </label>
                  </div>

                  <label>
                    Notes
                    <textarea id="itemNotesInput" rows={4}></textarea>
                  </label>

                  <div className="form-actions">
                    <button type="submit" className="primary-button">
                      Apply
                    </button>
                    <button type="button" className="secondary-button" id="duplicateItemButton">
                      Duplicate
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </aside>

          <section className="timeline-stage" aria-label="Timeline canvas">
            <div className="tool-dock" data-collapsed={toolbarCollapsed ? "true" : "false"}>
              <div className="tool-dock-header">
                <strong>Actions</strong>
                <div className="tool-dock-actions">
                  <button
                    type="button"
                    className="icon-button lock-toggle-button"
                    id="itemsLockedButton"
                    aria-pressed="false"
                    aria-label="Lock items"
                    title="Lock items"
                  >
                    <span className="toggle-icon-stack" aria-hidden="true">
                      <LockKeyholeOpen className="toggle-icon-state" data-lock-state="unlocked" data-active="true" size={17} />
                      <LockKeyhole className="toggle-icon-state" data-lock-state="locked" data-active="false" size={17} />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="icon-button panel-toggle-button"
                    data-collapsed={toolbarCollapsed ? "true" : "false"}
                    aria-expanded={!toolbarCollapsed}
                    aria-controls="timelineActionToolbar"
                    aria-label={toolbarCollapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
                    title={toolbarCollapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
                    onClick={() => setToolbarCollapsed((collapsed) => !collapsed)}
                  >
                    <span className="toggle-icon-stack" aria-hidden="true">
                      <PanelTopClose className="toggle-icon-state" data-active={!toolbarCollapsed} size={18} />
                      <PanelTopOpen className="toggle-icon-state" data-active={toolbarCollapsed} size={18} />
                    </span>
                  </button>
                </div>
              </div>

              <div id="timelineActionToolbar" className="toolbar" role="toolbar" aria-label="Timeline actions">
                <input id="itemsLockedInput" type="checkbox" hidden />
                <div className="toolbar-group" aria-label="Create items">
                  <span className="toolbar-group-title">Create</span>
                  <div className="toolbar-group-actions">
                    <button type="button" className="toolbar-button" data-tone="event" data-add="event" title="Add event">
                      <span className="toolbar-icon" aria-hidden="true">
                        <CircleDot size={15} />
                      </span>
                      <span>Event</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="period" data-add="period" title="Add period">
                      <span className="toolbar-icon" aria-hidden="true">
                        <Calendar size={15} />
                      </span>
                      <span>Period</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="note" data-add="note" title="Add note">
                      <span className="toolbar-icon" aria-hidden="true">
                        <StickyNote size={15} />
                      </span>
                      <span>Note</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="marker" data-add="marker" title="Add marker">
                      <span className="toolbar-icon" aria-hidden="true">
                        <Flag size={15} />
                      </span>
                      <span>Marker</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="birth" data-add="birth" title="Add birthdate">
                      <span className="toolbar-icon" aria-hidden="true">
                        <Baby size={15} />
                      </span>
                      <span>Birth</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="line" data-add="line" title="Add line item">
                      <span className="toolbar-icon" aria-hidden="true">
                        <Minus size={15} />
                      </span>
                      <span>Line</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="text" data-add="text" title="Add text">
                      <span className="toolbar-icon" aria-hidden="true">
                        <Type size={15} />
                      </span>
                      <span>Text</span>
                    </button>
                  </div>
                </div>
                <div className="toolbar-group" aria-label="File actions">
                  <span className="toolbar-group-title">File</span>
                  <div className="toolbar-group-actions">
                    <button type="button" className="toolbar-button" data-tone="save" id="saveJsonButton" title="Save JSON">
                      <span className="toolbar-icon" aria-hidden="true">
                        <Save size={15} />
                      </span>
                      <span>Save</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="load" id="loadJsonButton" title="Load JSON">
                      <span className="toolbar-icon" aria-hidden="true">
                        <FolderOpen size={15} />
                      </span>
                      <span>Load</span>
                    </button>
                  </div>
                </div>
                <div className="toolbar-group" aria-label="Export actions">
                  <span className="toolbar-group-title">Export</span>
                  <div className="toolbar-group-actions">
                    <button type="button" className="toolbar-button" data-tone="svg" id="exportSvgButton" title="Export SVG">
                      <span className="toolbar-icon" aria-hidden="true">
                        <FileCode2 size={15} />
                      </span>
                      <span>SVG</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="png" id="exportPngButton" title="Export PNG">
                      <span className="toolbar-icon" aria-hidden="true">
                        <ImageDown size={15} />
                      </span>
                      <span>PNG</span>
                    </button>
                    <button type="button" className="toolbar-button" data-tone="pdf" id="exportPdfButton" title="Export PDF">
                      <span className="toolbar-icon" aria-hidden="true">
                        <FileText size={15} />
                      </span>
                      <span>PDF</span>
                    </button>
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
                  <button type="button" className="icon-button line-editor-close" id="lineEditorCloseButton" aria-label="Close line editor">
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
                <label>
                  Name
                  <input id="lineNameInput" type="text" autoComplete="off" />
                </label>
                <ColorPickerField label="Background" prefix="line" paletteLabel="Preset line background colors" />
                <div className="line-editor-actions">
                  <button type="submit" className="primary-button">Apply</button>
                  <button type="button" className="secondary-button" id="lineColorClearButton">Clear color</button>
                  <button type="button" className="secondary-button" id="lineAddBelowButton">Add below</button>
                  <button type="button" className="quiet-button danger" id="lineRemoveButton">Remove</button>
                </div>
              </form>
            </div>
            <div className="context-menu" id="timelineContextMenu" role="menu" aria-label="Timeline item actions" hidden>
              <button type="button" role="menuitem" data-context-action="copy">
                <span className="context-menu-label">
                  <Copy size={15} aria-hidden="true" />
                  <span>Copy</span>
                </span>
                <kbd>Ctrl/Cmd C</kbd>
              </button>
              <button type="button" role="menuitem" data-context-action="paste">
                <span className="context-menu-label">
                  <Clipboard size={15} aria-hidden="true" />
                  <span>Paste</span>
                </span>
                <kbd>Ctrl/Cmd V</kbd>
              </button>
              <button type="button" role="menuitem" data-context-action="duplicate">
                <span className="context-menu-label">
                  <Files size={15} aria-hidden="true" />
                  <span>Duplicate</span>
                </span>
                <kbd>Ctrl/Cmd D</kbd>
              </button>
              <button type="button" role="menuitem" data-context-action="lock">
                <span className="context-menu-label">
                  <LockKeyhole size={15} aria-hidden="true" />
                  <span>Lock items</span>
                </span>
                <kbd>Ctrl/Cmd Shift L</kbd>
              </button>
              <button type="button" role="menuitem" data-context-action="unlock">
                <span className="context-menu-label">
                  <LockKeyholeOpen size={15} aria-hidden="true" />
                  <span>Unlock items</span>
                </span>
                <kbd>Ctrl/Cmd Shift L</kbd>
              </button>
              <div className="context-menu-separator" role="separator"></div>
              <button type="button" role="menuitem" data-context-action="zoom-in">
                <span className="context-menu-label">
                  <ZoomIn size={15} aria-hidden="true" />
                  <span>Zoom in</span>
                </span>
                <kbd>+</kbd>
              </button>
              <button type="button" role="menuitem" data-context-action="zoom-out">
                <span className="context-menu-label">
                  <ZoomOut size={15} aria-hidden="true" />
                  <span>Zoom out</span>
                </span>
                <kbd>-</kbd>
              </button>
              <button type="button" role="menuitem" data-context-action="fit">
                <span className="context-menu-label">
                  <Maximize2 size={15} aria-hidden="true" />
                  <span>Fit</span>
                </span>
                <span aria-hidden="true"></span>
              </button>
              <div className="context-menu-separator" role="separator"></div>
              <button type="button" role="menuitem" className="danger" data-context-action="delete">
                <span className="context-menu-label">
                  <Trash2 size={15} aria-hidden="true" />
                  <span>Delete</span>
                </span>
                <kbd>Del</kbd>
              </button>
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
    </>
  );
}

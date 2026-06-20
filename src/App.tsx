import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
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
            <button type="button" className="secondary-button" id="fitButton">
              Fit
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
            <button type="button" className="icon-button" id="zoomOutButton" aria-label="Zoom out">
              -
            </button>
            <label htmlFor="zoomRange">Zoom</label>
            <input id="zoomRange" type="range" min="0.5" max="360" step="0.5" defaultValue="18" />
            <span id="zoomLabel">18 px/month</span>
            <button type="button" className="icon-button" id="zoomInButton" aria-label="Zoom in">
              +
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
                    <ChevronLeft className="toggle-icon-state" data-active={!sidebarCollapsed} size={18} />
                    <ChevronRight className="toggle-icon-state" data-active={sidebarCollapsed} size={18} />
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
                  <h2>Rows / Lines</h2>
                  <button type="button" className="quiet-button" id="addLaneButton">
                    Add
                  </button>
                </div>
                <div className="lane-list" id="laneList"></div>
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
                    <label>
                      Color
                      <input id="itemColorInput" type="color" />
                    </label>
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
                    className="icon-button panel-toggle-button"
                    data-collapsed={toolbarCollapsed ? "true" : "false"}
                    aria-expanded={!toolbarCollapsed}
                    aria-controls="timelineActionToolbar"
                    aria-label={toolbarCollapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
                    title={toolbarCollapsed ? "Expand timeline toolbar" : "Collapse timeline toolbar"}
                    onClick={() => setToolbarCollapsed((collapsed) => !collapsed)}
                  >
                    <span className="toggle-icon-stack" aria-hidden="true">
                      <ChevronUp className="toggle-icon-state" data-active={!toolbarCollapsed} size={18} />
                      <ChevronDown className="toggle-icon-state" data-active={toolbarCollapsed} size={18} />
                    </span>
                  </button>
                </div>
              </div>

              <div id="timelineActionToolbar" className="toolbar" role="toolbar" aria-label="Timeline actions">
                <button type="button" className="toolbar-button" data-add="birth">
                  Birth
                </button>
                <button type="button" className="toolbar-button" data-add="event">
                  Event
                </button>
                <button type="button" className="toolbar-button" data-add="marker">
                  Marker
                </button>
                <button type="button" className="toolbar-button" data-add="note">
                  Note
                </button>
                <button type="button" className="toolbar-button" data-add="period">
                  Period
                </button>
                <button type="button" className="toolbar-button" data-add="line">
                  Line
                </button>
                <button type="button" className="toolbar-button" data-add="text">
                  Text
                </button>
                <span className="separator" aria-hidden="true"></span>
                <label className="toolbar-check">
                  <input id="itemsLockedInput" type="checkbox" />
                  Lock items
                </label>
                <span className="separator" aria-hidden="true"></span>
                <button type="button" className="toolbar-button" id="saveJsonButton">
                  Save JSON
                </button>
                <button type="button" className="toolbar-button" id="loadJsonButton">
                  Load JSON
                </button>
                <span className="separator" aria-hidden="true"></span>
                <button type="button" className="toolbar-button" id="exportSvgButton">
                  SVG
                </button>
                <button type="button" className="toolbar-button" id="exportPngButton">
                  PNG
                </button>
                <button type="button" className="toolbar-button" id="exportPdfButton">
                  PDF
                </button>
              </div>
            </div>

            <div className="timeline-viewport" id="timelineViewport" tabIndex={0}>
              <svg id="timelineSvg" role="img" aria-labelledby="stageTitle stageMeta"></svg>
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

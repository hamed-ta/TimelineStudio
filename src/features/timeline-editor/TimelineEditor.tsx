import { useEffect, useState } from "react";
import { EditorSidebar } from "./components/EditorSidebar";
import { LineEditorPopover } from "./components/LineEditorPopover";
import { TimelineCanvas } from "./components/TimelineCanvas";
import { TimelineContextMenu } from "./components/TimelineContextMenu";
import { TimelineHeader } from "./components/TimelineHeader";
import { TimelineInfoPanel } from "./components/TimelineInfoPanel";
import { TimelineToolbar } from "./components/TimelineToolbar";

declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;

const SIDEBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-sidebar-collapsed";
const TOOLBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-toolbar-collapsed";

export function TimelineEditor() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStoredBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY));
  const [toolbarCollapsed, setToolbarCollapsed] = useState(() => readStoredBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY));

  useEffect(() => {
    storeBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY, sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    storeBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY, toolbarCollapsed);
  }, [toolbarCollapsed]);

  return (
    <>
      <div className="app-shell">
        <TimelineHeader />

        <main className="workspace" data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}>
          <EditorSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
          />

          <section className="timeline-stage" aria-label="Timeline canvas">
            <TimelineToolbar
              collapsed={toolbarCollapsed}
              onToggleCollapsed={() => setToolbarCollapsed((collapsed) => !collapsed)}
            />
            <TimelineCanvas />
            <LineEditorPopover />
            <TimelineContextMenu />
            <TimelineInfoPanel />
          </section>
        </main>

        <footer className="app-footer" aria-label="Application information">
          <span className="app-footer-brand">{__APP_NAME__}</span>
          <span className="app-footer-divider" aria-hidden="true"></span>
          <span className="app-footer-version">Version {__APP_VERSION__}</span>
        </footer>
      </div>

      <input id="fileInput" type="file" accept="application/json,.json" hidden />
    </>
  );
}

function readStoredBoolean(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function storeBoolean(key: string, value: boolean) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Layout preference is cosmetic; ignore unavailable browser storage.
  }
}

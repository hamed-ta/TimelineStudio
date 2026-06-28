import { usePersistentBoolean } from "../../shared/hooks/usePersistentBoolean";
import { TimelineCanvas } from "./canvas/TimelineCanvas";
import { EditorSidebar } from "./components/EditorSidebar";
import { LineEditorPopover } from "./components/LineEditorPopover";
import { TimelineContextMenu } from "./components/TimelineContextMenu";
import { TimelineHeader } from "./components/TimelineHeader";
import { TimelineInfoPanel } from "./components/TimelineInfoPanel";
import { TimelineToolbar } from "./components/TimelineToolbar";

declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;

const SIDEBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-sidebar-collapsed";
const TOOLBAR_COLLAPSED_STORAGE_KEY = "timeline-studio-toolbar-collapsed";

export function TimelineEditor() {
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistentBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY);
  const [toolbarCollapsed, setToolbarCollapsed] = usePersistentBoolean(TOOLBAR_COLLAPSED_STORAGE_KEY);

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

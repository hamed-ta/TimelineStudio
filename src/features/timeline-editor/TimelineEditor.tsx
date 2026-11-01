import { useAppLocale } from "../../app/providers/AppLocaleProvider";
import { useEffect } from "react";
import { usePersistentBoolean } from "../../shared/hooks/usePersistentBoolean";
import { BrandMark } from "../../shared/brand/BrandMark";
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
const INFO_PANEL_COLLAPSED_STORAGE_KEY = "timeline-studio-info-panel-collapsed";

export function TimelineEditor() {
  const { t } = useAppLocale();
  useEffect(() => { void import("./legacyTimelineEditor.js"); }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = usePersistentBoolean(SIDEBAR_COLLAPSED_STORAGE_KEY);
  const [infoPanelCollapsed, setInfoPanelCollapsed] = usePersistentBoolean(INFO_PANEL_COLLAPSED_STORAGE_KEY);

  return (
    <>
      <div className="app-shell">
        <TimelineHeader />

        <main className="workspace" data-sidebar-collapsed={sidebarCollapsed ? "true" : "false"}>
          <EditorSidebar
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((collapsed) => !collapsed)}
          />

          <section className="timeline-stage" id="timelineStage" aria-label={t("timeline_canvas")}>
            <TimelineToolbar />
            <TimelineCanvas />
            <LineEditorPopover />
            <TimelineContextMenu />
            <TimelineInfoPanel
              collapsed={infoPanelCollapsed}
              onToggleCollapsed={() => setInfoPanelCollapsed((collapsed) => !collapsed)}
            />
          </section>
        </main>

        <footer className="app-footer" aria-label={t("app_information")}>
          <span className="app-footer-brand"><BrandMark />{__APP_NAME__}</span>
          <span className="app-footer-divider" aria-hidden="true"></span>
          <span className="app-footer-version">{t("version", { value: __APP_VERSION__ })}</span>
        </footer>
      </div>

      <input id="fileInput" type="file" accept="application/json,.json" hidden />
    </>
  );
}

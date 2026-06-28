import { AppThemeProvider } from "./providers/AppThemeProvider";
import { TimelineEditor } from "../features/timeline-editor/TimelineEditor";

export function App() {
  return (
    <AppThemeProvider>
      <TimelineEditor />
    </AppThemeProvider>
  );
}

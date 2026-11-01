import { AppLocaleProvider } from "./providers/AppLocaleProvider";
import { AppThemeProvider } from "./providers/AppThemeProvider";
import { TimelineEditor } from "../features/timeline-editor/TimelineEditor";

export function App() {
  return (
    <AppLocaleProvider>
    <AppThemeProvider>
      <TimelineEditor />
    </AppThemeProvider>
    </AppLocaleProvider>
  );
}

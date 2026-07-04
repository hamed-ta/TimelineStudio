import { Typography } from "antd";

export function TimelineHeader() {
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
        <Typography.Title level={2} id="stageTitle">
          New Timeline
        </Typography.Title>
        <span className="separator" aria-hidden="true"></span>
        <Typography.Text id="stageMeta" type="secondary">
          Create or load a timeline
        </Typography.Text>
        <span className="separator" aria-hidden="true"></span>
        <p className="file-state" id="fileState" aria-live="polite">
          <span id="fileNameLabel">No file selected</span>
          <span className="dirty-indicator" id="dirtyIndicator" hidden>
            Unsaved changes
          </span>
        </p>
      </div>
    </header>
  );
}

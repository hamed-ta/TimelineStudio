export function TimelineCanvas() {
  return (
    <div className="timeline-canvas-shell">
      <div className="timeline-cursor-readout" id="timelineCursorReadout" hidden aria-hidden="true">
        <div className="timeline-cursor-card" id="timelineCursorCard">
          <strong id="cursorAgoLabel"></strong>
          <span id="cursorAgeLabel"></span>
          <span id="cursorDateLabel"></span>
        </div>
      </div>
      <div className="timeline-viewport" id="timelineViewport" tabIndex={0}>
        <svg id="timelineSvg" role="img" aria-labelledby="stageTitle stageMeta"></svg>
        <textarea id="noteInlineEditor" className="note-inline-editor" hidden aria-label="Edit note text"></textarea>
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
      <div
        className="timeline-height-grip"
        id="timelineHeightGrip"
        role="separator"
        aria-label="Resize timeline height"
        aria-controls="timelineViewport"
        aria-orientation="horizontal"
        tabIndex={0}
      >
        <span aria-hidden="true"></span>
      </div>
    </div>
  );
}

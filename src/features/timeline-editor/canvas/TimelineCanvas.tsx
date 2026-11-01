import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
export function TimelineCanvas() {
  const { t, direction } = useAppLocale();
  return (
    <div className="timeline-canvas-shell">
      <div className="timeline-cursor-readout" id="timelineCursorReadout" hidden aria-hidden="true">
        <div className="timeline-cursor-card" id="timelineCursorCard">
          <strong id="cursorAgoLabel"></strong>
          <span id="cursorAgeLabel"></span>
          <span id="cursorDateLabel"></span>
        </div>
      </div>
      <div className="timeline-viewport" id="timelineViewport" dir="ltr" tabIndex={0}>
        <svg direction="ltr" id="timelineSvg" role="img" aria-labelledby="stageTitle stageMeta"></svg>
        <textarea id="noteInlineEditor" className="note-inline-editor" hidden aria-label={t("edit_note_text")}></textarea>
        <div dir={direction} className="timeline-empty-state" id="timelineEmptyState" hidden>
          <div className="empty-state-mark" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <strong>{t("empty_title")}</strong>
          <p>{t("empty_help")}</p>
        </div>
      </div>
      <div
        className="timeline-height-grip"
        id="timelineHeightGrip"
        role="separator"
        aria-label={t("resize_height")}
        aria-controls="timelineViewport"
        aria-orientation="horizontal"
        tabIndex={0}
      >
        <span aria-hidden="true"></span>
      </div>
    </div>
  );
}

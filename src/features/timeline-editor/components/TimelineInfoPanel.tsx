export function TimelineInfoPanel() {
  return (
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
  );
}

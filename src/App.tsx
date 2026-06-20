export function App() {
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

          <div className="toolbar" role="toolbar" aria-label="Timeline actions">
            <button type="button" className="toolbar-button" data-add="event">
              Event
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

          <div className="zoom-tools">
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

        <main className="workspace">
          <aside className="inspector" aria-label="Timeline editor">
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
                    <option value="event">Event</option>
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
          </aside>

          <section className="timeline-stage" aria-label="Timeline canvas">
            <div className="stage-header">
              <div>
                <h2 id="stageTitle">New Timeline</h2>
                <p id="stageMeta">Create or load a timeline</p>
              </div>
              <button type="button" className="secondary-button" id="fitButton">
                Fit
              </button>
            </div>

            <div className="timeline-viewport" id="timelineViewport" tabIndex={0}>
              <svg id="timelineSvg" role="img" aria-labelledby="stageTitle stageMeta"></svg>
            </div>
          </section>
        </main>
      </div>

      <input id="fileInput" type="file" accept="application/json,.json" hidden />
    </>
  );
}

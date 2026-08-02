import { Button, Card, Typography } from "antd";
import {
  CALENDAR_REGISTRY,
  isCalendarSupported as isCalendarRuntimeSupported,
} from "../../../timeline/calendarRegistry";
import {
  type TimelineSecondaryCalendar,
} from "../../../timeline/calendars";
import { ColorPickerField } from "./ColorPickerField";
import { FieldLabel } from "./FieldLabel";
import { MenuFoldIcon, MenuUnfoldIcon } from "./PanelToggleIcons";

const CALENDAR_OPTION_LABELS = {
  iranian: "Persian / Solar Hijri",
  "islamic-umalqura": "Islamic / Umm al-Qura",
  hebrew: "Hebrew",
  buddhist: "Buddhist",
  japanese: "Japanese",
  indian: "Indian / Saka",
} satisfies Record<TimelineSecondaryCalendar, string>;

export function EditorSidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <aside className="inspector" aria-label="Timeline editor">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <span className="sidebar-title-kicker">Editor</span>
          <strong>Timeline</strong>
        </div>
        <div className="sidebar-actions">
          <Button
            htmlType="button"
            className="icon-button panel-toggle-button"
            data-collapsed={collapsed ? "true" : "false"}
            aria-expanded={!collapsed}
            aria-controls="editorPanels"
            aria-label={collapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
            title={collapsed ? "Expand editor sidebar" : "Collapse editor sidebar"}
            onClick={onToggleCollapsed}
          >
            <span className="toggle-icon-stack" aria-hidden="true">
              <MenuFoldIcon active={!collapsed} />
              <MenuUnfoldIcon active={collapsed} />
            </span>
          </Button>
        </div>
      </div>

      <div id="editorPanels" className="sidebar-panels">
        <Card
          className="panel"
          size="small"
          title={<Typography.Title level={2}>Timeline</Typography.Title>}
        >
          <FieldLabel label="Title">
            <input id="timelineTitleInput" className="ant-input legacy-input" type="text" autoComplete="off" />
          </FieldLabel>

          <div className="field-grid">
            <FieldLabel label="Start date">
              <input id="startDateInput" className="ant-input legacy-input" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
            </FieldLabel>
            <FieldLabel label="End date">
              <input id="endDateInput" className="ant-input legacy-input" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
            </FieldLabel>
          </div>

          <label className="check-row">
            <input id="autoEndDateInput" className="legacy-checkbox" type="checkbox" />
            <span>End at today</span>
          </label>

          <FieldLabel label="Drag snap">
            <select id="snapInput" className="legacy-select">
              <option value="year">1 year</option>
              <option value="month">1 month</option>
              <option value="week">1 week</option>
              <option value="day">1 day</option>
            </select>
          </FieldLabel>

          <fieldset className="calendar-display-field">
            <legend>Display calendars</legend>
            <label className="check-row">
              <input id="displayGregorianInput" className="legacy-checkbox" type="checkbox" defaultChecked />
              <span>Gregorian</span>
            </label>
            <FieldLabel label="Secondary calendar">
              <select id="secondaryCalendarInput" className="legacy-select" defaultValue="">
                <option value="">None</option>
                {Object.values(CALENDAR_REGISTRY).map(({ id }) => (
                  <option key={id} value={id} disabled={!isCalendarRuntimeSupported(id)}>
                    {CALENDAR_OPTION_LABELS[id]}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <p id="calendarSupportWarning" className="calendar-support-warning" role="status" hidden>
              The selected secondary calendar is not supported by this browser. Showing Gregorian dates instead.
            </p>
          </fieldset>
        </Card>

        <Card
          className="panel"
          size="small"
          title={<Typography.Title level={2}>Item</Typography.Title>}
          extra={
            <Button htmlType="button" danger type="text" className="quiet-button danger" id="deleteItemButton">
              Delete
            </Button>
          }
        >
          <form id="itemForm">
            <FieldLabel label="Type">
              <select id="itemTypeInput" className="legacy-select">
                <option value="birth">Birth</option>
                <option value="event">Event</option>
                <option value="marker">Marker</option>
                <option value="note">Note</option>
                <option value="period">Period</option>
                <option value="line">Line</option>
                <option value="text">Text</option>
              </select>
            </FieldLabel>

            <FieldLabel id="itemTitleField" label="Title">
              <input id="itemTitleInput" className="ant-input legacy-input" type="text" autoComplete="off" />
            </FieldLabel>

            <div className="field-grid">
              <FieldLabel label="Lane">
                <input id="itemLaneInput" className="ant-input legacy-input" type="number" min="0" max="20" step="1" />
              </FieldLabel>
              <div className="color-field" id="itemColorField">
                <ColorPickerField label="Color" prefix="item" paletteLabel="Preset item colors" />
              </div>
              <div className="color-field" id="itemTextColorField" hidden>
                <ColorPickerField label="Text" prefix="itemText" paletteLabel="Preset note text colors" />
              </div>
              <FieldLabel label="Start date">
                <input id="itemStartInput" className="ant-input legacy-input" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
              </FieldLabel>
              <FieldLabel id="itemEndField" label="End date">
                <input id="itemEndInput" className="ant-input legacy-input" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
              </FieldLabel>
            </div>
            <p className="calendar-preview" id="itemCalendarPreview"></p>

            <div className="derived-label-options" id="itemDerivedLabelsField">
              <label className="check-row">
                <input id="itemAgeLabelsInput" className="legacy-checkbox" type="checkbox" defaultChecked />
                <span>Show age at start and end</span>
              </label>
              <label className="check-row">
                <input id="itemDurationLabelInput" className="legacy-checkbox" type="checkbox" defaultChecked />
                <span>Show duration</span>
              </label>
            </div>

            <FieldLabel id="itemNotesField" label="Notes">
              <textarea
                id="itemNotesInput"
                className="ant-input note-textarea"
                rows={8}
                dir="auto"
                placeholder="Write the note text shown in the balloon."
              />
            </FieldLabel>

            <div className="form-actions">
              <Button htmlType="submit" type="primary" className="primary-button">
                Apply
              </Button>
              <Button htmlType="button" className="secondary-button" id="duplicateItemButton">
                Duplicate
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </aside>
  );
}

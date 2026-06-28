import { Button, Card, Input, Typography } from "antd";
import { ColorPickerField } from "./ColorPickerField";
import { FieldLabel } from "./FieldLabel";
import { MenuFoldIcon, MenuUnfoldIcon } from "./PanelToggleIcons";

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
            <Input id="timelineTitleInput" type="text" autoComplete="off" />
          </FieldLabel>

          <div className="field-grid">
            <FieldLabel label="Start date">
              <Input id="startDateInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
            </FieldLabel>
            <FieldLabel label="End date">
              <Input id="endDateInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
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
              <Input id="itemTitleInput" type="text" autoComplete="off" />
            </FieldLabel>

            <div className="field-grid">
              <FieldLabel label="Lane">
                <Input id="itemLaneInput" type="number" min="0" max="20" step="1" />
              </FieldLabel>
              <div className="color-field" id="itemColorField">
                <ColorPickerField label="Color" prefix="item" paletteLabel="Preset item colors" />
              </div>
              <div className="color-field" id="itemTextColorField" hidden>
                <ColorPickerField label="Text" prefix="itemText" paletteLabel="Preset note text colors" />
              </div>
              <FieldLabel label="Start date">
                <Input id="itemStartInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
              </FieldLabel>
              <FieldLabel id="itemEndField" label="End date">
                <Input id="itemEndInput" type="text" inputMode="numeric" placeholder="YYYY-MM-DD" autoComplete="off" />
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

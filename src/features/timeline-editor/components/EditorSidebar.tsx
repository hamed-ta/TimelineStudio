import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
import { calendarLabel } from "../../../i18n/presentation";
import { Button, Card, Typography } from "antd";
import {
  CALENDAR_REGISTRY,
  isCalendarSupported as isCalendarRuntimeSupported,
} from "../../../timeline/calendarRegistry";
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
  const { t } = useAppLocale();
  return (
    <aside className="inspector" aria-label={t("timeline_editor")}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          <strong>{t("timeline")}</strong>
        </div>
        <div className="sidebar-actions">
          <Button
            htmlType="button"
            className="icon-button panel-toggle-button"
            data-collapsed={collapsed ? "true" : "false"}
            aria-expanded={!collapsed}
            aria-controls="editorPanels"
            aria-label={collapsed ? t("expand_sidebar") : t("collapse_sidebar")}
            title={collapsed ? t("expand_sidebar") : t("collapse_sidebar")}
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
          title={<Typography.Title level={2}>{t("timeline")}</Typography.Title>}
        >
          <FieldLabel label={t("title")}>
            <input id="timelineTitleInput" className="ant-input legacy-input" type="text" dir="auto" autoComplete="off" />
          </FieldLabel>

          <div className="field-grid">
            <FieldLabel label={t("start_date")}>
              <input id="startDateInput" className="ant-input legacy-input" type="text" inputMode="numeric" dir="ltr" placeholder="YYYY-MM-DD" autoComplete="off" />
            </FieldLabel>
            <FieldLabel label={t("end_date")}>
              <input id="endDateInput" className="ant-input legacy-input" type="text" inputMode="numeric" dir="ltr" placeholder="YYYY-MM-DD" autoComplete="off" />
            </FieldLabel>
          </div>

          <label className="check-row">
            <input id="autoEndDateInput" className="legacy-checkbox" type="checkbox" />
            <span>{t("end_today")}</span>
          </label>

          <FieldLabel label={t("snap")}>
            <select id="snapInput" className="legacy-select">
              <option value="year">{t("one_year")}</option>
              <option value="month">{t("one_month")}</option>
              <option value="week">{t("one_week")}</option>
              <option value="day">{t("one_day")}</option>
            </select>
          </FieldLabel>

          <fieldset className="calendar-display-field">
            <legend>{t("calendars")}</legend>
            <label className="check-row">
              <input id="displayGregorianInput" className="legacy-checkbox" type="checkbox" defaultChecked />
              <span>{t("calendar_gregorian")}</span>
            </label>
            <FieldLabel label={t("secondary_calendar")}>
              <select id="secondaryCalendarInput" className="legacy-select" defaultValue="">
                <option value="">{t("none")}</option>
                {Object.values(CALENDAR_REGISTRY).map(({ id }) => (
                  <option key={id} value={id} disabled={!isCalendarRuntimeSupported(id)}>
                    {calendarLabel(id)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <p id="calendarSupportWarning" className="calendar-support-warning" role="status" hidden>
              {t("calendar_warning")}
            </p>
          </fieldset>
        </Card>

        <Card
          className="panel"
          size="small"
          title={<Typography.Title level={2}>{t("item")}</Typography.Title>}
          extra={
            <Button htmlType="button" danger type="text" className="quiet-button danger" id="deleteItemButton">
              {t("delete")}
            </Button>
          }
        >
          <form id="itemForm">
            <FieldLabel label={t("type")}>
              <select id="itemTypeInput" className="legacy-select">
                <option value="birth">{t("birth")}</option>
                <option value="event">{t("event")}</option>
                <option value="marker">{t("marker")}</option>
                <option value="note">{t("note")}</option>
                <option value="period">{t("period")}</option>
                <option value="line">{t("line")}</option>
                <option value="text">{t("text")}</option>
              </select>
            </FieldLabel>

            <FieldLabel id="itemTitleField" label={t("title")}>
              <input id="itemTitleInput" className="ant-input legacy-input" type="text" dir="auto" autoComplete="off" />
            </FieldLabel>

            <div className="field-grid">
              <FieldLabel label={t("lane")}>
                <input id="itemLaneInput" className="ant-input legacy-input" type="number" min="0" max="20" step="1" />
              </FieldLabel>
              <div className="color-field" id="itemColorField">
                <ColorPickerField label={t("color")} prefix="item" paletteLabel={t("preset_item_colors")} />
              </div>
              <div className="color-field" id="itemTextColorField" hidden>
                <ColorPickerField label={t("text")} prefix="itemText" paletteLabel={t("preset_text_colors")} />
              </div>
              <FieldLabel label={t("start_date")}>
                <input id="itemStartInput" className="ant-input legacy-input" type="text" inputMode="numeric" dir="ltr" placeholder="YYYY-MM-DD" autoComplete="off" />
              </FieldLabel>
              <FieldLabel id="itemEndField" label={t("end_date")}>
                <input id="itemEndInput" className="ant-input legacy-input" type="text" inputMode="numeric" dir="ltr" placeholder="YYYY-MM-DD" autoComplete="off" />
              </FieldLabel>
            </div>
            <p className="calendar-preview" id="itemCalendarPreview"></p>

            <div className="derived-label-options" id="itemDerivedLabelsField">
              <label className="check-row">
                <input id="itemAgeLabelsInput" className="legacy-checkbox" type="checkbox" defaultChecked />
                <span>{t("show_ages")}</span>
              </label>
              <label className="check-row">
                <input id="itemDurationLabelInput" className="legacy-checkbox" type="checkbox" defaultChecked />
                <span>{t("show_duration")}</span>
              </label>
            </div>

            <FieldLabel id="itemNotesField" label={t("notes")}>
              <textarea
                id="itemNotesInput"
                className="ant-input note-textarea"
                rows={8}
                dir="auto"
                placeholder={t("note_placeholder")}
              />
            </FieldLabel>

            <div className="form-actions">
              <Button htmlType="submit" type="primary" className="primary-button">
                {t("apply")}
              </Button>
              <Button htmlType="button" className="secondary-button" id="duplicateItemButton">
                {t("duplicate")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </aside>
  );
}

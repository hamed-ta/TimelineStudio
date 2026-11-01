import { useAppLocale } from "../../../app/providers/AppLocaleProvider";
import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { ColorPickerField } from "./ColorPickerField";
import { FieldLabel } from "./FieldLabel";

export function LineEditorPopover() {
  const { t } = useAppLocale();
  return (
    <div className="line-editor-popover" id="lineEditorPopover" hidden>
      <form id="lineEditorForm">
        <div className="line-editor-heading">
          <strong id="lineEditorTitle">{t("line")}</strong>
          <Button htmlType="button" className="icon-button line-editor-close" id="lineEditorCloseButton" aria-label={t("close_line_editor")} icon={<CloseOutlined />} />
        </div>
        <FieldLabel label={t("name")}>
          <input id="lineNameInput" className="ant-input legacy-input" type="text" dir="auto" autoComplete="off" />
        </FieldLabel>
        <ColorPickerField label={t("background")} prefix="line" paletteLabel={t("preset_line_colors")} />
        <div className="line-editor-actions">
          <Button htmlType="submit" type="primary" className="primary-button">{t("apply")}</Button>
          <Button htmlType="button" className="secondary-button" id="lineColorClearButton">{t("clear_color")}</Button>
          <Button htmlType="button" className="secondary-button" id="lineAddBelowButton">{t("add_below")}</Button>
          <Button htmlType="button" danger type="text" className="quiet-button danger" id="lineRemoveButton">{t("remove")}</Button>
        </div>
      </form>
    </div>
  );
}

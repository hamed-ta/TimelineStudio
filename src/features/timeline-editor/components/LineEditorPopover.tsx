import { CloseOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { ColorPickerField } from "./ColorPickerField";
import { FieldLabel } from "./FieldLabel";

export function LineEditorPopover() {
  return (
    <div className="line-editor-popover" id="lineEditorPopover" hidden>
      <form id="lineEditorForm">
        <div className="line-editor-heading">
          <strong id="lineEditorTitle">Line</strong>
          <Button htmlType="button" className="icon-button line-editor-close" id="lineEditorCloseButton" aria-label="Close line editor" icon={<CloseOutlined />} />
        </div>
        <FieldLabel label="Name">
          <Input id="lineNameInput" type="text" autoComplete="off" />
        </FieldLabel>
        <ColorPickerField label="Background" prefix="line" paletteLabel="Preset line background colors" />
        <div className="line-editor-actions">
          <Button htmlType="submit" type="primary" className="primary-button">Apply</Button>
          <Button htmlType="button" className="secondary-button" id="lineColorClearButton">Clear color</Button>
          <Button htmlType="button" className="secondary-button" id="lineAddBelowButton">Add below</Button>
          <Button htmlType="button" danger type="text" className="quiet-button danger" id="lineRemoveButton">Remove</Button>
        </div>
      </form>
    </div>
  );
}

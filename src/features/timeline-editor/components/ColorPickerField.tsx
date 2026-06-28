import { BgColorsOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";

export function ColorPickerField({
  label,
  prefix,
  paletteLabel,
}: {
  label: string;
  prefix: "item" | "itemText" | "line";
  paletteLabel: string;
}) {
  const inputId = `${prefix}ColorInput`;
  const triggerId = `${prefix}ColorTrigger`;
  const previewId = `${prefix}ColorPreview`;
  const valueId = `${prefix}ColorValue`;
  const panelId = `${prefix}ColorPanel`;
  const planeId = `${prefix}ColorPlane`;
  const markerId = `${prefix}ColorPlaneMarker`;
  const hueId = `${prefix}ColorHueInput`;
  const hexId = `${prefix}ColorHexInput`;
  const paletteId = `${prefix}ColorPalette`;

  return (
    <div className="color-picker-field">
      <span className="field-caption">{label}</span>
      <div className="color-picker" data-color-picker={prefix}>
        <input id={inputId} type="hidden" />
        <Button
          htmlType="button"
          className="color-picker-trigger"
          id={triggerId}
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls={panelId}
          icon={<BgColorsOutlined />}
        >
          <span className="color-picker-preview" id={previewId} aria-hidden="true"></span>
          <span className="color-picker-value" id={valueId}>#2563EB</span>
        </Button>
        <div className="color-picker-panel" id={panelId} role="dialog" aria-label={`${label} picker`} hidden>
          <div
            className="color-picker-plane"
            id={planeId}
            role="slider"
            tabIndex={0}
            aria-label={`${label} saturation and brightness`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={100}
          >
            <span className="color-picker-plane-marker" id={markerId}></span>
          </div>
          <label className="color-picker-range">
            Hue
            <input id={hueId} type="range" min={0} max={360} defaultValue={220} aria-label={`${label} hue`} />
          </label>
          <label className="color-picker-hex-row">
            Hex
            <Input id={hexId} type="text" inputMode="text" maxLength={7} spellCheck={false} aria-label={`${label} hex color`} />
          </label>
          <div className="color-swatch-grid" id={paletteId} role="group" aria-label={paletteLabel}></div>
        </div>
      </div>
    </div>
  );
}

import { graphemes } from "../../../shared/text.ts";
const DEFAULT_CHAR_WIDTH = 7.2;
let measureContext: CanvasRenderingContext2D | null | undefined;

export function estimateSvgTextWidth(text: unknown, charWidth = DEFAULT_CHAR_WIDTH): number {
  const value = String(text || "");
  if (typeof document !== "undefined") {
    measureContext ??= document.createElement("canvas").getContext("2d");
    if (measureContext) {
      measureContext.font = `500 ${charWidth / 0.6}px ${getComputedStyle(document.body).fontFamily}`;
      return measureContext.measureText(value).width;
    }
  }
  return graphemes(value).length * charWidth;
}

export function fitSvgText(text: unknown, maxWidth: number, charWidth = DEFAULT_CHAR_WIDTH): string {
  const value = String(text || "");
  if (maxWidth <= 0) return "";
  if (estimateSvgTextWidth(value, charWidth) <= maxWidth) return value;
  const clusters = graphemes(value);
  while (clusters.length && estimateSvgTextWidth(`${clusters.join("")}...`, charWidth) > maxWidth) clusters.pop();
  return estimateSvgTextWidth("...", charWidth) <= maxWidth ? `${clusters.join("")}...` : "";
}

export function safeSvgId(value: unknown): string {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
}

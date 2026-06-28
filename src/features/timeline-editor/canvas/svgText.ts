const DEFAULT_CHAR_WIDTH = 7.2;

export function estimateSvgTextWidth(text: unknown, charWidth = DEFAULT_CHAR_WIDTH): number {
  return String(text || "").length * charWidth;
}

export function fitSvgText(text: unknown, maxWidth: number, charWidth = DEFAULT_CHAR_WIDTH): string {
  const value = String(text || "");
  if (maxWidth <= 0) return "";
  const estimatedWidth = estimateSvgTextWidth(value, charWidth);
  if (estimatedWidth <= maxWidth) return value;
  const maxChars = Math.max(3, Math.floor(maxWidth / charWidth) - 3);
  return `${value.slice(0, maxChars)}...`;
}

export function safeSvgId(value: unknown): string {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
}

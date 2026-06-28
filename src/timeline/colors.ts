export const DEFAULT_ITEM_COLOR = "#3b82f6";

export type RgbColor = {
  red: number;
  green: number;
  blue: number;
};

export type HsvColor = {
  h: number;
  s: number;
  v: number;
};

export function parseHexColor(value: unknown): string | null {
  const text = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(text)) return text.toLowerCase();
  if (/^[0-9a-fA-F]{6}$/.test(text)) return `#${text.toLowerCase()}`;
  return null;
}

export function normalizeColor(value: unknown): string {
  return parseHexColor(value) || DEFAULT_ITEM_COLOR;
}

export function normalizeOptionalColor(value: unknown): string {
  return parseHexColor(value) || "";
}

export function readableTextColor(hex: unknown): string {
  const { red, green, blue } = hexToRgb(normalizeColor(hex));
  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance > 0.56 ? "#1d2732" : "#ffffff";
}

export function adjustColor(hex: unknown, amount: number): string {
  const { red, green, blue } = hexToRgb(normalizeColor(hex));
  return rgbToHex(red + amount, green + amount, blue + amount);
}

export function hexToRgb(hex: unknown): RgbColor {
  const clean = normalizeColor(hex).slice(1);
  return {
    red: parseInt(clean.slice(0, 2), 16),
    green: parseInt(clean.slice(2, 4), 16),
    blue: parseInt(clean.slice(4, 6), 16),
  };
}

export function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((value) => Math.round(clampNumber(value, 0, 255)).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function hexToHsv(hex: unknown): HsvColor {
  const { red, green, blue } = hexToRgb(hex);
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;

  return {
    h: hue,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
}

export function hsvToHex(hue: number, saturation: number, value: number): string {
  const h = ((Number(hue) % 360) + 360) % 360;
  const s = clampNumber(Number(saturation), 0, 100) / 100;
  const v = clampNumber(Number(value), 0, 100) / 100;
  const chroma = v * s;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) [red, green, blue] = [chroma, x, 0];
  else if (h < 120) [red, green, blue] = [x, chroma, 0];
  else if (h < 180) [red, green, blue] = [0, chroma, x];
  else if (h < 240) [red, green, blue] = [0, x, chroma];
  else if (h < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return rgbToHex((red + m) * 255, (green + m) * 255, (blue + m) * 255);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

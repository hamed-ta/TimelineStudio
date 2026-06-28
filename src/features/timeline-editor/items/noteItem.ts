import {
  adjustColor,
  normalizeOptionalColor,
  readableTextColor,
} from "../../../timeline/colors.ts";
import {
  wrapNoteTextLines,
} from "../layout/noteLayout.ts";

const NOTE_FALLBACK_TITLE = "Note";

export type NoteSizeOptions = {
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  paddingX: number;
  tipHeight: number;
  textVerticalPadding: number;
  lineHeight: number;
  measureText: (text: string) => number;
};

type NoteLike = {
  color: string;
  notes: string;
  title: string;
  textColor?: string;
  noteWidth?: number;
  noteHeight?: number;
};

export function noteDisplayText(item: Pick<NoteLike, "notes" | "title">): string {
  return String(item.notes || item.title || NOTE_FALLBACK_TITLE).trim() || NOTE_FALLBACK_TITLE;
}

export function noteTitleFromText(text: string): string {
  const firstLine = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean);
  if (!firstLine) return NOTE_FALLBACK_TITLE;
  return firstLine.length > 80 ? `${firstLine.slice(0, 77)}...` : firstLine;
}

export function noteTextColorForItem(item: Pick<NoteLike, "color" | "textColor">): string {
  return normalizeOptionalColor(item.textColor) || readableTextColor(item.color);
}

export function noteBorderColor(color: string): string {
  return adjustColor(color, 34);
}

export function noteSizeForItem(item: NoteLike, options: NoteSizeOptions): { width: number; height: number } {
  const text = noteDisplayText(item);
  const naturalWidth = Math.min(
    options.maxWidth,
    Math.max(options.defaultWidth, longestNoteLineWidth(text, options.measureText) + options.paddingX * 2),
  );
  const width = clampNumber(
    hasFiniteNumber(item.noteWidth) ? Number(item.noteWidth) : naturalWidth,
    options.minWidth,
    options.maxWidth,
  );
  const naturalLineCount = wrapNoteTextLines(text, width - options.paddingX * 2, options.measureText).length;
  const naturalHeight = options.tipHeight + options.textVerticalPadding * 2 + naturalLineCount * options.lineHeight;
  const height = clampNumber(
    hasFiniteNumber(item.noteHeight) ? Number(item.noteHeight) : Math.max(options.defaultHeight, naturalHeight),
    options.minHeight,
    options.maxHeight,
  );
  return { width, height };
}

export function hasFiniteNumber(value: unknown): boolean {
  return Number.isFinite(Number(value));
}

function longestNoteLineWidth(text: string, measureText: (text: string) => number): number {
  return String(text || "")
    .split(/\r?\n/)
    .reduce((max, line) => Math.max(max, measureText(line)), 0);
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

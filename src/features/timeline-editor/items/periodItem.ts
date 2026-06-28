import {
  formatAgeAtDate,
  formatCompactDateSpan,
} from "../../../timeline/dateSpans.ts";

export type PeriodDerivedMeta = {
  startAge: string;
  endAge: string;
  duration: string;
};

export type PeriodDerivedMetaOptions = {
  ageMinWidth?: number;
  durationMinWidth?: number;
};

type PeriodLike = {
  type: string;
  startDate: string;
  endDate: string;
  showAgeLabels?: boolean;
  showDurationLabel?: boolean;
};

export function periodDerivedMeta(
  item: PeriodLike,
  width: number,
  birthDate?: string | null,
  options: PeriodDerivedMetaOptions = {},
): PeriodDerivedMeta | null {
  if (item.type !== "period") return null;

  const ageMinWidth = options.ageMinWidth ?? 230;
  const durationMinWidth = options.durationMinWidth ?? 150;
  const showAges = item.showAgeLabels !== false && width >= ageMinWidth;
  const showDuration = item.showDurationLabel !== false && width >= durationMinWidth;
  if (!showAges && !showDuration) return null;

  const meta = {
    startAge: showAges && birthDate ? formatAgeAtDate(birthDate, item.startDate) : "",
    endAge: showAges && birthDate ? formatAgeAtDate(birthDate, item.endDate) : "",
    duration: showDuration ? formatCompactDateSpan(item.startDate, item.endDate) : "",
  };

  return meta.startAge || meta.endAge || meta.duration ? meta : null;
}

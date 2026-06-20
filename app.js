import {
  addDaysIso,
  addMonthsIso,
  addYearsIso,
  clamp,
  clampIso,
  compareIso,
  daysBetween,
  isoDay,
  isoFromParts,
  isoMonth,
  isoYear,
  monthsBetween,
  normalizeDateInput,
  normalizeSnap,
  todayIso,
  toNumber,
  yearStartIso,
} from "./src/timeline/dates";
import {
  ITEM_COLOR_PALETTE,
  TYPE_COLORS,
  createEmptyTimeline,
  hasEndYear,
  isGlobalTimelineItemType,
  normalizeItem,
  normalizeTimeline,
  titleForType,
} from "./src/timeline/model";
import {
  TIMELINE_JSON_MIME,
  parseTimelineJson,
  serializeTimelineJson,
} from "./src/timeline/json";
import {
  formatDatePair,
  formatDisplayDate,
  formatIranianDate,
  formatZoomValue,
  iranianMonthName,
  monthName,
} from "./src/timeline/formatters";
import {
  buildPdfFromJpeg,
} from "./src/timeline/pdf";
import {
  serializeTimelineSvg,
} from "./src/timeline/svgExport";
import {
  canPickFileWithPicker,
  downloadBlob,
  pickFileWithPicker,
  saveBlobToHandle,
  saveBlobWithPicker,
} from "./src/platform/files";
import {
  canvasToBlob,
  loadImage,
} from "./src/platform/media";

(() => {
  const ZOOM_KEY = "timeline-studio-zoom-v2";
  const NS = "http://www.w3.org/2000/svg";
  const LEFT_GUTTER = 132;
  const RIGHT_GUTTER = 110;
  const AXIS_HEIGHT = 112;
  const FOOTER_HEIGHT = 34;
  const NOTE_AREA_HEIGHT = 76;
  const DEFAULT_ROW_HEIGHT = 68;
  const AXIS_LABEL_CHAR_WIDTH = 7.2;
  const AXIS_MONTH_LABEL_GAP = 14;
  const AXIS_DAY_LABEL_GAP = 8;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 360;
  const DEFAULT_ZOOM = 18;
  const FIT_MIN_ZOOM = DEFAULT_ZOOM;
  const EDGE_SNAP_PIXELS = 14;
  const EDGE_SNAP_MAX_DAYS = 14;
  const AVG_DAYS_PER_MONTH = 365.2425 / 12;
  const TIMELINE_JSON_FILE_TYPE = {
    description: "Timeline JSON",
    accept: { "application/json": [".json"] },
  };
  const dom = {
    statusText: document.getElementById("statusText"),
    timelineTitleInput: document.getElementById("timelineTitleInput"),
    startDateInput: document.getElementById("startDateInput"),
    endDateInput: document.getElementById("endDateInput"),
    autoEndDateInput: document.getElementById("autoEndDateInput"),
    itemsLockedInput: document.getElementById("itemsLockedInput"),
    snapInput: document.getElementById("snapInput"),
    laneList: document.getElementById("laneList"),
    addLaneButton: document.getElementById("addLaneButton"),
    itemForm: document.getElementById("itemForm"),
    itemTypeInput: document.getElementById("itemTypeInput"),
    itemTitleInput: document.getElementById("itemTitleInput"),
    itemLaneInput: document.getElementById("itemLaneInput"),
    itemColorInput: document.getElementById("itemColorInput"),
    itemColorPalette: document.getElementById("itemColorPalette"),
    itemStartInput: document.getElementById("itemStartInput"),
    itemEndInput: document.getElementById("itemEndInput"),
    itemEndField: document.getElementById("itemEndField"),
    itemDerivedLabelsField: document.getElementById("itemDerivedLabelsField"),
    itemAgeLabelsInput: document.getElementById("itemAgeLabelsInput"),
    itemDurationLabelInput: document.getElementById("itemDurationLabelInput"),
    itemCalendarPreview: document.getElementById("itemCalendarPreview"),
    itemNotesInput: document.getElementById("itemNotesInput"),
    deleteItemButton: document.getElementById("deleteItemButton"),
    duplicateItemButton: document.getElementById("duplicateItemButton"),
    saveJsonButton: document.getElementById("saveJsonButton"),
    loadJsonButton: document.getElementById("loadJsonButton"),
    exportSvgButton: document.getElementById("exportSvgButton"),
    exportPngButton: document.getElementById("exportPngButton"),
    exportPdfButton: document.getElementById("exportPdfButton"),
    fileInput: document.getElementById("fileInput"),
    zoomRange: document.getElementById("zoomRange"),
    zoomLabel: document.getElementById("zoomLabel"),
    zoomInButton: document.getElementById("zoomInButton"),
    zoomOutButton: document.getElementById("zoomOutButton"),
    fitButton: document.getElementById("fitButton"),
    timelineViewport: document.getElementById("timelineViewport"),
    timelineSvg: document.getElementById("timelineSvg"),
    timelineInfoPanel: document.getElementById("timelineInfoPanel"),
    hoverDateLabel: document.getElementById("hoverDateLabel"),
    hoverIranianLabel: document.getElementById("hoverIranianLabel"),
    hoverAgeLabel: document.getElementById("hoverAgeLabel"),
    selectedItemLabel: document.getElementById("selectedItemLabel"),
    selectedItemDateLabel: document.getElementById("selectedItemDateLabel"),
    selectedItemEndLabel: document.getElementById("selectedItemEndLabel"),
    selectedItemDurationLabel: document.getElementById("selectedItemDurationLabel"),
    selectedItemAgeLabel: document.getElementById("selectedItemAgeLabel"),
    stageTitle: document.getElementById("stageTitle"),
    stageMeta: document.getElementById("stageMeta"),
    fileNameLabel: document.getElementById("fileNameLabel"),
    dirtyIndicator: document.getElementById("dirtyIndicator"),
  };

  let timeline = createEmptyTimeline();
  let selectedId = null;
  let zoom = clamp(Number(localStorage.getItem(ZOOM_KEY)) || DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM);
  let suppressControlEvents = false;
  let dragState = null;
  let sidebarLanePointerDrag = null;
  let currentFileHandle = null;
  let currentFileName = "";
  let hasUnsavedChanges = false;
  let hoverDate = null;
  let lastPaletteColorIndex = -1;

  init();

  function init() {
    timeline = normalizeTimeline(timeline);
    bindEvents();
    setZoom(zoom, { render: false });
    renderAll({ save: false });
    setStatus("Ready");
  }

  function bindEvents() {
    renderItemColorPalette();

    document.querySelectorAll("[data-add]").forEach((button) => {
      button.addEventListener("click", () => addItem(button.dataset.add));
    });

    dom.timelineTitleInput.addEventListener("input", updateTimelineFromControls);
    [dom.startDateInput, dom.endDateInput].forEach((control) => {
      control.addEventListener("change", updateTimelineFromControls);
      control.addEventListener("blur", updateTimelineFromControls);
      control.addEventListener("keydown", handleTimelineDateKeydown);
    });
    dom.autoEndDateInput.addEventListener("change", updateTimelineFromControls);
    dom.itemsLockedInput.addEventListener("change", updateTimelineFromControls);
    dom.snapInput.addEventListener("change", updateTimelineFromControls);
    [dom.itemStartInput, dom.itemEndInput].forEach((control) => {
      control.addEventListener("input", updateItemCalendarPreviewFromInputs);
      control.addEventListener("change", updateItemCalendarPreviewFromInputs);
      control.addEventListener("keydown", handleItemDateKeydown);
    });

    dom.itemTypeInput.addEventListener("change", () => {
      const type = dom.itemTypeInput.value;
      dom.itemEndField.hidden = !hasEndYear(type);
      dom.itemDerivedLabelsField.hidden = type !== "period";
      dom.itemLaneInput.disabled = isGlobalTimelineItemType(type);
      if (isGlobalTimelineItemType(type)) dom.itemLaneInput.value = "0";
      updateItemCalendarPreviewFromInputs();
    });
    dom.itemColorInput.addEventListener("input", handleItemColorInput);
    dom.itemColorInput.addEventListener("change", handleItemColorInput);

    dom.itemForm.addEventListener("submit", (event) => {
      event.preventDefault();
      applyItemForm();
    });

    dom.deleteItemButton.addEventListener("click", deleteSelectedItem);
    dom.duplicateItemButton.addEventListener("click", duplicateSelectedItem);
    dom.addLaneButton.addEventListener("click", addLane);

    dom.saveJsonButton.addEventListener("click", saveJsonFile);
    dom.loadJsonButton.addEventListener("click", openJsonFile);
    dom.fileInput.addEventListener("change", loadJsonFile);
    document.addEventListener("keydown", handleGlobalKeydown);

    dom.exportSvgButton.addEventListener("click", exportSvgFile);
    dom.exportPngButton.addEventListener("click", exportPngFile);
    dom.exportPdfButton.addEventListener("click", exportPdfFile);

    dom.zoomRange.addEventListener("input", () => setZoom(Number(dom.zoomRange.value)));
    dom.zoomInButton.addEventListener("click", () => setZoom(zoom + 20));
    dom.zoomOutButton.addEventListener("click", () => setZoom(zoom - 20));
    dom.fitButton.addEventListener("click", fitTimelineToViewport);

    dom.timelineViewport.addEventListener("wheel", handleViewportWheel, { passive: false });
    dom.timelineViewport.addEventListener("keydown", (event) => {
      if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
        event.preventDefault();
        deleteSelectedItem();
      }
    });

    dom.timelineViewport.addEventListener("pointerdown", beginPointerDrag);
    dom.timelineViewport.addEventListener("pointermove", movePointerDrag);
    dom.timelineViewport.addEventListener("pointermove", updateHoverReadout);
    dom.timelineViewport.addEventListener("pointerleave", hideHoverReadout);
    dom.timelineViewport.addEventListener("pointerup", endPointerDrag);
    dom.timelineViewport.addEventListener("pointercancel", endPointerDrag);
  }

  function renderAll(options = {}) {
    timeline = normalizeTimeline(timeline);
    if (selectedId && !getItem(selectedId)) selectedId = null;

    syncTimelineControls();
    syncItemForm();
    renderLaneControls();
    renderTimeline();
    updateMeta();
    updateTimelineInfoPanel();
    if (options.save !== false) {
      markDirty();
    } else {
      updateFileState();
    }
  }

  function renderTimeline() {
    const svg = dom.timelineSvg;
    svg.replaceChildren();

    const settings = timeline.settings;
    const laneCount = Math.max(
      1,
      settings.laneLabels.length,
      ...timeline.items.map((item) => Math.max(0, Number(item.lane) + 1)),
    );
    const rowHeight = settings.rowHeight || DEFAULT_ROW_HEIGHT;
    const contentEndDate = addDaysIso(settings.endDate, 1);
    const contentWidth = LEFT_GUTTER + daysBetween(settings.startDate, contentEndDate) * pixelsPerDay() + RIGHT_GUTTER;
    const laneAreaBottom = AXIS_HEIGHT + laneCount * rowHeight;
    const noteAreaHeight = timeline.items.some((item) => item.type === "note") ? NOTE_AREA_HEIGHT : 0;
    const contentHeight = laneAreaBottom + noteAreaHeight + FOOTER_HEIGHT;

    svg.setAttribute("width", String(Math.ceil(contentWidth)));
    svg.setAttribute("height", String(Math.ceil(contentHeight)));
    svg.setAttribute("viewBox", `0 0 ${Math.ceil(contentWidth)} ${Math.ceil(contentHeight)}`);

    const defs = svgEl("defs");
    svg.append(defs);
    svg.append(svgEl("rect", { class: "canvas-bg", x: 0, y: 0, width: contentWidth, height: contentHeight }));
    svg.append(svgEl("rect", { class: "axis-band", x: 0, y: 0, width: contentWidth, height: AXIS_HEIGHT }));
    svg.append(svgEl("line", { class: "lane-rule", x1: 0, x2: contentWidth, y1: AXIS_HEIGHT, y2: AXIS_HEIGHT }));

    drawGrid(svg, settings, laneCount, rowHeight, contentHeight);
    drawLaneLabels(svg, settings, laneCount, rowHeight);

    const sortedItems = timeline.items
      .slice()
      .sort((a, b) => a.lane - b.lane || compareIso(a.startDate, b.startDate));
    sortedItems
      .filter((item) => isGlobalTimelineItemType(item.type))
      .forEach((item) => drawItem(svg, defs, item, rowHeight, laneCount, contentWidth, contentHeight));
    sortedItems
      .filter((item) => !isGlobalTimelineItemType(item.type))
      .forEach((item) => drawItem(svg, defs, item, rowHeight, laneCount, contentWidth, contentHeight));
  }

  function drawGrid(svg, settings, laneCount, rowHeight, contentHeight) {
    const startYear = isoYear(settings.startDate);
    const endYear = isoYear(settings.endDate);
    const yearLabelStep = zoom < 13 ? 5 : zoom < 21 ? 2 : 1;
    const contentEndDate = addDaysIso(settings.endDate, 1);
    let lastMonthLabelEnd = -Infinity;
    let lastDayLabelEnd = -Infinity;
    const showDayLabels = zoom >= 180;

    if (zoom >= 92) {
      for (let date = settings.startDate; compareIso(date, contentEndDate) <= 0; date = addDaysIso(date, 1)) {
        const x = dateToX(date);
        svg.append(svgEl("line", { class: "grid-day", x1: x, x2: x, y1: AXIS_HEIGHT, y2: contentHeight }));
        const day = isoDay(date);
        if (showDayLabels && isDayLabelCandidate(day)) {
          lastDayLabelEnd = drawDayAxisLabel(svg, date, x, contentEndDate, lastDayLabelEnd);
        }
      }
    }

    for (let year = startYear; year <= endYear; year += 1) {
      for (let month = 0; month < 12; month += 1) {
        const date = isoFromParts(year, month, 1);
        if (compareIso(date, settings.startDate) < 0 || compareIso(date, contentEndDate) > 0) continue;
        const x = dateToX(date);
        const isYearStart = month === 0;
        svg.append(svgEl("line", { class: isYearStart ? "grid-major" : "grid-minor", x1: x, x2: x, y1: isYearStart ? 0 : AXIS_HEIGHT, y2: contentHeight }));

        if (isYearStart && (year - startYear) % yearLabelStep === 0) {
          svg.append(svgEl("text", { class: "axis-year", x: x + 8, y: 24 }, formatDisplayDate(date)));
          svg.append(svgEl("text", { class: "axis-iranian", x: x + 8, y: 47 }, formatIranianDate(date)));
        } else if (!isYearStart && zoom >= 42) {
          lastMonthLabelEnd = drawMonthAxisLabel(svg, date, x, contentEndDate, lastMonthLabelEnd, showDayLabels);
        }
      }
    }

    for (let lane = 0; lane <= laneCount; lane += 1) {
      const y = AXIS_HEIGHT + lane * rowHeight;
      svg.append(svgEl("line", { class: "lane-rule", x1: 0, x2: dateToX(contentEndDate), y1: y, y2: y }));
    }
  }

  function isDayLabelCandidate(day) {
    return zoom >= 300 || day === 1 || day % 5 === 0;
  }

  function drawDayAxisLabel(svg, date, x, contentEndDate, lastLabelEnd) {
    const nextDate = addDaysIso(date, 1);
    const cellEndDate = compareIso(nextDate, contentEndDate) < 0 ? nextDate : contentEndDate;
    const cellWidth = Math.max(0, dateToX(cellEndDate) - x);
    const centerX = x + cellWidth / 2;
    const label = String(isoDay(date));
    const width = estimateSvgTextWidth(label);
    if (cellWidth >= 4 && canPlaceAxisLabel(centerX, width, lastLabelEnd, AXIS_DAY_LABEL_GAP)) {
      svg.append(svgEl("text", { class: "axis-day", x: centerX, y: 105, "text-anchor": "middle" }, label));
      return centerX + width / 2;
    }
    return lastLabelEnd;
  }

  function drawMonthAxisLabel(svg, date, x, contentEndDate, lastLabelEnd, hasDayLabels) {
    const nextDate = addMonthsIso(date, 1);
    const cellEndDate = compareIso(nextDate, contentEndDate) < 0 ? nextDate : contentEndDate;
    const cellWidth = Math.max(0, dateToX(cellEndDate) - x);
    const centerX = x + cellWidth / 2;
    const gregorian = monthName(date);
    const iranian = iranianMonthName(date);
    const stackedWidth = Math.max(estimateSvgTextWidth(gregorian), estimateSvgTextWidth(iranian));
    const gregorianY = hasDayLabels ? 58 : 78;
    const iranianY = hasDayLabels ? 74 : 96;
    const compactY = hasDayLabels ? 72 : 88;

    if (cellWidth >= stackedWidth + 18 && canPlaceAxisLabel(centerX, stackedWidth, lastLabelEnd, AXIS_MONTH_LABEL_GAP)) {
      svg.append(svgEl("text", { class: "axis-month axis-month-gregorian", x: centerX, y: gregorianY, "text-anchor": "middle" }, gregorian));
      svg.append(svgEl("text", { class: "axis-month axis-month-iranian", x: centerX, y: iranianY, "text-anchor": "middle" }, iranian));
      return centerX + stackedWidth / 2;
    }

    const compactWidth = estimateSvgTextWidth(gregorian);
    if (cellWidth >= compactWidth + 12 && canPlaceAxisLabel(centerX, compactWidth, lastLabelEnd, AXIS_MONTH_LABEL_GAP)) {
      svg.append(svgEl("text", { class: "axis-month axis-month-compact", x: centerX, y: compactY, "text-anchor": "middle" }, gregorian));
      return centerX + compactWidth / 2;
    }

    return lastLabelEnd;
  }

  function canPlaceAxisLabel(centerX, width, lastLabelEnd, gap) {
    return centerX - width / 2 >= lastLabelEnd + gap;
  }

  function drawLaneLabels(svg, settings, laneCount, rowHeight) {
    for (let lane = 0; lane < laneCount; lane += 1) {
      const label = settings.laneLabels[lane] || `Line ${lane + 1}`;
      const rowTop = AXIS_HEIGHT + lane * rowHeight;
      const centerY = rowTop + rowHeight / 2;
      const group = svgEl("g", {
        class: "lane-label-control",
        "data-timeline-lane-index": lane,
        tabindex: "0",
        "aria-label": `Drag ${label} to reorder line`,
      });

      group.append(svgEl("rect", {
        class: "lane-label-hit",
        x: 8,
        y: rowTop + 8,
        width: LEFT_GUTTER - 20,
        height: rowHeight - 16,
        rx: 7,
        fill: "transparent",
      }));
      [-7, 0, 7].forEach((offset) => {
        group.append(svgEl("circle", { class: "lane-label-grip", cx: 18, cy: centerY + offset, r: 1.7 }));
      });
      group.append(svgEl("text", { class: "lane-label", x: 28, y: centerY + 4 }, label));
      svg.append(group);
    }
  }

  function drawItem(svg, defs, item, rowHeight, laneCount, contentWidth, contentHeight) {
    const group = svgEl("g", {
      class: `item item-${item.type}${item.id === selectedId ? " selected" : ""}`,
      "data-item-id": item.id,
      tabindex: "0",
    });

    const y = AXIS_HEIGHT + item.lane * rowHeight + rowHeight / 2;
    const x1 = dateToX(item.startDate);
    const x2 = dateToX(hasEndYear(item.type) ? item.endDate : item.startDate);

    if (item.type === "birth") {
      drawBirth(group, item, x1, AXIS_HEIGHT + laneCount * rowHeight);
    } else if (item.type === "period") {
      drawPeriod(group, defs, item, x1, x2, y);
    } else if (item.type === "line") {
      drawLine(group, defs, item, x1, x2, y);
    } else if (item.type === "event") {
      drawEvent(group, defs, item, x1, y);
    } else if (item.type === "marker") {
      drawMarker(group, item, x1, AXIS_HEIGHT + laneCount * rowHeight);
    } else if (item.type === "note") {
      drawNote(group, defs, item, x1, y, laneCount, rowHeight, contentWidth);
    } else {
      drawTextItem(group, item, x1, y);
    }

    if (item.id === selectedId) drawSelection(group, item, x1, x2, y, laneCount, rowHeight, contentWidth, contentHeight);
    svg.append(group);
  }

  function drawPeriod(group, defs, item, x1, x2, y) {
    const width = Math.max(12, x2 - x1);
    const height = 34;
    const radius = 8;
    const gradientId = `period-glass-${safeSvgId(item.id)}`;
    if (!document.getElementById(gradientId)) {
      const gradient = svgEl("linearGradient", {
        id: gradientId,
        x1: x1,
        y1: y - height / 2,
        x2: x1,
        y2: y + height / 2,
        gradientUnits: "userSpaceOnUse",
      });
      gradient.append(svgEl("stop", { offset: "0", "stop-color": adjustColor(item.color, 10), "stop-opacity": "1" }));
      gradient.append(svgEl("stop", { offset: "1", "stop-color": adjustColor(item.color, -6), "stop-opacity": "1" }));
      defs.append(gradient);
    }
    const edgeColor = adjustColor(item.color, -14);

    group.append(svgEl("rect", {
      class: "period-shadow",
      x: x1,
      y: y - height / 2 + 4,
      width,
      height,
      rx: radius,
      fill: edgeColor,
    }));
    group.append(
      svgEl("rect", {
        class: "period-body",
        x: x1,
        y: y - height / 2,
        width,
        height,
        rx: radius,
        fill: `url(#${gradientId})`,
        stroke: edgeColor,
      }),
    );

    const periodMeta = getPeriodDerivedMeta(item, width);
    const titleY = periodMeta ? y - 2 : y + 5;
    const label = fitText(item.title, width - 16);
    group.append(
      svgEl("text", {
        class: "title-label",
        x: x1 + width / 2,
        y: titleY,
        "text-anchor": "middle",
        fill: readableTextColor(item.color),
      }, label),
    );
    if (periodMeta) drawPeriodDerivedLabels(group, periodMeta, item, x1, width, y);
  }

  function drawPeriodDerivedLabels(group, meta, item, x, width, y) {
    const fill = readableTextColor(item.color);
    const labelY = y + 12;
    if (meta.startAge) {
      group.append(svgEl("text", {
        class: "period-derived-label",
        x: x + 8,
        y: labelY,
        fill,
      }, meta.startAge));
    }
    if (meta.duration) {
      group.append(svgEl("text", {
        class: "period-derived-label",
        x: x + width / 2,
        y: labelY,
        "text-anchor": "middle",
        fill,
      }, meta.duration));
    }
    if (meta.endAge) {
      group.append(svgEl("text", {
        class: "period-derived-label",
        x: x + width - 8,
        y: labelY,
        "text-anchor": "end",
        fill,
      }, meta.endAge));
    }
  }

  function getPeriodDerivedMeta(item, width) {
    if (item.type !== "period") return null;
    const showAges = item.showAgeLabels !== false && width >= 230;
    const showDuration = item.showDurationLabel !== false && width >= 150;
    if (!showAges && !showDuration) return null;
    const birthItem = getPrimaryBirthItem();
    const meta = {
      startAge: showAges && birthItem ? formatAgeAtDate(birthItem.startDate, item.startDate) : "",
      endAge: showAges && birthItem ? formatAgeAtDate(birthItem.startDate, item.endDate) : "",
      duration: showDuration ? formatCompactDateSpan(item.startDate, item.endDate) : "",
    };
    return meta.startAge || meta.endAge || meta.duration ? meta : null;
  }

  function getPrimaryBirthItem() {
    return timeline.items
      .filter((item) => item.type === "birth")
      .sort((a, b) => compareIso(a.startDate, b.startDate))[0] || null;
  }

  function formatAgeAtDate(birthDate, targetDate) {
    if (compareIso(targetDate, birthDate) < 0) return "Before birth";
    return `Age ${formatCompactDateSpan(birthDate, targetDate)}`;
  }

  function formatDetailedAgeAtDate(birthDate, targetDate) {
    if (compareIso(targetDate, birthDate) < 0) return "Before birth";
    return `Age ${formatDetailedDateSpan(birthDate, targetDate)}`;
  }

  function formatDetailedAgeValueAtDate(birthDate, targetDate) {
    if (compareIso(targetDate, birthDate) < 0) return "before birth";
    return formatDetailedDateSpan(birthDate, targetDate);
  }

  function formatCompactDateSpan(startDate, endDate) {
    if (compareIso(endDate, startDate) < 0) return "before";
    const span = getDateSpanParts(startDate, endDate);
    const parts = [];
    if (span.years) parts.push(`${span.years}y`);
    if (span.months) parts.push(`${span.months}m`);
    if (span.days || parts.length === 0) parts.push(`${span.days}d`);
    return parts.join(" ");
  }

  function formatDetailedDateSpan(startDate, endDate) {
    if (compareIso(endDate, startDate) < 0) return "before";
    const span = getDateSpanParts(startDate, endDate);
    const parts = [];
    if (span.years) parts.push(`${span.years} ${span.years === 1 ? "year" : "years"}`);
    if (span.months) parts.push(`${span.months} ${span.months === 1 ? "month" : "months"}`);
    if (span.days || parts.length === 0) parts.push(`${span.days} ${span.days === 1 ? "day" : "days"}`);
    return parts.join(", ");
  }

  function getDateSpanParts(startDate, endDate) {
    let years = isoYear(endDate) - isoYear(startDate);
    let months = isoMonth(endDate) - isoMonth(startDate);
    let days = isoDay(endDate) - isoDay(startDate);
    if (days < 0) {
      months -= 1;
      days += daysInIsoMonth(isoYear(endDate), isoMonth(endDate) - 1);
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
  }

  function daysInIsoMonth(year, monthIndex) {
    return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  }

  function updateHoverReadout(event) {
    if (dragState) {
      return;
    }
    const rect = dom.timelineViewport.getBoundingClientRect();
    const pointerX = dom.timelineViewport.scrollLeft + event.clientX - rect.left;
    hoverDate = clampIso(xToDate(pointerX), timeline.settings.startDate, timeline.settings.endDate);
    updateTimelineInfoPanel();
  }

  function hideHoverReadout() {
    hoverDate = null;
    updateTimelineInfoPanel();
  }

  function drawLine(group, defs, item, x1, x2, y) {
    const markerId = `arrow-${safeSvgId(item.id)}`;
    if (!document.getElementById(markerId)) {
      const marker = svgEl("marker", {
        id: markerId,
        markerWidth: 9,
        markerHeight: 9,
        refX: 8,
        refY: 4.5,
        orient: "auto",
        markerUnits: "strokeWidth",
      });
      marker.append(svgEl("path", { d: "M 0 0 L 9 4.5 L 0 9 z", fill: item.color }));
      defs.append(marker);
    }

    group.append(
      svgEl("line", {
        class: "range-line",
        x1,
        y1: y,
        x2,
        y2: y,
        stroke: item.color,
        "marker-end": `url(#${markerId})`,
      }),
    );
    group.append(svgEl("text", { class: "note-label", x: x1 + 8, y: y - 11 }, fitText(item.title, Math.max(80, x2 - x1 - 20))));
  }

  function drawEvent(group, defs, item, x, y) {
    const gradientId = `event-glass-${safeSvgId(item.id)}`;
    if (!document.getElementById(gradientId)) {
      const gradient = svgEl("linearGradient", {
        id: gradientId,
        x1: x,
        y1: y - 12,
        x2: x,
        y2: y + 12,
        gradientUnits: "userSpaceOnUse",
      });
      gradient.append(svgEl("stop", { offset: "0", "stop-color": "#ffffff", "stop-opacity": "0.82" }));
      gradient.append(svgEl("stop", { offset: "0.36", "stop-color": item.color, "stop-opacity": "0.96" }));
      gradient.append(svgEl("stop", { offset: "1", "stop-color": adjustColor(item.color, -28), "stop-opacity": "1" }));
      defs.append(gradient);
    }

    const edgeColor = adjustColor(item.color, -34);
    group.append(svgEl("line", { class: "event-stem", x1: x, y1: y - 25, x2: x, y2: y + 25, stroke: edgeColor }));
    group.append(svgEl("circle", { class: "event-marker-shadow", cx: x + 1.5, cy: y + 2, r: 12, fill: edgeColor }));
    group.append(svgEl("circle", { class: "event-marker", cx: x, cy: y, r: 11, fill: `url(#${gradientId})` }));
    group.append(svgEl("circle", { class: "event-marker-edge", cx: x, cy: y, r: 11, stroke: edgeColor }));
    group.append(svgEl("ellipse", { class: "event-marker-glint", cx: x - 3.5, cy: y - 4.2, rx: 3.6, ry: 2.6 }));
    group.append(svgEl("text", { class: "note-label", x: x + 16, y: y + 5 }, item.title));
  }

  function drawMarker(group, item, x, laneAreaBottom) {
    const y1 = AXIS_HEIGHT;
    const y2 = laneAreaBottom;
    group.append(svgEl("line", { class: "marker-hit", x1: x, y1, x2: x, y2, stroke: "transparent" }));
    group.append(svgEl("line", { class: "marker-line", x1: x, y1, x2: x, y2, stroke: item.color }));
    group.append(svgEl("circle", { class: "marker-pin", cx: x, cy: y1, r: 5, fill: item.color }));
    group.append(svgEl("text", { class: "marker-label", x: x + 10, y: y1 + 18, fill: item.color }, item.title));
  }

  function drawBirth(group, item, x, laneAreaBottom) {
    const y1 = AXIS_HEIGHT - 8;
    const y2 = laneAreaBottom;
    const label = fitText(item.title || titleForType("birth"), 116);
    const labelWidth = Math.max(70, label.length * 7.2 + 22);
    const labelX = Math.max(8, x - labelWidth - 10);
    const labelY = AXIS_HEIGHT + 10;
    group.append(svgEl("line", { class: "birth-hit", x1: x, y1, x2: x, y2, stroke: "transparent" }));
    group.append(svgEl("line", { class: "birth-line-shadow", x1: x + 1.5, y1, x2: x + 1.5, y2, stroke: item.color }));
    group.append(svgEl("line", { class: "birth-line", x1: x, y1, x2: x, y2, stroke: item.color }));
    group.append(svgEl("circle", { class: "birth-pin", cx: x, cy: AXIS_HEIGHT, r: 7, fill: item.color }));
    group.append(svgEl("rect", { class: "birth-label-bg", x: labelX, y: labelY, width: labelWidth, height: 22, rx: 6, fill: item.color }));
    group.append(svgEl("text", {
      class: "birth-label-text",
      x: labelX + 11,
      y: labelY + 15,
      fill: readableTextColor(item.color),
    }, label));
  }

  function drawNote(group, defs, item, x, y, laneCount, rowHeight, contentWidth) {
    const layout = getNoteLayout(item, x, laneCount, rowHeight, contentWidth);
    const markerId = `note-arrow-${safeSvgId(item.id)}`;
    if (!document.getElementById(markerId)) {
      const marker = svgEl("marker", {
        id: markerId,
        markerWidth: 8,
        markerHeight: 8,
        refX: 7,
        refY: 4,
        orient: "auto",
        markerUnits: "strokeWidth",
      });
      marker.append(svgEl("path", { d: "M 0 0 L 8 4 L 0 8 z", fill: item.color }));
      defs.append(marker);
    }

    group.append(svgEl("line", {
      class: "note-leader",
      x1: layout.leaderX,
      y1: layout.leaderY,
      x2: x,
      y2: y,
      stroke: item.color,
      "marker-end": `url(#${markerId})`,
    }));
    group.append(svgEl("circle", { class: "note-anchor", cx: x, cy: y, r: 6, fill: item.color }));
    group.append(svgEl("rect", {
      class: "note-balloon",
      x: layout.x,
      y: layout.y,
      width: layout.width,
      height: layout.height,
      rx: 10,
      stroke: item.color,
    }));
    group.append(svgEl("text", { class: "note-balloon-text", x: layout.x + 12, y: layout.y + 23 }, layout.label));
  }

  function drawTextItem(group, item, x, y) {
    group.append(svgEl("circle", { cx: x, cy: y, r: 4, fill: item.color }));
    group.append(svgEl("text", { class: "note-label", x: x + 10, y: y + 5, fill: item.color }, item.title));
  }

  function drawSelection(group, item, x1, x2, y, laneCount, rowHeight, contentWidth, contentHeight) {
    if (item.type === "period") {
      const width = Math.max(12, x2 - x1);
      group.append(svgEl("rect", { class: "selection-outline", x: x1 - 4, y: y - 21, width: width + 8, height: 42, rx: 8 }));
      group.append(svgEl("rect", { class: "resize-handle", "data-item-id": item.id, "data-handle": "start", x: x1 - 5, y: y - 11, width: 10, height: 22, rx: 3 }));
      group.append(svgEl("rect", { class: "resize-handle", "data-item-id": item.id, "data-handle": "end", x: x2 - 5, y: y - 11, width: 10, height: 22, rx: 3 }));
    } else if (item.type === "line") {
      group.append(svgEl("rect", { class: "selection-outline", x: Math.min(x1, x2) - 7, y: y - 19, width: Math.abs(x2 - x1) + 14, height: 38, rx: 8 }));
      group.append(svgEl("circle", { class: "resize-handle", "data-item-id": item.id, "data-handle": "start", cx: x1, cy: y, r: 6 }));
      group.append(svgEl("circle", { class: "resize-handle", "data-item-id": item.id, "data-handle": "end", cx: x2, cy: y, r: 6 }));
    } else if (isGlobalTimelineItemType(item.type)) {
      group.append(svgEl("rect", {
        class: "selection-outline",
        x: x1 - 7,
        y: AXIS_HEIGHT + 4,
        width: 14,
        height: laneCount * rowHeight - 8,
        rx: 7,
      }));
    } else if (item.type === "note") {
      const layout = getNoteLayout(item, x1, laneCount, rowHeight, contentWidth);
      group.append(svgEl("rect", {
        class: "selection-outline",
        x: Math.min(x1 - 10, layout.x - 4),
        y: Math.min(y - 10, layout.y - 4),
        width: Math.max(x1 + 10, layout.x + layout.width + 4) - Math.min(x1 - 10, layout.x - 4),
        height: Math.max(y + 10, layout.y + layout.height + 4) - Math.min(y - 10, layout.y - 4),
        rx: 12,
      }));
    } else {
      group.append(svgEl("rect", { class: "selection-outline", x: x1 - 12, y: y - 22, width: 210, height: 44, rx: 8 }));
    }
  }

  function getNoteLayout(item, x, laneCount, rowHeight, contentWidth) {
    const width = clamp(String(item.title || "").length * 7.2 + 28, 96, 220);
    const height = 38;
    const balloonX = clamp(x - width / 2, 12, Math.max(12, contentWidth - width - 12));
    const balloonY = AXIS_HEIGHT + laneCount * rowHeight + 18;
    return {
      x: balloonX,
      y: balloonY,
      width,
      height,
      label: fitText(item.title, width - 24),
      leaderX: x,
      leaderY: balloonY,
    };
  }

  function updateMeta() {
    const settings = timeline.settings;
    dom.stageTitle.textContent = settings.title;
    dom.stageMeta.textContent = `${formatDisplayDate(settings.startDate)} / ${formatIranianDate(settings.startDate)} to ${formatDisplayDate(settings.endDate)} / ${formatIranianDate(settings.endDate)}`;
  }

  function updateTimelineInfoPanel() {
    updatePointerInfo();
    updateSelectionInfo();
  }

  function updatePointerInfo() {
    if (!dom.hoverDateLabel || !dom.hoverIranianLabel || !dom.hoverAgeLabel) return;
    const birthItem = getPrimaryBirthItem();
    if (!hoverDate) {
      dom.hoverDateLabel.textContent = "Hover over the timeline";
      dom.hoverIranianLabel.textContent = "Gregorian and Iranian dates";
      dom.hoverAgeLabel.textContent = birthItem ? "Age appears here" : "Add a birth item to calculate age";
      return;
    }

    dom.hoverDateLabel.textContent = formatDisplayDate(hoverDate);
    dom.hoverIranianLabel.textContent = formatIranianDate(hoverDate);
    dom.hoverAgeLabel.textContent = birthItem
      ? formatDetailedAgeAtDate(birthItem.startDate, hoverDate)
      : "Age: add a birth item";
  }

  function updateSelectionInfo() {
    if (
      !dom.selectedItemLabel ||
      !dom.selectedItemDateLabel ||
      !dom.selectedItemEndLabel ||
      !dom.selectedItemDurationLabel ||
      !dom.selectedItemAgeLabel
    ) {
      return;
    }
    const item = getItem(selectedId);
    if (!item) {
      dom.selectedItemLabel.textContent = "No item selected";
      dom.selectedItemDateLabel.textContent = "Select an item to inspect dates";
      setOptionalInfoLine(dom.selectedItemEndLabel, "");
      setOptionalInfoLine(dom.selectedItemDurationLabel, "");
      setOptionalInfoLine(dom.selectedItemAgeLabel, "");
      return;
    }

    dom.selectedItemLabel.textContent = formatSelectedItemTitle(item);
    dom.selectedItemDateLabel.textContent = formatSelectedItemStartLine(item);
    setOptionalInfoLine(dom.selectedItemEndLabel, formatSelectedItemEndLine(item));
    setOptionalInfoLine(dom.selectedItemDurationLabel, formatSelectedItemDurationLine(item));
    setOptionalInfoLine(dom.selectedItemAgeLabel, formatSelectedItemAgeLine(item));
  }

  function setOptionalInfoLine(element, text) {
    const value = text || "";
    element.textContent = value;
    element.hidden = !value;
  }

  function formatSelectedItemTitle(item) {
    const lineText = isGlobalTimelineItemType(item.type) ? "" : ` - Line ${item.lane + 1}`;
    return `${itemTypeLabel(item.type)}: ${item.title}${lineText}`;
  }

  function formatSelectedItemStartLine(item) {
    const start = `${formatDisplayDate(item.startDate)} / ${formatIranianDate(item.startDate)}`;
    return hasEndYear(item.type) ? `Start: ${start}` : `Date: ${start}`;
  }

  function formatSelectedItemEndLine(item) {
    if (!hasEndYear(item.type)) return "";
    const end = `${formatDisplayDate(item.endDate)} / ${formatIranianDate(item.endDate)}`;
    return `End: ${end}`;
  }

  function formatSelectedItemDurationLine(item) {
    if (!hasEndYear(item.type)) return "";
    return `Duration: ${formatDetailedDateSpan(item.startDate, item.endDate)}`;
  }

  function formatSelectedItemAgeLine(item) {
    const birthItem = getPrimaryBirthItem();
    if (item.type === "birth") {
      return "Age source";
    }
    if (!birthItem) return "";
    if (hasEndYear(item.type)) {
      return `Age: ${formatDetailedAgeValueAtDate(birthItem.startDate, item.startDate)} to ${formatDetailedAgeValueAtDate(birthItem.startDate, item.endDate)}`;
    }
    return `Age: ${formatDetailedAgeValueAtDate(birthItem.startDate, item.startDate)}`;
  }

  function itemTypeLabel(type) {
    return {
      birth: "Birth",
      event: "Event",
      marker: "Marker",
      note: "Note",
      period: "Period",
      line: "Line",
      text: "Text",
    }[String(type)] || "Item";
  }

  function setCurrentFile(handle, name) {
    currentFileHandle = handle || null;
    currentFileName = name || (handle && handle.name) || "";
    updateFileState();
  }

  function markDirty() {
    if (hasUnsavedChanges) return;
    hasUnsavedChanges = true;
    updateFileState();
  }

  function setDirty(value) {
    hasUnsavedChanges = Boolean(value);
    updateFileState();
  }

  function updateFileState() {
    if (!dom.fileNameLabel || !dom.dirtyIndicator) return;
    if (currentFileHandle) {
      dom.fileNameLabel.textContent = `File: ${currentFileName || currentFileHandle.name || "selected file"}`;
      dom.fileNameLabel.title = "Save writes to this file.";
    } else if (currentFileName) {
      dom.fileNameLabel.textContent = `Copy: ${currentFileName}`;
      dom.fileNameLabel.title = "This browser did not grant write access; Save downloads a JSON copy.";
    } else {
      dom.fileNameLabel.textContent = "No file selected";
      dom.fileNameLabel.title = "Save will ask for a file location or download a JSON copy.";
    }
    dom.dirtyIndicator.hidden = !hasUnsavedChanges;
  }

  function timelineDataSnapshot() {
    return JSON.stringify({
      settings: timeline.settings,
      items: timeline.items,
    });
  }

  function renderAllAfterMaybeChange(previousSnapshot) {
    const changed = timelineDataSnapshot() !== previousSnapshot;
    renderAll({ save: changed });
    return changed;
  }

  function syncTimelineControls() {
    suppressControlEvents = true;
    dom.timelineTitleInput.value = timeline.settings.title;
    dom.startDateInput.value = timeline.settings.startDate;
    dom.endDateInput.value = timeline.settings.endDate;
    dom.endDateInput.disabled = timeline.settings.autoEndDate;
    dom.autoEndDateInput.checked = timeline.settings.autoEndDate;
    dom.itemsLockedInput.checked = timeline.settings.itemsLocked;
    dom.timelineViewport.classList.toggle("items-locked", timeline.settings.itemsLocked);
    dom.snapInput.value = String(timeline.settings.snap);
    dom.zoomRange.value = String(zoom);
    dom.zoomLabel.textContent = `${formatZoomValue(zoom)} px/month`;
    suppressControlEvents = false;
  }

  function syncItemForm() {
    const item = getItem(selectedId);
    const controls = [
      dom.itemTypeInput,
      dom.itemTitleInput,
      dom.itemLaneInput,
      dom.itemColorInput,
      dom.itemStartInput,
      dom.itemEndInput,
      dom.itemAgeLabelsInput,
      dom.itemDurationLabelInput,
      dom.itemNotesInput,
      dom.deleteItemButton,
      dom.duplicateItemButton,
    ];

    suppressControlEvents = true;
    controls.forEach((control) => {
      control.disabled = !item;
    });

    if (!item) {
      dom.itemTypeInput.value = "event";
      dom.itemTitleInput.value = "";
      dom.itemLaneInput.value = "";
      dom.itemColorInput.value = TYPE_COLORS.event;
      dom.itemStartInput.value = "";
      dom.itemEndInput.value = "";
      dom.itemAgeLabelsInput.checked = true;
      dom.itemDurationLabelInput.checked = true;
      dom.itemNotesInput.value = "";
      dom.itemCalendarPreview.textContent = "Select an item to see Gregorian and Iranian dates.";
      dom.itemEndField.hidden = true;
      dom.itemDerivedLabelsField.hidden = true;
      updateColorPaletteState("", { disabled: true });
      dom.itemForm.classList.add("empty-selection");
      suppressControlEvents = false;
      return;
    }

    dom.itemForm.classList.remove("empty-selection");
    dom.itemTypeInput.value = item.type;
    dom.itemTitleInput.value = item.title;
    dom.itemLaneInput.value = item.lane;
    dom.itemColorInput.value = item.color;
    dom.itemStartInput.value = item.startDate;
    dom.itemEndInput.value = item.endDate;
    dom.itemAgeLabelsInput.checked = item.showAgeLabels !== false;
    dom.itemDurationLabelInput.checked = item.showDurationLabel !== false;
    dom.itemNotesInput.value = item.notes;
    dom.itemEndField.hidden = !hasEndYear(item.type);
    dom.itemDerivedLabelsField.hidden = item.type !== "period";
    dom.itemLaneInput.disabled = isGlobalTimelineItemType(item.type);
    updateColorPaletteState(item.color, { disabled: false });
    updateItemCalendarPreview(item);
    suppressControlEvents = false;
  }

  function renderItemColorPalette() {
    if (!dom.itemColorPalette) return;
    dom.itemColorPalette.replaceChildren();
    ITEM_COLOR_PALETTE.forEach((swatch) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "color-swatch-button";
      button.dataset.color = swatch.value;
      button.style.setProperty("--swatch-color", swatch.value);
      button.setAttribute("aria-label", `Use ${swatch.name} item color`);
      button.title = swatch.name;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", selectPresetColor);
      dom.itemColorPalette.append(button);
    });
  }

  function selectPresetColor(event) {
    if (suppressControlEvents) return;
    const color = event.currentTarget.dataset.color;
    if (!color) return;
    dom.itemColorInput.value = normalizeColor(color);
    applyItemColorFromControl();
  }

  function handleItemColorInput() {
    if (suppressControlEvents) return;
    applyItemColorFromControl();
  }

  function applyItemColorFromControl() {
    const item = getItem(selectedId);
    if (!item) return;
    const color = normalizeColor(dom.itemColorInput.value || item.color);
    dom.itemColorInput.value = color;
    updateColorPaletteState(color, { disabled: false });
    if (item.color === color) return;

    const previousSnapshot = timelineDataSnapshot();
    item.color = color;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Item color updated");
  }

  function updateColorPaletteState(activeColor, options = {}) {
    if (!dom.itemColorPalette) return;
    const disabled = options.disabled === true;
    const normalized = activeColor ? normalizeColor(activeColor).toLowerCase() : "";
    dom.itemColorPalette.querySelectorAll(".color-swatch-button").forEach((button) => {
      const isActive = !disabled && button.dataset.color?.toLowerCase() === normalized;
      button.disabled = disabled;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function renderLaneControls() {
    const labels = ensureLaneLabels();
    dom.laneList.replaceChildren();
    labels.forEach((label, index) => {
      const row = document.createElement("div");
      row.className = "lane-editor-row";
      row.dataset.laneIndex = String(index);

      const dragHandle = document.createElement("button");
      dragHandle.type = "button";
      dragHandle.className = "lane-drag-handle";
      dragHandle.dataset.laneIndex = String(index);
      dragHandle.ariaLabel = `Drag ${label || `Line ${index + 1}`} to reorder`;
      dragHandle.title = "Drag to reorder";
      dragHandle.addEventListener("pointerdown", beginSidebarLanePointerDrag);
      for (let dot = 0; dot < 6; dot += 1) {
        dragHandle.append(document.createElement("span"));
      }

      const field = document.createElement("label");
      field.className = "lane-editor-label";

      const caption = document.createElement("span");
      caption.textContent = `Line ${index + 1}`;

      const input = document.createElement("input");
      input.type = "text";
      input.value = label;
      input.dataset.laneIndex = String(index);
      input.autocomplete = "off";
      input.addEventListener("input", updateLaneLabelDraft);
      input.addEventListener("blur", updateLaneLabel);
      input.addEventListener("change", updateLaneLabel);

      field.append(caption, input);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "lane-remove-button";
      removeButton.textContent = "Remove";
      removeButton.dataset.laneIndex = String(index);
      removeButton.disabled = labels.length <= 1;
      removeButton.addEventListener("click", removeLane);

      row.append(dragHandle, field, removeButton);
      dom.laneList.append(row);
    });
  }

  function ensureLaneLabels() {
    const labels = timeline.settings.laneLabels;
    const laneCount = Math.max(
      1,
      labels.length,
      ...timeline.items.map((item) => Math.max(0, Number(item.lane) + 1)),
    );
    while (labels.length < laneCount) {
      labels.push(`Line ${labels.length + 1}`);
    }
    return labels;
  }

  function updateLaneLabel(event) {
    const index = Number(event.currentTarget.dataset.laneIndex);
    if (!Number.isInteger(index)) return;
    const previousSnapshot = timelineDataSnapshot();
    timeline.settings.laneLabels[index] = event.currentTarget.value.trim() || `Line ${index + 1}`;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Line renamed");
  }

  function updateLaneLabelDraft(event) {
    const index = Number(event.currentTarget.dataset.laneIndex);
    if (!Number.isInteger(index)) return;
    timeline.settings.laneLabels[index] = event.currentTarget.value;
    markDirty();
  }

  function addLane() {
    timeline.settings.laneLabels.push(`Line ${timeline.settings.laneLabels.length + 1}`);
    renderAll();
    setStatus("Line added");
  }

  function beginSidebarLanePointerDrag(event) {
    if (event.button !== 0) return;
    const index = Number(event.currentTarget.dataset.laneIndex);
    if (!Number.isInteger(index)) return;
    sidebarLanePointerDrag = {
      pointerId: event.pointerId,
      laneIndex: index,
      moved: false,
    };
    event.currentTarget.closest(".lane-editor-row").classList.add("is-dragging");
    document.addEventListener("pointermove", moveSidebarLanePointerDrag);
    document.addEventListener("pointerup", endSidebarLanePointerDrag);
    document.addEventListener("pointercancel", endSidebarLanePointerDrag);
    event.preventDefault();
  }

  function moveSidebarLanePointerDrag(event) {
    if (!sidebarLanePointerDrag || event.pointerId !== sidebarLanePointerDrag.pointerId) return;
    const targetRow = document.elementFromPoint(event.clientX, event.clientY)?.closest(".lane-editor-row");
    clearLaneListDragClasses();
    if (!targetRow || !dom.laneList.contains(targetRow)) {
      markActiveLaneRow();
      return;
    }

    targetRow.classList.add("is-drop-target");
    const targetIndex = Number(targetRow.dataset.laneIndex);
    if (Number.isInteger(targetIndex) && targetIndex !== sidebarLanePointerDrag.laneIndex) {
      const moved = moveLane(sidebarLanePointerDrag.laneIndex, targetIndex, { announce: false });
      if (moved) {
        sidebarLanePointerDrag.laneIndex = targetIndex;
        sidebarLanePointerDrag.moved = true;
      }
    }
    markActiveLaneRow();
    event.preventDefault();
  }

  function endSidebarLanePointerDrag(event) {
    if (!sidebarLanePointerDrag || event.pointerId !== sidebarLanePointerDrag.pointerId) return;
    const moved = sidebarLanePointerDrag.moved;
    sidebarLanePointerDrag = null;
    document.removeEventListener("pointermove", moveSidebarLanePointerDrag);
    document.removeEventListener("pointerup", endSidebarLanePointerDrag);
    document.removeEventListener("pointercancel", endSidebarLanePointerDrag);
    clearLaneListDragClasses();
    if (moved) {
      renderAll();
      setStatus("Line moved");
    }
    event.preventDefault();
  }

  function clearLaneListDragClasses() {
    dom.laneList.querySelectorAll(".lane-editor-row").forEach((row) => {
      row.classList.remove("is-dragging", "is-drop-target");
    });
  }

  function markActiveLaneRow() {
    if (!sidebarLanePointerDrag) return;
    const activeRow = dom.laneList.querySelector(`.lane-editor-row[data-lane-index="${sidebarLanePointerDrag.laneIndex}"]`);
    if (activeRow) activeRow.classList.add("is-dragging");
  }

  function moveLane(fromIndex, toIndex, options = {}) {
    const labels = ensureLaneLabels();
    const from = Number(fromIndex);
    const to = clamp(Number(toIndex), 0, labels.length - 1);
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from >= labels.length || from === to) {
      return false;
    }

    const [label] = labels.splice(from, 1);
    labels.splice(to, 0, label);
    timeline.items.forEach((item) => {
      if (item.lane === from) {
        item.lane = to;
      } else if (from < to && item.lane > from && item.lane <= to) {
        item.lane -= 1;
      } else if (from > to && item.lane >= to && item.lane < from) {
        item.lane += 1;
      }
    });

    renderAll({ save: false });
    if (options.announce !== false) setStatus("Line moved");
    return true;
  }

  function removeLane(event) {
    const index = Number(event.currentTarget.dataset.laneIndex);
    const labels = ensureLaneLabels();
    if (!Number.isInteger(index) || index < 0 || index >= labels.length) return;
    if (labels.length <= 1) {
      setStatus("Keep at least one line");
      return;
    }

    const label = labels[index] || `Line ${index + 1}`;
    const itemsOnLine = timeline.items.filter((item) => item.lane === index);
    const itemText = itemsOnLine.length === 1 ? "1 item" : `${itemsOnLine.length} items`;
    const ok = window.confirm(
      itemsOnLine.length
        ? `Remove "${label}" and delete ${itemText} on it?`
        : `Remove "${label}"?`,
    );
    if (!ok) return;

    const removedItemIds = new Set(itemsOnLine.map((item) => item.id));
    labels.splice(index, 1);
    timeline.items = timeline.items
      .filter((item) => item.lane !== index)
      .map((item) => (item.lane > index ? { ...item, lane: item.lane - 1 } : item));
    if (selectedId && removedItemIds.has(selectedId)) selectedId = null;
    renderAll();
    setStatus("Line removed");
  }

  function updateItemCalendarPreviewFromInputs() {
    if (suppressControlEvents) return;
    const startDate = normalizeDateInput(dom.itemStartInput.value, timeline.settings.startDate);
    const endDate = hasEndYear(dom.itemTypeInput.value)
      ? normalizeDateInput(dom.itemEndInput.value, startDate)
      : startDate;
    dom.itemCalendarPreview.textContent = hasEndYear(dom.itemTypeInput.value)
      ? `${formatDatePair(startDate)} to ${formatDatePair(endDate)}`
      : formatDatePair(startDate);
  }

  function updateItemCalendarPreview(item) {
    dom.itemCalendarPreview.textContent = hasEndYear(item.type)
      ? `${formatDatePair(item.startDate)} to ${formatDatePair(item.endDate)}`
      : formatDatePair(item.startDate);
  }

  function updateTimelineFromControls(event) {
    if (suppressControlEvents) return;
    const previousSnapshot = timelineDataSnapshot();
    const settings = timeline.settings;
    settings.title = dom.timelineTitleInput.value.trim() || "New Timeline";
    settings.startDate = normalizeDateInput(dom.startDateInput.value, settings.startDate);
    settings.autoEndDate = dom.autoEndDateInput.checked;
    if (event && event.currentTarget === dom.endDateInput) {
      settings.autoEndDate = false;
    }
    settings.endDate = settings.autoEndDate
      ? todayIso()
      : normalizeDateInput(dom.endDateInput.value, settings.endDate);
    if (compareIso(settings.endDate, settings.startDate) < 0) settings.endDate = settings.startDate;
    settings.itemsLocked = dom.itemsLockedInput.checked;
    settings.snap = normalizeSnap(dom.snapInput.value);
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Timeline updated");
  }

  function handleTimelineDateKeydown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    updateTimelineFromControls(event);
    event.currentTarget.blur();
  }

  function handleItemDateKeydown(event) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    updateItemCalendarPreviewFromInputs();
    event.currentTarget.blur();
  }

  function handleGlobalKeydown(event) {
    if ((!event.ctrlKey && !event.metaKey) || event.key.toLowerCase() !== "s") return;
    event.preventDefault();
    saveJsonFile();
  }

  function applyItemForm() {
    const item = getItem(selectedId);
    if (!item) return;

    const previousSnapshot = timelineDataSnapshot();
    const type = dom.itemTypeInput.value;
    item.type = type;
    item.title = dom.itemTitleInput.value.trim() || titleForType(type);
    item.lane = isGlobalTimelineItemType(type) ? 0 : clamp(Math.round(toNumber(dom.itemLaneInput.value, item.lane)), 0, 20);
    item.color = normalizeColor(dom.itemColorInput.value || TYPE_COLORS[type]);
    item.startDate = normalizeDateInput(dom.itemStartInput.value, item.startDate);
    item.endDate = hasEndYear(type) ? normalizeDateInput(dom.itemEndInput.value, addDaysIso(item.startDate, 1)) : item.startDate;
    if (hasEndYear(type) && compareIso(item.endDate, item.startDate) <= 0) item.endDate = addDaysIso(item.startDate, 1);
    item.showAgeLabels = dom.itemAgeLabelsInput.checked;
    item.showDurationLabel = dom.itemDurationLabelInput.checked;
    item.notes = dom.itemNotesInput.value;

    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Item updated");
  }

  function addItem(type) {
    const centerDate = getViewportCenterDate();
    const startDate = snapDate(clampIso(centerDate, timeline.settings.startDate, timeline.settings.endDate));
    const laneByType = { birth: 0, period: 0, line: 3, event: 2, marker: 0, note: 2, text: 4 };
    const endDate = hasEndYear(type) ? defaultEndDate(startDate) : startDate;
    const item = normalizeItem({
      id: createId(type),
      type,
      lane: laneByType[type] || 0,
      startDate,
      endDate: clampIso(endDate, addDaysIso(startDate, 1), addDaysIso(timeline.settings.endDate, 1)),
      title: titleForType(type),
      color: randomPaletteColor(),
      notes: "",
      showAgeLabels: true,
      showDurationLabel: true,
    });

    timeline.items.push(item);
    selectedId = item.id;
    renderAll();
    setStatus(`${titleForType(type)} added`);
  }

  function deleteSelectedItem() {
    if (!selectedId) return;
    const item = getItem(selectedId);
    if (!item) return;
    const ok = window.confirm(`Delete "${item.title}"?`);
    if (!ok) return;
    timeline.items = timeline.items.filter((candidate) => candidate.id !== selectedId);
    selectedId = null;
    renderAll();
    setStatus("Item deleted");
  }

  function duplicateSelectedItem() {
    const item = getItem(selectedId);
    if (!item) return;
    const copy = {
      ...item,
      id: createId(item.type),
      title: `${item.title} copy`,
      lane: isGlobalTimelineItemType(item.type) ? 0 : clamp(item.lane + 1, 0, 20),
    };
    timeline.items.push(copy);
    selectedId = copy.id;
    renderAll();
    setStatus("Item duplicated");
  }

  function beginPointerDrag(event) {
    if (event.button !== 0) return;
    const laneNode = event.target.closest("[data-timeline-lane-index]");
    if (laneNode) {
      const laneIndex = Number(laneNode.dataset.timelineLaneIndex);
      if (!Number.isInteger(laneIndex)) return;
      dragState = {
        pointerId: event.pointerId,
        mode: "lane",
        laneIndex,
      };
      dom.timelineViewport.setPointerCapture(event.pointerId);
      dom.timelineViewport.classList.add("is-reordering-lanes");
      event.preventDefault();
      return;
    }

    const handle = event.target.closest(".resize-handle");
    const itemNode = timeline.settings.itemsLocked ? null : event.target.closest("[data-item-id]");
    if (!itemNode) {
      if (selectedId) {
        selectedId = null;
        renderAll({ save: false });
      }
      dragState = {
        pointerId: event.pointerId,
        mode: "pan",
        startClientX: event.clientX,
        startClientY: event.clientY,
        startScrollLeft: dom.timelineViewport.scrollLeft,
        startScrollTop: dom.timelineViewport.scrollTop,
        moved: false,
      };
      dom.timelineViewport.setPointerCapture(event.pointerId);
      dom.timelineViewport.classList.add("is-panning");
      event.preventDefault();
      return;
    }

    const item = getItem(itemNode.dataset.itemId);
    if (!item) return;
    selectedId = item.id;
    const point = svgPoint(event);
    dragState = {
      pointerId: event.pointerId,
      mode: handle ? handle.dataset.handle : "move",
      itemId: item.id,
      startPoint: point,
      original: { ...item },
    };
    dom.timelineViewport.setPointerCapture(event.pointerId);
    renderAll({ save: false });
    event.preventDefault();
  }

  function movePointerDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    if (dragState.mode === "pan") {
      const dx = event.clientX - dragState.startClientX;
      const dy = event.clientY - dragState.startClientY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragState.moved = true;
      dom.timelineViewport.scrollLeft = dragState.startScrollLeft - dx;
      dom.timelineViewport.scrollTop = dragState.startScrollTop - dy;
      event.preventDefault();
      return;
    }

    if (dragState.mode === "lane") {
      const targetLane = laneIndexFromPointer(event);
      if (targetLane !== dragState.laneIndex) {
        const moved = moveLane(dragState.laneIndex, targetLane, { announce: false });
        if (moved) {
          dragState.laneIndex = targetLane;
          dragState.moved = true;
        }
      }
      event.preventDefault();
      return;
    }

    const item = getItem(dragState.itemId);
    if (!item) return;
    const point = svgPoint(event);
    const dxDays = Math.round((point.x - dragState.startPoint.x) / pixelsPerDay());
    const dyLanes = Math.round((point.y - dragState.startPoint.y) / timeline.settings.rowHeight);
    const original = dragState.original;
    const minDate = timeline.settings.startDate;
    const maxDate = addDaysIso(timeline.settings.endDate, 1);

    if (dragState.mode === "start") {
      const maxStart = addDaysIso(item.endDate, -minDurationDays());
      item.startDate = clampIso(snapDate(clampIso(addDaysIso(original.startDate, dxDays), minDate, maxStart)), minDate, maxStart);
    } else if (dragState.mode === "end") {
      const minEnd = addDaysIso(item.startDate, minDurationDays());
      item.endDate = clampIso(snapDate(clampIso(addDaysIso(original.endDate, dxDays), minEnd, maxDate)), minEnd, maxDate);
    } else {
      const duration = hasEndYear(item.type) ? daysBetween(original.startDate, original.endDate) : 0;
      let nextStart = snapDate(addDaysIso(original.startDate, dxDays));
      if (compareIso(nextStart, minDate) < 0) nextStart = minDate;
      if (hasEndYear(item.type) && compareIso(addDaysIso(nextStart, duration), maxDate) > 0) {
        nextStart = addDaysIso(maxDate, -duration);
      } else if (!hasEndYear(item.type) && compareIso(nextStart, timeline.settings.endDate) > 0) {
        nextStart = timeline.settings.endDate;
      }
      item.startDate = nextStart;
      item.lane = isGlobalTimelineItemType(item.type) ? 0 : clamp(original.lane + dyLanes, 0, 20);
      if (hasEndYear(item.type)) {
        item.endDate = addDaysIso(item.startDate, duration);
      } else {
        item.endDate = item.startDate;
      }
    }

    if (hasEndYear(item.type) && compareIso(item.endDate, item.startDate) <= 0) {
      item.endDate = addDaysIso(item.startDate, minDurationDays());
    }
    applyLaneEdgeSnap(item, dragState.mode, original);
    renderAll({ save: false });
    event.preventDefault();
  }

  function applyLaneEdgeSnap(item, mode, original) {
    if (isGlobalTimelineItemType(item.type)) return;
    const neighbors = getLaneSnapNeighbors(item);
    if (!neighbors.length) return;

    const threshold = edgeSnapThresholdDays();
    const minOffset = dateOffset(timeline.settings.startDate);
    const maxRangeEnd = dateOffset(addDaysIso(timeline.settings.endDate, 1));
    const maxPoint = dateOffset(timeline.settings.endDate);
    const hasRange = hasEndYear(item.type);
    const duration = hasRange ? Math.max(minDurationDays(), dateOffset(item.endDate) - dateOffset(item.startDate)) : 0;
    const originalStart = original ? dateOffset(original.startDate) : dateOffset(item.startDate);
    let start = dateOffset(item.startDate);
    let end = hasRange ? dateOffset(item.endDate) : start;

    if (mode === "start" && hasRange) {
      start = snapEdgeOffset(start, neighbors, threshold);
      start = clamp(start, minOffset, end - minDurationDays());
      start = preventResizedStartOverlap(start, end, neighbors);
    } else if (mode === "end" && hasRange) {
      end = snapEdgeOffset(end, neighbors, threshold);
      end = clamp(end, start + minDurationDays(), maxRangeEnd);
      end = preventResizedEndOverlap(start, end, neighbors);
    } else {
      const delta = snapMoveDelta(start, end, neighbors, threshold);
      start += delta;
      end += delta;
      [start, end] = clampMovedRange(start, end, duration, hasRange, maxRangeEnd, maxPoint);
      if (hasRange) {
        [start, end] = preventMovedRangeOverlap(start, end, duration, neighbors, originalStart, maxRangeEnd);
      }
    }

    if (hasRange) {
      item.startDate = dateFromOffset(start);
      item.endDate = dateFromOffset(Math.max(start + minDurationDays(), end));
    } else {
      const point = clamp(start, minOffset, maxPoint);
      item.startDate = dateFromOffset(point);
      item.endDate = item.startDate;
    }
  }

  function getLaneSnapNeighbors(item) {
    return timeline.items
      .filter((candidate) => candidate.id !== item.id)
      .filter((candidate) => !isGlobalTimelineItemType(candidate.type))
      .filter((candidate) => Number(candidate.lane) === Number(item.lane))
      .map((candidate) => {
        const start = dateOffset(candidate.startDate);
        const end = hasEndYear(candidate.type) ? dateOffset(candidate.endDate) : start;
        return {
          id: candidate.id,
          hasRange: hasEndYear(candidate.type),
          start,
          end,
        };
      })
      .sort((a, b) => a.start - b.start || a.end - b.end);
  }

  function edgeSnapThresholdDays() {
    return clamp(Math.ceil(EDGE_SNAP_PIXELS / pixelsPerDay()), 1, EDGE_SNAP_MAX_DAYS);
  }

  function snapEdgeOffset(edge, neighbors, threshold) {
    let bestDelta = 0;
    let bestDistance = threshold + 1;
    neighbors.forEach((neighbor) => {
      [neighbor.start, neighbor.end].forEach((target) => {
        const distance = Math.abs(edge - target);
        if (distance <= threshold && distance < bestDistance) {
          bestDistance = distance;
          bestDelta = target - edge;
        }
      });
    });
    return edge + bestDelta;
  }

  function snapMoveDelta(start, end, neighbors, threshold) {
    let bestDelta = 0;
    let bestDistance = threshold + 1;
    neighbors.forEach((neighbor) => {
      [neighbor.start, neighbor.end].forEach((target) => {
        [target - start, target - end].forEach((delta) => {
          const distance = Math.abs(delta);
          if (distance <= threshold && distance < bestDistance) {
            bestDistance = distance;
            bestDelta = delta;
          }
        });
      });
    });
    return bestDelta;
  }

  function preventResizedStartOverlap(start, end, neighbors) {
    return neighbors
      .filter((neighbor) => neighbor.hasRange)
      .reduce((nextStart, neighbor) => (
        rangesOverlap(nextStart, end, neighbor.start, neighbor.end)
          ? Math.min(end - minDurationDays(), neighbor.end)
          : nextStart
      ), start);
  }

  function preventResizedEndOverlap(start, end, neighbors) {
    return neighbors
      .filter((neighbor) => neighbor.hasRange)
      .reduce((nextEnd, neighbor) => (
        rangesOverlap(start, nextEnd, neighbor.start, neighbor.end)
          ? Math.max(start + minDurationDays(), neighbor.start)
          : nextEnd
      ), end);
  }

  function preventMovedRangeOverlap(start, end, duration, neighbors, originalStart, maxRangeEnd) {
    let nextStart = start;
    let nextEnd = end;
    const movingRight = nextStart >= originalStart;
    const blockers = neighbors.filter((neighbor) => neighbor.hasRange);

    for (let index = 0; index < blockers.length; index += 1) {
      const overlap = blockers.find((neighbor) => rangesOverlap(nextStart, nextEnd, neighbor.start, neighbor.end));
      if (!overlap) break;
      if (movingRight) {
        nextEnd = overlap.start;
        nextStart = nextEnd - duration;
      } else {
        nextStart = overlap.end;
        nextEnd = nextStart + duration;
      }
      [nextStart, nextEnd] = clampMovedRange(nextStart, nextEnd, duration, true, maxRangeEnd, maxRangeEnd);
    }

    return [nextStart, nextEnd];
  }

  function clampMovedRange(start, end, duration, hasRange, maxRangeEnd, maxPoint) {
    if (!hasRange) {
      const point = clamp(start, dateOffset(timeline.settings.startDate), maxPoint);
      return [point, point];
    }
    let nextStart = start;
    let nextEnd = end;
    if (nextStart < dateOffset(timeline.settings.startDate)) {
      nextStart = dateOffset(timeline.settings.startDate);
      nextEnd = nextStart + duration;
    }
    if (nextEnd > maxRangeEnd) {
      nextEnd = maxRangeEnd;
      nextStart = nextEnd - duration;
    }
    return [nextStart, nextEnd];
  }

  function rangesOverlap(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
  }

  function dateOffset(isoDate) {
    return daysBetween(timeline.settings.startDate, isoDate);
  }

  function dateFromOffset(offset) {
    return addDaysIso(timeline.settings.startDate, Math.round(offset));
  }

  function endPointerDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const endedDrag = dragState;
    const wasPan = endedDrag.mode === "pan";
    const wasLaneReorder = endedDrag.mode === "lane";
    const panMoved = Boolean(endedDrag.moved);
    const dataMoved = hasDraggedItemChanged(endedDrag);
    try {
      dom.timelineViewport.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }
    dom.timelineViewport.classList.remove("is-panning");
    dom.timelineViewport.classList.remove("is-reordering-lanes");
    dragState = null;
    if (wasPan) {
      if (panMoved) setStatus("Timeline panned");
      return;
    }
    if (wasLaneReorder) {
      renderAll({ save: Boolean(endedDrag.moved) });
      if (endedDrag.moved) setStatus("Line moved");
      return;
    }
    renderAll({ save: dataMoved });
    setStatus(dataMoved ? "Item moved" : "Item selected");
  }

  function hasDraggedItemChanged(endedDrag) {
    if (!endedDrag || !endedDrag.original || !endedDrag.itemId) return false;
    const item = getItem(endedDrag.itemId);
    if (!item) return false;
    return item.startDate !== endedDrag.original.startDate
      || item.endDate !== endedDrag.original.endDate
      || item.lane !== endedDrag.original.lane;
  }

  function handleViewportWheel(event) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const rect = dom.timelineViewport.getBoundingClientRect();
    const pointerX = dom.timelineViewport.scrollLeft + event.clientX - rect.left;
    const dateUnderPointer = xToDate(pointerX);
    const nextZoom = zoom + (event.deltaY > 0 ? -4 : 4);
    setZoom(nextZoom, { render: false });
    renderAll({ save: false });
    dom.timelineViewport.scrollLeft = dateToX(dateUnderPointer) - (event.clientX - rect.left);
  }

  function setZoom(value, options = {}) {
    zoom = clamp(Number(value) || DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM);
    localStorage.setItem(ZOOM_KEY, String(zoom));
    dom.zoomRange.value = String(zoom);
    dom.zoomLabel.textContent = `${formatZoomValue(zoom)} px/month`;
    if (options.render !== false) renderAll({ save: false });
  }

  function fitTimelineToViewport() {
    const months = Math.max(1, monthsBetween(timeline.settings.startDate, addDaysIso(timeline.settings.endDate, 1)));
    const available = Math.max(200, dom.timelineViewport.clientWidth - LEFT_GUTTER - RIGHT_GUTTER - 24);
    const fittedZoom = clamp(available / months, MIN_ZOOM, MAX_ZOOM);
    const readableZoom = Math.max(fittedZoom, FIT_MIN_ZOOM);
    setZoom(readableZoom);
    dom.timelineViewport.scrollLeft = 0;
    setStatus(fittedZoom < FIT_MIN_ZOOM ? "Fit applied at readable zoom" : "Fit applied");
  }

  function getViewportCenterDate() {
    const centerX = dom.timelineViewport.scrollLeft + dom.timelineViewport.clientWidth / 2;
    return xToDate(centerX);
  }

  function dateToX(isoDate) {
    return LEFT_GUTTER + daysBetween(timeline.settings.startDate, isoDate) * pixelsPerDay();
  }

  function xToDate(x) {
    return addDaysIso(timeline.settings.startDate, Math.round((Number(x) - LEFT_GUTTER) / pixelsPerDay()));
  }

  function svgPoint(event) {
    const point = dom.timelineSvg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(dom.timelineSvg.getScreenCTM().inverse());
  }

  function laneIndexFromPointer(event) {
    const point = svgPoint(event);
    const labels = ensureLaneLabels();
    const rowHeight = timeline.settings.rowHeight || DEFAULT_ROW_HEIGHT;
    return clamp(Math.floor((point.y - AXIS_HEIGHT) / rowHeight), 0, labels.length - 1);
  }

  function getItem(id) {
    return timeline.items.find((item) => item.id === id) || null;
  }

  async function saveJsonFile() {
    const blob = new Blob([serializeTimelineJson(timeline)], { type: TIMELINE_JSON_MIME });
    const filename = currentFileName || `${filenameBase()}.json`;

    try {
      if (currentFileHandle) {
        await saveBlobToHandle(blob, currentFileHandle);
        setDirty(false);
        setStatus(`Saved ${currentFileName || "current file"}`);
        return;
      }

      const handle = await saveBlobWithPicker(blob, filename, TIMELINE_JSON_FILE_TYPE);
      if (handle) {
        const savedName = handle.name || filename;
        setCurrentFile(handle, savedName);
        setDirty(false);
        setStatus(`Saved ${savedName}`);
        return;
      }

      downloadBlob(blob, filename);
      setCurrentFile(null, filename);
      setDirty(false);
      setStatus("JSON downloaded");
    } catch (error) {
      if (error && error.name === "AbortError") {
        setStatus("Save canceled");
        return;
      }
      console.error(error);
      downloadBlob(blob, filename);
      setCurrentFile(null, filename);
      setDirty(false);
      setStatus("JSON downloaded");
    }
  }

  async function openJsonFile() {
    if (!canPickFileWithPicker()) {
      dom.fileInput.click();
      return;
    }

    try {
      const picked = await pickFileWithPicker(TIMELINE_JSON_FILE_TYPE);
      await loadTimelineFromFile(picked.file, picked.handle);
    } catch (error) {
      if (error && error.name === "AbortError") {
        setStatus("Load canceled");
        return;
      }
      console.error(error);
      setStatus("Could not load JSON");
      window.alert("The selected file is not a valid timeline JSON file.");
    }
  }

  async function loadJsonFile() {
    const file = dom.fileInput.files && dom.fileInput.files[0];
    if (!file) return;
    try {
      await loadTimelineFromFile(file, null);
    } catch (error) {
      console.error(error);
      setStatus("Could not load JSON");
      window.alert("The selected file is not a valid timeline JSON file.");
    } finally {
      dom.fileInput.value = "";
    }
  }

  async function loadTimelineFromFile(file, handle) {
    const text = await file.text();
    timeline = parseTimelineJson(text);
    selectedId = null;
    setCurrentFile(handle, file.name);
    renderAll({ save: false });
    setDirty(false);
    setStatus(handle ? `Loaded ${file.name}` : "JSON loaded; Save downloads a copy");
  }

  function exportSvgFile() {
    const svgText = serializeTimelineSvg(dom.timelineSvg);
    downloadBlob(new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }), `${filenameBase()}.svg`);
    setStatus("SVG exported");
  }

  async function exportPngFile() {
    try {
      setStatus("Exporting PNG");
      const canvas = await timelineToCanvas("image/png");
      const blob = await canvasToBlob(canvas, "image/png");
      downloadBlob(blob, `${filenameBase()}.png`);
      setStatus("PNG exported");
    } catch (error) {
      console.error(error);
      setStatus("PNG export failed");
      window.alert("PNG export failed.");
    }
  }

  async function exportPdfFile() {
    try {
      setStatus("Exporting PDF");
      const canvas = await timelineToCanvas("image/jpeg");
      const jpegBlob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      const jpegBytes = new Uint8Array(await jpegBlob.arrayBuffer());
      const pdfBytes = buildPdfFromJpeg(jpegBytes, canvas.width, canvas.height);
      downloadBlob(new Blob([pdfBytes], { type: "application/pdf" }), `${filenameBase()}.pdf`);
      setStatus("PDF exported");
    } catch (error) {
      console.error(error);
      setStatus("PDF export failed");
      window.alert("PDF export failed.");
    }
  }

  async function timelineToCanvas(type) {
    const svgText = serializeTimelineSvg(dom.timelineSvg);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const svgWidth = Number(dom.timelineSvg.getAttribute("width"));
    const svgHeight = Number(dom.timelineSvg.getAttribute("height"));
    const maxPixels = 24000000;
    const scale = clamp(Math.sqrt(maxPixels / Math.max(1, svgWidth * svgHeight)), 0.35, 2);
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(svgWidth * scale);
    canvas.height = Math.ceil(svgHeight * scale);

    try {
      const image = await loadImage(url);
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.scale(scale, scale);
      context.drawImage(image, 0, 0, svgWidth, svgHeight);
      if (type === "image/jpeg") {
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, svgWidth, svgHeight);
      }
      return canvas;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function svgEl(tagName, attributes = {}, text = null) {
    const node = document.createElementNS(NS, tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      node.setAttribute(key, String(value));
    });
    if (text !== null) node.textContent = text;
    return node;
  }

  function fitText(text, maxWidth) {
    const value = String(text || "");
    if (maxWidth <= 0) return "";
    const estimatedWidth = estimateSvgTextWidth(value);
    if (estimatedWidth <= maxWidth) return value;
    const maxChars = Math.max(3, Math.floor(maxWidth / AXIS_LABEL_CHAR_WIDTH) - 3);
    return `${value.slice(0, maxChars)}...`;
  }

  function estimateSvgTextWidth(text) {
    return String(text || "").length * AXIS_LABEL_CHAR_WIDTH;
  }

  function readableTextColor(hex) {
    const clean = normalizeColor(hex).slice(1);
    const red = parseInt(clean.slice(0, 2), 16);
    const green = parseInt(clean.slice(2, 4), 16);
    const blue = parseInt(clean.slice(4, 6), 16);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    return luminance > 0.56 ? "#1d2732" : "#ffffff";
  }

  function adjustColor(hex, amount) {
    const clean = normalizeColor(hex).slice(1);
    const red = clamp(parseInt(clean.slice(0, 2), 16) + amount, 0, 255);
    const green = clamp(parseInt(clean.slice(2, 4), 16) + amount, 0, 255);
    const blue = clamp(parseInt(clean.slice(4, 6), 16) + amount, 0, 255);
    return `#${[red, green, blue].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
  }

  function normalizeColor(value) {
    const text = String(value || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(text) ? text : ITEM_COLOR_PALETTE[6].value;
  }

  function randomPaletteColor() {
    if (!ITEM_COLOR_PALETTE.length) return TYPE_COLORS.event;
    let index = randomIndex(ITEM_COLOR_PALETTE.length);
    if (ITEM_COLOR_PALETTE.length > 1 && index === lastPaletteColorIndex) {
      index = (index + 1) % ITEM_COLOR_PALETTE.length;
    }
    lastPaletteColorIndex = index;
    return ITEM_COLOR_PALETTE[index].value;
  }

  function randomIndex(max) {
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function pixelsPerDay() {
    return zoom / AVG_DAYS_PER_MONTH;
  }

  function snapDate(isoDate) {
    const date = normalizeDateInput(isoDate, timeline.settings.startDate);
    const snap = normalizeSnap(timeline.settings.snap);
    if (snap === "year") {
      const currentYear = isoYear(date);
      const midYear = `${currentYear}-07-02`;
      return yearStartIso(compareIso(date, midYear) < 0 ? currentYear : currentYear + 1);
    }
    if (snap === "month") {
      const year = isoYear(date);
      const month = isoMonth(date);
      const day = isoDay(date);
      return isoFromParts(month === 11 && day >= 16 ? year + 1 : year, day >= 16 ? (month + 1) % 12 : month, 1);
    }
    if (snap === "week") {
      const days = daysBetween(timeline.settings.startDate, date);
      return addDaysIso(timeline.settings.startDate, Math.round(days / 7) * 7);
    }
    return addDaysIso(timeline.settings.startDate, daysBetween(timeline.settings.startDate, date));
  }

  function minDurationDays() {
    if (timeline.settings.snap === "year") return 365;
    if (timeline.settings.snap === "month") return 28;
    if (timeline.settings.snap === "week") return 7;
    return 1;
  }

  function defaultEndDate(startDate) {
    if (timeline.settings.snap === "year") return addYearsIso(startDate, 1);
    if (timeline.settings.snap === "week") return addDaysIso(startDate, 7);
    if (timeline.settings.snap === "day") return addDaysIso(startDate, 1);
    return addMonthsIso(startDate, 1);
  }

  function createId(prefix) {
    if (window.crypto && crypto.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function safeSvgId(value) {
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
  }

  function filenameBase() {
    const slug = timeline.settings.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 42);
    return slug || "timeline";
  }

  function setStatus(message) {
    dom.statusText.textContent = message;
  }
})();

export {};

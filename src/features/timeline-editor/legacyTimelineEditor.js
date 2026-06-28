import {
  addDaysIso,
  addMonthsIso,
  clamp,
  clampIso,
  daysBetween,
  isoDay,
  isoFromParts,
  isoYear,
  normalizeDateInput,
  normalizeSnap,
  todayIso,
  toNumber,
} from "../../timeline/dates";
import {
  ITEM_COLOR_PALETTE,
  TYPE_COLORS,
  createEmptyTimeline,
  hasEndYear,
  isGlobalTimelineItemType,
  normalizeItem,
  normalizeTimeline,
  titleForType,
} from "../../timeline/model";
import {
  adjustColor,
  hexToHsv,
  hexToRgb,
  hsvToHex,
  normalizeColor,
  normalizeOptionalColor,
  readableTextColor,
  rgbToHex,
} from "../../timeline/colors";
import {
  TIMELINE_JSON_MIME,
  parseTimelineJson,
  serializeTimelineJson,
} from "../../timeline/json";
import {
  formatDatePair,
  formatDisplayDate,
  formatIranianDate,
  formatZoomValue,
  iranianMonthName,
  monthName,
} from "../../timeline/formatters";
import {
  formatAgeAtDate,
  formatCompactDateSpan,
  formatDetailedAgeAtDate,
  formatDetailedAgeValueAtDate,
  formatDetailedDateSpan,
} from "../../timeline/dateSpans";
import {
  buildPdfFromJpeg,
} from "../../timeline/export/pdf";
import {
  serializeTimelineSvg,
} from "../../timeline/export/svgExport";
import {
  canPickFileWithPicker,
  downloadBlob,
  pickFileWithPicker,
  saveBlobToHandle,
  saveBlobWithPicker,
} from "../../platform/files";
import {
  canvasToBlob,
  loadImage,
} from "../../platform/media";
import {
  isEditableShortcutTarget,
} from "./interactions/keyboardShortcuts";
import {
  rangesOverlap,
  snapEdgeOffset,
  snapMoveDelta,
} from "./interactions/edgeSnap";
import {
  canPlaceAxisLabel,
} from "./layout/axisLayout";
import {
  defaultEndDateForSnap,
  fitZoomForTimeline,
  minDurationDaysForSnap,
  snapTimelineDate,
  timelineDateToX,
  timelinePixelsPerDay,
  timelineXToDate,
} from "./layout/timelineLayout";
import {
  findAvailableNoteY,
  noteBubblePath,
  noteTextFirstBaseline,
  textDirectionFor,
  wrapNoteText,
} from "./layout/noteLayout";
import {
  hasFiniteNumber,
  noteBorderColor,
  noteDisplayText,
  noteSizeForItem,
  noteTextColorForItem,
  noteTitleFromText,
} from "./items/noteItem";

(() => {
  const ZOOM_KEY = "timeline-studio-zoom-v2";
  const NS = "http://www.w3.org/2000/svg";
  const LEFT_GUTTER = 132;
  const RIGHT_GUTTER = 110;
  const AXIS_HEIGHT = 112;
  const FOOTER_HEIGHT = 34;
  const DEFAULT_ROW_HEIGHT = 68;
  const AXIS_LABEL_CHAR_WIDTH = 7.2;
  const AXIS_MONTH_LABEL_GAP = 14;
  const AXIS_DAY_LABEL_GAP = 8;
  const NOTE_AREA_TOP_GAP = 14;
  const NOTE_AREA_BOTTOM_GAP = 26;
  const NOTE_TIP_HEIGHT = 7;
  const NOTE_TIP_HALF_WIDTH = 9;
  const NOTE_TIP_MAX_LEAN = 7;
  const NOTE_DEFAULT_WIDTH = 196;
  const NOTE_DEFAULT_HEIGHT = 50;
  const NOTE_MIN_WIDTH = 84;
  const NOTE_MAX_WIDTH = 420;
  const NOTE_MIN_HEIGHT = 44;
  const NOTE_MAX_HEIGHT = 280;
  const NOTE_PADDING_X = 9;
  const NOTE_TEXT_VERTICAL_PADDING = 8;
  const NOTE_TEXT_BASELINE_OFFSET = 13;
  const NOTE_LINE_HEIGHT = 17;
  const NOTE_STACK_GAP = 10;
  const NOTE_DOUBLE_CLICK_MS = 520;
  const NOTE_DOUBLE_CLICK_DISTANCE = 12;
  const MIN_ZOOM = 6;
  const MAX_ZOOM = 360;
  const DEFAULT_ZOOM = 18;
  const FIT_MIN_ZOOM = MIN_ZOOM;
  const EDGE_SNAP_PIXELS = 14;
  const EDGE_SNAP_MAX_DAYS = 14;
  const AVG_DAYS_PER_MONTH = 365.2425 / 12;
  const TIMELINE_ITEM_TYPES = ["birth", "event", "marker", "note", "period", "line", "text"];
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
    itemsLockedButton: document.getElementById("itemsLockedButton"),
    snapInput: document.getElementById("snapInput"),
    laneList: document.getElementById("laneList"),
    addLaneButton: document.getElementById("addLaneButton"),
    lineEditorPopover: document.getElementById("lineEditorPopover"),
    lineEditorForm: document.getElementById("lineEditorForm"),
    lineEditorTitle: document.getElementById("lineEditorTitle"),
    lineNameInput: document.getElementById("lineNameInput"),
    lineColorInput: document.getElementById("lineColorInput"),
    lineColorTrigger: document.getElementById("lineColorTrigger"),
    lineColorPreview: document.getElementById("lineColorPreview"),
    lineColorValue: document.getElementById("lineColorValue"),
    lineColorPanel: document.getElementById("lineColorPanel"),
    lineColorPlane: document.getElementById("lineColorPlane"),
    lineColorPlaneMarker: document.getElementById("lineColorPlaneMarker"),
    lineColorHueInput: document.getElementById("lineColorHueInput"),
    lineColorHexInput: document.getElementById("lineColorHexInput"),
    lineColorPalette: document.getElementById("lineColorPalette"),
    lineColorClearButton: document.getElementById("lineColorClearButton"),
    lineAddBelowButton: document.getElementById("lineAddBelowButton"),
    lineRemoveButton: document.getElementById("lineRemoveButton"),
    lineEditorCloseButton: document.getElementById("lineEditorCloseButton"),
    itemForm: document.getElementById("itemForm"),
    itemTypeInput: document.getElementById("itemTypeInput"),
    itemTitleField: document.getElementById("itemTitleField"),
    itemTitleInput: document.getElementById("itemTitleInput"),
    itemLaneInput: document.getElementById("itemLaneInput"),
    itemColorField: document.getElementById("itemColorField"),
    itemColorInput: document.getElementById("itemColorInput"),
    itemColorTrigger: document.getElementById("itemColorTrigger"),
    itemColorPreview: document.getElementById("itemColorPreview"),
    itemColorValue: document.getElementById("itemColorValue"),
    itemColorPanel: document.getElementById("itemColorPanel"),
    itemColorPlane: document.getElementById("itemColorPlane"),
    itemColorPlaneMarker: document.getElementById("itemColorPlaneMarker"),
    itemColorHueInput: document.getElementById("itemColorHueInput"),
    itemColorHexInput: document.getElementById("itemColorHexInput"),
    itemColorPalette: document.getElementById("itemColorPalette"),
    itemTextColorField: document.getElementById("itemTextColorField"),
    itemTextColorInput: document.getElementById("itemTextColorInput"),
    itemTextColorTrigger: document.getElementById("itemTextColorTrigger"),
    itemTextColorPreview: document.getElementById("itemTextColorPreview"),
    itemTextColorValue: document.getElementById("itemTextColorValue"),
    itemTextColorPanel: document.getElementById("itemTextColorPanel"),
    itemTextColorPlane: document.getElementById("itemTextColorPlane"),
    itemTextColorPlaneMarker: document.getElementById("itemTextColorPlaneMarker"),
    itemTextColorHueInput: document.getElementById("itemTextColorHueInput"),
    itemTextColorHexInput: document.getElementById("itemTextColorHexInput"),
    itemTextColorPalette: document.getElementById("itemTextColorPalette"),
    itemNotesField: document.getElementById("itemNotesField"),
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
    noteInlineEditor: document.getElementById("noteInlineEditor"),
    timelineEmptyState: document.getElementById("timelineEmptyState"),
    timelineContextMenu: document.getElementById("timelineContextMenu"),
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
  let copiedItem = null;
  let contextMenuTarget = null;
  let lineEditorLaneIndex = null;
  let itemColorPicker = null;
  let itemTextColorPicker = null;
  let lineColorPicker = null;
  let lastNoteLayouts = new Map();
  let lastNotePointerDown = null;
  let noteMeasureContext = null;
  let noteMeasureFont = "";
  let editingNoteId = null;
  let editingNoteOriginalNotes = "";
  let editingNoteOriginalDisplayText = "";

  init();

  function init() {
    timeline = normalizeTimeline(timeline);
    bindEvents();
    setZoom(zoom, { render: false });
    renderAll({ save: false });
    setStatus("Ready");
  }

  function bindEvents() {
    setupColorPickers();

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
    dom.itemsLockedButton.addEventListener("click", () => setItemsLocked(!timeline.settings.itemsLocked));
    dom.snapInput.addEventListener("change", updateTimelineFromControls);
    [dom.itemStartInput, dom.itemEndInput].forEach((control) => {
      control.addEventListener("input", updateItemCalendarPreviewFromInputs);
      control.addEventListener("change", updateItemCalendarPreviewFromInputs);
      control.addEventListener("keydown", handleItemDateKeydown);
    });

    dom.itemTypeInput.addEventListener("change", () => {
      const type = dom.itemTypeInput.value;
      updateItemFieldVisibilityForType(type);
      updateItemNotesLabel({ type });
      const item = getItem(selectedId);
      setColorPickerDisabled(itemTextColorPicker, !item || isItemReadOnly(item) || type !== "note");
      dom.itemEndField.hidden = !hasEndYear(type);
      dom.itemDerivedLabelsField.hidden = type !== "period";
      dom.itemLaneInput.disabled = isGlobalTimelineItemType(type);
      if (isGlobalTimelineItemType(type)) dom.itemLaneInput.value = "0";
      updateItemCalendarPreviewFromInputs();
    });
    dom.itemColorInput.addEventListener("input", handleItemColorInput);
    dom.itemColorInput.addEventListener("change", handleItemColorInput);
    if (dom.itemTextColorInput) dom.itemTextColorInput.addEventListener("input", handleItemTextColorInput);
    if (dom.itemTextColorInput) dom.itemTextColorInput.addEventListener("change", handleItemTextColorInput);
    dom.itemNotesInput.addEventListener("input", updateNotesInputDirection);

    dom.itemForm.addEventListener("submit", (event) => {
      event.preventDefault();
      applyItemForm();
    });

    dom.deleteItemButton.addEventListener("click", deleteSelectedItem);
    dom.duplicateItemButton.addEventListener("click", duplicateSelectedItem);
    if (dom.addLaneButton) dom.addLaneButton.addEventListener("click", () => addLaneAfter(ensureLaneLabels().length - 1));
    if (dom.lineEditorForm) dom.lineEditorForm.addEventListener("submit", applyLineEditor);
    if (dom.lineNameInput) dom.lineNameInput.addEventListener("input", updateLineEditorNameDraft);
    if (dom.lineNameInput) dom.lineNameInput.addEventListener("blur", commitLineEditorName);
    if (dom.lineColorInput) dom.lineColorInput.addEventListener("input", updateLineEditorColor);
    if (dom.lineColorInput) dom.lineColorInput.addEventListener("change", updateLineEditorColor);
    if (dom.lineColorClearButton) dom.lineColorClearButton.addEventListener("click", clearLineEditorColor);
    if (dom.lineAddBelowButton) dom.lineAddBelowButton.addEventListener("click", addLineFromEditor);
    if (dom.lineRemoveButton) dom.lineRemoveButton.addEventListener("click", removeLineFromEditor);
    if (dom.lineEditorCloseButton) dom.lineEditorCloseButton.addEventListener("click", closeLineEditor);
    dom.timelineContextMenu.addEventListener("click", handleContextMenuClick);

    dom.saveJsonButton.addEventListener("click", saveJsonFile);
    dom.loadJsonButton.addEventListener("click", openJsonFile);
    dom.fileInput.addEventListener("change", loadJsonFile);
    document.addEventListener("keydown", handleGlobalKeydown);
    document.addEventListener("copy", handleGlobalCopy);
    document.addEventListener("paste", handleGlobalPaste);

    dom.exportSvgButton.addEventListener("click", exportSvgFile);
    dom.exportPngButton.addEventListener("click", exportPngFile);
    dom.exportPdfButton.addEventListener("click", exportPdfFile);

    dom.zoomRange.addEventListener("input", () => setZoom(Number(dom.zoomRange.value)));
    dom.zoomInButton.addEventListener("click", () => zoomBy(20));
    dom.zoomOutButton.addEventListener("click", () => zoomBy(-20));
    dom.fitButton.addEventListener("click", fitTimelineToViewport);

    dom.timelineViewport.addEventListener("wheel", handleViewportWheel, { passive: false });
    dom.timelineViewport.addEventListener("contextmenu", openTimelineContextMenu);
    dom.timelineViewport.addEventListener("click", openNoteEditorFromClickCount);
    dom.timelineViewport.addEventListener("dblclick", openNoteEditorFromDoubleClick);
    dom.timelineViewport.addEventListener("keydown", (event) => {
      const addNode = event.target.closest?.("[data-timeline-lane-add]");
      if (addNode && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        addLaneAfter(ensureLaneLabels().length - 1);
        return;
      }
      const laneNode = event.target.closest?.("[data-timeline-lane-index]");
      if (laneNode && event.key === "Enter") {
        event.preventDefault();
        const rect = dom.timelineViewport.getBoundingClientRect();
        openLineEditor(Number(laneNode.dataset.timelineLaneIndex), rect.left + 48, rect.top + 96);
        return;
      }
      if (isEditableShortcutTarget(event.target)) return;
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
    if (dom.noteInlineEditor) {
      dom.noteInlineEditor.addEventListener("blur", commitNoteInlineEditor);
      dom.noteInlineEditor.addEventListener("input", updateNoteInlineEditorDirection);
      dom.noteInlineEditor.addEventListener("keydown", handleNoteInlineEditorKeydown);
      dom.noteInlineEditor.addEventListener("pointerdown", (event) => event.stopPropagation());
      dom.noteInlineEditor.addEventListener("click", (event) => event.stopPropagation());
      dom.noteInlineEditor.addEventListener("contextmenu", (event) => event.stopPropagation());
      dom.noteInlineEditor.addEventListener("dblclick", (event) => event.stopPropagation());
    }
    document.addEventListener("pointerdown", commitNoteInlineEditorFromPointer, true);
    document.addEventListener("pointerdown", closeContextMenuFromPointer, true);
    document.addEventListener("pointerdown", closeLineEditorFromPointer, true);
    document.addEventListener("pointerdown", closeColorPickersFromPointer, true);
    window.addEventListener("resize", () => {
      closeContextMenu();
      closeLineEditor();
      closeColorPickers();
    });
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
    positionNoteInlineEditor();
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
    const timelineWidth = LEFT_GUTTER + daysBetween(settings.startDate, contentEndDate) * pixelsPerDay() + RIGHT_GUTTER;
    const viewportWidth = Math.ceil(dom.timelineViewport.clientWidth || 0);
    const contentWidth = Math.max(timelineWidth, viewportWidth);
    const laneAreaBottom = AXIS_HEIGHT + laneCount * rowHeight;
    const noteLayouts = computeNoteLayouts(laneCount, rowHeight, contentWidth);
    lastNoteLayouts = noteLayouts;
    const noteAreaHeight = getNoteAreaHeight(noteLayouts, laneAreaBottom);
    const contentHeight = laneAreaBottom + FOOTER_HEIGHT + noteAreaHeight;

    svg.setAttribute("width", String(Math.ceil(contentWidth)));
    svg.setAttribute("height", String(Math.ceil(contentHeight)));
    svg.setAttribute("viewBox", `0 0 ${Math.ceil(contentWidth)} ${Math.ceil(contentHeight)}`);

    const defs = svgEl("defs");
    svg.append(defs);
    svg.append(svgEl("rect", { class: "canvas-bg", x: 0, y: 0, width: contentWidth, height: contentHeight }));
    svg.append(svgEl("rect", { class: "axis-band", x: 0, y: 0, width: contentWidth, height: AXIS_HEIGHT }));
    svg.append(svgEl("line", { class: "lane-rule", x1: 0, x2: contentWidth, y1: AXIS_HEIGHT, y2: AXIS_HEIGHT }));

    drawLaneBackgrounds(svg, settings, laneCount, rowHeight, contentWidth);
    drawGrid(svg, settings, laneCount, rowHeight, contentHeight, contentWidth);
    drawLaneLabels(svg, settings, laneCount, rowHeight);

    const isEmpty = timeline.items.length === 0;
    dom.timelineViewport.classList.toggle("is-empty", isEmpty);
    if (dom.timelineEmptyState) dom.timelineEmptyState.hidden = !isEmpty;

    const sortedItems = timeline.items
      .slice()
      .sort((a, b) => a.lane - b.lane || compareIso(a.startDate, b.startDate));
    drawNoteLeaderLayer(svg, defs, sortedItems, laneCount, rowHeight, noteLayouts);
    sortedItems
      .filter((item) => isGlobalTimelineItemType(item.type))
      .forEach((item) => drawItem(svg, defs, item, rowHeight, laneCount, contentWidth, contentHeight, noteLayouts));
    sortedItems
      .filter((item) => !isGlobalTimelineItemType(item.type))
      .forEach((item) => drawItem(svg, defs, item, rowHeight, laneCount, contentWidth, contentHeight, noteLayouts));
  }

  function drawGrid(svg, settings, laneCount, rowHeight, contentHeight, contentWidth) {
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
      svg.append(svgEl("line", { class: "lane-rule", x1: 0, x2: contentWidth, y1: y, y2: y }));
    }
  }

  function drawLaneBackgrounds(svg, settings, laneCount, rowHeight, contentWidth) {
    const colors = ensureLaneColors();
    for (let lane = 0; lane < laneCount; lane += 1) {
      const color = colors[lane];
      if (!color) continue;
      svg.append(svgEl("rect", {
        class: "lane-background",
        x: 0,
        y: AXIS_HEIGHT + lane * rowHeight,
        width: contentWidth,
        height: rowHeight,
        fill: color,
      }));
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
    if (cellWidth >= 4 && canPlaceAxisLabel({ centerX, width, lastLabelEnd, gap: AXIS_DAY_LABEL_GAP })) {
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

    if (cellWidth >= stackedWidth + 18 && canPlaceAxisLabel({
      centerX,
      width: stackedWidth,
      lastLabelEnd,
      gap: AXIS_MONTH_LABEL_GAP,
    })) {
      svg.append(svgEl("text", { class: "axis-month axis-month-gregorian", x: centerX, y: gregorianY, "text-anchor": "middle" }, gregorian));
      svg.append(svgEl("text", { class: "axis-month axis-month-iranian", x: centerX, y: iranianY, "text-anchor": "middle" }, iranian));
      return centerX + stackedWidth / 2;
    }

    const compactWidth = estimateSvgTextWidth(gregorian);
    if (cellWidth >= compactWidth + 12 && canPlaceAxisLabel({
      centerX,
      width: compactWidth,
      lastLabelEnd,
      gap: AXIS_MONTH_LABEL_GAP,
    })) {
      svg.append(svgEl("text", { class: "axis-month axis-month-compact", x: centerX, y: compactY, "text-anchor": "middle" }, gregorian));
      return centerX + compactWidth / 2;
    }

    return lastLabelEnd;
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
        width: LEFT_GUTTER - 46,
        height: rowHeight - 16,
        rx: 7,
        fill: "transparent",
      }));
      [-7, 0, 7].forEach((offset) => {
        group.append(svgEl("circle", { class: "lane-label-grip", cx: 18, cy: centerY + offset, r: 1.7 }));
      });
      group.append(svgEl("text", { class: "lane-label", x: 28, y: centerY + 4 }, fitText(label, LEFT_GUTTER - 66)));
      svg.append(group);
    }
    const addY = AXIS_HEIGHT + laneCount * rowHeight + FOOTER_HEIGHT / 2;
    const addGroup = svgEl("g", {
      class: "lane-add-control",
      "data-timeline-lane-add": "true",
      tabindex: "0",
      "aria-label": "Add line",
    });
    addGroup.append(svgEl("rect", {
      class: "lane-add-hit",
      x: 8,
      y: addY - 13,
      width: LEFT_GUTTER - 20,
      height: 26,
      rx: 7,
    }));
    addGroup.append(svgEl("line", { class: "lane-add-icon", x1: 23, x2: 35, y1: addY, y2: addY }));
    addGroup.append(svgEl("line", { class: "lane-add-icon", x1: 29, x2: 29, y1: addY - 6, y2: addY + 6 }));
    addGroup.append(svgEl("text", { class: "lane-add-label", x: 44, y: addY + 4 }, "Add line"));
    svg.append(addGroup);
  }

  function drawItem(svg, defs, item, rowHeight, laneCount, contentWidth, contentHeight, noteLayouts) {
    const group = svgEl("g", {
      class: `item item-${item.type}${item.locked ? " locked" : ""}${item.id === selectedId ? " selected" : ""}`,
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
      drawNote(group, defs, item, x1, y, noteLayouts);
    } else {
      drawTextItem(group, item, x1, y);
    }

    if (item.id === selectedId) drawSelection(group, item, x1, x2, y, laneCount, rowHeight, contentWidth, contentHeight, noteLayouts);
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

  function drawNoteLeaderLayer(svg, defs, items, laneCount, rowHeight, noteLayouts) {
    const layer = svgEl("g", { class: "note-leader-layer", "aria-hidden": "true" });
    items
      .filter((item) => item.type === "note")
      .forEach((item) => {
        const layout = noteLayouts.get(item.id);
        if (!layout) return;
        const x = dateToX(item.startDate);
        const y = AXIS_HEIGHT + item.lane * rowHeight + rowHeight / 2;
        const markerId = ensureNoteArrowMarker(defs, item);
        layer.append(svgEl("line", {
          class: `note-leader${item.id === selectedId ? " selected" : ""}`,
          x1: layout.tipX,
          y1: layout.tipY,
          x2: x,
          y2: y,
          stroke: item.color,
          "marker-end": `url(#${markerId})`,
        }));
      });
    if (layer.childNodes.length) svg.append(layer);
  }

  function ensureNoteArrowMarker(defs, item) {
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
    return markerId;
  }

  function drawNote(group, defs, item, x, y, noteLayouts) {
    const layout = noteLayouts.get(item.id);
    if (!layout) return;
    const gradientId = ensureNoteBalloonGradient(defs, item, layout);
    group.append(svgEl("circle", { class: "note-anchor", cx: x, cy: y, r: 6, fill: item.color }));
    group.append(svgEl("path", {
      class: "note-balloon",
      "data-note-drag": "true",
      "data-note-edit": "true",
      d: noteBubblePath(layout, noteBubblePathOptions()),
      fill: `url(#${gradientId})`,
      stroke: noteBorderColor(item.color),
    }));
    drawNoteText(group, layout);
  }

  function ensureNoteBalloonGradient(defs, item, layout) {
    const gradientId = `note-balloon-fill-${safeSvgId(item.id)}`;
    if (!document.getElementById(gradientId)) {
      const gradient = svgEl("linearGradient", {
        id: gradientId,
        x1: layout.x,
        y1: layout.y,
        x2: layout.x,
        y2: layout.y + layout.height,
        gradientUnits: "userSpaceOnUse",
      });
      gradient.append(svgEl("stop", { offset: "0", "stop-color": adjustColor(item.color, 26), "stop-opacity": "1" }));
      gradient.append(svgEl("stop", { offset: "0.58", "stop-color": item.color, "stop-opacity": "1" }));
      gradient.append(svgEl("stop", { offset: "1", "stop-color": adjustColor(item.color, -10), "stop-opacity": "1" }));
      defs.append(gradient);
    }
    return gradientId;
  }

  function drawTextItem(group, item, x, y) {
    group.append(svgEl("circle", { cx: x, cy: y, r: 4, fill: item.color }));
    group.append(svgEl("text", { class: "note-label", x: x + 10, y: y + 5, fill: item.color }, item.title));
  }

  function drawSelection(group, item, x1, x2, y, laneCount, rowHeight, contentWidth, contentHeight, noteLayouts) {
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
      const layout = noteLayouts.get(item.id);
      if (!layout) return;
      const handleSize = 12;
      const handleX = layout.x + layout.width - handleSize - 1;
      const handleY = layout.y + layout.height - handleSize - 1;
      group.append(svgEl("path", {
        class: "selection-outline note-selection-outline",
        d: noteBubblePath(layout, noteBubblePathOptions()),
      }));
      group.append(svgEl("rect", {
        class: "resize-handle note-resize-handle note-resize-hit",
        "data-item-id": item.id,
        "data-handle": "note-resize",
        x: handleX - 2,
        y: handleY - 2,
        width: handleSize + 4,
        height: handleSize + 4,
        rx: 2,
      }));
      group.append(svgEl("path", {
        class: "resize-handle note-resize-handle note-resize-icon",
        d: [
          `M ${handleX + 7} ${handleY + 12} L ${handleX + 12} ${handleY + 7}`,
          `M ${handleX + 3} ${handleY + 12} L ${handleX + 12} ${handleY + 3}`,
        ].join(" "),
      }));
    } else {
      group.append(svgEl("rect", { class: "selection-outline", x: x1 - 12, y: y - 22, width: 210, height: 44, rx: 8 }));
    }
  }

  function computeNoteLayouts(laneCount, rowHeight, contentWidth) {
    const layouts = new Map();
    const placedLayouts = [];
    const baseY = noteBaseY(laneCount, rowHeight);
    const textLayoutOptions = noteTextLayoutOptions();
    timeline.items
      .filter((item) => item.type === "note")
      .slice()
      .sort((a, b) => compareIso(a.startDate, b.startDate) || a.lane - b.lane || String(a.id).localeCompare(String(b.id)))
      .forEach((item) => {
        const anchorX = dateToX(item.startDate);
        const size = noteSizeForItem(item, noteSizeOptions());
        const rawX = hasFiniteNumber(item.noteOffsetX)
          ? anchorX + Number(item.noteOffsetX)
          : anchorX - size.width / 2;
        const x = clamp(rawX, 12, Math.max(12, contentWidth - size.width - 12));
        const y = hasFiniteNumber(item.noteOffsetY)
          ? baseY + Number(item.noteOffsetY)
          : findAvailableNoteY({ x, y: baseY, width: size.width, height: size.height }, placedLayouts, baseY, NOTE_STACK_GAP);
        const text = noteDisplayText(item);
        const layout = {
          itemId: item.id,
          anchorX,
          x,
          y,
          width: size.width,
          height: size.height,
          text,
          textColor: noteTextColorForItem(item),
          direction: textDirectionFor(text),
          lines: wrapNoteText(text, size.width - NOTE_PADDING_X * 2, size.height, textLayoutOptions),
          tipX: clamp(anchorX, x + NOTE_TIP_HALF_WIDTH + 10, x + size.width - NOTE_TIP_HALF_WIDTH - 10),
          tipY: y,
        };
        layouts.set(item.id, layout);
        placedLayouts.push(layout);
      });
    return layouts;
  }

  function getNoteAreaHeight(noteLayouts, laneAreaBottom) {
    if (!noteLayouts.size) return 0;
    let bottom = laneAreaBottom + FOOTER_HEIGHT;
    noteLayouts.forEach((layout) => {
      bottom = Math.max(bottom, layout.y + layout.height);
    });
    return Math.max(0, bottom - (laneAreaBottom + FOOTER_HEIGHT) + NOTE_AREA_BOTTOM_GAP);
  }

  function noteBaseY(laneCount, rowHeight) {
    return AXIS_HEIGHT + laneCount * rowHeight + FOOTER_HEIGHT + NOTE_AREA_TOP_GAP;
  }

  function noteBubblePathOptions(pad = 0) {
    return {
      tipHeight: NOTE_TIP_HEIGHT,
      tipHalfWidth: NOTE_TIP_HALF_WIDTH,
      tipMaxLean: NOTE_TIP_MAX_LEAN,
      pad,
    };
  }

  function noteSizeOptions() {
    return {
      defaultWidth: NOTE_DEFAULT_WIDTH,
      defaultHeight: NOTE_DEFAULT_HEIGHT,
      minWidth: NOTE_MIN_WIDTH,
      maxWidth: NOTE_MAX_WIDTH,
      minHeight: NOTE_MIN_HEIGHT,
      maxHeight: NOTE_MAX_HEIGHT,
      paddingX: NOTE_PADDING_X,
      tipHeight: NOTE_TIP_HEIGHT,
      textVerticalPadding: NOTE_TEXT_VERTICAL_PADDING,
      lineHeight: NOTE_LINE_HEIGHT,
      measureText: measureNoteTextWidth,
    };
  }

  function noteTextLayoutOptions() {
    return {
      tipHeight: NOTE_TIP_HEIGHT,
      verticalPadding: NOTE_TEXT_VERTICAL_PADDING,
      baselineOffset: NOTE_TEXT_BASELINE_OFFSET,
      lineHeight: NOTE_LINE_HEIGHT,
      measureText: measureNoteTextWidth,
    };
  }

  function drawNoteText(group, layout) {
    const isRtl = layout.direction === "rtl";
    const textX = isRtl ? layout.x + layout.width - NOTE_PADDING_X : layout.x + NOTE_PADDING_X;
    const textY = noteTextFirstBaseline(layout, noteTextLayoutOptions());
    const text = svgEl("text", {
      class: "note-balloon-text",
      "data-note-drag": "true",
      "data-note-edit": "true",
      x: textX,
      y: textY,
      fill: layout.textColor,
      direction: layout.direction,
      "text-anchor": "start",
      "unicode-bidi": "plaintext",
    });
    layout.lines.forEach((line, index) => {
      text.append(svgEl("tspan", {
        x: textX,
        dy: index === 0 ? 0 : NOTE_LINE_HEIGHT,
      }, line));
    });
    group.append(text);
  }

  function measureNoteTextWidth(text) {
    const value = String(text || "");
    if (!noteMeasureContext) {
      noteMeasureContext = document.createElement("canvas").getContext("2d");
    }
    if (!noteMeasureContext) return estimateSvgTextWidth(value);
    if (!noteMeasureFont) {
      const rootStyle = getComputedStyle(document.documentElement);
      noteMeasureFont = `700 13px ${rootStyle.fontFamily || "sans-serif"}`;
    }
    noteMeasureContext.font = noteMeasureFont;
    return noteMeasureContext.measureText(value).width;
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
    const lineText = isGlobalTimelineItemType(item.type) || item.type === "note" ? "" : ` - Line ${item.lane + 1}`;
    const lockedText = item.locked ? "Locked - " : "";
    const title = item.type === "note" ? noteTitleFromText(noteDisplayText(item)) : item.title;
    return `${lockedText}${itemTypeLabel(item.type)}: ${title}${lineText}`;
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
    syncItemsLockedButton();
    dom.timelineViewport.classList.toggle("items-locked", timeline.settings.itemsLocked);
    dom.snapInput.value = String(timeline.settings.snap);
    dom.zoomRange.value = String(zoom);
    dom.zoomLabel.textContent = `${formatZoomValue(zoom)} px/month`;
    suppressControlEvents = false;
  }

  function syncItemForm() {
    const item = getItem(selectedId);
    const itemReadOnly = item ? isItemReadOnly(item) : true;
    const controls = [
      dom.itemTypeInput,
      dom.itemTitleInput,
      dom.itemLaneInput,
      dom.itemColorInput,
      dom.itemTextColorInput,
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
      control.disabled = !item || itemReadOnly;
    });

    if (!item) {
      dom.itemTypeInput.value = "event";
      dom.itemTitleInput.value = "";
      dom.itemLaneInput.value = "";
      dom.itemColorInput.value = TYPE_COLORS.event;
      if (dom.itemTextColorInput) dom.itemTextColorInput.value = "";
      dom.itemStartInput.value = "";
      dom.itemEndInput.value = "";
      dom.itemAgeLabelsInput.checked = true;
      dom.itemDurationLabelInput.checked = true;
      dom.itemNotesInput.value = "";
      updateItemFieldVisibilityForType("event");
      updateItemNotesLabel(null);
      updateNotesInputDirection();
      dom.itemCalendarPreview.textContent = "Select an item to see Gregorian and Iranian dates.";
      dom.itemEndField.hidden = true;
      dom.itemDerivedLabelsField.hidden = true;
      setColorPickerValue(itemColorPicker, TYPE_COLORS.event, { emit: false });
      setColorPickerDisabled(itemColorPicker, true);
      setColorPickerValue(itemTextColorPicker, "#111827", { emit: false });
      setColorPickerDisabled(itemTextColorPicker, true);
      dom.itemForm.classList.add("empty-selection");
      suppressControlEvents = false;
      return;
    }

    dom.itemForm.classList.remove("empty-selection");
    dom.itemTypeInput.value = item.type;
    dom.itemTitleInput.value = item.title;
    dom.itemLaneInput.value = item.lane;
    setColorPickerValue(itemColorPicker, item.color, { emit: false });
    setColorPickerDisabled(itemColorPicker, itemReadOnly);
    setColorPickerValue(itemTextColorPicker, item.type === "note" ? noteTextColorForItem(item) : "#111827", { emit: false });
    setColorPickerDisabled(itemTextColorPicker, itemReadOnly || item.type !== "note");
    dom.itemStartInput.value = item.startDate;
    dom.itemEndInput.value = item.endDate;
    dom.itemAgeLabelsInput.checked = item.showAgeLabels !== false;
    dom.itemDurationLabelInput.checked = item.showDurationLabel !== false;
    dom.itemNotesInput.value = item.type === "note" ? noteDisplayText(item) : item.notes;
    updateItemFieldVisibilityForType(item.type);
    updateItemNotesLabel(item);
    updateNotesInputDirection();
    dom.itemEndField.hidden = !hasEndYear(item.type);
    dom.itemDerivedLabelsField.hidden = item.type !== "period";
    dom.itemLaneInput.disabled = itemReadOnly || isGlobalTimelineItemType(item.type);
    updateItemCalendarPreview(item);
    suppressControlEvents = false;
  }

  function updateItemNotesLabel(item) {
    const label = dom.itemNotesField?.querySelector("span");
    if (!label) return;
    label.textContent = item?.type === "note" ? "Balloon text" : "Notes";
    dom.itemNotesInput.placeholder = item?.type === "note"
      ? "Write the text shown inside the note balloon."
      : "Write private notes for this item.";
  }

  function updateItemFieldVisibilityForType(type) {
    if (dom.itemTitleField) dom.itemTitleField.hidden = type === "note";
    if (dom.itemTextColorField) dom.itemTextColorField.hidden = type !== "note";
    const colorLabel = dom.itemColorField?.querySelector(".field-caption");
    if (colorLabel) colorLabel.textContent = type === "note" ? "Balloon" : "Color";
  }

  function updateNotesInputDirection() {
    if (!dom.itemNotesInput) return;
    dom.itemNotesInput.dir = textDirectionFor(dom.itemNotesInput.value);
  }

  function setupColorPickers() {
    itemColorPicker = createColorPicker({
      name: "item",
      input: dom.itemColorInput,
      trigger: dom.itemColorTrigger,
      preview: dom.itemColorPreview,
      valueLabel: dom.itemColorValue,
      panel: dom.itemColorPanel,
      plane: dom.itemColorPlane,
      planeMarker: dom.itemColorPlaneMarker,
      hueInput: dom.itemColorHueInput,
      hexInput: dom.itemColorHexInput,
      palette: dom.itemColorPalette,
      defaultColor: TYPE_COLORS.event,
      emptyLabel: "",
      onChange: handleItemColorInput,
    });
    itemTextColorPicker = createColorPicker({
      name: "itemText",
      input: dom.itemTextColorInput,
      trigger: dom.itemTextColorTrigger,
      preview: dom.itemTextColorPreview,
      valueLabel: dom.itemTextColorValue,
      panel: dom.itemTextColorPanel,
      plane: dom.itemTextColorPlane,
      planeMarker: dom.itemTextColorPlaneMarker,
      hueInput: dom.itemTextColorHueInput,
      hexInput: dom.itemTextColorHexInput,
      palette: dom.itemTextColorPalette,
      defaultColor: "#111827",
      emptyLabel: "",
      onChange: handleItemTextColorInput,
    });
    lineColorPicker = createColorPicker({
      name: "line",
      input: dom.lineColorInput,
      trigger: dom.lineColorTrigger,
      preview: dom.lineColorPreview,
      valueLabel: dom.lineColorValue,
      panel: dom.lineColorPanel,
      plane: dom.lineColorPlane,
      planeMarker: dom.lineColorPlaneMarker,
      hueInput: dom.lineColorHueInput,
      hexInput: dom.lineColorHexInput,
      palette: dom.lineColorPalette,
      defaultColor: "#e2e8f0",
      emptyLabel: "No color",
      optional: true,
      onChange: updateLineEditorColor,
    });
  }

  function createColorPicker(config) {
    if (!config.input || !config.trigger || !config.panel || !config.plane || !config.hueInput || !config.hexInput) return null;
    const picker = {
      ...config,
      root: config.trigger.closest("[data-color-picker]"),
      hsv: hexToHsv(config.defaultColor),
      disabled: false,
    };

    picker.trigger.addEventListener("click", () => toggleColorPicker(picker));
    picker.hueInput.addEventListener("input", () => updateColorPickerFromHue(picker));
    picker.hexInput.addEventListener("input", () => updateColorPickerFromHex(picker, { commit: false }));
    picker.hexInput.addEventListener("change", () => updateColorPickerFromHex(picker, { commit: true }));
    picker.hexInput.addEventListener("blur", () => updateColorPickerFromHex(picker, { commit: true }));
    picker.hexInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      updateColorPickerFromHex(picker, { commit: true });
      setColorPickerOpen(picker, false);
    });
    picker.plane.addEventListener("pointerdown", (event) => beginColorPlaneDrag(picker, event));
    picker.plane.addEventListener("keydown", (event) => nudgeColorPlane(picker, event));
    renderColorPickerPalette(picker);
    setColorPickerValue(picker, config.optional ? "" : config.defaultColor, { emit: false });
    return picker;
  }

  function renderColorPickerPalette(picker) {
    if (!picker.palette) return;
    picker.palette.replaceChildren();
    ITEM_COLOR_PALETTE.forEach((swatch) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "color-swatch-button";
      button.dataset.color = swatch.value;
      button.style.setProperty("--swatch-color", swatch.value);
      button.setAttribute("aria-label", `Use ${swatch.name} color`);
      button.title = swatch.name;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        if (picker.disabled) return;
        setColorPickerValue(picker, swatch.value, { emit: true });
      });
      picker.palette.append(button);
    });
  }

  function toggleColorPicker(picker) {
    if (!picker || picker.disabled) return;
    setColorPickerOpen(picker, picker.panel.hidden);
  }

  function setColorPickerOpen(picker, isOpen) {
    if (!picker) return;
    if (isOpen) closeColorPickers(picker);
    picker.panel.hidden = !isOpen;
    picker.trigger.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      syncColorPickerControls(picker);
      positionColorPickerPanel(picker);
      requestAnimationFrame(() => picker.hexInput.select());
    }
  }

  function positionColorPickerPanel(picker) {
    picker.panel.style.visibility = "hidden";
    picker.panel.style.left = "0px";
    picker.panel.style.top = "0px";
    const rect = picker.panel.getBoundingClientRect();
    const rootRect = picker.root?.getBoundingClientRect();
    if (!rootRect) {
      picker.panel.style.visibility = "";
      return;
    }
    const viewportPadding = 8;
    const left = clamp(rootRect.left, viewportPadding, Math.max(viewportPadding, window.innerWidth - rect.width - viewportPadding));
    const preferredTop = rootRect.bottom + 8;
    const top = preferredTop + rect.height <= window.innerHeight - viewportPadding
      ? preferredTop
      : clamp(rootRect.top - rect.height - 8, viewportPadding, Math.max(viewportPadding, window.innerHeight - rect.height - viewportPadding));
    picker.panel.style.left = `${left}px`;
    picker.panel.style.top = `${top}px`;
    picker.panel.style.visibility = "";
  }

  function closeColorPickers(exceptPicker = null) {
    [itemColorPicker, itemTextColorPicker, lineColorPicker].forEach((picker) => {
      if (!picker || picker === exceptPicker) return;
      setColorPickerOpen(picker, false);
    });
  }

  function closeColorPickersFromPointer(event) {
    [itemColorPicker, itemTextColorPicker, lineColorPicker].forEach((picker) => {
      if (!picker || picker.panel.hidden || !picker.root) return;
      if (picker.root.contains(event.target)) return;
      if (picker.panel.contains(event.target)) return;
      setColorPickerOpen(picker, false);
    });
  }

  function setColorPickerDisabled(picker, disabled) {
    if (!picker) return;
    picker.disabled = disabled;
    picker.trigger.disabled = disabled;
    picker.hueInput.disabled = disabled;
    picker.hexInput.disabled = disabled;
    picker.plane.setAttribute("aria-disabled", String(disabled));
    picker.palette?.querySelectorAll(".color-swatch-button").forEach((button) => {
      button.disabled = disabled;
    });
    picker.root?.classList.toggle("is-disabled", disabled);
    if (disabled) setColorPickerOpen(picker, false);
  }

  function setColorPickerValue(picker, value, options = {}) {
    if (!picker) return;
    const normalized = picker.optional ? normalizeOptionalColor(value) : normalizeColor(value);
    const displayColor = normalized || picker.defaultColor;
    picker.input.value = normalized;
    picker.hsv = hexToHsv(displayColor);
    syncColorPickerControls(picker);
    if (options.emit === true && !suppressControlEvents) {
      picker.onChange();
    }
  }

  function syncColorPickerControls(picker) {
    const storedColor = picker.input.value;
    const displayColor = storedColor || picker.defaultColor;
    picker.preview?.style.setProperty("--selected-color", displayColor);
    picker.preview?.classList.toggle("is-empty", !storedColor);
    picker.valueLabel.textContent = storedColor ? storedColor.toUpperCase() : picker.emptyLabel;
    picker.panel.style.setProperty("--picker-hue-color", hsvToHex(picker.hsv.h, 100, 100));
    picker.planeMarker.style.left = `${picker.hsv.s}%`;
    picker.planeMarker.style.top = `${100 - picker.hsv.v}%`;
    picker.hueInput.value = String(Math.round(picker.hsv.h));
    picker.hexInput.value = storedColor || displayColor;
    picker.plane.setAttribute("aria-valuenow", String(Math.round(picker.hsv.s)));
    picker.plane.setAttribute("aria-valuetext", `Saturation ${Math.round(picker.hsv.s)} percent, brightness ${Math.round(picker.hsv.v)} percent`);
    picker.palette?.querySelectorAll(".color-swatch-button").forEach((button) => {
      const isActive = Boolean(storedColor) && button.dataset.color?.toLowerCase() === storedColor.toLowerCase();
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.disabled = picker.disabled;
    });
  }

  function updateColorPickerFromHue(picker) {
    if (picker.disabled) return;
    const hue = clamp(Number(picker.hueInput.value), 0, 360);
    setColorPickerValue(picker, hsvToHex(hue, picker.hsv.s, picker.hsv.v), { emit: true });
  }

  function updateColorPickerFromHex(picker, options = {}) {
    if (picker.disabled) return;
    const normalized = parseHexColor(picker.hexInput.value);
    if (normalized) {
      setColorPickerValue(picker, normalized, { emit: true });
      return;
    }
    if (options.commit === true) {
      picker.hexInput.value = picker.input.value || picker.defaultColor;
    }
  }

  function beginColorPlaneDrag(picker, event) {
    if (picker.disabled) return;
    event.preventDefault();
    picker.plane.setPointerCapture?.(event.pointerId);
    updateColorPickerFromPlane(picker, event);
    const move = (moveEvent) => updateColorPickerFromPlane(picker, moveEvent);
    const end = () => {
      picker.plane.removeEventListener("pointermove", move);
      picker.plane.removeEventListener("pointerup", end);
      picker.plane.removeEventListener("pointercancel", end);
    };
    picker.plane.addEventListener("pointermove", move);
    picker.plane.addEventListener("pointerup", end);
    picker.plane.addEventListener("pointercancel", end);
  }

  function updateColorPickerFromPlane(picker, event) {
    const rect = picker.plane.getBoundingClientRect();
    const saturation = clamp(((event.clientX - rect.left) / Math.max(1, rect.width)) * 100, 0, 100);
    const value = clamp(100 - ((event.clientY - rect.top) / Math.max(1, rect.height)) * 100, 0, 100);
    setColorPickerValue(picker, hsvToHex(picker.hsv.h, saturation, value), { emit: true });
  }

  function nudgeColorPlane(picker, event) {
    if (picker.disabled) return;
    const step = event.shiftKey ? 10 : 4;
    let saturation = picker.hsv.s;
    let value = picker.hsv.v;
    if (event.key === "ArrowLeft") saturation -= step;
    else if (event.key === "ArrowRight") saturation += step;
    else if (event.key === "ArrowDown") value -= step;
    else if (event.key === "ArrowUp") value += step;
    else if (event.key === "Home") {
      saturation = 0;
      value = 100;
    } else if (event.key === "End") {
      saturation = 100;
      value = 0;
    } else {
      return;
    }
    event.preventDefault();
    setColorPickerValue(picker, hsvToHex(picker.hsv.h, clamp(saturation, 0, 100), clamp(value, 0, 100)), { emit: true });
  }

  function handleItemColorInput() {
    if (suppressControlEvents) return;
    applyItemColorFromControl();
  }

  function handleItemTextColorInput() {
    if (suppressControlEvents) return;
    applyItemTextColorFromControl();
  }

  function applyItemColorFromControl() {
    const item = getItem(selectedId);
    if (!item) return;
    const color = normalizeColor(dom.itemColorInput.value || item.color);
    setColorPickerValue(itemColorPicker, color, { emit: false });
    setColorPickerDisabled(itemColorPicker, false);
    if (item.color === color) return;

    const previousSnapshot = timelineDataSnapshot();
    item.color = color;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Item color updated");
  }

  function applyItemTextColorFromControl() {
    const item = getItem(selectedId);
    if (!item || item.type !== "note") return;
    const color = normalizeColor(dom.itemTextColorInput.value || noteTextColorForItem(item));
    setColorPickerValue(itemTextColorPicker, color, { emit: false });
    setColorPickerDisabled(itemTextColorPicker, false);
    if (item.textColor === color) return;

    const previousSnapshot = timelineDataSnapshot();
    item.textColor = color;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Note text color updated");
  }

  function renderLaneControls() {
    if (!dom.laneList) return;
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
    ensureLaneColors();
    return labels;
  }

  function ensureLaneColors() {
    if (!Array.isArray(timeline.settings.laneColors)) {
      timeline.settings.laneColors = [];
    }
    const colors = timeline.settings.laneColors;
    const labelCount = timeline.settings.laneLabels.length || 1;
    while (colors.length < labelCount) colors.push("");
    if (colors.length > labelCount) colors.length = labelCount;
    colors.forEach((color, index) => {
      colors[index] = normalizeOptionalColor(color);
    });
    return colors;
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
    addLaneAfter(ensureLaneLabels().length - 1);
  }

  function addLaneAfter(index) {
    const labels = ensureLaneLabels();
    const colors = ensureLaneColors();
    const insertAt = clamp(Number(index) + 1, 0, labels.length);
    const previousSnapshot = timelineDataSnapshot();
    labels.splice(insertAt, 0, `Line ${labels.length + 1}`);
    colors.splice(insertAt, 0, "");
    timeline.items.forEach((item) => {
      if (!isGlobalTimelineItemType(item.type) && item.lane >= insertAt) item.lane += 1;
    });
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Line added");
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
    const colors = ensureLaneColors();
    const [color] = colors.splice(from, 1);
    colors.splice(to, 0, color || "");
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
    removeLaneByIndex(index);
  }

  function removeLaneByIndex(index) {
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

    const colors = ensureLaneColors();
    const removedItemIds = new Set(itemsOnLine.map((item) => item.id));
    labels.splice(index, 1);
    colors.splice(index, 1);
    timeline.items = timeline.items
      .filter((item) => item.lane !== index)
      .map((item) => (item.lane > index ? { ...item, lane: item.lane - 1 } : item));
    if (selectedId && removedItemIds.has(selectedId)) selectedId = null;
    if (lineEditorLaneIndex === index) closeLineEditor({ commit: false });
    if (lineEditorLaneIndex !== null && lineEditorLaneIndex > index) lineEditorLaneIndex -= 1;
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
    if (event.defaultPrevented) return;
    const key = event.key.toLowerCase();
    const hasShortcutModifier = (event.ctrlKey || event.metaKey) && !event.altKey;

    if (hasShortcutModifier && !event.shiftKey && key === "s") {
      event.preventDefault();
      saveJsonFile();
      return;
    }

    if (event.key === "Escape") {
      closeContextMenu();
      return;
    }

    if (isEditableShortcutTarget(event.target)) return;

    if (hasShortcutModifier && !event.shiftKey && key === "c") {
      event.preventDefault();
      copySelectedItem();
      return;
    }

    if (hasShortcutModifier && !event.shiftKey && key === "v") {
      event.preventDefault();
      pasteCopiedItem();
      return;
    }

    if (hasShortcutModifier && !event.shiftKey && key === "d") {
      event.preventDefault();
      duplicateSelectedItem();
      return;
    }

    if (hasShortcutModifier && event.shiftKey && key === "l") {
      event.preventDefault();
      setItemsLocked(!timeline.settings.itemsLocked);
      return;
    }

    if (!event.ctrlKey && !event.metaKey && !event.altKey && (key === "+" || key === "=")) {
      event.preventDefault();
      zoomBy(20);
      return;
    }

    if (!event.ctrlKey && !event.metaKey && !event.altKey && key === "-") {
      event.preventDefault();
      zoomBy(-20);
      return;
    }

    if ((event.key === "Delete" || event.key === "Backspace") && selectedId) {
      event.preventDefault();
      deleteSelectedItem();
    }
  }

  function handleGlobalCopy(event) {
    if (event.defaultPrevented || isEditableShortcutTarget(event.target)) return;
    if (copySelectedItem()) event.preventDefault();
  }

  function handleGlobalPaste(event) {
    if (event.defaultPrevented || isEditableShortcutTarget(event.target)) return;
    if (pasteCopiedItem()) event.preventDefault();
  }

  function canCreateOrPasteItems() {
    if (!timeline.settings.itemsLocked) return true;
    setStatus("Turn off read only to edit the timeline");
    return false;
  }

  function isItemReadOnly(item) {
    return Boolean(timeline.settings.itemsLocked || item?.locked);
  }

  function canModifyItem(item, actionLabel = "modify") {
    if (!item) return false;
    if (timeline.settings.itemsLocked) {
      setStatus(`Turn off read only to ${actionLabel}`);
      return false;
    }
    if (item.locked) {
      setStatus(`Unlock this item to ${actionLabel}`);
      return false;
    }
    return true;
  }

  function applyItemForm() {
    const item = getItem(selectedId);
    if (!item) return;
    if (!canModifyItem(item, "edit it")) {
      syncItemForm();
      return;
    }

    const previousSnapshot = timelineDataSnapshot();
    const type = dom.itemTypeInput.value;
    item.type = type;
    const notes = dom.itemNotesInput.value;
    item.title = type === "note"
      ? noteTitleFromText(notes)
      : dom.itemTitleInput.value.trim() || titleForType(type);
    item.lane = isGlobalTimelineItemType(type) ? 0 : clamp(Math.round(toNumber(dom.itemLaneInput.value, item.lane)), 0, 20);
    item.color = normalizeColor(dom.itemColorInput.value || TYPE_COLORS[type]);
    item.startDate = normalizeDateInput(dom.itemStartInput.value, item.startDate);
    item.endDate = hasEndYear(type) ? normalizeDateInput(dom.itemEndInput.value, addDaysIso(item.startDate, 1)) : item.startDate;
    if (hasEndYear(type) && compareIso(item.endDate, item.startDate) <= 0) item.endDate = addDaysIso(item.startDate, 1);
    item.showAgeLabels = dom.itemAgeLabelsInput.checked;
    item.showDurationLabel = dom.itemDurationLabelInput.checked;
    item.notes = notes;
    if (type === "note") {
      item.textColor = normalizeColor(dom.itemTextColorInput.value || noteTextColorForItem(item));
    } else {
      delete item.textColor;
    }

    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Item updated");
  }

  function addItem(type) {
    if (!canCreateOrPasteItems()) return;
    const centerDate = getViewportCenterDate();
    const startDate = snapDate(clampIso(centerDate, timeline.settings.startDate, timeline.settings.endDate));
    const item = createItemAt(type, { date: startDate });

    timeline.items.push(item);
    selectedId = item.id;
    renderAll();
    setStatus(`${titleForType(type)} added`);
  }

  function createItemAt(type, target = {}) {
    const startDate = snapDate(clampIso(target.date || getViewportCenterDate(), timeline.settings.startDate, timeline.settings.endDate));
    const laneByType = { birth: 0, period: 0, line: 3, event: 2, marker: 0, note: 2, text: 4 };
    const lane = Number.isInteger(target.lane) ? target.lane : laneByType[type] || 0;
    const endDate = hasEndYear(type) ? defaultEndDate(startDate) : startDate;
    return normalizeItem({
      id: createId(type),
      type,
      lane: isGlobalTimelineItemType(type) ? 0 : clamp(lane, 0, 20),
      startDate,
      endDate: clampIso(endDate, addDaysIso(startDate, 1), addDaysIso(timeline.settings.endDate, 1)),
      title: titleForType(type),
      color: randomPaletteColor(),
      notes: "",
      locked: false,
      showAgeLabels: true,
      showDurationLabel: true,
    });
  }

  function deleteSelectedItem(itemId = selectedId) {
    if (!itemId) return;
    const item = getItem(itemId);
    if (!item) return;
    if (!canModifyItem(item, "delete it")) return;
    const ok = window.confirm(`Delete "${item.title}"?`);
    if (!ok) return;
    timeline.items = timeline.items.filter((candidate) => candidate.id !== item.id);
    if (selectedId === item.id) selectedId = null;
    renderAll();
    setStatus("Item deleted");
  }

  function copySelectedItem(itemId = selectedId) {
    const item = getItem(itemId);
    if (!item) {
      setStatus("Select an item to copy");
      return false;
    }
    copiedItem = { ...item };
    updateContextMenuItems();
    setStatus("Item copied");
    return true;
  }

  function pasteCopiedItem(target = {}) {
    if (!canCreateOrPasteItems()) return false;
    if (!copiedItem) {
      setStatus("Copy an item before pasting");
      updateContextMenuItems();
      return false;
    }
    const copy = createPastedItem(copiedItem, target);
    timeline.items.push(copy);
    selectedId = copy.id;
    renderAll();
    setStatus("Item pasted");
    return true;
  }

  function createPastedItem(source, target = {}) {
    const maxRangeEnd = addDaysIso(timeline.settings.endDate, 1);
    const originalDuration = hasEndYear(source.type)
      ? Math.max(minDurationDays(), daysBetween(source.startDate, source.endDate))
      : 0;
    const maxDuration = Math.max(minDurationDays(), daysBetween(timeline.settings.startDate, maxRangeEnd));
    const duration = Math.min(originalDuration, maxDuration);
    let startDate = snapDate(clampIso(target.date || getViewportCenterDate(), timeline.settings.startDate, timeline.settings.endDate));
    let endDate = hasEndYear(source.type) ? addDaysIso(startDate, duration) : startDate;

    if (hasEndYear(source.type) && compareIso(endDate, maxRangeEnd) > 0) {
      endDate = maxRangeEnd;
      startDate = clampIso(addDaysIso(endDate, -duration), timeline.settings.startDate, timeline.settings.endDate);
    }

    return normalizeItem({
      ...source,
      id: createId(source.type),
      title: `${source.title} copy`,
      lane: isGlobalTimelineItemType(source.type) ? 0 : clamp(Math.round(toNumber(target.lane, source.lane)), 0, 20),
      startDate,
      endDate,
      locked: false,
    });
  }

  function duplicateSelectedItem(itemId = selectedId) {
    const item = getItem(itemId);
    if (!item) return;
    if (!canModifyItem(item, "duplicate it")) return;
    const copy = {
      ...item,
      id: createId(item.type),
      title: `${item.title} copy`,
      lane: isGlobalTimelineItemType(item.type) ? 0 : clamp(item.lane + 1, 0, 20),
      locked: false,
    };
    timeline.items.push(copy);
    selectedId = copy.id;
    renderAll();
    setStatus("Item duplicated");
  }

  function setItemsLocked(locked) {
    const nextLocked = Boolean(locked);
    if (timeline.settings.itemsLocked === nextLocked) {
      setStatus(nextLocked ? "Timeline is already read only" : "Timeline is already editable");
      updateContextMenuItems();
      return;
    }

    const previousSnapshot = timelineDataSnapshot();
    timeline.settings.itemsLocked = nextLocked;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    updateContextMenuItems();
    if (changed) setStatus(nextLocked ? "Read only on" : "Read only off");
  }

  function syncItemsLockedButton() {
    if (!dom.itemsLockedButton) return;
    const locked = timeline.settings.itemsLocked;
    dom.itemsLockedButton.classList.toggle("is-active", locked);
    dom.itemsLockedButton.setAttribute("aria-pressed", String(locked));
    dom.itemsLockedButton.setAttribute("aria-label", locked ? "Turn off read only" : "Read only");
    dom.itemsLockedButton.title = locked ? "Turn off read only" : "Read only";
    dom.itemsLockedButton.querySelectorAll(".toggle-icon-state").forEach((icon) => {
      icon.dataset.active = String(icon.dataset.lockState === (locked ? "locked" : "unlocked"));
    });
  }

  function openLineEditor(index, clientX, clientY) {
    const labels = ensureLaneLabels();
    const colors = ensureLaneColors();
    if (!Number.isInteger(index) || index < 0 || index >= labels.length || !dom.lineEditorPopover) return;
    closeContextMenu();
    lineEditorLaneIndex = index;
    dom.lineEditorPopover.hidden = false;
    dom.lineEditorTitle.textContent = `Line ${index + 1}`;
    dom.lineNameInput.value = labels[index] || `Line ${index + 1}`;
    const color = normalizeOptionalColor(colors[index]);
    dom.lineEditorPopover.dataset.color = color;
    setColorPickerValue(lineColorPicker, color, { emit: false });
    setColorPickerDisabled(lineColorPicker, false);
    dom.lineRemoveButton.disabled = labels.length <= 1;
    positionLineEditor(clientX, clientY);
    dom.lineNameInput.focus();
    dom.lineNameInput.select();
  }

  function positionLineEditor(clientX, clientY) {
    const popover = dom.lineEditorPopover;
    if (!popover) return;
    popover.style.visibility = "hidden";
    popover.style.left = "0px";
    popover.style.top = "0px";
    const rect = popover.getBoundingClientRect();
    const left = clamp(clientX, 8, Math.max(8, window.innerWidth - rect.width - 8));
    const top = clamp(clientY, 8, Math.max(8, window.innerHeight - rect.height - 8));
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    popover.style.visibility = "";
  }

  function updateLineEditorNameDraft() {
    if (lineEditorLaneIndex === null) return;
    const labels = ensureLaneLabels();
    if (!labels[lineEditorLaneIndex] && dom.lineNameInput.value === "") return;
    const previousSnapshot = timelineDataSnapshot();
    labels[lineEditorLaneIndex] = dom.lineNameInput.value;
    renderAllAfterMaybeChange(previousSnapshot);
  }

  function commitLineEditorName() {
    if (lineEditorLaneIndex === null) return;
    const labels = ensureLaneLabels();
    const previousSnapshot = timelineDataSnapshot();
    labels[lineEditorLaneIndex] = dom.lineNameInput.value.trim() || `Line ${lineEditorLaneIndex + 1}`;
    dom.lineNameInput.value = labels[lineEditorLaneIndex];
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Line renamed");
  }

  function updateLineEditorColor() {
    if (lineEditorLaneIndex === null) return;
    const colors = ensureLaneColors();
    const previousSnapshot = timelineDataSnapshot();
    const color = normalizeColor(dom.lineColorInput.value);
    colors[lineEditorLaneIndex] = color;
    dom.lineEditorPopover.dataset.color = color;
    setColorPickerValue(lineColorPicker, color, { emit: false });
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Line color updated");
  }

  function clearLineEditorColor() {
    if (lineEditorLaneIndex === null) return;
    const colors = ensureLaneColors();
    const previousSnapshot = timelineDataSnapshot();
    colors[lineEditorLaneIndex] = "";
    dom.lineEditorPopover.dataset.color = "";
    setColorPickerValue(lineColorPicker, "", { emit: false });
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Line color cleared");
  }

  function applyLineEditor(event) {
    event.preventDefault();
    commitLineEditorName();
    closeLineEditor();
  }

  function addLineFromEditor() {
    if (lineEditorLaneIndex === null) return;
    const index = lineEditorLaneIndex;
    addLaneAfter(index);
    const rect = dom.lineEditorPopover.getBoundingClientRect();
    openLineEditor(index + 1, rect.left, rect.top);
  }

  function removeLineFromEditor() {
    if (lineEditorLaneIndex === null) return;
    removeLaneByIndex(lineEditorLaneIndex);
  }

  function closeLineEditorFromPointer(event) {
    if (!dom.lineEditorPopover || dom.lineEditorPopover.hidden) return;
    if (dom.lineEditorPopover.contains(event.target)) return;
    if (event.target.closest?.("[data-timeline-lane-index]")) return;
    closeLineEditor();
  }

  function closeLineEditor(options = {}) {
    if (!dom.lineEditorPopover) return;
    if (options.commit !== false && lineEditorLaneIndex !== null && dom.lineNameInput) commitLineEditorName();
    closeColorPickers(lineColorPicker);
    setColorPickerOpen(lineColorPicker, false);
    dom.lineEditorPopover.hidden = true;
    lineEditorLaneIndex = null;
  }

  function openTimelineContextMenu(event) {
    event.preventDefault();
    const itemNode = event.target.closest("[data-item-id]");
    const laneNode = event.target.closest("[data-timeline-lane-index]");
    if (!itemNode && laneNode) {
      const laneIndex = Number(laneNode.dataset.timelineLaneIndex);
      openLineEditor(laneIndex, event.clientX, event.clientY);
      return;
    }
    const item = itemNode ? getItem(itemNode.dataset.itemId) : null;
    const point = svgPoint(event);
    const date = snapDate(clampIso(xToDate(point.x), timeline.settings.startDate, timeline.settings.endDate));
    const lane = item && !isGlobalTimelineItemType(item.type)
      ? item.lane
      : laneIndexFromPointer(event);

    contextMenuTarget = {
      date,
      lane,
      itemId: item ? item.id : null,
    };

    if (item && selectedId !== item.id) {
      selectedId = item.id;
      renderAll({ save: false });
    }

    updateContextMenuItems();
    showContextMenuAt(event.clientX, event.clientY);
  }

  function handleContextMenuClick(event) {
    const addButton = event.target.closest("[data-context-add]");
    if (addButton && !addButton.disabled) {
      const target = contextMenuTarget ? { ...contextMenuTarget } : {};
      const type = addButton.dataset.contextAdd;
      closeContextMenu();
      addItemFromContext(type, target);
      return;
    }

    const button = event.target.closest("[data-context-action]");
    if (!button || button.disabled) return;
    const action = button.dataset.contextAction;
    const target = contextMenuTarget ? { ...contextMenuTarget } : {};

    if (action === "add-menu") {
      event.preventDefault();
      toggleContextSubmenu("add");
      return;
    }
    closeContextMenu();

    const actionItemId = target.itemId || selectedId;

    if (action === "copy") {
      copySelectedItem(actionItemId);
    } else if (action === "paste") {
      pasteCopiedItem(target);
    } else if (action === "duplicate") {
      duplicateSelectedItem(actionItemId);
    } else if (action === "lock-item") {
      setSelectedItemLocked(true, actionItemId);
    } else if (action === "unlock-item") {
      setSelectedItemLocked(false, actionItemId);
    } else if (action === "zoom-in") {
      zoomBy(20);
    } else if (action === "zoom-out") {
      zoomBy(-20);
    } else if (action === "fit") {
      fitTimelineToViewport();
    } else if (action === "delete") {
      deleteSelectedItem(actionItemId);
    }
  }

  function addItemFromContext(type, target) {
    if (!TIMELINE_ITEM_TYPES.includes(String(type))) return;
    if (!canCreateOrPasteItems()) return;
    const item = createItemAt(type, target);
    timeline.items.push(item);
    selectedId = item.id;
    renderAll();
    setStatus(`${titleForType(type)} added`);
  }

  function setSelectedItemLocked(locked, itemId = selectedId) {
    const item = getItem(itemId);
    if (!item) {
      setStatus("Select an item first");
      return;
    }
    const nextLocked = Boolean(locked);
    if (item.locked === nextLocked) {
      setStatus(nextLocked ? "Item already locked" : "Item already unlocked");
      updateContextMenuItems();
      return;
    }
    const previousSnapshot = timelineDataSnapshot();
    item.locked = nextLocked;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    updateContextMenuItems();
    if (changed) setStatus(nextLocked ? "Item locked" : "Item unlocked");
  }

  function updateContextMenuItems() {
    if (!dom.timelineContextMenu) return;
    const item = getItem(contextMenuTarget?.itemId || selectedId);
    const hasSelection = Boolean(item);
    const allLocked = timeline.settings.itemsLocked;
    const itemLocked = Boolean(item?.locked);
    const canModifySelection = hasSelection && !allLocked && !itemLocked;
    const canAdd = !allLocked;
    setContextMenuActionState("add-menu", { disabled: !canAdd });
    setContextMenuAddState({ disabled: !canAdd });
    setContextMenuActionState("copy", { disabled: !hasSelection });
    setContextMenuActionState("paste", { disabled: !copiedItem || allLocked });
    setContextMenuActionState("duplicate", { disabled: !canModifySelection });
    setContextMenuActionState("delete", { disabled: !canModifySelection });
    setContextMenuActionState("lock-item", {
      disabled: !hasSelection,
      hidden: itemLocked,
    });
    setContextMenuActionState("unlock-item", {
      disabled: !hasSelection,
      hidden: !itemLocked,
    });
  }

  function setContextMenuAddState(options = {}) {
    dom.timelineContextMenu.querySelectorAll("[data-context-add]").forEach((button) => {
      const disabled = options.disabled === true;
      button.disabled = disabled;
      button.setAttribute("aria-disabled", String(disabled));
    });
  }

  function toggleContextSubmenu(name) {
    const submenu = dom.timelineContextMenu.querySelector(`[data-context-submenu="${name}"]`);
    if (!submenu) return;
    const isOpen = !submenu.classList.contains("is-open");
    dom.timelineContextMenu.querySelectorAll(".context-menu-submenu.is-open").forEach((node) => {
      node.classList.remove("is-open");
      node.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
    });
    submenu.classList.toggle("is-open", isOpen);
    submenu.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", String(isOpen));
  }

  function setContextMenuActionState(action, options = {}) {
    const button = dom.timelineContextMenu.querySelector(`[data-context-action="${action}"]`);
    if (!button) return;
    const disabled = options.disabled === true;
    button.disabled = disabled;
    button.hidden = options.hidden === true;
    button.setAttribute("aria-disabled", String(disabled));
  }

  function showContextMenuAt(clientX, clientY) {
    const menu = dom.timelineContextMenu;
    menu.hidden = false;
    dom.timelineViewport.classList.add("context-menu-open");
    menu.style.visibility = "hidden";
    menu.style.left = "0px";
    menu.style.top = "0px";
    const rect = menu.getBoundingClientRect();
    const left = clamp(clientX, 8, Math.max(8, window.innerWidth - rect.width - 8));
    const top = clamp(clientY, 8, Math.max(8, window.innerHeight - rect.height - 8));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.classList.toggle("opens-submenu-left", left + rect.width + 228 > window.innerWidth - 8);
    menu.querySelectorAll(".context-menu-submenu.is-open").forEach((node) => {
      node.classList.remove("is-open");
      node.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
    });
    menu.style.visibility = "";
    focusFirstContextMenuAction();
  }

  function focusFirstContextMenuAction() {
    const firstAction = dom.timelineContextMenu.querySelector("button:not([hidden]):not(:disabled)");
    if (firstAction) firstAction.focus();
  }

  function closeContextMenuFromPointer(event) {
    if (!dom.timelineContextMenu || dom.timelineContextMenu.hidden) return;
    if (dom.timelineContextMenu.contains(event.target)) return;
    closeContextMenu();
  }

  function closeContextMenu() {
    if (!dom.timelineContextMenu) return;
    dom.timelineContextMenu.hidden = true;
    dom.timelineViewport.classList.remove("context-menu-open");
    dom.timelineContextMenu.querySelectorAll(".context-menu-submenu.is-open").forEach((node) => {
      node.classList.remove("is-open");
      node.querySelector("[aria-expanded]")?.setAttribute("aria-expanded", "false");
    });
    contextMenuTarget = null;
  }

  function openNoteEditorFromClickCount(event) {
    if (event.detail < 2) return;
    openNoteEditorFromDoubleClick(event);
  }

  function openNoteEditorFromDoubleClick(event) {
    const editNode = event.target.closest?.("[data-note-edit], .item-note[data-item-id]");
    const itemNode = editNode?.closest("[data-item-id]");
    if (!itemNode) return;
    const item = getItem(itemNode.dataset.itemId);
    if (!item || item.type !== "note") return;
    if (!canModifyItem(item, "edit it")) return;
    event.preventDefault();
    selectedId = item.id;
    renderAll({ save: false });
    openNoteInlineEditor(item.id);
  }

  function shouldOpenNoteEditorFromPointer(event, itemId) {
    const now = Date.now();
    const previous = lastNotePointerDown;
    lastNotePointerDown = {
      itemId,
      time: now,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    if (!previous || previous.itemId !== itemId) return false;
    const elapsed = now - previous.time;
    const distance = Math.hypot(event.clientX - previous.clientX, event.clientY - previous.clientY);
    if (elapsed > NOTE_DOUBLE_CLICK_MS || distance > NOTE_DOUBLE_CLICK_DISTANCE) return false;
    lastNotePointerDown = null;
    return true;
  }

  function openNoteInlineEditor(noteId) {
    const item = getItem(noteId);
    const layout = item ? lastNoteLayouts.get(noteId) : null;
    if (!item || item.type !== "note" || !layout || !dom.noteInlineEditor) return;
    editingNoteId = item.id;
    editingNoteOriginalNotes = item.notes;
    editingNoteOriginalDisplayText = noteDisplayText(item);
    dom.noteInlineEditor.value = editingNoteOriginalDisplayText;
    dom.noteInlineEditor.hidden = false;
    updateNoteInlineEditorDirection();
    positionNoteInlineEditor();
    dom.noteInlineEditor.focus();
    dom.noteInlineEditor.select();
  }

  function positionNoteInlineEditor() {
    if (!editingNoteId || !dom.noteInlineEditor || dom.noteInlineEditor.hidden) return;
    const item = getItem(editingNoteId);
    const layout = item ? lastNoteLayouts.get(editingNoteId) : null;
    if (!item || item.type !== "note" || !layout) {
      closeNoteInlineEditor();
      return;
    }
    dom.noteInlineEditor.style.left = `${layout.x}px`;
    dom.noteInlineEditor.style.top = `${layout.y + NOTE_TIP_HEIGHT}px`;
    dom.noteInlineEditor.style.width = `${layout.width}px`;
    dom.noteInlineEditor.style.height = `${Math.max(NOTE_MIN_HEIGHT - NOTE_TIP_HEIGHT, layout.height - NOTE_TIP_HEIGHT)}px`;
    dom.noteInlineEditor.style.color = noteTextColorForItem(item);
    dom.noteInlineEditor.style.background = item.color;
  }

  function updateNoteInlineEditorDirection() {
    if (!dom.noteInlineEditor) return;
    dom.noteInlineEditor.dir = textDirectionFor(dom.noteInlineEditor.value);
  }

  function handleNoteInlineEditorKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelNoteInlineEditor();
    } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      dom.noteInlineEditor.blur();
    }
  }

  function commitNoteInlineEditor() {
    if (!editingNoteId || !dom.noteInlineEditor) return;
    const item = getItem(editingNoteId);
    const value = dom.noteInlineEditor.value;
    const shouldWrite = item && (
      value !== editingNoteOriginalDisplayText ||
      editingNoteOriginalNotes !== item.notes
    );
    closeNoteInlineEditor();
    if (!item || item.type !== "note" || !shouldWrite) {
      renderAll({ save: false });
      return;
    }
    const previousSnapshot = timelineDataSnapshot();
    item.notes = value;
    item.title = noteTitleFromText(value);
    selectedId = item.id;
    const changed = renderAllAfterMaybeChange(previousSnapshot);
    if (changed) setStatus("Note text updated");
  }

  function cancelNoteInlineEditor() {
    closeNoteInlineEditor();
    renderAll({ save: false });
    setStatus("Note edit canceled");
  }

  function commitNoteInlineEditorFromPointer(event) {
    if (!editingNoteId || !dom.noteInlineEditor || dom.noteInlineEditor.hidden) return;
    if (event.target instanceof Element && event.target.closest("#noteInlineEditor")) return;
    commitNoteInlineEditor();
  }

  function closeNoteInlineEditor() {
    if (dom.noteInlineEditor) {
      dom.noteInlineEditor.hidden = true;
      dom.noteInlineEditor.value = "";
      dom.noteInlineEditor.style.left = "";
      dom.noteInlineEditor.style.top = "";
      dom.noteInlineEditor.style.width = "";
      dom.noteInlineEditor.style.height = "";
      dom.noteInlineEditor.style.color = "";
      dom.noteInlineEditor.style.background = "";
    }
    editingNoteId = null;
    editingNoteOriginalNotes = "";
    editingNoteOriginalDisplayText = "";
  }

  function beginPointerDrag(event) {
    closeContextMenu();
    if (event.button !== 0) return;
    if (event.target.closest?.("#noteInlineEditor")) return;
    const laneAddNode = event.target.closest("[data-timeline-lane-add]");
    if (laneAddNode) {
      event.preventDefault();
      closeLineEditor();
      addLaneAfter(ensureLaneLabels().length - 1);
      return;
    }

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
    const noteDragNode = event.target.closest("[data-note-drag]");
    const itemNode = event.target.closest("[data-item-id]");
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
    const noteDoubleClick = item.type === "note"
      && noteDragNode
      && !handle
      && (event.detail >= 2 || shouldOpenNoteEditorFromPointer(event, item.id));
    if (noteDoubleClick) {
      event.preventDefault();
      lastNotePointerDown = null;
      if (!canModifyItem(item, "edit it")) {
        renderAll({ save: false });
        return;
      }
      renderAll({ save: false });
      openNoteInlineEditor(item.id);
      return;
    }
    if (isItemReadOnly(item)) {
      renderAll({ save: false });
      event.preventDefault();
      return;
    }
    const point = svgPoint(event);
    const mode = handle ? handle.dataset.handle : (noteDragNode ? "note-position" : "move");
    const noteLayout = item.type === "note" ? lastNoteLayouts.get(item.id) : null;
    dragState = {
      pointerId: event.pointerId,
      mode,
      itemId: item.id,
      startPoint: point,
      original: { ...item },
      startLayout: noteLayout ? { ...noteLayout, lines: noteLayout.lines.slice() } : null,
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

    if (item.type === "note" && dragState.mode === "note-position") {
      moveNoteBalloon(item, point, original, dragState.startLayout);
    } else if (item.type === "note" && dragState.mode === "note-resize") {
      resizeNoteBalloon(item, point, original, dragState.startLayout);
    } else if (dragState.mode === "start") {
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
    if (dragState.mode !== "note-position" && dragState.mode !== "note-resize") {
      applyLaneEdgeSnap(item, dragState.mode, original);
    }
    renderAll({ save: false });
    event.preventDefault();
  }

  function moveNoteBalloon(item, point, original, startLayout) {
    const layout = startLayout || lastNoteLayouts.get(item.id);
    if (!layout) return;
    const dx = point.x - dragState.startPoint.x;
    const dy = point.y - dragState.startPoint.y;
    const contentWidth = currentContentWidth();
    const rowHeight = timeline.settings.rowHeight || DEFAULT_ROW_HEIGHT;
    const baseY = noteBaseY(currentLaneCount(), rowHeight);
    const nextX = clamp(layout.x + dx, 12, Math.max(12, contentWidth - layout.width - 12));
    const nextY = Math.max(baseY, layout.y + dy);
    const anchorX = dateToX(original.startDate);

    item.startDate = original.startDate;
    item.endDate = original.endDate;
    item.lane = original.lane;
    item.noteOffsetX = Math.round(nextX - anchorX);
    item.noteOffsetY = Math.round(nextY - baseY);
  }

  function resizeNoteBalloon(item, point, original, startLayout) {
    const layout = startLayout || lastNoteLayouts.get(item.id);
    if (!layout) return;
    const dx = point.x - dragState.startPoint.x;
    const dy = point.y - dragState.startPoint.y;
    const contentWidth = currentContentWidth();
    const rowHeight = timeline.settings.rowHeight || DEFAULT_ROW_HEIGHT;
    const baseY = noteBaseY(currentLaneCount(), rowHeight);
    const nextWidth = clamp(layout.width + dx, NOTE_MIN_WIDTH, Math.min(NOTE_MAX_WIDTH, Math.max(NOTE_MIN_WIDTH, contentWidth - layout.x - 12)));
    const nextHeight = clamp(layout.height + dy, NOTE_MIN_HEIGHT, NOTE_MAX_HEIGHT);
    const anchorX = dateToX(original.startDate);

    item.startDate = original.startDate;
    item.endDate = original.endDate;
    item.lane = original.lane;
    item.noteOffsetX = Math.round(layout.x - anchorX);
    item.noteOffsetY = Math.round(layout.y - baseY);
    item.noteWidth = Math.round(nextWidth);
    item.noteHeight = Math.round(nextHeight);
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
    if (dataMoved && endedDrag.mode === "note-resize") {
      setStatus("Note resized");
    } else if (dataMoved && endedDrag.mode === "note-position") {
      setStatus("Note moved");
    } else {
      setStatus(dataMoved ? "Item moved" : "Item selected");
    }
  }

  function hasDraggedItemChanged(endedDrag) {
    if (!endedDrag || !endedDrag.original || !endedDrag.itemId) return false;
    const item = getItem(endedDrag.itemId);
    if (!item) return false;
    return item.startDate !== endedDrag.original.startDate
      || item.endDate !== endedDrag.original.endDate
      || item.lane !== endedDrag.original.lane
      || item.noteOffsetX !== endedDrag.original.noteOffsetX
      || item.noteOffsetY !== endedDrag.original.noteOffsetY
      || item.noteWidth !== endedDrag.original.noteWidth
      || item.noteHeight !== endedDrag.original.noteHeight;
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

  function zoomBy(delta) {
    const requestedZoom = zoom + delta;
    setZoom(requestedZoom);
    if (requestedZoom < MIN_ZOOM) {
      setStatus("Minimum readable zoom reached");
    } else if (requestedZoom > MAX_ZOOM) {
      setStatus("Maximum zoom reached");
    } else {
      setStatus(delta > 0 ? "Zoomed in" : "Zoomed out");
    }
  }

  function fitTimelineToViewport() {
    const fittedZoom = fitZoomForTimeline({
      startDate: timeline.settings.startDate,
      endDate: timeline.settings.endDate,
      viewportWidth: dom.timelineViewport.clientWidth,
      leftGutter: LEFT_GUTTER,
      rightGutter: RIGHT_GUTTER,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
    });
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
    return timelineDateToX(isoDate, timeline.settings.startDate, LEFT_GUTTER, pixelsPerDay());
  }

  function xToDate(x) {
    return timelineXToDate(x, timeline.settings.startDate, LEFT_GUTTER, pixelsPerDay());
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

  function currentLaneCount() {
    return Math.max(
      1,
      timeline.settings.laneLabels.length,
      ...timeline.items.map((item) => Math.max(0, Number(item.lane) + 1)),
    );
  }

  function currentContentWidth() {
    const renderedWidth = Number(dom.timelineSvg.getAttribute("width"));
    if (Number.isFinite(renderedWidth) && renderedWidth > 0) return renderedWidth;
    const contentEndDate = addDaysIso(timeline.settings.endDate, 1);
    const timelineWidth = LEFT_GUTTER + daysBetween(timeline.settings.startDate, contentEndDate) * pixelsPerDay() + RIGHT_GUTTER;
    const viewportWidth = Math.ceil(dom.timelineViewport.clientWidth || 0);
    return Math.max(timelineWidth, viewportWidth);
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
    return timelinePixelsPerDay(zoom, AVG_DAYS_PER_MONTH);
  }

  function snapDate(isoDate) {
    return snapTimelineDate(isoDate, timeline.settings.startDate, timeline.settings.snap);
  }

  function minDurationDays() {
    return minDurationDaysForSnap(timeline.settings.snap);
  }

  function defaultEndDate(startDate) {
    return defaultEndDateForSnap(startDate, timeline.settings.snap);
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

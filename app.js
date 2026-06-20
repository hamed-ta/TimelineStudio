import {
  addDaysIso,
  addMonthsIso,
  addYearsIso,
  clamp,
  clampIso,
  compareIso,
  dateFromIso,
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
  TYPE_COLORS,
  createEmptyTimeline,
  hasEndYear,
  normalizeItem,
  normalizeTimeline,
  titleForType,
} from "./src/timeline/model";
import {
  TIMELINE_JSON_MIME,
  parseTimelineJson,
  serializeTimelineJson,
} from "./src/timeline/json";

(() => {
  const ZOOM_KEY = "timeline-studio-zoom-v2";
  const NS = "http://www.w3.org/2000/svg";
  const LEFT_GUTTER = 132;
  const RIGHT_GUTTER = 110;
  const AXIS_HEIGHT = 112;
  const FOOTER_HEIGHT = 34;
  const DEFAULT_ROW_HEIGHT = 68;
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 360;
  const DEFAULT_ZOOM = 18;
  const AVG_DAYS_PER_MONTH = 365.2425 / 12;
  const EN_DATE_FORMAT = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const EN_MONTH_FORMAT = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
  });
  const IRANIAN_DATE_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const IRANIAN_MONTH_FORMAT = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    month: "short",
    timeZone: "UTC",
  });

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
    itemStartInput: document.getElementById("itemStartInput"),
    itemEndInput: document.getElementById("itemEndInput"),
    itemEndField: document.getElementById("itemEndField"),
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
    stageTitle: document.getElementById("stageTitle"),
    stageMeta: document.getElementById("stageMeta"),
  };

  let timeline = createEmptyTimeline();
  let selectedId = null;
  let zoom = clamp(Number(localStorage.getItem(ZOOM_KEY)) || DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM);
  let suppressControlEvents = false;
  let dragState = null;

  const EXPORT_CSS = `
    .axis-band{fill:#f8fafc}
    .canvas-bg{fill:#ffffff}
    .grid-major{stroke:#cbd5e1;stroke-width:1}
    .grid-minor{stroke:#e6ebf0;stroke-width:1}
    .grid-day{stroke:#f1f4f7;stroke-width:1}
    .lane-rule{stroke:#d9e0e7;stroke-width:1}
    .lane-label,.axis-label,.axis-iranian,.age-label,.axis-month,.axis-day{fill:#667586;font-size:12px}
    .axis-year{fill:#1d2732;font-size:13px;font-weight:700}
    .title-label{font-size:13px;font-weight:700}
    .note-label{font-size:13px;font-weight:650}
    .period-body{stroke:rgba(0,0,0,.18);stroke-width:1}
    .event-stem{stroke-width:2;stroke-linecap:round}
    .event-marker{stroke:#fff;stroke-width:2}
    .range-line{fill:none;stroke-width:4;stroke-linecap:round}
  `;

  init();

  function init() {
    timeline = normalizeTimeline(timeline);
    bindEvents();
    setZoom(zoom, { render: false });
    renderAll({ save: false });
    setStatus("Ready");
  }

  function bindEvents() {
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
      dom.itemEndField.hidden = !hasEndYear(dom.itemTypeInput.value);
      updateItemCalendarPreviewFromInputs();
    });

    dom.itemForm.addEventListener("submit", (event) => {
      event.preventDefault();
      applyItemForm();
    });

    dom.deleteItemButton.addEventListener("click", deleteSelectedItem);
    dom.duplicateItemButton.addEventListener("click", duplicateSelectedItem);
    dom.addLaneButton.addEventListener("click", addLane);

    dom.saveJsonButton.addEventListener("click", saveJsonFile);
    dom.loadJsonButton.addEventListener("click", () => dom.fileInput.click());
    dom.fileInput.addEventListener("change", loadJsonFile);

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
  }

  function renderTimeline() {
    const svg = dom.timelineSvg;
    svg.replaceChildren();

    const settings = timeline.settings;
    const laneCount = Math.max(
      5,
      settings.laneLabels.length,
      ...timeline.items.map((item) => Math.max(0, Number(item.lane) + 1)),
    );
    const rowHeight = settings.rowHeight || DEFAULT_ROW_HEIGHT;
    const contentEndDate = addDaysIso(settings.endDate, 1);
    const contentWidth = LEFT_GUTTER + daysBetween(settings.startDate, contentEndDate) * pixelsPerDay() + RIGHT_GUTTER;
    const contentHeight = AXIS_HEIGHT + laneCount * rowHeight + FOOTER_HEIGHT;

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

    timeline.items
      .slice()
      .sort((a, b) => a.lane - b.lane || compareIso(a.startDate, b.startDate))
      .forEach((item) => drawItem(svg, defs, item, rowHeight));
  }

  function drawGrid(svg, settings, laneCount, rowHeight, contentHeight) {
    const startYear = isoYear(settings.startDate);
    const endYear = isoYear(settings.endDate);
    const yearLabelStep = zoom < 13 ? 5 : zoom < 21 ? 2 : 1;
    const contentEndDate = addDaysIso(settings.endDate, 1);

    if (zoom >= 92) {
      const dayLabelStep = zoom >= 280 ? 1 : zoom >= 180 ? 5 : 0;
      for (let date = settings.startDate; compareIso(date, contentEndDate) <= 0; date = addDaysIso(date, 1)) {
        const x = dateToX(date);
        svg.append(svgEl("line", { class: "grid-day", x1: x, x2: x, y1: AXIS_HEIGHT, y2: contentHeight }));
        const day = isoDay(date);
        if (dayLabelStep && (day === 1 || day % dayLabelStep === 0)) {
          svg.append(svgEl("text", { class: "axis-day", x: x + 3, y: 104 }, String(day)));
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
          svg.append(svgEl("text", { class: "axis-month", x: x + 5, y: 84 }, `${monthName(date)} / ${iranianMonthName(date)}`));
        }
      }
    }

    for (let lane = 0; lane <= laneCount; lane += 1) {
      const y = AXIS_HEIGHT + lane * rowHeight;
      svg.append(svgEl("line", { class: "lane-rule", x1: 0, x2: dateToX(contentEndDate), y1: y, y2: y }));
    }
  }

  function drawLaneLabels(svg, settings, laneCount, rowHeight) {
    for (let lane = 0; lane < laneCount; lane += 1) {
      const label = settings.laneLabels[lane] || `Lane ${lane}`;
      const y = AXIS_HEIGHT + lane * rowHeight + rowHeight / 2 + 4;
      svg.append(svgEl("text", { class: "lane-label", x: 18, y }, label));
    }
  }

  function drawItem(svg, defs, item, rowHeight) {
    const group = svgEl("g", {
      class: `item item-${item.type}${item.id === selectedId ? " selected" : ""}`,
      "data-item-id": item.id,
      tabindex: "0",
    });

    const y = AXIS_HEIGHT + item.lane * rowHeight + rowHeight / 2;
    const x1 = dateToX(item.startDate);
    const x2 = dateToX(hasEndYear(item.type) ? item.endDate : item.startDate);

    if (item.type === "period") {
      drawPeriod(group, item, x1, x2, y);
    } else if (item.type === "line") {
      drawLine(group, defs, item, x1, x2, y);
    } else if (item.type === "event") {
      drawEvent(group, item, x1, y);
    } else {
      drawTextItem(group, item, x1, y);
    }

    if (item.id === selectedId) drawSelection(group, item, x1, x2, y);
    svg.append(group);
  }

  function drawPeriod(group, item, x1, x2, y) {
    const width = Math.max(12, x2 - x1);
    group.append(
      svgEl("rect", {
        class: "period-body",
        x: x1,
        y: y - 17,
        width,
        height: 34,
        rx: 6,
        fill: item.color,
      }),
    );

    const label = fitText(item.title, width - 16);
    group.append(
      svgEl("text", {
        class: "title-label",
        x: x1 + width / 2,
        y: y + 5,
        "text-anchor": "middle",
        fill: readableTextColor(item.color),
      }, label),
    );
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
    group.append(svgEl("text", { class: "note-label", x: x1 + 8, y: y - 11, fill: "#1d2732" }, fitText(item.title, Math.max(80, x2 - x1 - 20))));
  }

  function drawEvent(group, item, x, y) {
    group.append(svgEl("line", { class: "event-stem", x1: x, y1: y - 23, x2: x, y2: y + 23, stroke: item.color }));
    group.append(svgEl("circle", { class: "event-marker", cx: x, cy: y, r: 9, fill: item.color }));
    group.append(svgEl("text", { class: "note-label", x: x + 16, y: y + 5, fill: "#1d2732" }, item.title));
  }

  function drawTextItem(group, item, x, y) {
    group.append(svgEl("circle", { cx: x, cy: y, r: 4, fill: item.color }));
    group.append(svgEl("text", { class: "note-label", x: x + 10, y: y + 5, fill: item.color }, item.title));
  }

  function drawSelection(group, item, x1, x2, y) {
    if (item.type === "period") {
      const width = Math.max(12, x2 - x1);
      group.append(svgEl("rect", { class: "selection-outline", x: x1 - 4, y: y - 21, width: width + 8, height: 42, rx: 8 }));
      group.append(svgEl("rect", { class: "resize-handle", "data-item-id": item.id, "data-handle": "start", x: x1 - 5, y: y - 11, width: 10, height: 22, rx: 3 }));
      group.append(svgEl("rect", { class: "resize-handle", "data-item-id": item.id, "data-handle": "end", x: x2 - 5, y: y - 11, width: 10, height: 22, rx: 3 }));
    } else if (item.type === "line") {
      group.append(svgEl("rect", { class: "selection-outline", x: Math.min(x1, x2) - 7, y: y - 19, width: Math.abs(x2 - x1) + 14, height: 38, rx: 8 }));
      group.append(svgEl("circle", { class: "resize-handle", "data-item-id": item.id, "data-handle": "start", cx: x1, cy: y, r: 6 }));
      group.append(svgEl("circle", { class: "resize-handle", "data-item-id": item.id, "data-handle": "end", cx: x2, cy: y, r: 6 }));
    } else {
      group.append(svgEl("rect", { class: "selection-outline", x: x1 - 12, y: y - 22, width: 210, height: 44, rx: 8 }));
    }
  }

  function updateMeta() {
    const settings = timeline.settings;
    dom.stageTitle.textContent = settings.title;
    dom.stageMeta.textContent = `${formatDisplayDate(settings.startDate)} / ${formatIranianDate(settings.startDate)} to ${formatDisplayDate(settings.endDate)} / ${formatIranianDate(settings.endDate)}`;
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
      dom.itemNotesInput.value = "";
      dom.itemCalendarPreview.textContent = "Select an item to see Gregorian and Iranian dates.";
      dom.itemEndField.hidden = true;
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
    dom.itemNotesInput.value = item.notes;
    dom.itemEndField.hidden = !hasEndYear(item.type);
    updateItemCalendarPreview(item);
    suppressControlEvents = false;
  }

  function renderLaneControls() {
    const labels = ensureLaneLabels();
    dom.laneList.replaceChildren();
    labels.forEach((label, index) => {
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
      dom.laneList.append(field);
    });
  }

  function ensureLaneLabels() {
    const labels = timeline.settings.laneLabels;
    const laneCount = Math.max(
      5,
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
    timeline.settings.laneLabels[index] = event.currentTarget.value.trim() || `Line ${index + 1}`;
    renderAll();
    setStatus("Line renamed");
  }

  function updateLaneLabelDraft(event) {
    const index = Number(event.currentTarget.dataset.laneIndex);
    if (!Number.isInteger(index)) return;
    timeline.settings.laneLabels[index] = event.currentTarget.value;
  }

  function addLane() {
    timeline.settings.laneLabels.push(`Line ${timeline.settings.laneLabels.length + 1}`);
    renderAll();
    setStatus("Line added");
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
    renderAll();
    setStatus("Timeline updated");
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

  function applyItemForm() {
    const item = getItem(selectedId);
    if (!item) return;

    const type = dom.itemTypeInput.value;
    item.type = type;
    item.title = dom.itemTitleInput.value.trim() || titleForType(type);
    item.lane = clamp(Math.round(toNumber(dom.itemLaneInput.value, item.lane)), 0, 20);
    item.color = normalizeColor(dom.itemColorInput.value || TYPE_COLORS[type]);
    item.startDate = normalizeDateInput(dom.itemStartInput.value, item.startDate);
    item.endDate = hasEndYear(type) ? normalizeDateInput(dom.itemEndInput.value, addDaysIso(item.startDate, 1)) : item.startDate;
    if (hasEndYear(type) && compareIso(item.endDate, item.startDate) <= 0) item.endDate = addDaysIso(item.startDate, 1);
    item.notes = dom.itemNotesInput.value;

    renderAll();
    setStatus("Item updated");
  }

  function addItem(type) {
    const centerDate = getViewportCenterDate();
    const startDate = snapDate(clampIso(centerDate, timeline.settings.startDate, timeline.settings.endDate));
    const laneByType = { period: 0, line: 3, event: 2, text: 4 };
    const endDate = hasEndYear(type) ? defaultEndDate(startDate) : startDate;
    const item = normalizeItem({
      id: createId(type),
      type,
      lane: laneByType[type] || 0,
      startDate,
      endDate: clampIso(endDate, addDaysIso(startDate, 1), addDaysIso(timeline.settings.endDate, 1)),
      title: titleForType(type),
      color: TYPE_COLORS[type],
      notes: "",
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
      lane: clamp(item.lane + 1, 0, 20),
    };
    timeline.items.push(copy);
    selectedId = copy.id;
    renderAll();
    setStatus("Item duplicated");
  }

  function beginPointerDrag(event) {
    if (event.button !== 0) return;
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
      item.lane = clamp(original.lane + dyLanes, 0, 20);
      if (hasEndYear(item.type)) {
        item.endDate = addDaysIso(item.startDate, duration);
      } else {
        item.endDate = item.startDate;
      }
    }

    if (hasEndYear(item.type) && compareIso(item.endDate, item.startDate) <= 0) {
      item.endDate = addDaysIso(item.startDate, minDurationDays());
    }
    renderAll({ save: false });
    event.preventDefault();
  }

  function endPointerDrag(event) {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const wasPan = dragState.mode === "pan";
    const panMoved = Boolean(dragState.moved);
    try {
      dom.timelineViewport.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already be released by the browser.
    }
    dom.timelineViewport.classList.remove("is-panning");
    dragState = null;
    if (wasPan) {
      if (panMoved) setStatus("Timeline panned");
      return;
    }
    renderAll();
    setStatus("Item moved");
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
    setZoom(clamp(available / months, MIN_ZOOM, MAX_ZOOM));
    dom.timelineViewport.scrollLeft = 0;
    setStatus("Fit applied");
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

  function getItem(id) {
    return timeline.items.find((item) => item.id === id) || null;
  }

  async function saveJsonFile() {
    const blob = new Blob([serializeTimelineJson(timeline)], { type: TIMELINE_JSON_MIME });
    const filename = `${filenameBase()}.json`;

    try {
      const savedWithPicker = await saveBlobWithPicker(blob, filename, {
        description: "Timeline JSON",
        accept: { "application/json": [".json"] },
      });
      if (!savedWithPicker) downloadBlob(blob, filename);
      setStatus("JSON saved");
    } catch (error) {
      if (error && error.name === "AbortError") {
        setStatus("Save canceled");
        return;
      }
      console.error(error);
      downloadBlob(blob, filename);
      setStatus("JSON downloaded");
    }
  }

  async function loadJsonFile() {
    const file = dom.fileInput.files && dom.fileInput.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      timeline = parseTimelineJson(text);
      selectedId = null;
      renderAll();
      setStatus("JSON loaded");
    } catch (error) {
      console.error(error);
      setStatus("Could not load JSON");
      window.alert("The selected file is not a valid timeline JSON file.");
    } finally {
      dom.fileInput.value = "";
    }
  }

  function exportSvgFile() {
    const svgText = serializeTimelineSvg();
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

  function serializeTimelineSvg() {
    const clone = dom.timelineSvg.cloneNode(true);
    clone.setAttribute("xmlns", NS);
    clone.querySelectorAll(".selection-outline,.resize-handle").forEach((node) => node.remove());
    clone.querySelectorAll(".selected").forEach((node) => node.classList.remove("selected"));
    const style = document.createElementNS(NS, "style");
    style.textContent = EXPORT_CSS;
    clone.insertBefore(style, clone.firstChild);
    return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
  }

  async function timelineToCanvas(type) {
    const svgText = serializeTimelineSvg();
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

  function buildPdfFromJpeg(jpegBytes, imageWidth, imageHeight) {
    const encoder = new TextEncoder();
    const chunks = [];
    const offsets = [0];
    let offset = 0;

    const addBytes = (bytes) => {
      chunks.push(bytes);
      offset += bytes.length;
    };
    const addText = (text) => addBytes(encoder.encode(text));
    const beginObject = (number) => {
      offsets[number] = offset;
      addText(`${number} 0 obj\n`);
    };

    const pageWidth = Math.max(300, imageWidth * 0.75);
    const pageHeight = Math.max(200, imageHeight * 0.75);
    const contents = `q\n${pageWidth.toFixed(2)} 0 0 ${pageHeight.toFixed(2)} 0 0 cm\n/Im0 Do\nQ\n`;

    addText("%PDF-1.4\n");
    beginObject(1);
    addText("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
    beginObject(2);
    addText("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");
    beginObject(3);
    addText(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /ProcSet [/PDF /ImageC] /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
    beginObject(4);
    addText(`<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
    addBytes(jpegBytes);
    addText("\nendstream\nendobj\n");
    beginObject(5);
    addText(`<< /Length ${contents.length} >>\nstream\n${contents}endstream\nendobj\n`);

    const xrefOffset = offset;
    addText("xref\n0 6\n0000000000 65535 f \n");
    for (let index = 1; index <= 5; index += 1) {
      addText(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
    }
    addText(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

    const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
    let cursor = 0;
    chunks.forEach((chunk) => {
      output.set(chunk, cursor);
      cursor += chunk.length;
    });
    return output;
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      }, type, quality);
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function saveBlobWithPicker(blob, filename, fileType) {
    if (!window.showSaveFilePicker) return false;
    let handle;
    try {
      handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [fileType],
      });
    } catch (error) {
      if (error && (error.name === "SecurityError" || error.name === "NotAllowedError")) return false;
      throw error;
    }
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return true;
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
    const estimatedWidth = value.length * 7.2;
    if (estimatedWidth <= maxWidth) return value;
    const maxChars = Math.max(3, Math.floor(maxWidth / 7.2) - 3);
    return `${value.slice(0, maxChars)}...`;
  }

  function readableTextColor(hex) {
    const clean = normalizeColor(hex).slice(1);
    const red = parseInt(clean.slice(0, 2), 16);
    const green = parseInt(clean.slice(2, 4), 16);
    const blue = parseInt(clean.slice(4, 6), 16);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    return luminance > 0.56 ? "#1d2732" : "#ffffff";
  }

  function normalizeColor(value) {
    const text = String(value || "").trim();
    return /^#[0-9a-fA-F]{6}$/.test(text) ? text : "#2563eb";
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

  function formatDisplayDate(isoDate) {
    return EN_DATE_FORMAT.format(dateFromIso(isoDate));
  }

  function formatIranianDate(isoDate) {
    const parts = IRANIAN_DATE_FORMAT
      .formatToParts(dateFromIso(isoDate))
      .reduce((result, part) => {
        if (part.type !== "literal" && part.type !== "era") result[part.type] = part.value;
        return result;
      }, {});
    return `${parts.day} ${parts.month} ${parts.year}`;
  }

  function formatDatePair(isoDate) {
    return `${formatDisplayDate(isoDate)} / ${formatIranianDate(isoDate)}`;
  }

  function formatZoomValue(value) {
    return Number(value) >= 10 ? String(Math.round(value)) : Number(value).toFixed(1).replace(/\.0$/, "");
  }

  function monthName(isoDate) {
    return EN_MONTH_FORMAT.format(dateFromIso(isoDate));
  }

  function iranianMonthName(isoDate) {
    return IRANIAN_MONTH_FORMAT.format(dateFromIso(isoDate));
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

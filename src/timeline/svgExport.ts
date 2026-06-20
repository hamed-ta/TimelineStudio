export const TIMELINE_EXPORT_CSS = `
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
  .marker-hit{stroke-width:16;pointer-events:stroke}
  .marker-line{stroke-width:2;stroke-dasharray:7 7;stroke-linecap:round}
  .marker-pin{stroke:#fff;stroke-width:2}
  .marker-label{font-size:12px;font-weight:750;paint-order:stroke;stroke:#fff;stroke-linejoin:round;stroke-width:4px}
  .note-leader{fill:none;stroke-width:2;stroke-linecap:round}
  .note-anchor{stroke:#fff;stroke-width:2}
  .note-balloon{fill:#fff;stroke-width:2}
  .note-balloon-text{fill:#1d2732;font-size:13px;font-weight:700}
  .range-line{fill:none;stroke-width:4;stroke-linecap:round}
`;

export function serializeTimelineSvg(svg: SVGSVGElement, exportCss = TIMELINE_EXPORT_CSS): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.querySelectorAll(".selection-outline,.resize-handle").forEach((node) => node.remove());
  clone.querySelectorAll(".selected").forEach((node) => node.classList.remove("selected"));
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = exportCss;
  clone.insertBefore(style, clone.firstChild);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(clone)}`;
}

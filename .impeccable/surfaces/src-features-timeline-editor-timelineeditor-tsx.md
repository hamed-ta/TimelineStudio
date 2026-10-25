---
version: 1
slug: "src-features-timeline-editor-timelineeditor-tsx"
primary_target: "src/features/timeline-editor/TimelineEditor.tsx"
related_targets: ["styles.css","src/app/providers/AppThemeProvider.tsx"]
---

# Timeline Editor

Mode: Operate. Route: `/`. Scope: the existing editor shell, controls, typography, and canvas theme.

## Direction contract

THESIS: A precise personal timeline floats inside quiet midnight glass. Replace the gray/blue visual treatment while retaining the familiar editor organization.

OWN-WORLD: The supplied AuthKit midnight canvas, ice-to-fog text hierarchy, pill commands, 6px fields, 16px glass panels, and inset frost edges. Daylight interprets the same system. Functional and user-selected colors retain their meaning.

STORY: Read the timeline and file state, create or select an item, edit its fields, and save or export using the existing commands. The canvas remains the primary work area.

FIRST VIEWPORT: Compact metadata header above a left inspector and right timeline. Grouped create/file/export actions precede view controls; at narrow widths they wrap into rows. The illuminated central time axis is the signature, surrounded by crisp date grids and low-noise glass.

FORM: User-pinned AuthKit direction overrides alternative visual worlds; existing product workflows fix the layout and control vocabulary. Direction seed: bb72d0c0. Code-first; no approved image comp.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Constraints: keep Ant Design, all DOM IDs and legacy bindings, empty defaults, local JSON ownership, calendars, undo/redo, and System/Light/Dark. Verify dark/light desktop, mobile, and the user's 660px preview width. No shipping raster assets are required.

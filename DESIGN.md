---
name: Timeline Studio
description: Frosted glass at midnight, adapted for a personal timeline workspace.
colors:
  midnight-canvas: "#05060f"
  deep-glass: "rgba(5, 6, 15, 0.97)"
  frosted-glass: "rgba(186, 214, 247, 0.03)"
  frost-wash: "rgba(186, 214, 247, 0.06)"
  frost-hover: "rgba(186, 214, 247, 0.12)"
  frost-subtle: "rgba(186, 214, 247, 0.02)"
  ice-highlight: "#d8ecf8"
  frost-glow: "#d1e4fa"
  moon-mist: "#c7d3ea"
  fog-veil: "#9da7ba"
  pure-white: "#ffffff"
  void-violet: "#663af3"
  violet-hover-dark: "#7652ff"
  violet-hover-light: "#5626dc"
  violet-label-dark: "#c0adff"
  glass-edge: "rgba(186, 215, 247, 0.12)"
  glass-edge-strong: "rgba(186, 215, 247, 0.24)"
  control-edge-dark: "#66748b"
  focus-ice: "#b6d9fc"
  danger-dark: "#f49b9b"
  axis-dark: "#9cb9dc"
  cursor-dark: "#e9be88"
  daylight-canvas: "#eef2f8"
  daylight-surface: "rgba(255, 255, 255, 0.6)"
  daylight-raised: "rgba(255, 255, 255, 0.78)"
  daylight-hover: "#e4eaf3"
  daylight-overlay: "rgba(255, 255, 255, 0.97)"
  daylight-ink: "#17243b"
  brand-sage-light: "#426b64"
  brand-amber-light: "#996c36"
  brand-sage-dark: "#a4cbbb"
  brand-amber-dark: "#e6bb7e"
  daylight-muted: "#465775"
  daylight-helper: "#576780"
  daylight-edge: "rgba(47, 65, 94, 0.18)"
  daylight-edge-strong: "rgba(47, 65, 94, 0.42)"
  control-edge-light: "#8292ac"
  danger-light: "#b93835"
  canvas-light: "#f7f9fd"
  axis-light: "#596e90"
  cursor-light: "#a05b1c"
typography:
  display:
    fontFamily: '"Space Grotesk Variable", "Inter Variable", "Vazirmatn Variable", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Space Grotesk Variable", "Inter Variable", "Vazirmatn Variable", sans-serif'
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.2
  body:
    fontFamily: '"Inter Variable", "Vazirmatn Variable", "Noto Sans Arabic", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Inter Variable", "Vazirmatn Variable", "Noto Sans Arabic", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
  control:
    fontFamily: '"Inter Variable", "Vazirmatn Variable", "Noto Sans Arabic", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
  timeline:
    fontFamily: '"Inter Variable", "Vazirmatn Variable", "Noto Sans Arabic", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Tahoma, sans-serif'
    fontSize: "0.75rem"
rounded:
  input: "6px"
  card: "16px"
  button: "999px"
spacing:
  unit: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  brand-mark:
    width: "36px"
    height: "36px"
  brand-mark-footer:
    width: "22px"
    height: "22px"
  button-primary:
    backgroundColor: "{colors.void-violet}"
    textColor: "{colors.pure-white}"
    typography: "{typography.control}"
    rounded: "{rounded.button}"
    padding: "0 12px"
    height: "34px"
  button-ghost:
    backgroundColor: "{colors.frost-wash}"
    textColor: "{colors.frost-glow}"
    typography: "{typography.control}"
    rounded: "{rounded.button}"
    padding: "0 12px"
    height: "34px"
  button-ghost-hover:
    backgroundColor: "{colors.frost-hover}"
    textColor: "{colors.ice-highlight}"
    rounded: "{rounded.button}"
  button-secondary:
    backgroundColor: "{colors.frost-subtle}"
    textColor: "{colors.frost-glow}"
    rounded: "{rounded.button}"
    padding: "0 12px"
    height: "34px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.frost-glow}"
    rounded: "{rounded.button}"
    padding: "0 9px"
    height: "30px"
  input:
    backgroundColor: "{colors.frost-wash}"
    textColor: "{colors.frost-glow}"
    typography: "{typography.label}"
    rounded: "{rounded.input}"
    padding: "7px 9px"
    height: "36px"
  panel:
    backgroundColor: "{colors.frosted-glass}"
    rounded: "{rounded.card}"
    padding: "{spacing.md}"
  overlay:
    backgroundColor: "{colors.deep-glass}"
    textColor: "{colors.frost-glow}"
    rounded: "{rounded.card}"
  toolbar:
    backgroundColor: "{colors.frosted-glass}"
    rounded: "{rounded.card}"
    padding: "7px"
---

# Design System: Timeline Studio

## Overview

**Creative North Star: "Frosted glass cathedral at midnight"**

Timeline Studio adopts the supplied AuthKit reference's midnight blue-black ground, luminous ice typography, restrained violet, pill controls, inset frost edges, and softly illuminated glass. The timeline is the work on display: quiet glass controls surround a precise, legible canvas.

This records the implemented system in `styles.css` and `AppThemeProvider.tsx`, after the finish review. The AuthKit marketing composition is adapted into a compact working editor; its proprietary fonts are replaced with the supplied alternatives. [The product record](docs/product.md) owns behavior; ADR 0007 keeps Ant Design as the control system.

**Key Characteristics:**
- Cool blue-white foregrounds stepping down through ice, frost, mist, and fog.
- Translucent surfaces with lit inset edges and restrained depth.
- Compact working controls and breathing room around the timeline.
- Familiar editor layout, accurate dates, and user-owned timeline colors.
- A daylight interpretation with System, Light, and Dark preferences.
- A Sage + amber Gentle turn symbol beside a solid, readable application name.

## Colors

The frontmatter records the reusable implemented palette. Dark values describe the reference world; daylight tokens supply its light interpretation. CSS semantic variables select the active theme, and Ant Design receives matching container, text, border, and action values. The reference's unused Steel Plate and malformed `#2f343` surface are not implementation tokens.

### Primary

Void Violet fills form commits and native checkbox/range accents. Violet Hover Dark and Light are the theme-specific hover colors. Ordinary toolbar commands use frosted or outlined pills. This adapts auth-submit emphasis to editor forms.

### Neutral

Midnight Canvas is the deepest ground. Deep Glass supports menus and overlays; Frosted Glass and Frost Wash build panels and controls. Ice Highlight leads, Frost Glow supplies normal text, Moon Mist supplies secondary text, and Fog Veil supplies helpers. Glass Edge is decorative separation; Control Edge provides essential field boundaries and Focus Ice makes dark-theme keyboard focus visible.

### Brand Identity

The approved identity is **Gentle turn, Sage + amber**: a rounded lowercase t and a separate circular moment. Use Brand Sage Light and Brand Amber Light on light surfaces; Brand Sage Dark and Brand Amber Dark on midnight. CSS roles `--brand-sage` and `--brand-amber` resolve with the app theme, including System. These colours belong to the identity; Void Violet remains the action accent and timeline item colours remain user-owned.

Use the shared `BrandMark` geometry at 36px in the header and 22px beside the footer name. Keep the live application name in Space Grotesk: the header uses solid Daylight Ink or Ice Highlight, and the footer uses the normal theme text role. Outlined lockups and monochrome artwork live in `public/brand/`; browser/home-screen icons and the social card derive from those masters. `docs/brand/usage.md` records clear space, minimum sizes, approved backgrounds, and regeneration. Forced-colour mode renders both symbol shapes in CanvasText.

**The Readable Glass Rule.** Decorative hairlines may recede; text, editable field boundaries, and focus indicators must use their stronger semantic roles.

### Functional Color

Keep user-selected item and line colors exactly as stored. Muted action-icon colors distinguish commands as required by the product. Danger supplies destructive text and the unsaved indicator; Axis and Cursor have separate theme-specific colors. These functional hues and user data are exceptions to the cool brand palette. The reference's customization swatches do not become extra brand accents.

### Light Appearance

Daylight Canvas and translucent white surfaces replace the dark ground, with Daylight Ink, Muted, Helper, and Edge roles. Canvas Light keeps the SVG reading area distinct from the shell. The same shapes, hierarchy, and restrained depth apply. System mode follows the operating system; the saved Light or Dark preference overrides it.

## Typography

Use locally bundled Inter Variable for functional text, Space Grotesk Variable for the brand and headings, and Vazirmatn Variable for Persian glyph coverage. Space Grotesk and Inter are substitutes named in the reference; its proprietary faces were not supplied. The full source fallback stacks are preserved in the tokens. Metadata, calendar previews, cursor readouts, information blocks, and range readouts use tabular digits.

- **Display / Title:** the compact brand and section headings share the 15px medium-weight scale. The brand adds tight tracking and a solid theme-appropriate heading colour beside the Sage + amber mark.
- **Body / Control:** working text is 14px; command text is medium weight. Supporting copy also uses the observed 13px step.
- **Label:** 12px semibold field labels and helpers; line height keeps stacked forms readable.
- **Timeline:** 12px date/lane labels, 13px stronger year/item labels, and 11px derived period labels. These are canvas detail sizes, not a general UI text scale.

**The Solid Working Text Rule.** Keep the brand name and functional text solid; colour expression belongs to the symbol and the editor's existing semantic roles.

## Layout

Keep the compact metadata header, collapsible left inspector, grouped Create/File/Export toolbar, right-side View controls, custom timeline, and collapsible information panel. The canvas receives most of the working area. The reference's 120px section gaps and centered 1200px marketing container do not constrain the editor.

Use the compact spacing steps in the frontmatter, with small optical gaps of 5–10px between controls. Panel bodies use 16px padding, inspector padding is 14px, and the stage uses 10px by 12px. The inspector is 320px wide, collapsing to 58px. The canvas receives the remaining width and scrolls within its own viewport.

At 1600px and below, toolbar action groups wrap and View moves to a separate row. At 960px and below, the header and inspector stack above a stage with a 580px minimum height; the inspector is capped at 420px. At 560px and below, paired form fields become one column and shell padding is 12px. Coarse pointers increase the principal command and field targets to 44px.

The signature is an illuminated time axis in a quiet glass workspace. A faint 96px shell grid and static cool radial glow support it without replacing the precise SVG date grid. Exported data and timeline geometry retain their product meanings.

## Elevation & Depth

Depth combines a lit inset edge, a broad low-opacity inner wash, and a diffuse outer shadow. The sidecar records exact dark and daylight shadow stacks: the full stack belongs to the canvas and overlays; the smaller stack belongs to inspector cards, the tool dock, and information panels. Buttons use only a shallow inset highlight.

Only the sticky metadata header uses backdrop blur (14px). The SVG canvas and moving items stay crisp. Menus use almost opaque Deep Glass or Daylight Overlay so colored items cannot overwhelm their text.

**The Inset Light Rule.** Glass depth comes from the edge and inner wash before the outer shadow; avoid adding broad accent glows to every control.

## Shapes

Use the source's consistent families: pill commands, softly rounded cards and overlays, and tighter rectangular fields. Circular icon buttons share the pill radius. The frontmatter owns these three radius values. Functional geometry remains distinct: note balloons and their inline editor, period bars, marker leaders, resize grips, and dashed selections keep their existing shapes.

## Components

### Brand Mark and Name

The shared Gentle turn symbol carries Sage in its rounded t and Amber in its separate moment. Keep its geometry and proportions aligned with the public vector masters. The header pairs the 36px symbol with the compact 15px, medium-weight Space Grotesk name across a 10px gap; the footer pairs the 22px symbol with the name across a 6px gap. Both names remain solid. The inline SVG is decorative beside the text name and carries no independent focus target. In forced colours, both shapes use CanvasText.

### Buttons and Toolbar

Frosted pills use medium-weight text and line-art icons; functional icon tints are the product exception. Hover strengthens the wash and border without moving the command. Primary form commits use Void Violet and white text. Secondary commands use the subtler surface; quiet actions use a transparent surface and a 30px minimum height. Standard and icon commands are 34px high. Coarse-pointer rules raise the main targets to 44px. Icon-only commands retain accessible names and tooltips.

Keyboard focus uses the semantic 2px outline with a 2px offset and a soft 3px halo. The button outline is explicitly authored with `!important` so Ant Design cannot replace it with a weaker treatment.

### Panels and Overlays

Inspector cards use translucent frost, a lit top edge, 48px headers, and 16px body padding. The command dock uses the same material with 7px padding. Popovers and context menus use the overlay material and a stronger edge. Their widths are constrained to the viewport. Preserve field labels and the form hierarchy; do not introduce marketing eyebrows or auth mockups.

### Inputs and States

Fields use a faint cool wash, the stronger Control Edge, solid text, 36px minimum height, and 7px by 9px padding. Native title, date, and select fields inherit the Label typography (12px, semibold, 1.4 line height); selects reserve 30px on the right for the chevron. Focus uses the outline and halo above. Preserve labels, native editing behavior, disabled distinctions, and legible placeholders. Read-only fields use muted text and the hover surface. Destructive text uses Danger; color selection exposes the stored value rather than a brand substitution.

### Timeline and Theme Control

The SVG shares the shell's cool ground and typography while retaining readable major/minor date lines, alternating time bands, a prominent axis, and a distinct cursor. Data colors are never replaced by brand tokens. Theme changes alter presentation only, preserving saved JSON and undo history.

State transitions use 140ms ease; panel/layout changes use 160–200ms ease. Ambient glows stay still. Source rules disable transitions and animations under reduced motion, and replace essential boundaries and both brand-symbol fills in forced colors. These two media modes were source-reviewed; the final screenshot set covers desktop dark/light, mobile dark/light, 660px dark, and a dark zoom overlay rather than simulated accessibility media modes.

## Do's and Don'ts

### Do:

- **Do** use semantic CSS variables and matching Ant Design tokens so both themes retain the same hierarchy.
- **Do** carry midnight, luminous text, inset frost, and the three radius families into new editor surfaces.
- **Do** preserve System/Light/Dark, Persian-capable text, user colors, and precise timeline geometry.
- **Do** use the shared Gentle turn geometry and theme-specific Sage + amber roles with a solid application name.
- **Do** verify new surfaces in both themes, at desktop and narrow widths, with keyboard focus and accessibility preferences.

### Don't:

- **Don't** copy AuthKit/WorkOS branding, auth mockups, a marketing hero, or their product claims.
- **Don't** dim body text, essential field boundaries, or timeline labels to decorative hairline opacity.
- **Don't** put gradients on working text, blur the canvas, animate the grid, or recolor saved data to satisfy the shell palette.
- **Don't** stretch or rotate the brand symbol, move its moment, add effects to it, or replace control accents and stored item colours with brand colours.

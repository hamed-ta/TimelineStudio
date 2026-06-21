# 0007 Ant Design UI System

Status: Accepted

## Context

Timeline Studio is moving from a custom-styled React shell toward a modern app UI. The app still has a custom SVG timeline canvas and a legacy controller in `app.js`, but the surrounding editor shell, toolbar, form controls, icons, and light/dark theme should use a maintained design system.

MUI and Ant Design were compared as candidate systems. MUI is a strong general-purpose React UI library, while Ant Design provides a broad, polished component system with mature React and TypeScript support, strong theming, and a design language suitable for complex productivity interfaces.

The user chose Ant Design for the app UI direction.

## Decision

Adopt Ant Design as Timeline Studio's UI component system.

Use:

- `antd` for app shell components, controls, design tokens, and light/dark styling.
- `@ant-design/icons` for action icons.
- Ant Design theme algorithms for light and dark modes.

Keep the timeline SVG renderer and legacy DOM bindings working during the migration. Until the timeline controller is migrated into React, Ant components may be combined with native elements only where the existing controller requires exact DOM behavior, such as real `select`, `range`, and hidden compatibility inputs.

## Consequences

Positive:
- The app gains a consistent, maintained UI system for controls, panels, icons, and themes.
- Light and dark theme styling can use Ant Design's theme algorithms instead of only custom CSS tokens.
- Future auth, file, dialog, menu, and dashboard surfaces can reuse the same component system.

Negative:
- The dependency footprint increases.
- Some legacy controller bindings still require DOM-compatible bridge controls during the incremental migration.
- The timeline canvas still needs custom CSS/SVG styling because it is not a standard Ant Design component.

## Follow-up Work

- Continue moving legacy controller state into React so `Select`, `Slider`, `Dropdown`, `Menu`, and form components can replace remaining native bridge controls.
- Replace the custom context menu and color picker with Ant-based popover/menu controls once interaction state is React-owned.
- Review bundle size after the main UI migration stabilizes.

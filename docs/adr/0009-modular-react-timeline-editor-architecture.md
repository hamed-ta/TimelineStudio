# 0009 Modular React Timeline Editor Architecture

Status: Accepted

## Context

Timeline Studio now has a Vite, React, TypeScript, and Ant Design shell, but the legacy `app.js` controller still owns most editor behavior. It handles state mutation, DOM binding, SVG rendering, pointer interactions, keyboard shortcuts, timeline item drawing, context menus, file operations, and several item-specific behaviors in one large module.

That was useful during the behavior-preserving migration, but the file is now too large for safe feature work. Note items alone need layout calculation, collision handling, SVG drawing, inline editing, resizing, dragging, selection, context-menu behavior, and sidebar controls. Future Firebase storage, account features, richer exports, and tests will be harder if the editor remains one central DOM controller.

React's documented model favors breaking UI into components, keeping minimal state, deriving computed data, and using one-way data flow. For more complex shared state, React documents reducer and context as a way to separate state update logic from rendering. Redux's style guide recommends organizing application code by feature when domains grow.

## Decision

Adopt a feature-oriented React architecture for the timeline editor.

Use React components for UI and SVG rendering, reducer-managed editor state for timeline mutations, custom hooks for reusable interaction behavior, and pure TypeScript modules for timeline math and layout.

Do not adopt classic MVC or MVVM as the project architecture. The app should follow React's component and unidirectional data-flow model instead.

Do not add Redux yet. Start with `useReducer` and context for timeline editor state. Reconsider Redux Toolkit only if the app later needs cross-page state, advanced undo/redo, collaboration, time-travel debugging, or state tooling that is not practical with local reducers.

Target structure:

```text
src/
  app/
    App.tsx
    layout/
    providers/

  features/
    timeline-editor/
      TimelineEditor.tsx
      timelineReducer.ts
      timelineActions.ts
      timelineSelectors.ts
      useTimelineEditor.ts

      components/
        EditorSidebar.tsx
        LineEditorPopover.tsx
        TimelineContextMenu.tsx
        TimelineHeader.tsx
        TimelineInfoPanel.tsx
        TimelineToolbar.tsx

      canvas/
        Axis.tsx
        Grid.tsx
        LaneLabels.tsx
        SelectionOverlay.tsx
        TimelineSvg.tsx

      interactions/
        contextMenu.ts
        edgeSnap.ts
        keyboardShortcuts.ts
        pointerDrag.ts

      items/
        BirthItem.tsx
        EventItem.tsx
        LineItem.tsx
        MarkerItem.tsx
        NoteItem.tsx
        PeriodItem.tsx
        TextItem.tsx

      layout/
        axisLayout.ts
        noteLayout.ts
        timelineLayout.ts

  platform/
    files.ts
    media.ts

  shared/
    components/
    hooks/
    utils/

  timeline/
    dates.ts
    export/
      pdf.ts
      svgExport.ts
    formatters.ts
    json.ts
    model.ts
```

Migration rules:

- Preserve saved JSON compatibility unless a migration is intentional and documented.
- Move behavior in small, testable slices rather than rewriting the editor.
- Extract pure calculations before converting interactive rendering.
- Keep existing DOM IDs and data attributes until the owning behavior has moved into React.
- Prefer component files by feature/domain, not one folder for every generic file type.
- Keep timeline model, date, JSON, and export helpers independent from React.
- Use refs only for browser APIs and DOM concerns React cannot model directly, such as focus, scroll position, pointer coordinates, file handles, and measuring.
- Keep Ant Design as the shell/control system from ADR 0007, but keep the timeline canvas custom.

## Consequences

Positive:

- The largest editor behaviors can be tested and reviewed in smaller modules.
- Item-specific complexity, especially notes, can live near the component and layout code it affects.
- React components can gradually replace legacy DOM rendering without a full rewrite.
- A reducer creates one explicit place for timeline mutations such as add, delete, move, resize, lock, reorder, and update settings.
- Pure layout modules make future browser tests and unit tests easier.

Negative:

- During migration, some behavior will temporarily bridge React components and legacy `app.js`.
- The app may have more files before it has less total code.
- Poor boundaries could recreate the same complexity across many files, so reducers, selectors, and feature modules must stay cohesive.

## Follow-up Work

- Start by extracting pure layout and interaction helpers from `app.js`, especially note layout, axis layout, edge snapping, and keyboard shortcut guards.
- Introduce `features/timeline-editor/timelineReducer.ts` for timeline document mutations.
- Move header, toolbar, info panel, context menu, and editor sidebar into React-owned feature components.
- Convert SVG rendering item by item, starting with `NoteItem` because it has the most item-specific complexity.
- Keep `app.js` only as a compatibility bridge during migration, then delete it when React owns the editor behavior.
- Add focused unit tests for pure timeline layout and reducer behavior before broad browser automation.

## References

- React: Thinking in React, component hierarchy, minimal state, and one-way data flow: https://react.dev/learn/thinking-in-react
- React: Scaling up with reducer and context: https://react.dev/learn/scaling-up-with-reducer-and-context
- React: Reusing logic with custom hooks: https://react.dev/learn/reusing-logic-with-custom-hooks
- Redux Style Guide: feature folder organization: https://redux.js.org/style-guide/

# Red Green Refactor Workflow

Use this workflow for every feature or bug fix.

## 1. BDD

Write or update a user-facing scenario in `docs/product.md`.

Use Given / When / Then language:

```md
Given a timeline with locked items
When the user drags the timeline canvas
Then the canvas pans
And no item date or line changes.
```

## 2. Red

Prefer an automated failing test when a test harness exists.

Until automated browser tests exist, document the failing or missing behavior in `docs/workflows/browser-smoke.md` or in the active task notes, then confirm the behavior manually.

## 3. Green

Make the smallest implementation change that satisfies the scenario.

Avoid unrelated refactors while making the behavior pass.

## 4. Refactor

Clean up naming, duplication, or structure after the behavior works.

Do not change behavior during refactor.

## 5. Verify

Run the relevant checks and record the result in `docs/handoff.md`.

For this app, the minimum JavaScript check is:

```sh
node --check src/features/timeline-editor/legacyTimelineEditor.js
```

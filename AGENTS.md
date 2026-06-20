# AGENTS.md

## Project

Timeline Studio is a dependency-free static web app for building personal horizontal timelines.

Main files:
- `index.html`: app shell
- `styles.css`: layout and visual design
- `app.js`: timeline state, rendering, import/export, and interactions
- `README.md`: user-facing project notes

Avoid adding dependencies unless the user explicitly asks or an ADR accepts the change.

## Project Documents

- `docs/product.md`: product behavior, concepts, and BDD acceptance scenarios
- `docs/plan.md`: current short-term plan and priorities
- `docs/handoff.md`: current state for session handoff
- `docs/startup.md`: `/startup` workflow
- `docs/closeup.md`: `/closeup` workflow
- `docs/workflows/red-green-refactor.md`: required feature workflow
- `docs/workflows/browser-smoke.md`: manual browser verification checklist
- `docs/adr/`: accepted long-lived decisions

## Commands

Check JavaScript syntax:

```sh
node --check app.js
```

Run locally:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8765/index.html
```

## Session Commands

When the user says `/startup`, follow `docs/startup.md`.

When the user says `/closeup`, follow `docs/closeup.md`.

## Required Development Loop

For every behavior change, follow `docs/workflows/red-green-refactor.md`.

Minimum rule:
- Update or add a BDD scenario in `docs/product.md`.
- Establish the RED state with an automated failing test when possible, or a documented browser/manual check when no harness exists.
- Implement the smallest GREEN change.
- REFACTOR only after behavior works.
- VERIFY and record results in `docs/handoff.md`.

Do not consider a feature complete unless the behavior scenario, verification result, and handoff are updated.

## Documentation Rules

- Update `docs/product.md` when intended user-visible behavior changes.
- Update `docs/plan.md` when priorities or task status changes.
- Update `docs/handoff.md` before ending a meaningful work session.
- Add an ADR only for lasting decisions that affect future development.
- Keep documentation concise and specific to this project.

## Implementation Rules

- Preserve compatibility with existing saved JSON unless a migration is intentional.
- Keep date calculations deterministic and based on stored Gregorian ISO dates.
- Keep Iranian date text as display output derived from Gregorian dates.
- Do not add sample personal data to the default app state.

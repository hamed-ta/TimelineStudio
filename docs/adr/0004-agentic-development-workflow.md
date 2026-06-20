# 0004 Agentic Development Workflow

Status: Accepted

## Context

The project is being developed with coding agents across multiple sessions. The user wants small manageable iterations, clear handoffs, and behavior-first development.

## Decision

Use `AGENTS.md` as the agent operating guide.

Use:
- `docs/product.md` for product behavior and BDD scenarios
- `docs/plan.md` for short-term planning
- `docs/handoff.md` for session state
- `docs/startup.md` and `docs/closeup.md` for session boundaries
- `docs/workflows/red-green-refactor.md` for the required implementation loop
- `docs/workflows/browser-smoke.md` for manual UI verification until automated browser tests exist

Behavior changes must follow BDD plus red/green/refactor.

## Consequences

Positive:
- New sessions can start from documented state.
- Agents have a clear definition of done.
- Product behavior and technical decisions are less likely to drift.

Negative:
- Documentation must be kept current.
- Manual browser checks remain a weak point until automated tests are added.

# Domain Docs

Timeline Studio uses a single-context domain layout:

- `CONTEXT.md` at the repository root: domain terms and relationships.
- `docs/adr/`: accepted architectural decisions.

## Before Exploring

Read root `CONTEXT.md` when present, then read ADRs relevant to the area being explored.

If domain documentation is absent, proceed silently. The `domain-modeling` skill creates or updates it when terms or decisions are resolved.

Read `docs/product.md` for product behavior and BDD scenarios. Keep current priorities and verification evidence in `docs/plan.md` and `docs/handoff.md`.

## Vocabulary

Use terms defined in `CONTEXT.md` in issues, proposals, hypotheses, and test names. If a needed concept is missing, reconsider the wording or note the gap for `domain-modeling`.

## ADR Conflicts

Surface any proposal that contradicts an existing ADR. Name the ADR and explain why the decision should be reopened.

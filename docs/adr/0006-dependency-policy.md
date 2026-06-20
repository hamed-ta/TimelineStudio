# 0006 Dependency Policy

Status: Accepted

## Context

Timeline Studio started as a dependency-free static app. ADR 0005 changed the target direction to a Vite, React, TypeScript, and Firebase web app. As the editor becomes more interactive, some features may be safer and cheaper to build with well-maintained libraries than with custom code.

The project should still stay lightweight, open source, and inexpensive to operate.

## Decision

Dependencies may be added when they materially improve at least one of:

- Accessibility or keyboard interaction quality.
- UI behavior that is easy to get wrong, such as dialogs, menus, drag/drop, virtualized lists, or complex controls.
- Data correctness, validation, export, import, or testing reliability.
- Developer maintainability compared with custom code.

Before adding a dependency, prefer the smallest suitable package and check:

- Active maintenance and compatibility with the current Vite/React/TypeScript stack.
- License compatibility with an open-source project.
- Bundle size and whether the package is tree-shakable.
- Security and supply-chain risk.
- Whether the feature is important enough to justify installation, lockfile changes, and future upgrades.

Use documentation based on scope:

- Small feature dependency: document the reason in `docs/plan.md` and record the result in `docs/handoff.md`.
- Long-lived, cross-cutting, runtime, backend, storage, auth, routing, state-management, or design-system dependency: add an ADR.
- New dependency with user-visible behavior: update `docs/product.md` scenarios when behavior changes.

Do not add a dependency only because it is popular. Do not add broad frameworks or design systems for a narrow feature without an ADR.

## Consequences

Positive:
- The app can use proven libraries for complex UI and integration work.
- Accessibility and browser edge cases can improve without excessive custom code.
- Dependency decisions remain reviewable in project docs.

Negative:
- More dependencies increase install size, audit noise, and maintenance overhead.
- Poor dependency choices can increase bundle size or lock the project into an unnecessary abstraction.
- Agents must be explicit about why a dependency is justified.

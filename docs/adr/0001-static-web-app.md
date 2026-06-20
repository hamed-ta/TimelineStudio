# 0001 Static Web App

Status: Accepted

## Context

Timeline Studio is a personal timeline editor that should run locally with minimal setup. The app currently works as static HTML, CSS, and JavaScript.

## Decision

Keep Timeline Studio as a dependency-free static web app unless a future feature clearly requires a build system or framework.

## Consequences

Positive:
- Easy to run locally.
- Easy for agents to inspect and modify.
- No install step is required.
- Lower maintenance overhead.

Negative:
- Complex state management may become harder as the app grows.
- Automated browser testing needs separate tooling if added later.
- Large UI complexity may eventually justify a framework.

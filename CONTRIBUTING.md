# Contributing to Timeline Studio

Thanks for helping improve Timeline Studio. This project is a local-first timeline editor, so changes should preserve user-owned JSON data and avoid surprising stored-file migrations.

## Ways To Contribute

- Report bugs with reproduction steps, browser name/version, and whether the issue happens with a new empty timeline.
- Suggest features with the workflow they support and how they affect saved JSON compatibility.
- Improve documentation, accessibility, keyboard behavior, export behavior, or browser compatibility.
- Submit focused pull requests that keep behavior changes small and testable.

## Local Setup

Install dependencies:

```sh
npm install
```

Run the app:

```sh
npm run dev -- --port 8765
```

Open:

```text
http://127.0.0.1:8765/
```

Run validation before opening a pull request:

```sh
node --check app.js
npm run typecheck
npm run build
```

## Development Rules

- Preserve compatibility with existing saved JSON unless a migration is intentional and documented.
- Keep stored dates as deterministic Gregorian ISO dates.
- Keep Iranian date text as derived display output.
- Do not add sample personal data to the default app state.
- Avoid new dependencies unless they materially improve accessibility, reliability, maintainability, or complex feature behavior.
- Keep user-visible behavior documented in `docs/product.md`.
- Record notable changes in `CHANGELOG.md`.
- Update `docs/handoff.md` before ending meaningful work.

## Pull Request Checklist

- The change is focused and explained.
- User-visible behavior is covered in `docs/product.md` when applicable.
- `CHANGELOG.md` includes a short entry for notable changes.
- Existing JSON files continue to load unless the PR intentionally adds a migration.
- Validation commands pass locally.
- Screenshots or short screen recordings are included for visual UI changes when useful.

## Commit Messages

Use concise conventional-style commit messages:

```text
feat: add timeline item context menu
fix: prevent axis label overlap
docs: add release workflow notes
ci: add github pages deployment
chore: update dependency metadata
```

Prefer one logical change per commit.

## Release Notes

Releases are tag based. Version tags must match `package.json` and a matching section in `CHANGELOG.md`. See `docs/versioning.md` for the exact release flow.

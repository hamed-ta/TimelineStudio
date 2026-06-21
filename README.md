# Timeline Studio

Timeline Studio is a local-first web app for building personal horizontal timelines. It runs in the browser, saves portable JSON files, and can export the visible timeline as SVG, PNG, or PDF.

The project is migrating toward a modern Vite, React, TypeScript, Ant Design, and eventually Firebase-based app while preserving local JSON ownership.

## Features

- Horizontal SVG timeline with pan, zoom, fit, and readable zoom limits.
- Event, period, marker, birth, note, line, and text item types.
- Live Gregorian and Iranian calendar display derived from stored Gregorian dates.
- Birthdate-based age readouts and optional period age/duration labels.
- Drag, resize, reorder, rename, recolor, lock, copy, paste, duplicate, and delete timeline items.
- Line editing directly from the timeline label area.
- Shared item and line color picker with preset palette, hue control, and hex entry.
- Light, dark, and system themes.
- JSON load/save with direct file saving when the browser supports it.
- SVG, PNG, and PDF export.

## Local Development

Install dependencies:

```sh
npm install
```

Start the Vite dev server:

```sh
npm run dev -- --port 8765
```

Open:

```text
http://127.0.0.1:8765/
```

Run validation:

```sh
node --check app.js
npm run typecheck
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

## Data

Timeline Studio starts with an empty timeline. Use `Load JSON` to open saved timelines and `Save` to write JSON back to the current file when browser support allows it. JSON import/export remains the portable user-owned format.

Personal timeline files should stay outside git, for example under ignored `user-data/`.

## Deployment

The repository includes GitHub Actions for CI and release deployment.

- Branch pushes and pull requests run syntax check, typecheck, and build.
- Version tags like `v0.2.0` build the app, deploy `dist` to GitHub Pages, create or update a GitHub Release, and attach a zipped static build.

Before the first deployment, configure the GitHub repository:

```text
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

For the `TimelineStudio` repository, GitHub Pages will serve the project at:

```text
https://<github-username>.github.io/TimelineStudio/
```

The release workflow sets Vite's base path from the actual repository name, so the renamed `TimelineStudio` repository does not require a hard-coded base path.

## Release Flow

See [docs/versioning.md](docs/versioning.md) for the full release process.

Typical release:

```sh
npm version minor --no-git-tag-version
# Move CHANGELOG.md Unreleased entries to: ## 0.2.0 - YYYY-MM-DD
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release 0.2.0"
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

## Project Docs

- [Product notes](docs/product.md)
- [Plan](docs/plan.md)
- [Versioning](docs/versioning.md)
- [Changelog](CHANGELOG.md)
- [Architecture decisions](docs/adr/)

## License

Timeline Studio is released under the [MIT License](LICENSE).

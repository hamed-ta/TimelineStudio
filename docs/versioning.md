# Versioning

Timeline Studio uses semantic versioning for releases:

- `MAJOR`: incompatible saved JSON format changes, removed features, or breaking deployment/runtime changes.
- `MINOR`: new user-facing features that preserve existing saved JSON compatibility.
- `PATCH`: bug fixes, internal refactors, documentation fixes, and behavior-preserving improvements.

The current package version is `0.2.1`. Do not bump it during ordinary migration slices unless the user asks for a release or version bump.

## Changelog

Record notable changes in `CHANGELOG.md`.

Use `Unreleased` for work that has not been released yet. When a release is cut:

1. Move relevant `Unreleased` entries under a version heading such as `## 0.2.0 - YYYY-MM-DD`.
2. Update `package.json` only when intentionally bumping the version.
3. Keep entries concise and user-readable.

## Release And Deploy

GitHub Actions validates normal branch pushes and pull requests with:

```sh
node --check app.js
npm run typecheck
npm run build
```

Versioned releases are tag-based. A release tag must match the version in `package.json` and `package-lock.json`, and `CHANGELOG.md` must include a matching version heading.

Example release flow:

```sh
npm version minor --no-git-tag-version
# Move CHANGELOG.md Unreleased entries to: ## 0.2.0 - YYYY-MM-DD
git add package.json package-lock.json CHANGELOG.md
git commit -m "chore: release 0.2.0"
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

Pushing the tag runs the release workflow. It builds the app, deploys `dist` to GitHub Pages, creates or updates the GitHub Release, and attaches a zipped static build artifact.

If a release rerun finds that the zipped static build artifact already exists, the workflow leaves that immutable release asset in place instead of trying to replace it.

The release workflow can also be run manually from the GitHub Actions tab with the exact tag name, such as `v0.2.0`.

Before the first deployment, configure the repository at GitHub Settings -> Pages -> Build and deployment -> Source -> GitHub Actions.

For the `TimelineStudio` repository, the default project URL is:

```text
https://<github-username>.github.io/TimelineStudio/
```

The release workflow sets `VITE_BASE_PATH` from the actual GitHub repository name, so project-page asset paths follow future repository renames automatically.

## Compatibility

- Preserve existing saved JSON compatibility unless a migration is intentional and documented.
- Call out any saved-data migration in both `CHANGELOG.md` and `docs/product.md`.
- Keep local JSON import/export available across version changes.

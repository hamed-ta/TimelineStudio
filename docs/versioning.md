# Versioning

Timeline Studio uses semantic versioning for releases:

- `MAJOR`: incompatible saved JSON format changes, removed features, or breaking deployment/runtime changes.
- `MINOR`: new user-facing features that preserve existing saved JSON compatibility.
- `PATCH`: bug fixes, internal refactors, documentation fixes, and behavior-preserving improvements.

The current package version is `0.1.0`. Do not bump it during ordinary migration slices unless the user asks for a release or version bump.

## Changelog

Record notable changes in `CHANGELOG.md`.

Use `Unreleased` for work that has not been released yet. When a release is cut:

1. Move relevant `Unreleased` entries under a version heading such as `## 0.2.0 - YYYY-MM-DD`.
2. Update `package.json` only when intentionally bumping the version.
3. Keep entries concise and user-readable.

## Compatibility

- Preserve existing saved JSON compatibility unless a migration is intentional and documented.
- Call out any saved-data migration in both `CHANGELOG.md` and `docs/product.md`.
- Keep local JSON import/export available across version changes.

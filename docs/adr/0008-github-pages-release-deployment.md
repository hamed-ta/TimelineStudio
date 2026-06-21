# 0008 GitHub Pages Release Deployment

Status: Accepted

## Context

Timeline Studio is currently a static Vite app. The user wants a public URL that can be deployed from GitHub with CI/CD, while keeping hosting simple and inexpensive.

The app is not ready for Firebase Auth or Firestore yet, so Firebase Hosting can wait until backend work begins.

## Decision

Use GitHub Actions and GitHub Pages for the first public deployment path.

Use two workflow layers:

- CI validates branch pushes, pull requests, and manual runs.
- Version tags such as `v0.2.0` build the app, deploy `dist` to GitHub Pages, and create or update a GitHub Release from the matching `CHANGELOG.md` section.

The release tag must match `package.json` version. GitHub Pages release builds set Vite's base path to `/<repository>/` so project-page asset URLs work.

## Consequences

Positive:
- Hosting is free for a public open-source repository.
- The deployed app is static and inexpensive to operate.
- Releases are explicit and tied to semantic version tags.
- GitHub Releases preserve user-readable changelog notes and a downloadable static build artifact.

Negative:
- GitHub Pages project URLs require a repository base path unless a custom domain is configured.
- Releases require a disciplined version/changelog/tag flow.
- Firebase Hosting may still become preferable once Firebase Auth and Firestore are added.

## Follow-up Work

- Enable GitHub Pages in repository settings with Source set to GitHub Actions.
- Add a custom domain later if desired.
- Revisit hosting when Firebase backend work starts.

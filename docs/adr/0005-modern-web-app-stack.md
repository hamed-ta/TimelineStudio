# 0005 Modern Web App Stack

Status: Accepted

## Context

Timeline Studio currently works as a dependency-free static web app. The next product direction is an account-based web app where users can sign in, create timelines, and eventually store timeline data in a backend database while preserving local JSON import/export.

The app should remain open source and inexpensive to operate for free users. The migration should be done in small behavior-preserving steps so the existing editor can still be run and tested throughout the transition.

## Decision

Adopt the following target stack:

- Vite for the frontend build/dev server.
- React for the app UI.
- TypeScript for safer state, data model, and storage boundaries.
- Firebase Authentication for sign-in.
- Cloud Firestore for per-user timeline storage.
- Firebase Hosting for deployment.

Keep JSON import/export as a first-class portability feature.

Use a storage/repository boundary before adding backend storage so the app can support local JSON now and Firestore later.

Do not add a custom Node backend, Next.js server app, Flutter rewrite, or Google Drive primary storage as the first migration step.

## Consequences

Positive:
- The existing browser-first product can migrate incrementally.
- Vite keeps local development fast and the deployed app static until backend services are added.
- React and TypeScript make the growing editor UI and data model easier to test and maintain.
- Firebase provides auth, database, security rules, emulator support, and hosting without running servers.
- Firebase free-tier usage can support an early open-source/free product if reads and writes are controlled.

Negative:
- The project will no longer be dependency-free.
- Firestore introduces NoSQL data modeling and security-rule maintenance.
- Firebase creates some vendor lock-in.
- Careless realtime listeners or autosave behavior can increase Firestore reads/writes and cost.
- The migration must avoid rewriting editor behavior in one large step.

## Follow-up Work

- Add an implementation plan for a behavior-preserving Vite + React + TypeScript migration.
- Add automated browser checks before or during the migration when possible.
- Add Firebase only after local JSON load/edit/save behavior is stable in the new frontend shell.
- Add an ADR later if Google Drive import/export becomes a supported integration.

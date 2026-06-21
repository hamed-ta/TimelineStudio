# Security Policy

Timeline Studio is a browser-based, local-first app. It does not currently run a backend service, but security still matters for saved files, browser APIs, build tooling, and future account-based features.

## Supported Versions

Before the first public release, security fixes target the latest `main` branch. After releases begin, security fixes target the latest GitHub Release unless otherwise documented.

## Reporting A Vulnerability

Please do not report exploitable security details in a public issue.

Preferred reporting path:

1. Use GitHub private vulnerability reporting for this repository when it is enabled.
2. If private vulnerability reporting is not available, open a minimal public issue asking for a private security contact. Do not include exploit details, sensitive data, proof-of-concept payloads, or affected private files in that public issue.

Helpful details to include privately:

- Affected version, commit, or deployment URL.
- Browser, operating system, and reproduction steps.
- Impact and whether user data or saved JSON files can be exposed or modified.
- Any proof of concept, shared privately.

## Scope

In scope:

- Cross-site scripting or unsafe HTML/script handling.
- Unsafe JSON import behavior.
- File System Access API misuse.
- Export behavior that leaks unintended data.
- GitHub Actions or release workflow weaknesses.
- Dependency vulnerabilities with a reachable impact.

Out of scope:

- Vulnerabilities that require direct access to a user's local files without a Timeline Studio issue.
- Social engineering.
- Denial-of-service findings without a practical security impact.
- Reports for unsupported browsers unless the issue also affects supported modern browsers.

## Maintainer Response

Maintainers should acknowledge valid private reports, assess impact, prepare a fix, and publish a release or advisory when appropriate. Public disclosure should wait until users have a reasonable path to update.

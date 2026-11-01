# Handoff

## Release 0.5.0 — 2026-11-01

- User requested a minor-version release, commit and tag push to trigger deployment. Bumped package and lockfile from `0.4.0` to `0.5.0`, moved accumulated Unreleased notes into the dated release section and updated README/versioning guidance.
- Release scope is the approved five-language interface, RTL/alignment follow-ups, creation-only calendar defaults and portable font-aware exports, plus the already committed brand/tooling changes since `v0.4.0`. Gregorian ISO storage and existing saved calendar choices remain compatible.
- Local release verification passed: legacy syntax, 142/142 tests, typecheck, catalog validation, production build with `/TimelineStudio/` paths, package/lockfile version agreement, changelog extraction and whitespace checks. The existing bundle-size advisory remains. Remote `main` matched the checkout before publication, and `v0.5.0` was available.
- Created release commit `96d01daeb0cf6951255839ea25f51ac9765a384d` and annotated tag `v0.5.0`, then pushed `main` and the tag atomically. [Release/deployment workflow 41260637127](https://github.com/hamed-ta/TimelineStudio/actions/runs/41260637127) succeeded through tests, typecheck, catalog/build checks, Pages deployment and release publication. [Branch CI 41260637077](https://github.com/hamed-ta/TimelineStudio/actions/runs/41260637077) also passed.
- [GitHub Release 0.5.0](https://github.com/hamed-ta/TimelineStudio/releases/tag/v0.5.0) contains `timeline-studio-0.5.0.zip` (702,045 bytes). Its published SHA-256 and ZIP integrity passed; all 43 packaged files match the verified local build byte-for-byte. The three entry JavaScript/CSS assets on the live site also match local SHA-256 content.
- Verified [the live site](https://hamed-ta.github.io/TimelineStudio/) in the in-app browser: footer reports `0.5.0`, all five language choices are available, and fresh Persian/Arabic timelines select Persian / Solar Hijri and Islamic / Umm al-Qura respectively with RTL controls. No page overflow or app console errors were observed. Restored an empty English timeline with System appearance; ignored capture: `.impeccable/review/live-0.5.0.jpg`.
- GitHub accepted the direct push using the account's existing rules bypass, reporting locked-branch, PR, verified-signature and prior-deployment rule violations. No repository rules were changed. It also reported existing Dependabot alerts; dependency remediation was outside this release scope. Existing native-picker, fluent-review and physical-device verification limits from the implementation entry below remain unchanged.

## Five-Language Interface — 2026-11-01

- User approved the multilingual proposal for English, Spanish, French, Persian and Arabic. Added `i18next` 26.6.0 and `react-i18next` 17.1.9, five bundled catalogs, typed message keys, saved/browser/English language resolution, Ant locale/direction and a compact language selector. ADR 0010 records the runtime dependency and supersedes only ADR 0003's English-only Persian display clause.
- Localized React controls, assistive labels, legacy status/confirmations, file state, cursor/selection details, dates, ages, durations and color names. Calendar/date display now has explicit locale/calendar/numbering/UTC settings; structural calendar keys, numeric day ticks and Gregorian ISO storage remain stable. Normalization never translates saved document strings; new names become ordinary creation-language data.
- Locale changes refresh presentation without normalizing the timeline, synchronizing forms, remounting the editor or recording history. Browser checks retained unapplied title/notes drafts, item selection, ISO date, color, dirty state and SVG x position across languages; calendar undo/redo remained functional.
- User screenshots identified a selector lifted by the inherited 11 px label margin and a wrong RTL sidebar arrow. Removed the margin, mirrored both sidebar toggle states and moved custom-select chevrons left. The measured language/theme/height centers all equal 148.5 px on desktop. The user clarified language-specific default calendars apply only to new timelines: Persian / Solar Hijri for Persian, Islamic / Umm al-Qura for Arabic, Gregorian for English/Spanish/French. Browser reload/switch checks passed for all five while preserving current calendar choices on language changes.
- Added grapheme-safe text fitting and browser text measurement. SVG exports embed the existing Inter Latin/extended-Latin and Vazirmatn Arabic font subsets; PNG/PDF rasterize the same self-contained SVG. Removed add-line controls, hit regions, cursor guides and selection/drag grips from exports. Downloaded SVG/PNG/PDF, checked font embedding/control removal structurally, inspected standalone SVG in the in-app browser and PNG/PDF renders (Poppler); Persian/Arabic/Latin shaping is readable and the reported black export rectangle is absent.
- RED evidence: missing locale module, split family emoji, Persian initially receiving Gregorian, plus user-supplied alignment/RTL screenshots. GREEN verification passed: legacy syntax, **142/142 tests**, typecheck, catalog validation and production build with `/TimelineStudio/` base path. `npm run i18n:check` checks all five catalogs, plural forms, interpolation and source/JSX coverage and runs during builds. The existing >500 kB bundle advisory remains.
- In-app browser checks covered all five language switches and new-document defaults, RTL, light/dark, 1440 px desktop, 390 px mobile and 660 px. Final viewport evidence is ignored `.impeccable/review/locale-*.jpg`; top/canvas mobile captures replace malformed RTL full-page capture output. No page-width overflow or app console errors were found. A single mechanical scan returned only incumbent advisory styling flags. Export evidence is `.impeccable/review/export-final*` and `/tmp/timeline-final-pdf.png`.
- `DESIGN.md` documents the finished language control and RTL behavior; existing design tokens and ignored sidecar were preserved. Independent finish review returned `ship` for the scoped extension after inspecting all eight recaptures, both RTL toggle states, the user screenshots and SVG/PNG/PDF evidence. It scored export cleanup, select chevrons, selector alignment, RTL toggle direction and creation-only calendar defaults resolved.
- Limits: native JSON save dialog canceled during automation, so native save/load picker completion, real file-handle retention and a GUI JSON roundtrip remain unverified; existing JSON/model/history tests pass. Fluent-speaker translation review, physical devices, rendered forced-colors/reduced-motion and other browser engines remain unverified. Standalone SVG rendered correctly; the in-app viewer's injected inspection script logged an `animation` error on the SVG-only document (the export contains no app scripts).
- At the implementation checkpoint, version remained `0.4.0` with changes under Unreleased. The user subsequently requested publication as `0.5.0`; the release evidence above supersedes that checkpoint. The next existing architecture task remains reducer-owned undo/redo.
- Final production preview was restored to an empty, clean Persian timeline using Persian / Solar Hijri only, System appearance and an expanded inspector. Temporary viewport overrides were reset. Final capture: `.impeccable/review/locale-final-preview.jpg`.

## Multilingual Research — 2026-11-01

- User requested project inspection and web research on multilingual support, then specified five popular languages including Persian and Arabic. Proposed language set: English, Spanish, French, Persian and Arabic.
- Added [the research proposal](research/2026-11-01-multilingual-support.md) with primary-source comparisons of i18next/react-i18next, Lingui and FormatJS, a current-source audit and a phased delivery/acceptance plan. Recommendation is i18next/react-i18next shared across React and imperative rendering, repo-owned catalogs, existing Ant `ConfigProvider` locale/direction and native `Intl` presentation.
- Key implementation constraints: isolate stable calendar parts and numeric day selection from localized digits; keep language outside JSON/history; preserve unsaved form drafts instead of calling the full form-sync render path; avoid translating stored document strings or parsing localized line names with the English regex. Localized Persian calendar display requires revisiting ADR 0003's English letters/numbers clause, preserving Gregorian ISO ownership. PDF currently wraps a JPEG, so export font/shaping verification belongs upstream of PDF assembly.
- Verified all five Ant ESM locale files in installed Ant Design 6.4.4 and ran local UTC/calendar/plural/digit parsing probes. Documentation whitespace and local-link checks passed, including the new research file. Source audit found no existing localization dependency. Research did not install packages, modify runtime code, or verify browser/export behavior; app tests/build were not rerun for this documentation-only work.
- Implementation remains proposed; existing product scenarios and accepted ADRs are unchanged. The current reducer-history migration priority remains in place.

## Live Brand Deployment And Local Tooling — 2026-10-25

- User requested a build/deployment of the approved logo and asked to ignore the project's `.impeccable/` directory.
- Manually dispatched `release.yml` on `main` with `tag=v0.4.0`, using its documented same-version refresh path. [Workflow 40158160023](https://github.com/hamed-ta/TimelineStudio/actions/runs/40158160023) successfully built and deployed source commit `b29f16bf10579ffb71a01130adc483032abb238c`, ran syntax/tests/typecheck/build, and refreshed the release ZIP. No version bump or new tag was created.
- Verified [the live website](https://hamed-ta.github.io/TimelineStudio/) in the in-app browser: both header/footer marks are present, the resolved dark sage/amber fills match the approved colours, version remains `0.4.0`, icon/social metadata use the correct Pages paths, and there were no console errors or page-width overflow. Screenshot: ignored `.impeccable/review/live-sage-amber.png`.
- Eight live assets returned HTTP 200 and matched local SHA-256 content exactly: SVG/ICO favicons, Apple icon, manifest, normal 192/512 icons, maskable icon, and social card. External social-crawler cache refresh and real home-screen installation remain untested.
- Replaced the partial Impeccable ignore rules with `.impeccable/` and removed four existing metadata/config/surface files from the git index using `git rm --cached`. The local files are preserved; `DESIGN.md`, product docs, production artwork, and usage guidance remain tracked.
- Verified the whole directory is ignored, no `.impeccable` files remain tracked, local metadata files still exist, and the change passes whitespace checks. This cleanup is documentation/tooling only and does not change the deployed app.

## Sage + Amber Brand Integration — 2026-10-25

- User approved palette 03 **Sage + amber** for A, **Gentle turn**, requested integration wherever appropriate, explicitly invoked Impeccable and `DESIGN.md`, and requested commit/push. The two historical concept checkpoints below are resolved.
- Replaced the gradient-square header mark with shared `BrandMark` SVG geometry, added it beside the footer name, and made the live brand name solid. Theme-specific semantic brand tokens preserve the existing editor/action/data colours; forced colours use CanvasText.
- Added outlined light/dark lockups and symbols, black/white masters, adaptive SVG favicon, 16/32/48 ICO, Apple/192/512/maskable icons, a base-relative manifest, 1200×630 social card, README artwork, and `docs/brand/usage.md`. Optional `scripts/generate-brand-assets.py` uses local `rsvg-convert`; there are no new runtime dependencies. All shipping PNGs embed vector-source provenance, and the Impeccable raster scan found no missing provenance.
- BDD/RED: added the brand identity acceptance scenario and browser-smoke checks. Baseline browser at 660×988 showed a header `SPAN` gradient tile, no footer symbol, and no icon metadata. GREEN replaced these surfaces without changing timeline controllers, saved JSON, dates, or defaults.
- Automated verification passed: legacy JS syntax, 135/135 tests, production build/typecheck with `VITE_BASE_PATH=/TimelineStudio/`, XML/master geometry, PNG dimensions/opacity/provenance, three-size ICO, manifest paths, built icon links, and `git diff --check`. The existing >500 kB chunk advisory remains.
- Browser verification used the production preview at `http://127.0.0.1:8766/TimelineStudio/` in the Codex in-app browser. Inspected full-page captures at desktop 1440×1000, mobile 390×844, and actual preview 660×988, all light/dark. No page-width overflow, incorrect brand fills, or console errors were found. Files: ignored `.impeccable/review/brand-{desktop,mobile,user-660}-{light,dark}.png`.
- Functional smoke passed: a temporary period retained its visible title/ISO dates/colour/dirty state through System/Light/Dark changes; undo returned to empty/clean, redo restored it, and a final undo restored empty data. System preference was restored. Forced-colour behavior was source-reviewed, not browser-emulated; real home-screen installation and external social crawlers were not tested.
- Impeccable context and incumbent surface brief were read; a single detector pass reported only existing advisory patterns/functional palette values. Independent finish review found the six captures valid and the brand integration faithful. Its sole provenance finding was cleared on the verdict pass after loading PNG chunks: all eight PNGs already contained their vector-origin metadata. Final disposition: `ship` for the scoped identity work. The documenter reconciled `DESIGN.md` and `.impeccable/design.json` with the code, adding brand metadata/preview and removing obsolete gradient rules. Version stays `0.4.0`; deployment is release-triggered, so this ordinary push does not publish the live site.

## A Logo Colour Studies — 2026-10-25

- User accepted A, **Gentle turn**, and requested colour. The direction-selection checkpoint below is resolved; palette choice is still open.
- Added **Blue hour** (recommended muted blue/lavender), **Violet moment** (neutral with a violet dot), and **Sage + amber** (warmer alternative), each with light/dark symbol and outlined lockup SVGs. Review image and palette/check notes: `docs/brand/logo-concepts/2026-10-25/a-colour/`.
- Preserved A's exact v2 geometry. Rendered and inspected the comparison across daylight/midnight and at 32/16 px in daylight. Twelve artwork files passed XML, geometry-preservation, and structural checks without FAIL/WARN findings. All body/dot colours exceed 4.6:1 against their intended background; `git diff --check` passed.
- These are colour-only design artifacts. No app behavior or dependency changed; no BDD update, app test/build, integration, release, commit, or push was performed. Full logo/icon kit and usage guide remain pending after the palette is settled.

## Logo Concepts — 2026-10-25

- Interpreted the request as a Timeline Studio logo brief: calm, safe, personal, and suitable for different kinds of personal timelines. Treated the quoted Kiln/asset examples as illustrative prompts.
- Read `DESIGN.md` and reviewed the existing CSS gradient-square identity. Used the logo-design skill to develop three directions: A **Gentle turn** (recommended rounded t/moment), B **Open chapters** (abstract pages), and C **At your pace** (wordmark-led capsule/moment).
- Review image, outlined v2 SVG symbols/lockups, first iterations, brief, rationale, and test notes are in `docs/brand/logo-concepts/2026-10-25/`. Font artwork derives from the project's OFL-licensed Space Grotesk; no runtime dependency was added.
- Two design/test rounds completed. All six v2 SVG drawings passed structural audit without FAIL/WARN findings. Inspected overview and separate scale/background/reference renders, including 16 px symbols and 160 px lockups. Ignored evidence: `.impeccable/review/logo-concepts-2026-10-25-qa.png`.
- Final XML/asset and `git diff --check` checks passed. Headless Chrome could not capture the generated HTML sheet; visual evidence is from inspected `rsvg-convert` images. App/browser/device tests were not rerun for these design-only artifacts. No product behavior changed, so `docs/product.md` and the BDD scenarios remain unchanged.
- User selection is pending at the logo-design skill's required concept checkpoint. Full colour/reversed/icon kit, usage guide, app integration, and trademark clearance are not complete. The existing app remains at `0.4.0`; no release, commit, or push was requested.

## Release 0.4.0 — 2026-10-25

- User approved the visual update and requested a minor-version release, push, and live GitHub Pages deployment.
- Bumped package and lockfile versions from `0.3.0` to `0.4.0`; moved all pending changelog entries into the dated `0.4.0` release section and updated versioning notes.
- The release includes the approved AuthKit-inspired appearance and changes accumulated since `0.3.0`, including selectable secondary calendars.
- Release verification passed: JavaScript syntax, 135/135 tests, production build/typecheck with `/TimelineStudio/` asset paths, matching package/lockfile versions, release-note extraction, and `git diff --check`.
- Published `v0.4.0` from release commit `46e4e07` and pushed `main` and the tag together. [Release/deployment workflow 40150712520](https://github.com/hamed-ta/TimelineStudio/actions/runs/40150712520) succeeded, including tests, typecheck, build, Pages deployment, and GitHub Release publication; branch CI also passed.
- [GitHub Release 0.4.0](https://github.com/hamed-ta/TimelineStudio/releases/tag/v0.4.0) includes `timeline-studio-0.4.0.zip` (608,087 bytes).
- Live verification passed at [the GitHub Pages site](https://hamed-ta.github.io/TimelineStudio/): rendered footer `Version 0.4.0`, midnight canvas `#05060f`, pill control radius `999px`, fonts loaded, and no browser console errors. The live app opened with empty data. Screenshot: ignored `.impeccable/review/live-0.4.0.jpg`.

## AuthKit Visual Direction — 2026-10-25

- The engineering-skill setup was committed and pushed to `origin/main` as `f91b6d9` before starting this work.
- User confirmed existing product facts remain in place, selected code-first for future showcase work, and requested code styling after `DESIGN.md` is written.
- Added Impeccable schema/platform metadata and a visual acceptance scenario without replacing existing product requirements.
- Recorded the supplied midnight/glass direction in `DESIGN.md` before implementation, as requested.
- RED browser check: the original dark editor computed `--bg: #141414`, `--accent: #1677ff`, and 7px Save-button corners; the requested midnight palette and pill/glass styling were absent.
- GREEN: updated `styles.css`, Ant Design theme tokens, font imports, and the sidebar heading. Fixed desktop command clipping and narrow metadata overlap; preserved all legacy IDs, controller/model code, and saved data behavior.
- Narrow dependencies: `@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`, and `@fontsource-variable/vazirmatn`. Fonts are served locally; their license notices are included under `public/licenses/fonts/`.
- Verification: legacy JavaScript syntax passed, `npm test` passed 135/135, and production build/typecheck passed with the existing chunk-size advisory.
- Browser evidence: Codex in-app browser at 1440×1000 and 390×844 in dark/light, plus the user's 660×954 preview in dark. Final full-page captures are in ignored `.impeccable/review/`; document and inspector scroll positions were reset and checked before each final capture.
- Browser smoke passed for temporary bilingual period editing, Gregorian/Persian display, theme retention of visible title/ISO dates/color/calendar/unsaved state, undo/redo, sidebar collapse, accessible command wrapping, zoom-popover placement, and visible keyboard focus. No synthetic review data was added to app defaults or repository timeline files.
- The mechanical detector ran once. The thick warning edge was removed; reference-pinned heading gradient and blueprint grid were retained. Remaining palette/geometry advisories were supplied to the reviewer for context.
- Independent Impeccable finish review returned `ship` after all six required final captures were reopened. The documenter reconciled `DESIGN.md` with implemented tokens and produced `.impeccable/design.json` with nine representative components, depth/motion/breakpoints, and matching narrative.
- Documentation/configuration checks and `git diff --check` passed. The production build includes all three font license notices. The preview was restored to an empty timeline with System appearance and an expanded inspector after undoing the four temporary review edits.
- Rendered reduced-motion/forced-colors emulation and physical-device checks remain explicitly deferred. Their source rules are present; these are not recorded as rendered passes.
- The visual work is included in the `0.4.0` release preparation above. Next implementation task remains reducer-owned undo/redo history.

## Engineering Skill Setup — 2026-10-25

- Added `AGENTS.md` consumer pointers and `docs/agents/` configuration for GitHub Issues in `hamed-ta/TimelineStudio`, the five default triage labels, and a single-context domain-doc layout.
- Domain terms will be maintained in root `CONTEXT.md` when resolved by `domain-modeling`; existing architectural decisions remain in `docs/adr/`.
- Updated the plan and changelog for this documentation-only setup.
- Verification: `git diff --check` and a focused documentation audit passed. The audit checked the single Agent skills block, preserved existing instructions, three resolving configuration pointers, tracker/origin agreement, exact label mappings, single-context rules, and file whitespace. The calendar application checks below are retained evidence from the earlier implementation session and were not rerun for this setup.

## Current State

Selectable secondary calendars are implemented on `main`. Gregorian remains the stored main calendar; users can display Gregorian only, Gregorian plus one secondary, or one secondary calendar only.

Supported secondary calendars are Persian / Solar Hijri, Islamic / Umm al-Qura, Hebrew, Buddhist, Japanese, and Indian / Saka. Display text uses English wording and Latin digits.

## Implementation

- `src/timeline/calendars.ts` owns selection normalization, the one-secondary invariant, and control state.
- `src/timeline/calendarRegistry.ts` owns `Intl` metadata, formatting, date parts, runtime support, and non-mutating effective fallback.
- `src/timeline/calendarBoundaries.ts` derives cached month/year transitions by scanning Gregorian ISO days.
- The sidebar exposes Gregorian plus one secondary selector; unsupported options are disabled and unsupported saved selections render Gregorian with a warning without changing history or dirty state.
- The SVG renderer keeps Gregorian boundaries in dual mode and uses the selected secondary calendar for boundaries, labels, ticks, grids, day values, and bands in secondary-only mode.

## Verification

- `node --check src/features/timeline-editor/legacyTimelineEditor.js` passed.
- `npm test` passed 135/135 tests.
- `npm run typecheck` passed.
- `npm run build` passed with the existing Vite chunk-size advisory.
- `git diff --check` passed.
- 2026-08-02 browser behavior was user-confirmed working correctly; the browser family was not recorded.
- Independent task reviews found no spec-compliance or code-quality issues in the selection, registry, boundary, control, or renderer slices.

## Known Issues

- Vite reports the existing production chunk-size advisory.
- Browser behavior has manual smoke coverage but no automated browser harness.

## Next Step

Add reducer-level RED tests for undo, redo, selection restoration, saved-state dirty tracking, and redo invalidation before moving history ownership out of the legacy controller.

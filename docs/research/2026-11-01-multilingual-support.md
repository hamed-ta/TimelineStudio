# Multilingual support research

Date: 2026-11-01. Sources accessed on this date.
Status: research recommendation accepted and implemented on 2026-11-01; ADR 0010 and the current handoff describe the final behavior and verification. The comparison below is the original decision background.

## Recommendation

Use **i18next + react-i18next**, with translation catalogs committed alongside the app. This is a project-specific recommendation: Timeline Studio needs one translation service usable from both React components and the remaining imperative JavaScript/SVG code. React gets `useTranslation`; other modules can call the same initialized instance's `t`. Language changes must also refresh imperative output; hooks do not update arbitrary DOM created elsewhere. The core API supplies initialization, language changes, resource loading and language-change events. [React hook](https://react.i18next.com/latest/usetranslation-hook), [i18next API](https://www.i18next.com/overview/api).

Proposed initial five languages are English (`en`), Spanish (`es`), French (`fr`), Persian (`fa`), and Arabic (`ar`). The user requested five popular languages including Persian and Arabic; the other three are a proposed product selection, not a ranking established by this research.

## Library comparison

| Approach | Officially documented capabilities | Fit for this project |
| --- | --- | --- |
| i18next + react-i18next | React hooks and standalone API; fallback languages; plural messages and interpolation; typed keys; official extraction/type-generation CLI. | Recommended for gradual extraction of existing English strings, shared across React and legacy code, without adding a translation compilation step to the runtime build. |
| Lingui | React and standalone core; extracted catalogs; ICU messages; compilation and dynamic loading; Vite plugin can transform macros natively. | Strong alternative when compile-time messages and translator-oriented catalog tooling are preferred. It supports the mixed React/JS architecture too; it is not disqualified by the legacy code. |
| FormatJS / react-intl | ICU message syntax, extraction CLI, React API and `createIntl` for non-React usage. | Also viable; prefer it if standardized ICU message syntax and integrated `Intl` formatting outweigh the convenience of i18next's resource/fallback configuration. |

Sources: [i18next getting started](https://react.i18next.com/getting-started), [fallback](https://www.i18next.com/principles/fallback), [plurals](https://www.i18next.com/translation-function/plurals), [TypeScript](https://www.i18next.com/overview/typescript), [official CLI](https://github.com/i18next/i18next-cli), [Lingui introduction](https://lingui.dev/introduction), [Lingui core](https://lingui.dev/ref/core), [Lingui extraction](https://lingui.dev/guides/message-extraction), [Lingui Vite plugin](https://lingui.dev/ref/vite-plugin), [FormatJS API](https://formatjs.github.io/docs/react-intl/api/), [FormatJS extraction](https://formatjs.github.io/docs/getting-started/message-extraction/).

No claim here that the recommended option has the smallest measured bundle. Locally installed versions are React 19.2.7, Ant Design 6.4.4, TypeScript 5.9.3 and Vite 8.0.16. Select compatible localization package versions during implementation and verify Node and CI support before committing a lockfile. CLI documentation now recommends `i18next-cli`; review extraction/type generation against the selected version before adopting its commands.

## Project audit

The checkout was clean at `324f963` before this research. Findings below come from current source, not assumptions about a fully migrated React app.

| Area | Current source | Implementation consequence |
| --- | --- | --- |
| Startup | `src/main.tsx` renders React and dynamically imports the legacy controller. | Initialize translations before either surface uses them; keep editor initialization tied to mounted DOM. |
| Shell and controls | `TimelineEditor.tsx`, `components/*.tsx`, and `AppThemeProvider.tsx` contain English labels, accessible names, theme names and placeholders. The existing `ConfigProvider` has only theme configuration. | Add locale state above the theme provider and feed locale/direction into that existing provider. Translate all visible and assistive text. |
| Dynamic output | `legacyTimelineEditor.js` and `timelineInfo.ts` generate status, confirmations, file state, selection details, units and cursor readouts. | Both React and the imperative renderer must use the same instance. A hook-only conversion leaves substantial English output behind. |
| Calendar structure | `formatters.ts` fixes Gregorian formatting to English; `calendarRegistry.ts` fixes secondary formats to English/Latin digits. `drawGrid()` passes `Number(dayLabel)` into day-tick selection. | Separate numeric calendar values and stable boundary keys from display strings before changing locale or digits. |
| Human durations | `dateSpans.ts` and `timelineInfo.ts` concatenate English years/months/days, age and relative-time fragments. | Keep `getDateSpanParts()` numeric; localize whole messages and plural forms in presentation code. Preserve the current multi-unit precision. |
| Document defaults | `model.ts` stores `New Timeline`, default item titles and `Line N` as actual document strings. `nextLaneLabel()` in the legacy controller parses an English-only naming pattern. | Translate new defaults only at deliberate creation, preserve imported/existing strings, and decouple line numbering from English label parsing. Do not make normalization depend on the current UI locale. |
| Text layout/export | `svgText.ts` estimates widths by character count and truncates by string slicing. Notes have measured widths and some bidi support. `svgExport.ts` clones SVG and injects CSS; PNG/PDF rasterize it. | Audit every item type, measure translated labels, truncate on grapheme boundaries, and carry font/direction rules into standalone exports. |

The language-change path needs particular care: `renderAll()` normalizes the timeline, synchronizes both forms and recreates lane controls. Calling it merely to change language can overwrite in-progress field edits. Add a presentation refresh that preserves drafts, focus, selection, file handles, scroll/zoom and history. Do not remount the editor with a language key.

## Locale configuration

Maintain one allowlisted locale registry with the message catalog, formatting locale, direction and Ant Design locale. Suggested mapping:

| UI language | Direction | Ant Design locale |
| --- | --- | --- |
| `en` | `ltr` | `en_US` |
| `es` | `ltr` | `es_ES` |
| `fr` | `ltr` | `fr_FR` |
| `fa` | `rtl` | `fa_IR` |
| `ar` | `rtl` | `ar_EG` |

These Ant locale packages are documented. Feed `locale` and `direction` to the existing `ConfigProvider`; translate Timeline Studio's own text through the catalogs. Ant's Vite production FAQ recommends imports from `antd/es/locale/...`; check the built production output, not just development. Static Ant message/modal methods have context limitations, so prefer methods obtained within the provider. [Ant internationalization](https://ant.design/docs/react/i18n/), [ConfigProvider and Vite FAQ](https://ant.design/components/config-provider/).

Proposed precedence: explicit saved choice, then supported `navigator.languages`, then English. Normalize regional variants to the supported language when there is no separate regional catalog. Persist this as app preference, outside timeline history and saved timeline JSON. A detector plugin is optional: if used, configure its order and caches explicitly rather than accepting cookie/URL/path defaults. Set the document's `lang` and `dir` with the resolved locale. [Detector configuration](https://github.com/i18next/i18next-browser-languageDetector), [HTML direction](https://www.w3.org/International/questions/qa-html-dir.html).

Start with repo-owned JSON catalogs and English fallback. For this small editor, bundle the five catalogs initially and use a simple allowlisted preference resolver; a backend loader and detector package are unnecessary initially. Split by explicit dynamic imports only if measured size warrants it; i18next supports resource loaders. This recommendation needs no translation server, account, paid translation service, Firebase change, or routing migration. Start with one catalog per language under `src/i18n/locales/`, grouped by stable keys such as `toolbar`, `editor`, `status`, and `validation`; avoid a namespace per component. [Resource loading](https://www.i18next.com/how-to/add-or-load-translations).

Use whole-message interpolation and locale plural rules, especially for Arabic, rather than assembling English fragments or adding `s`. Use stable keys and translator context. Keep runtime text insertion safe: React text children, DOM `textContent`, and escaped SVG serialization; do not treat translated/user text as trusted HTML. Review escaping at the legacy DOM boundary rather than copying React-only interpolation settings blindly. [Plurals](https://www.i18next.com/translation-function/plurals), [interpolation](https://www.i18next.com/translation-function/interpolation).

## Dates, identity and data safety

Locale, selected display calendar, numbering system and time zone are separate concerns in `Intl.DateTimeFormat`. Keep Gregorian ISO dates and UTC date-only calculations; supply the selected calendar explicitly so switching to Persian or Arabic cannot silently change the calendar. Use `Intl.NumberFormat` for displayed numeric values. Choose an explicit numbering policy rather than assuming bare `ar` always gives Arabic-script digits; regional/browser defaults can differ. [ECMA-402 DateTimeFormat](https://tc39.es/ecma402/#sec-intl-datetimeformat-constructor).

The current calendar implementation combines display strings with structural values: `calendarRegistry.ts` generates `yearKey`/`monthKey` used by `calendarBoundaries.ts`, and `formatters.ts` converts returned calendar parts with `Number(...)`. Replacing the formatter locale globally would expose calculations to localized digits and labels. First separate stable calendar parts/keys using Latin digits from localized presentation; cache display formatters by locale, calendar and numbering policy. Do not parse formatted text back into the model. This is a codebase-specific finding, not a library limitation.

ADR 0003 currently specifies Iranian labels in English letters and numbers. Localized Persian labels/digits require explicitly revisiting that clause in a future ADR while retaining Gregorian data ownership. Language switching should not translate existing user titles, notes, imported content, stored enum IDs, filenames or document data. Newly created default text and generated captions need an explicit policy; never retroactively rewrite existing content.

## RTL, fonts and exports

RTL includes both app layout and user content. Use logical CSS properties, isolate mixed-direction names/dates/filenames, and use `dir="auto"` or `bdi` for HTML content whose direction is unknown. Date input and machine-readable ISO text need explicit LTR treatment where appropriate. [W3C inline bidi guidance](https://www.w3.org/International/articles/inline-bidi-markup/index.en).

SVG text needs separate attention: `direction` affects `text-anchor`, so inheriting RTL over every SVG node can move labels. Keep the timeline's chronological coordinate system unchanged in the first implementation, and make canvas/text direction explicit. This is a proposed product choice, not a general rule that RTL timelines must run left to right. Test Arabic/Persian shaping, punctuation and Latin text together. [SVG text layout and direction](https://www.w3.org/TR/SVG2/text.html#DirectionProperty).

The repo already includes Vazirmatn, but visual coverage and all font weights still need verification with real Persian and Arabic strings. Font readiness must precede text measurement and raster export. `document.fonts.ready` concerns the document's font loading/layout; it does not prove a standalone SVG has embedded fonts. [CSS Font Loading, work in progress](https://drafts.csswg.org/css-font-loading/#dom-fontfaceset-ready).

Current `pdf.ts` embeds a JPEG rather than PDF text. Its localization risk is the upstream SVG/font/rasterization result, not direct PDF Unicode font encoding. Serialized SVG must carry the required direction/styles and have a deliberate portable-font strategy; test downloaded SVG independently of the open app, plus PNG and PDF. A vector/searchable PDF rewrite is a separate feature.

## Implementation acceptance checklist

- Add an ADR for the runtime dependency and display policy; update product scenarios before behavior changes.
- Test all five locales, English fallback, saved preference, unsupported/regional languages, missing keys and locale-loading failure.
- Verify Arabic plural categories with actual counts, translated accessibility labels/tooltips/errors, and long-string expansion.
- Verify RTL popovers, context menus, forms, keyboard behavior, narrow layouts and mixed-script user content.
- Prove language changes preserve JSON, date positions, selected calendars, dirty state, undo history and all user-authored text.
- Prove stable calendar boundaries and numeric parts across locale changes, UTC dates near calendar/year transitions, and existing saves.
- Check SVG, PNG and PDF output in a clean viewer; capture Persian/Arabic text after fonts load.
- Run extraction/key parity checks, existing tests, typecheck and production build; record actual browser/export evidence in handoff.

## Suggested delivery order

1. **Foundation and English/Persian pilot:** record the runtime dependency and the narrow revision to ADR 0003, add BDD scenarios and RED tests, then introduce `src/i18n/` initialization, locale registry, typed catalogs and a small language selector using native language names. Localize one full workflow across React, legacy status, calendar labels and export to prove the integration before extracting every string. Preserve the existing DOM IDs and ongoing reducer migration.
2. **Complete all five languages:** cover remaining shell, custom controls, messages, durations and SVG captions; configure Ant locales and RTL; separate date structure from presentation and handle document defaults at creation. Check all required plural forms and interpolation variables, not identical raw key sets across languages. Run catalog extraction/type checks and obtain fluent review of Persian/Arabic grammar and terminology, with review of Spanish/French translations too.
3. **Acceptance and release:** verify each locale on desktop/narrow screens in light/dark themes, runtime switching with unsaved drafts, current JSON compatibility, chronological geometry and mixed-script content. Inspect SVG/PNG/PDF outside the app and run the existing test/typecheck/build checks with the Pages base path. Publish only after these results are recorded.

The finished scope is all five languages; the pilot is an integration checkpoint. This can ship incrementally within the current architecture without completing the entire reducer/React canvas migration first. No multilingual SEO routes are needed for the editor; localized crawler metadata can be scoped separately if public localized pages are later requested.

## Verification performed for this research

- Read source, accepted architecture/date decisions, current plan and handoff.
- Verified the five Ant ESM locale files exist in the installed Ant Design package.
- Ran a deterministic Node `Intl` probe for all five languages with explicit Gregorian/Persian calendars and UTC. It confirmed locale-dependent labels and Arabic plural categories `zero/one/two/few/many/other`; `Number('۲۹')` and `Number('٢٩')` both return `NaN`. These are local runtime checks, not cross-browser certification.
- Documentation whitespace and local-link checks passed, including the new research file.
- Research did not install dependencies, benchmark bundles, translate catalogs, or certify browser/export behavior. App tests and builds were not rerun for this documentation-only change.

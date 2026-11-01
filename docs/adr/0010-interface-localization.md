# 0010 Interface Localization

Status: Accepted

Adopt i18next and react-i18next with five bundled, repository-owned catalogs (English, Spanish, French, Persian, Arabic), one shared runtime instance and typed message keys. This supports the current React shell and imperative SVG/controller migration together without a translation server or build-time message compiler. Lingui and FormatJS are viable alternatives; runtime catalogs and a shared translation API fit this incremental migration.

Language is a browser preference, independent from the timeline's saved display calendars, Gregorian ISO dates, calculations and history. Resolve an explicit saved language first, supported browser languages second and English last. Persian and Arabic use RTL controls; timeline geometry stays chronological left-to-right, with text direction determined separately. Localize defaults only when creating data; never reinterpret existing saved strings as message keys.

This supersedes only ADR 0003's requirement that Iranian display labels use English letters and numbers. Calendar structure and numeric parsing retain stable Latin-digit parts; human-readable date labels follow the chosen language with explicit calendar, numbering and UTC settings. Gregorian ISO storage remains unchanged. Exports embed their fonts and carry text direction independently of the app document.

New timelines use the creation language’s initial display calendar: Persian / Solar Hijri for Persian, Islamic / Umm al-Qura for Arabic, Gregorian for English, Spanish and French. This is a creation-time default only; switching language and loading existing documents preserve their calendar selections.

import assert from 'node:assert/strict';
import test from 'node:test';
import { i18n, setLanguage, t, resolveLanguage, localeConfig, resources } from './index.ts';
import { formatDateForCalendars, iranianDateParts, calendarDayLabel } from '../timeline/formatters.ts';
import { calendarBoundaryDates } from '../timeline/calendarBoundaries.ts';
import { formatDetailedDateSpan } from '../timeline/dateSpans.ts';
import { createEmptyTimeline, normalizeTimeline } from '../timeline/model.ts';

test('language resolution honors saved preference and supported regional variants', () => {
  assert.equal(resolveLanguage('fa-IR', ['fr-FR']), 'fa');
  assert.equal(resolveLanguage('xx', ['de-DE', 'ar-EG']), 'ar');
  assert.equal(resolveLanguage(null, ['es-MX']), 'es');
  assert.equal(resolveLanguage(null, ['de-DE']), 'en');
  assert.equal(localeConfig.fa.direction, 'rtl');
  assert.equal(localeConfig.ar.direction, 'rtl');
});

test('all five catalogs contain complete messages and matching interpolation variables', () => {
  assert.deepEqual(Object.keys(resources).sort(), ['ar', 'en', 'es', 'fa', 'fr']);
  for (const [language, { translation }] of Object.entries(resources)) {
    for (const [key, value] of Object.entries(resources.en.translation)) {
      if (key.endsWith('_one') || key.endsWith('_other')) continue;
      assert.ok(translation[key]?.trim(), `${language}:${key}`);
      const variables = message => [...message.matchAll(/{{(\w+)}}/g)].map(match => match[1]).sort();
      assert.deepEqual(variables(translation[key]), variables(value), `${language}:${key}`);
    }
    for (const unit of ['years', 'months', 'days', 'items']) {
      for (const category of new Intl.PluralRules(language).resolvedOptions().pluralCategories) {
        assert.ok(translation[`${unit}_${category}`]?.trim(), `${language}:${unit}_${category}`);
      }
    }
  }
});

test('localized presentation preserves numeric calendar structure and document data', async () => {
  const doc = createEmptyTimeline();
  const before = JSON.stringify(normalizeTimeline(doc));
  const boundaries = calendarBoundaryDates('iranian', '2026-03-01', '2026-05-01', 'month');
  try {
    await setLanguage('fa');
    assert.match(formatDateForCalendars('2026-03-21', ['iranian']), /فروردین/);
    assert.match(calendarDayLabel('2026-03-21', 'iranian'), /۱/);
    assert.deepEqual(iranianDateParts('2026-03-21'), { year: 1405, month: 1, day: 1 });
    assert.deepEqual(calendarBoundaryDates('iranian', '2026-03-01', '2026-05-01', 'month'), boundaries);
    assert.equal(JSON.stringify(normalizeTimeline(doc)), before);
    await setLanguage('ar');
    assert.notEqual(t('items', { count: 2, value: '٢' }), t('items', { count: 3, value: '٣' }));
    assert.doesNotMatch(formatDetailedDateSpan('2026-01-01', '2027-02-02'), /year|month|day/);
    assert.equal(i18n.resolvedLanguage, 'ar');
  } finally { await setLanguage('en'); }
});

test('creation defaults use their creation language and normalization never retranslates them', async () => {
  const { localizedEmptyTimeline, newItemTitle, nextLineName } = await import('./presentation.ts');
  try {
    await setLanguage('fa');
    const timeline = localizedEmptyTimeline();
    assert.equal(timeline.settings.title, 'خط زمان جدید');
    assert.equal(newItemTitle('event'), 'رویداد جدید');
    const next = nextLineName(timeline.settings.laneLabels);
    assert.equal(next, 'خط ۷');
    assert.equal(nextLineName([...timeline.settings.laneLabels, next]), 'خط ۸');
    const stored = JSON.stringify(normalizeTimeline(timeline));
    for (const language of ['en', 'es', 'fr', 'ar']) {
      await setLanguage(language);
      assert.equal(JSON.stringify(normalizeTimeline(timeline)), stored);
    }
    await setLanguage('fr');
    assert.equal(localizedEmptyTimeline().settings.title, 'Nouvelle chronologie');
  } finally { await setLanguage('en'); }
});

test('calendar tick values stay numeric for every supported language', async () => {
  const { calendarDayValue } = await import('../timeline/formatters.ts');
  const { formatCalendarParts } = await import('../timeline/calendarRegistry.ts');
  const key = formatCalendarParts('2026-03-21', 'iranian').monthKey;
  try {
    for (const language of Object.keys(resources)) {
      await setLanguage(language);
      assert.equal(calendarDayValue('2026-03-21', 'iranian'), 1);
      assert.equal(formatCalendarParts('2026-03-21', 'iranian').monthKey, key);
      assert.equal(iranianDateParts('2026-03-21').year, 1405);
    }
  } finally { await setLanguage('en'); }
});

test('only new timelines receive the language default calendar', async () => {
  const { localizedEmptyTimeline } = await import('./presentation.ts');
  const existing = createEmptyTimeline();
  existing.settings.displayCalendars = ['gregorian', 'hebrew'];
  const saved = JSON.stringify(existing);
  try {
    for (const [language, calendar] of [['en', 'gregorian'], ['es', 'gregorian'], ['fr', 'gregorian'], ['fa', 'iranian'], ['ar', 'islamic-umalqura']]) {
      await setLanguage(language);
      assert.deepEqual(localizedEmptyTimeline().settings.displayCalendars, [calendar]);
      assert.deepEqual(normalizeTimeline(existing).settings.displayCalendars, ['gregorian', 'hebrew']);
      assert.equal(JSON.stringify(existing), saved);
    }
  } finally { await setLanguage('en'); }
});

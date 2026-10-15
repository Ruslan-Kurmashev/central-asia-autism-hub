import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Regression gate: the core team is not interchangeable with the
// independent experts directory, and unconfirmed contributors stay private.
const members = await readFile('src/data/team-profiles.ts', 'utf8');
const component = await readFile('src/components/TeamDirectory.astro', 'utf8');
const css = await readFile('src/styles/team-directory.css', 'utf8');
const router = await readFile('src/pages/kz/[lang]/about/[page].astro', 'utf8');

assert.ok(members.includes('confirmed: true') && members.includes('publicProfileApproved: true'), 'Missing confirmed founder profile');
assert.ok(members.includes('Руслан Курмашев') && members.includes('Ruslan Kurmashev'), 'Founder name missing in profile');
assert.ok(component.includes('member.confirmed && member.publicProfileApproved'), 'Unconfirmed profiles must not render');
assert.ok(component.includes('member.photo ?') && component.includes('team-directory__initials'), 'Missing accessible monogram/photo fallback');
assert.ok(component.includes("localePath(locale, 'about/experts')") && component.includes("localePath(locale, 'about/contact')"), 'Cross navigation missing');
assert.ok(router.includes('TeamDirectory locale={locale}'), 'Team router not wired');
assert.ok(css.includes('@media (max-width: 48rem)') && css.includes(':focus-visible'), 'Mobile or keyboard safeguards missing');

const expected = {
  ru: ['Наша команда', 'Руслан Курмашев', 'Основатель и руководитель проекта', 'Наши эксперты', 'Предложить сотрудничество'],
  kk: ['Біздің команда', 'Руслан Курмашев', 'Жобаның негізін қалаушы және жетекшісі', 'Біздің сарапшылар', 'Ынтымақтастық ұсыну'],
  en: ['Our team', 'Ruslan Kurmashev', 'Founder and project lead', 'Our experts', 'Propose a collaboration'],
};
for (const [locale, strings] of Object.entries(expected)) {
  const html = await readFile(path.resolve('dist/kz', locale, 'about/team/index.html'), 'utf8');
  assert.ok(html.includes('team-directory__hero') && html.includes('team-directory__collaboration'), 'Team page missing for ' + locale);
  assert.equal((html.match(/class="team-directory__member"/g) || []).length, 1, 'Core team size mismatch: ' + locale);
  assert.equal((html.match(/class="team-directory__role-card"/g) || []).length, 3, 'Responsibilities and verification rules missing: ' + locale);
  for (const s of strings) assert.ok(html.includes(s), locale + ' missing localized copy: ' + s);
  for (const uri of ['/central-asia-autism-hub/kz/' + locale + '/about/experts/', '/central-asia-autism-hub/kz/' + locale + '/about/contact/']) {
    assert.ok(html.includes('href="' + uri + '"'), 'Missing link ' + uri);
  }
  assert.ok(!html.includes('src="undefined"'), locale + ': broken portrait source');
}
console.log('Team page QA PASS: 3 localized pages, 1 confirmed founder profile, responsive layout, and expert/contact links.');

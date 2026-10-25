/**
 * Canonical table-of-contents policy shared by Astro and build-time QA.
 * Nested H3 headings are not chapters. Non-numbered substantive H2 sections
 * remain navigable. Explicitly labelled summaries / meta-navigation do not
 * inflate the chapter counter.
 */
const nonChapterTitles = new Set([
  'главное для родителей',
  'главное за одну минуту',
  'что важно запомнить',
  'короткий итог',
  'главное',
  'коротко',
  'главный вывод',
  'в этой статье',
  'навигация по маршруту',
  'дальше в этом разделе',
  'связанные материалы',
  'материалы по теме',
  'қысқаша',
  'қысқаша қорытынды',
  'негізгі ойлар',
  'ата-аналарға маңыздысы',
  'қатысты материалдар',
  'in brief',
  'key takeaways',
  'quick recap',
  'related resources',
]);

export function selectArticleSections(headings) {
  const main = headings.filter(heading => heading.depth === 2);
  if (main.length <= 1) return main;
  return main.filter(heading =>
    !nonChapterTitles.has(heading.text.trim().toLocaleLowerCase()));
}

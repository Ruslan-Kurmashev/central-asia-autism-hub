// Editor-curated parent reading sequence, independent of publication dates and
// language-specific slugs. Keep the glossary immediately after the first article.
// Keys must appear exactly once for each published RU / KK / EN autism-basics set.
export const PARENT_AUTISM_BASICS_READING_ORDER = Object.freeze([
  'parents-what-is-autism',
  'parents-autism-myths-facts',
  'parents-autism-communication-speech-gestures-echolalia',
  'parents-autism-sensory-differences',
  'parents-autism-co-occurring-conditions',
  'parents-autism-stimming-repetitive-actions',
  'parents-autism-meltdown-shutdown',
  'parents-autism-neurodiversity-language',
  'parents-autism-in-girls',
  'parents-autism-causes',
]);

const position = new Map(PARENT_AUTISM_BASICS_READING_ORDER.map((key, i) => [key, i]));

export function compareParentAutismBasics(leftKey, rightKey) {
  const left = position.get(leftKey) ?? Number.POSITIVE_INFINITY;
  const right = position.get(rightKey) ?? Number.POSITIVE_INFINITY;
  return left - right || leftKey.localeCompare(rightKey, 'en');
}

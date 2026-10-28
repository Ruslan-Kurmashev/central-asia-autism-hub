// Editorial order for 12 parent-development articles, shared across RU, KK and EN.
// Never interpret the reading order as an assessment algorithm or a reason to delay care.
export const PARENT_DEVELOPMENT_READING_ORDER = Object.freeze([
  'parents-development-milestones',
  'parents-when-to-discuss-child-development',
  'parents-child-developmental-skill-loss',
  'parents-how-to-observe-child-development-at-home',
  'parents-speech-language-understanding-development',
  'parents-everyday-communication-support',
  'parents-child-play-development-and-caregiver-participation',
  'parents-emotions-coregulation-practical-guide',
  'parents-child-context-dependent-behaviour-home-preschool',
  'parents-child-daily-independence-practical-guide',
  'parents-gross-fine-motor-home-practice',
  'parents-bilingual-family-speech-development',
]);

const positions = new Map(PARENT_DEVELOPMENT_READING_ORDER.map((key, index) => [key, index]));

export function compareParentDevelopment(leftKey, rightKey) {
  const left = positions.get(leftKey) ?? Number.POSITIVE_INFINITY;
  const right = positions.get(rightKey) ?? Number.POSITIVE_INFINITY;
  return left - right || leftKey.localeCompare(rightKey, 'en');
}

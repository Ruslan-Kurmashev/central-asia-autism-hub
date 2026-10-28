import type { CollectionEntry } from 'astro:content';

// Both provider-language URLs remain in the content collection, but each pair
// represents one programme and renders as one card in LearningCatalog.
export const bilingualCoursePairs = [
  ['orleu-russian-assistive-needs-sett', 'orleu-kazakh-assistive-needs-sett'],
  ['orleu-russian-aac-assistive-technologies', 'orleu-kazakh-aac-assistive-technologies'],
] as const;

export function countVisibleLearningCourses(entries: CollectionEntry<'learning'>[]): number {
  const bySlug = new Map(entries.map((entry) => [entry.data.slug, entry]));
  const pairedVersions = bilingualCoursePairs.filter(([russianSlug, kazakhSlug]) =>
    Boolean(bySlug.get(russianSlug)?.data.externalUrl && bySlug.get(kazakhSlug)?.data.externalUrl),
  ).length;

  return entries.length - pairedVersions;
}

import type { CollectionEntry } from 'astro:content';

/**
 * A separate learning page is justified only if a learner can actually
 * consume material on AutismHub. Metadata copied from an external provider
 * is not enough to justify an intermediate page.
 *
 * Add future first-party interactive lessons here only when the site
 * genuinely hosts those materials, rather than when a course is simply
 * listed in the directory.
 */
export function hasOnSiteLearning(data: Pick<CollectionEntry<'learning'>['data'], 'lessons'>): boolean {
  return (data.lessons ?? []).some((lesson) => Boolean(lesson.youtubeVideoId));
}

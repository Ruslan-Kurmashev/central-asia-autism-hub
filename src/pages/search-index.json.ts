import { getCollection } from 'astro:content';
import { articlePath, localePath } from '../lib/urls';

export const prerender = true;

const published = (data: { draft: boolean; translationStatus: string; publishedAt?: Date; updatedAt?: Date }) =>
  !data.draft && data.translationStatus !== 'pending' && Boolean(data.publishedAt) && Boolean(data.updatedAt);

const plainText = (markdown: string) => markdown
  .replace(/\!\[[^\]]*\]\([^)]+\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/[#*_`~|<>]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 10000);

export async function GET() {
  const [pages, research, learning] = await Promise.all([
    getCollection('pages', ({ data }) => published(data)),
    getCollection('research', ({ data }) => published(data)),
    getCollection('learning', ({ data }) => published(data) && Boolean(data.externalUrl)),
  ]);

  const articles = [...pages, ...research].map((entry) => ({
    language: entry.data.language,
    section: entry.data.section,
    kind: 'article',
    translationKey: entry.data.translationKey,
    title: entry.data.title,
    summary: entry.data.summary,
    href: articlePath(entry.data.language, entry.data.section, entry.data.slug),
    updated: entry.data.updatedAt!.toISOString().slice(0, 10),
    searchText: plainText(
      [
        entry.data.description,
        entry.data.topic,
        ...entry.data.keyPoints,
        ...entry.data.sources.map((source) => source.title),
        'body' in entry && typeof entry.body === 'string' ? entry.body : '',
      ].join(' '),
    ),
  }));

  const courses = learning.map((entry) => ({
    language: entry.data.language,
    section: 'learning',
    kind: 'course',
    translationKey: entry.data.translationKey,
    title: entry.data.title,
    summary: entry.data.summary,
    href: localePath(entry.data.language, 'learning') + '#course-' + entry.data.slug,
    updated: entry.data.updatedAt!.toISOString().slice(0, 10),
    searchText: plainText([
      entry.data.description,
      entry.data.provider,
      entry.data.topicArea ?? '',
      entry.data.registrationStatus ?? '',
      entry.data.completionOutcome ?? '',
      entry.data.languages.join(' '),
    ].join(' ')),
  }));

  const extras = [{
    language: 'ru', section: 'parents', kind: 'guide', translationKey: 'parents-autism-glossary-ru',
    title: 'Словарь терминов об аутизме',
    summary: 'Понятные объяснения терминов, используемых в диагностике, исследованиях и поддержке.',
    href: localePath('ru', 'parents/glossary'),
    updated: '',
    searchText: 'словарь термины определения глоссарий аутизм рас РАС диагностика поддержка',
  }];

  const entries = [...articles, ...courses, ...extras].sort((a, b) =>
    a.language.localeCompare(b.language) ||
    a.title.localeCompare(b.title, a.language),
  );
  return new Response(JSON.stringify({ version: 1, entries }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}

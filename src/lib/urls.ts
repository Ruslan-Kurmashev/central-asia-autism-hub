import { SITE, type Locale, type Section } from '../site.config';

const basePath = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function sitePath(path = ''): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  return cleanPath ? `${basePath}${cleanPath}/` : basePath;
}

export function localePath(locale: Locale, path = ''): string {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const suffix = cleanPath ? `/${cleanPath}` : '';
  return sitePath(`${SITE.country}/${locale}${suffix}`);
}

export function sectionPath(locale: Locale, section: Section): string {
  return localePath(locale, section);
}

// Return to the existing Guidelines panel with the Kazakhstan disclosure expanded.
export function kazakhstanDocumentsPath(locale: Locale): string {
  return sectionPath(locale, 'professionals') + '?documents=kazakhstan#professional-guidelines';
}

export function articlePath(
  locale: Locale,
  section: Section,
  slug: string,
): string {
  return localePath(locale, `${section}/${slug}`);
}

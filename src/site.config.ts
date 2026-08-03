export const SITE = {
  name: 'Autism Hub Kazakhstan',
  umbrellaName: 'Central Asia Autism Hub',
  country: 'kz',
  repositoryUrl: 'https://github.com/Ruslan-Kurmashev/central-asia-autism-hub',
  isLive: false,
} as const;

export const SUPPORTED_LOCALES = ['ru', 'kk', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const SECTIONS = [
  'parents',
  'research',
  'help-kazakhstan',
  'learning',
  'professionals',
  'about',
] as const;

export type Section = (typeof SECTIONS)[number];

export const LANGUAGE_META: Record<
  Locale,
  { label: string; hreflang: string; htmlLang: string }
> = {
  ru: { label: 'Русский', hreflang: 'ru-KZ', htmlLang: 'ru' },
  kk: { label: 'Қазақша', hreflang: 'kk-KZ', htmlLang: 'kk' },
  en: { label: 'English', hreflang: 'en-KZ', htmlLang: 'en' },
};

export function isLocale(value: string | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}
export function isSection(value: string | undefined): value is Section {
  return SECTIONS.includes(value as Section);
}

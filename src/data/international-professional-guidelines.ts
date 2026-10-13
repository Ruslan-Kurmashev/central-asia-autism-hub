import type { Locale } from '../site.config';

export type Localized = Record<Locale, string>;
export type GuidelineCountryId = 'uk' | 'us' | 'au' | 'ca';
export type InternationalGuideline = {
  id: string;
  title: Localized;
  organisation: string;
  year: number;
  sourceUrl: string;
  translationKey?: string;
};
export type GuidelineCountry = {
  id: GuidelineCountryId;
  title: Localized;
  description: Localized;
  documents: InternationalGuideline[];
};

// Original issuing-organisation links are not AutismHub-reviewed summaries.
// Display an internal article only when a matching, published translation exists.
// New countries or documents require an official source and editorial verification.
export const internationalGuidelineCountries: GuidelineCountry[] = [
  {
    id: 'uk',
    title: { ru: 'Великобритания', kk: 'Ұлыбритания', en: 'United Kingdom' },
    description: {
      ru: 'Клинические руководства National Institute for Health and Care Excellence (NICE).',
      kk: 'National Institute for Health and Care Excellence (NICE) клиникалық нұсқаулықтары.',
      en: 'Clinical guidelines from the National Institute for Health and Care Excellence (NICE).',
    },
    documents: [
      {
        id: 'nice-cg128',
        title: { ru: 'NICE CG128: выявление и диагностика аутизма у детей и подростков', kk: 'NICE CG128: балалар мен жасөспірімдердегі аутизмді анықтау және диагностикалау', en: 'NICE CG128: recognising and diagnosing autism in under-19s' },
        organisation: 'NICE', year: 2011, sourceUrl: 'https://www.nice.org.uk/guidance/cg128',
        translationKey: 'professionals-g04',
      },
      {
        id: 'nice-cg170',
        title: { ru: 'NICE CG170: поддержка детей и подростков с аутизмом', kk: 'NICE CG170: аутист балалар мен жасөспірімдерді қолдау', en: 'NICE CG170: support for autistic children and young people' },
        organisation: 'NICE', year: 2013, sourceUrl: 'https://www.nice.org.uk/guidance/cg170',
        translationKey: 'professionals-g05',
      },
      {
        id: 'nice-cg142',
        title: { ru: 'NICE CG142: диагностика и поддержка аутичных взрослых', kk: 'NICE CG142: аутист ересектерді диагностикалау және қолдау', en: 'NICE CG142: diagnosis and support for autistic adults' },
        organisation: 'NICE', year: 2012, sourceUrl: 'https://www.nice.org.uk/guidance/cg142',
        translationKey: 'professionals-g06',
      },
    ],
  },
  {
    id: 'us',
    title: { ru: 'США', kk: 'АҚШ', en: 'United States' },
    description: { ru: 'Клинические публикации American Academy of Pediatrics (AAP).', kk: 'American Academy of Pediatrics (AAP) клиникалық жарияланымдары.', en: 'Clinical publications by the American Academy of Pediatrics (AAP).' },
    documents: [
      {
        id: 'aap-2020',
        title: {
          ru: 'AAP (2020): выявление, оценка и ведение детей с расстройствами аутистического спектра',
          kk: 'AAP (2020): аутизм спектрі бұзылыстары бар балаларды анықтау, бағалау және қолдау',
          en: 'AAP (2020): Identification, Evaluation, and Management of Children With Autism Spectrum Disorder',
        },
        organisation: 'American Academy of Pediatrics', year: 2020,
        sourceUrl: 'https://doi.org/10.1542/peds.2019-3447',
        translationKey: 'professionals-intl-us-aap-2020',
      },
    ],
  },
  {
    id: 'au',
    title: { ru: 'Австралия', kk: 'Аустралия', en: 'Australia' },
    description: { ru: 'Национальные руководства Autism CRC по оценке и поддержке аутичных людей.', kk: 'Autism CRC әзірлеген аутизмді бағалау және қолдау жөніндегі ұлттық нұсқаулықтар.', en: 'National assessment and support guidelines developed by Autism CRC.' },
    documents: [
      {
        id: 'autism-crc-assessment-2023',
        title: { ru: 'Национальное руководство Австралии по оценке и диагностике аутизма (2-е издание, обновление 2023)', kk: 'Аустралиядағы аутизмді бағалау және диагностикалау жөніндегі ұлттық нұсқаулық (2-бас., 2023)', en: 'National Guideline for the Assessment and Diagnosis of Autism in Australia (2nd ed., 2023)' },
        organisation: 'Autism CRC', year: 2023,
        sourceUrl: 'https://www.autismcrc.com.au/best-practice/assessment-and-diagnosis',
        translationKey: 'professionals-intl-au-autism-crc-assessment-2023',
      },
      {
        id: 'autism-crc-supporting-children',
        title: { ru: 'Национальное руководство Австралии по поддержке обучения, участия и благополучия аутичных детей и их семей', kk: 'Аутист балалар мен олардың отбасыларының оқуын, қатысуын және әл-ауқатын қолдау жөніндегі ұлттық нұсқаулық', en: 'National Guideline for Supporting the Learning, Participation, and Wellbeing of Autistic Children and their Families' },
        organisation: 'Autism CRC', year: 2023,
        sourceUrl: 'https://www.autismcrc.com.au/best-practice/supporting-children',
        translationKey: 'professionals-intl-au-autism-crc-supporting-children',
      },
    ],
  },
  {
    id: 'ca',
    title: { ru: 'Канада', kk: 'Канада', en: 'Canada' },
    description: { ru: 'Позиционные документы Canadian Paediatric Society (CPS).', kk: 'Canadian Paediatric Society (CPS) ұсынымдық құжаттары.', en: 'Position statements from the Canadian Paediatric Society (CPS).' },
    documents: [
      {
        id: 'cps-early-detection',
        title: { ru: 'CPS (2019): раннее выявление аутизма у маленьких детей', kk: 'CPS (2019): жас балаларда аутизмді ерте анықтау', en: 'CPS (2019): Early detection for autism spectrum disorder in young children' },
        organisation: 'Canadian Paediatric Society', year: 2019,
        sourceUrl: 'https://cps.ca/en/documents/position/asd-early-detection',
      },
      {
        id: 'cps-diagnostic-standards',
        title: { ru: 'CPS (2019): стандарты диагностической оценки аутизма', kk: 'CPS (2019): аутизмді диагностикалық бағалау стандарттары', en: 'CPS (2019): Standards of diagnostic assessment for autism spectrum disorder' },
        organisation: 'Canadian Paediatric Society', year: 2019,
        sourceUrl: 'https://cps.ca/en/documents/position/asd-diagnostic-assessment',
      },
      {
        id: 'cps-followup',
        title: { ru: 'CPS (2019): сопровождение после диагностики и дальнейшее наблюдение', kk: 'CPS (2019): диагноздан кейінгі қолдау және әрі қарай бақылау', en: 'CPS (2019): Post-diagnostic management and follow-up care for autism spectrum disorder' },
        organisation: 'Canadian Paediatric Society', year: 2019,
        sourceUrl: 'https://cps.ca/en/documents/position/asd-post-diagnostic-management',
      },
    ],
  },
];
export const internationalGuidelineCount = internationalGuidelineCountries.reduce((sum, country) => sum + country.documents.length, 0);
export const publishedGuidelineKeys = new Set(internationalGuidelineCountries.flatMap((country) => country.documents.map((doc) => doc.translationKey).filter((key): key is string => Boolean(key))));

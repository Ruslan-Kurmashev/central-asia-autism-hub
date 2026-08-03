import type { Locale } from '../site.config';

export type Audience = 'parents' | 'families' | 'professionals' | 'general';

interface ContentCopy {
  materialsTitle: string;
  materialsText: string;
  readMaterial: string;
  articleLabel: string;
  audienceLabel: string;
  audiences: Record<Audience, string>;
  publishedLabel: string;
  updatedLabel: string;
  reviewDueLabel: string;
  authorLabel: string;
  editorLabel: string;
  authorAndEditorLabel: string;
  reviewerLabel: string;
  sourceResponsibility: string;
  noIndependentReview: string;
  keyPointsTitle: string;
  limitationsTitle: string;
  sourcesTitle: string;
  accessedLabel: string;
  conflictLabel: string;
  versionLabel: string;
  informationBoundaryTitle: string;
  informationBoundaryText: string;
  medicalBoundaryTitle: string;
  medicalBoundaryText: string;
  translationNotice: string;
  translationUnavailable: string;
  backToSection: string;
}

export const CONTENT_UI: Record<Locale, ContentCopy> = {
  ru: {
    materialsTitle: 'Опубликованные материалы',
    materialsText: 'Проверенные материалы этого раздела с источниками и датами обновления.',
    readMaterial: 'Открыть материал',
    articleLabel: 'Информационный материал',
    audienceLabel: 'Для кого',
    audiences: {
      parents: 'родителей',
      families: 'семей',
      professionals: 'специалистов',
      general: 'всех читателей',
    },
    publishedLabel: 'Опубликовано',
    updatedLabel: 'Обновлено',
    reviewDueLabel: 'Следующая проверка',
    authorLabel: 'Автор',
    editorLabel: 'Редактор',
    authorAndEditorLabel: 'Автор и редактор',
    reviewerLabel: 'Независимый рецензент',
    sourceResponsibility: 'Материал основан на источниках, перечисленных ниже.',
    noIndependentReview: 'Независимое внешнее рецензирование не проводилось.',
    keyPointsTitle: 'Коротко о главном',
    limitationsTitle: 'Ограничения и неопределённость',
    sourcesTitle: 'Источники',
    accessedLabel: 'Проверено',
    conflictLabel: 'Конфликт интересов',
    versionLabel: 'Примечание к версии',
    informationBoundaryTitle: 'Граница материала',
    informationBoundaryText: 'Материал предназначен для общей информации и не заменяет профессиональную консультацию.',
    medicalBoundaryTitle: 'Медицинская граница',
    medicalBoundaryText: 'Материал не предназначен для диагностики или индивидуального выбора лечения и не заменяет консультацию квалифицированного специалиста.',
    translationNotice: 'Этот материал пока доступен не на всех языках сайта. Если перевода нет, переключатель языка откроет соответствующий раздел.',
    translationUnavailable: 'перевод материала пока недоступен; открыть раздел',
    backToSection: 'Вернуться в раздел',
  },
  kk: {
    materialsTitle: 'Жарияланған материалдар',
    materialsText: 'Дереккөздері мен жаңарту күндері көрсетілген осы бөлімнің тексерілген материалдары.',
    readMaterial: 'Материалды ашу',
    articleLabel: 'Ақпараттық материал',
    audienceLabel: 'Кімге арналған',
    audiences: {
      parents: 'ата-аналарға',
      families: 'отбасыларға',
      professionals: 'мамандарға',
      general: 'барлық оқырмандарға',
    },
    publishedLabel: 'Жарияланды',
    updatedLabel: 'Жаңартылды',
    reviewDueLabel: 'Келесі тексеру',
    authorLabel: 'Автор',
    editorLabel: 'Редактор',
    authorAndEditorLabel: 'Автор және редактор',
    reviewerLabel: 'Тәуелсіз рецензент',
    sourceResponsibility: 'Материал төменде көрсетілген дереккөздерге негізделген.',
    noIndependentReview: 'Тәуелсіз сыртқы рецензия жүргізілген жоқ.',
    keyPointsTitle: 'Негізгі ойлар',
    limitationsTitle: 'Шектеулер мен белгісіздік',
    sourcesTitle: 'Дереккөздер',
    accessedLabel: 'Тексерілді',
    conflictLabel: 'Мүдделер қақтығысы',
    versionLabel: 'Нұсқа туралы ескерту',
    informationBoundaryTitle: 'Материал шекарасы',
    informationBoundaryText: 'Материал жалпы ақпаратқа арналған және кәсіби кеңесті алмастырмайды.',
    medicalBoundaryTitle: 'Медициналық шекара',
    medicalBoundaryText: 'Материал диагноз қоюға немесе емді жеке таңдауға арналмаған және білікті маман кеңесін алмастырмайды.',
    translationNotice: 'Бұл материал сайттың барлық тілінде әзірге қолжетімді емес. Аударма болмаса, тіл ауыстырғышы тиісті бөлімді ашады.',
    translationUnavailable: 'материал аудармасы әзірге жоқ; бөлімді ашу',
    backToSection: 'Бөлімге оралу',
  },
  en: {
    materialsTitle: 'Published materials',
    materialsText: 'Reviewed materials in this section, with sources and visible update dates.',
    readMaterial: 'Open material',
    articleLabel: 'Information material',
    audienceLabel: 'Intended for',
    audiences: {
      parents: 'parents',
      families: 'families',
      professionals: 'professionals',
      general: 'all readers',
    },
    publishedLabel: 'Published',
    updatedLabel: 'Updated',
    reviewDueLabel: 'Next review',
    authorLabel: 'Author',
    editorLabel: 'Editor',
    authorAndEditorLabel: 'Author and editor',
    reviewerLabel: 'Independent reviewer',
    sourceResponsibility: 'This material is based on the sources listed below.',
    noIndependentReview: 'No independent external review was conducted.',
    keyPointsTitle: 'Key points',
    limitationsTitle: 'Limitations and uncertainty',
    sourcesTitle: 'Sources',
    accessedLabel: 'Checked',
    conflictLabel: 'Conflict of interest',
    versionLabel: 'Version note',
    informationBoundaryTitle: 'Scope of this material',
    informationBoundaryText: 'This material provides general information and does not replace professional advice.',
    medicalBoundaryTitle: 'Medical boundary',
    medicalBoundaryText: 'This material is not intended for diagnosis or individual treatment decisions and does not replace advice from a qualified professional.',
    translationNotice: 'This material is not yet available in every site language. When a translation is missing, the language switcher opens the corresponding section.',
    translationUnavailable: 'material not yet translated; open the section',
    backToSection: 'Return to the section',
  },
};

export const DATE_LOCALES: Record<Locale, string> = {
  ru: 'ru-KZ',
  kk: 'kk-KZ',
  en: 'en-KZ',
};

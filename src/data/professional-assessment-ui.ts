import type { Locale } from '../site.config';

export const assessmentUI: Record<Locale, {
  section: string; professional: string; homeLead: string;
  sequence: string; library: string; libraryLead: string; libraryLink: string;
  articles: string; resources: string; available: string; upcoming: string;
  next: string; previous: string; back: string; read: string;
  toolGroup: string; downloads: string; allGroups: string; fileVersion: string;
  toolsLead: string; onlyPublished: string; upcomingTools: string;
  searchLabel: string; searchPlaceholder: string; noMatches: string;
  noTools: string; translatePending: string; stageToolsPending: string;
  legalNote: string; sequenceNote: string; sources: string; permissions: string;
}> = {
  ru: {
    section: 'Оценка и диагностика', professional: 'Для специалистов',
    homeLead: 'Пошаговый маршрут для специалистов: от первых признаков до заключения и дальнейшего плана.',
    sequence: 'Этапы оценки', library: 'Библиотека инструментов',
    libraryLead: 'Скачать схемы, таблицы и шаблоны', libraryLink: 'Перейти к инструментам',
    articles: 'Статьи и руководства', resources: 'Инструменты этапа',
    available: 'Опубликовано', upcoming: 'В подготовке',
    next: 'Следующий этап', previous: 'Предыдущий этап', back: 'К маршруту',
    read: 'Читать статью', toolGroup: 'Категория', downloads: 'Скачать',
    allGroups: 'Все категории', fileVersion: 'Версия',
    toolsLead: 'Готовые для скачивания схемы, сравнительные таблицы и редактируемые документы для профессиональной работы.',
    onlyPublished: 'В списке показаны только готовые файлы.',
    upcomingTools: 'Остальные инструменты находятся в разработке',
    searchLabel: 'Поиск инструмента', searchPlaceholder: 'Название или формат',
    noMatches: 'По выбранным условиям файлов нет.',
    noTools: 'Пока нет опубликованных файлов на этом языке.',
    translatePending: 'Файлы на выбранном языке готовятся. Русскоязычные документы не выдаются за переводы.',
    stageToolsPending: 'Скачиваемые инструменты этого этапа пока в подготовке.',
    legalNote: 'Материалы предназначены для специалистов, не устанавливают диагноз и не заменяют обязательные клинические документы Казахстана.',
    sequenceNote: 'Схема помогает ориентироваться в материалах. В реальной практике этапы оценки могут выполняться параллельно.',
    sources: 'Официальные источники', permissions: 'M-CHAT-R/F, ADOS-2, ADI-R и CARS-2 имеют ограничения на использование и распространение. Используйте официальные руководства и лицензированные материалы.',
  },
  kk: {
    section: 'Бағалау және диагностика', professional: 'Мамандарға',
    homeLead: 'Мамандарға арналған кезеңдік бағыт: алғашқы белгілерден қорытынды мен кейінгі жоспарға дейін.',
    sequence: 'Бағалау кезеңдері', library: 'Құралдар кітапханасы',
    libraryLead: 'Схемалар, кестелер және үлгілерді жүктеу', libraryLink: 'Құралдарға өту',
    articles: 'Мақалалар мен нұсқаулықтар', resources: 'Кезеңнің құралдары',
    available: 'Жарияланды', upcoming: 'Дайындалуда',
    next: 'Келесі кезең', previous: 'Алдыңғы кезең', back: 'Бағытқа оралу',
    read: 'Мақаланы оқу', toolGroup: 'Санат', downloads: 'Жүктеу',
    allGroups: 'Барлық санаттар', fileVersion: 'Нұсқа',
    toolsLead: 'Мамандарға арналған жүктелетін схемалар, салыстыру кестелері және өңделетін құжаттар.',
    onlyPublished: 'Тек дайын файлдар көрсетіледі.',
    upcomingTools: 'Қалған құралдар әзірленуде',
    searchLabel: 'Құралды іздеу', searchPlaceholder: 'Атауы немесе форматы',
    noMatches: 'Таңдалған шарттар бойынша файл табылмады.',
    noTools: 'Бұл тілде жарияланған файлдар әзірге жоқ.',
    translatePending: 'Қазақ тіліндегі файлдар әзірленуде. Орысша материалдар аударма ретінде көрсетілмейді.',
    stageToolsPending: 'Бұл кезеңнің жүктелетін құралдары әзірленуде.',
    legalNote: 'Материалдар мамандарға арналған, диагноз қоймайды және Қазақстанның міндетті медициналық құжаттарын алмастырмайды.',
    sequenceNote: 'Бұл схема материалдарды табуға көмектеседі. Нақты бағалауда кезеңдер қатар орындалуы мүмкін.',
    sources: 'Ресми дереккөздер', permissions: 'M-CHAT-R/F, ADOS-2, ADI-R және CARS-2 материалдарының қолданылуына шектеулер бар. Ресми нұсқаулықтар мен лицензияларды тексеріңіз.',
  },
  en: {
    section: 'Assessment and diagnosis', professional: 'For professionals',
    homeLead: 'A practical route for professionals, from early concerns to reporting and ongoing support.',
    sequence: 'Assessment stages', library: 'Resource library',
    libraryLead: 'Download diagrams, comparison tables and editable templates', libraryLink: 'Browse resources',
    articles: 'Professional articles', resources: 'Stage resources',
    available: 'Published', upcoming: 'In preparation',
    next: 'Next stage', previous: 'Previous stage', back: 'Back to the pathway',
    read: 'Read article', toolGroup: 'Category', downloads: 'Download',
    allGroups: 'All categories', fileVersion: 'Version',
    toolsLead: 'Downloadable diagrams, comparison tables and editable documents for professional practice.',
    onlyPublished: 'Only published files are shown.',
    upcomingTools: 'Other resources are being developed',
    searchLabel: 'Search resources', searchPlaceholder: 'Title or format',
    noMatches: 'No files match your filters.',
    noTools: 'No resources have been released in this language yet.',
    translatePending: 'Translated files are in preparation. Russian files are not presented as translated resources.',
    stageToolsPending: 'Resources for this stage are in preparation.',
    legalNote: 'These resources are intended for professionals. They do not establish a diagnosis or replace mandatory Kazakhstan clinical documents.',
    sequenceNote: 'This sequence is a navigation aid, not a mandatory clinical order. Assessment stages may overlap.',
    sources: 'Official sources', permissions: 'M-CHAT-R/F, ADOS-2, ADI-R and CARS-2 have licensing and distribution restrictions. Use official instructions and licensed resources.',
  },
};

export function countForLocale(locale: Locale, count: number, kind: 'article' | 'file'): string {
  if (locale === 'en') return count + ' ' + (kind === 'article' ? (count === 1 ? 'article' : 'articles') : (count === 1 ? 'resource' : 'resources'));
  if (locale === 'kk') return count + ' ' + (kind === 'article' ? 'мақала' : 'құрал');
  const forms = kind === 'article' ? ['статья','статьи','статей'] : ['инструмент','инструмента','инструментов'];
  const n = Math.abs(count);
  const ix = n%10===1 && n%100!==11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12||n%100>14) ? 1 : 2;
  return count + ' ' + forms[ix];
}

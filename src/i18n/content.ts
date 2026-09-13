import type { Locale } from '../site.config';

export type Audience = 'parents' | 'families' | 'professionals' | 'general';

interface MilestoneUiCopy {
  selectorEyebrow: string;
  selectorTitle: string;
  selectorInstruction: string;
  groupUnderOne: string;
  groupOneToTwoHalf: string;
  groupThreeToFive: string;
  openSheet: string;
  betweenAgesLead: string;
  betweenAgesText: string;
  correctedAgeText: string;
  pageTitleTemplate: string;
  pageDescriptionTemplate: string;
  breadcrumbLabel: string;
  noticeAriaLabel: string;
  noticeTitle: string;
  noticeText: string;
  noticePrivacyText: string;
  answerOptionsLabel: string;
  exampleLabel: string;
  sourceLinkTemplate: string;
}

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
  milestones: MilestoneUiCopy;
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
    milestones: {
      selectorEyebrow: 'Листы наблюдений',
      selectorTitle: 'Выберите возраст ребёнка',
      selectorInstruction: 'Откройте возраст, который ребёнку уже исполнился.',
      groupUnderOne: 'До 1 года',
      groupOneToTwoHalf: 'От 1 года до 2,5 лет',
      groupThreeToFive: 'От 3 до 5 лет',
      openSheet: 'Открыть лист',
      betweenAgesLead: 'Если возраст находится между двумя точками',
      betweenAgesText: 'используйте предыдущую. Например, в 20 месяцев откройте лист для 18 месяцев.',
      correctedAgeText: 'Если ребёнок родился более чем на 3 недели раньше предполагаемого срока, для ранних возрастов CDC рекомендует использовать скорректированный возраст. Если вы не уверены, какой возраст учитывать, обсудите это с врачом.',
      pageTitleTemplate: 'Ориентиры развития в {age}',
      pageDescriptionTemplate: 'Лист наблюдений для родителей: ориентиры развития ребёнка в {age}. Материал не является диагностическим тестом.',
      breadcrumbLabel: 'Ориентиры развития',
      noticeAriaLabel: 'Как использовать лист',
      noticeTitle: 'Это лист наблюдений, а не тест.',
      noticeText: 'Здесь нет правильных или неправильных ответов, баллы не подсчитываются и результат не рассчитывается.',
      noticePrivacyText: 'Отметки и заметки остаются в вашем браузере. Сайт не отправляет их на сервер и не сохраняет в базе данных.',
      answerOptionsLabel: 'Варианты ответа',
      exampleLabel: 'Пример',
      sourceLinkTemplate: 'CDC: ориентиры для возраста {age}',
    },
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
    milestones: {
      selectorEyebrow: 'Бақылау парақтары',
      selectorTitle: 'Баланың жасын таңдаңыз',
      selectorInstruction: 'Балаңыздың жасына сәйкес кезеңді ашыңыз.',
      groupUnderOne: '1 жасқа дейін',
      groupOneToTwoHalf: '1 жастан 2,5 жасқа дейін',
      groupThreeToFive: '3 жастан 5 жасқа дейін',
      openSheet: 'Парақты ашу',
      betweenAgesLead: 'Егер жас екі кезеңнің арасында болса',
      betweenAgesText: 'алдыңғы жас кезеңін пайдаланыңыз. Мысалы, 20 айда 18 айға арналған парақты ашыңыз.',
      correctedAgeText: 'Егер бала болжамды мерзімнен 3 аптадан астам ерте туған болса, ерте жаста CDC түзетілген жасты қолдануды ұсынады. Қай жасты есепке алу керектігіне күмәндансаңыз, дәрігермен талқылаңыз.',
      pageTitleTemplate: 'Даму бағдарлары: {age}',
      pageDescriptionTemplate: 'Ата-аналарға арналған бақылау парағы: {age} кезеңіндегі баланың даму бағдарлары. Материал диагностикалық тест емес.',
      breadcrumbLabel: 'Даму бағдарлары',
      noticeAriaLabel: 'Парақты қалай пайдалану керек',
      noticeTitle: 'Бұл бақылау парағы, тест емес.',
      noticeText: 'Мұнда дұрыс немесе бұрыс жауап жоқ, ұпай есептелмейді және нәтиже шығарылмайды.',
      noticePrivacyText: 'Белгілер мен жазбалар браузеріңізде қалады. Сайт оларды серверге жібермейді және дерекқорда сақтамайды.',
      answerOptionsLabel: 'Жауап нұсқалары',
      exampleLabel: 'Мысал',
      sourceLinkTemplate: 'CDC: {age} кезеңіне арналған даму бағдарлары',
    },
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
    milestones: {
      selectorEyebrow: 'Observation sheets',
      selectorTitle: "Choose your child's age",
      selectorInstruction: 'Open the age your child has already reached.',
      groupUnderOne: 'Under 1 year',
      groupOneToTwoHalf: '1 to 2.5 years',
      groupThreeToFive: '3 to 5 years',
      openSheet: 'Open sheet',
      betweenAgesLead: 'If the age falls between two milestones',
      betweenAgesText: 'use the younger age. For example, at 20 months open the 18-month sheet.',
      correctedAgeText: 'If your child was born more than 3 weeks early, CDC recommends using corrected age for the early milestones. If you are unsure which age to use, discuss it with a doctor.',
      pageTitleTemplate: 'Developmental milestones at {age}',
      pageDescriptionTemplate: 'Parent observation sheet: developmental milestones at {age}. This material is not a diagnostic test.',
      breadcrumbLabel: 'Developmental milestones',
      noticeAriaLabel: 'How to use this sheet',
      noticeTitle: 'This is an observation sheet, not a test.',
      noticeText: 'There are no right or wrong answers, no score is calculated, and no result is generated.',
      noticePrivacyText: 'Your selections and notes stay in your browser. The site does not send them to a server or save them in a database.',
      answerOptionsLabel: 'Response options',
      exampleLabel: 'Example',
      sourceLinkTemplate: 'CDC: milestones for {age}',
    },
  },
};

export const DATE_LOCALES: Record<Locale, string> = {
  ru: 'ru-KZ',
  kk: 'kk-KZ',
  en: 'en-KZ',
};

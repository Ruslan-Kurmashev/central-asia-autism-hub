import type { Locale, Section } from '../site.config';

type TopicCopy = {
  id: string;
  title: string;
  description: string;
};

type SectionCopy = {
  title: string;
  description: string;
  topics: TopicCopy[];
};

type PrincipleCopy = {
  title: string;
  description: string;
};

type LocaleCopy = {
  skipLink: string;
  primaryNavigation: string;
  languageNavigation: string;
  languageLabel: string;
  homeLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  heroPoints: string[];
  statusTitle: string;
  statusText: string;
  heroPrimaryAction: string;
  heroSecondaryAction: string;
  heroProfessionalAction: string;
  exploreTitle: string;
  exploreText: string;
  principlesTitle: string;
  principlesText: string;
  principles: PrincipleCopy[];
  principlesBoundary: string;
  topicsTitle: string;
  topicsText: string;
  sectionStatus: string;
  sectionStatusText: string;
  backHome: string;
  footerBoundary: string;
  footerStatus: string;
  footerNavigation: string;
  footerLinks: {
    editorial: string;
    privacy: string;
    accessibility: string;
    contact: string;
  };
  repositoryLabel: string;
  sections: Record<Section, SectionCopy>;
};

export const UI: Record<Locale, LocaleCopy> = {
  ru: {
    skipLink: 'Перейти к основному содержанию',
    primaryNavigation: 'Основная навигация',
    languageNavigation: 'Выбор языка',
    languageLabel: 'Язык',
    homeLabel: 'Главная',
    eyebrow: 'Информационный ресурс для семей в Казахстане',
    title: 'Об аутизме — понятно, бережно и с опорой на источники',
    lead:
      'Собираем в одном месте проверяемую информацию для родителей: основные знания, научные разборы, обучение и навигацию по поддержке в Казахстане.',
    heroPoints: [
      'В первую очередь — для родителей',
      'Русский, қазақша и English',
      'Источники и даты проверки материалов',
    ],
    statusTitle: 'Бета-версия.',
    statusText:
      'Материалы и разделы постепенно добавляются после проверки источников и перевода.',
    heroPrimaryAction: 'Начать с основной информации',
    heroSecondaryAction: 'Материалы для родителей',
    heroProfessionalAction: 'Для специалистов',
    exploreTitle: 'Что вы найдёте на сайте',
    exploreText:
      'Шесть постоянных разделов объединяют информацию для семей, локальные ресурсы, научные разборы и обучение.',
    principlesTitle: 'Как мы работаем с информацией',
    principlesText:
      'Для каждого материала предусмотрены понятное объяснение, проверяемые источники и видимая дата обновления.',
    principles: [
      {
        title: 'Понятный язык',
        description:
          'Объясняем необходимые термины и отделяем практический вывод от научных подробностей.',
      },
      {
        title: 'Проверяемые источники',
        description:
          'Указываем первоисточники, силу доказательств, неопределённость и важные ограничения.',
      },
      {
        title: 'Дата обновления',
        description:
          'Показываем, когда материал опубликован, проверен и в последний раз обновлён.',
      },
      {
        title: 'Контекст Казахстана',
        description:
          'Отдельно проверяем местные организации, документы, образовательные и социальные маршруты.',
      },
    ],
    principlesBoundary:
      'Сайт не ставит диагноз и не заменяет профессиональную консультацию.',
    topicsTitle: 'Темы раздела',
    topicsText:
      'Эта карта показывает, какие материалы войдут в раздел. Публикация начнётся после проверки содержания и переводов.',
    sectionStatus: 'Материалы готовятся',
    sectionStatusText:
      'Сейчас зафиксированы структура и редакционные требования. Непроверенные медицинские или локальные сведения не публикуются.',
    backHome: 'Вернуться на главную',
    footerBoundary:
      'Информационно-образовательный ресурс. Не ставит диагноз и не заменяет профессиональную консультацию.',
    footerStatus: 'Техническая версия — содержательные материалы ещё не опубликованы.',
    footerNavigation: 'Политики и информация о проекте',
    footerLinks: {
      editorial: 'Редакционная политика',
      privacy: 'Приватность и данные',
      accessibility: 'Доступность',
      contact: 'Контакты',
    },
    repositoryLabel: 'Репозиторий проекта на GitHub',
    sections: {
      parents: {
        title: 'Родителям',
        description:
          'Понятная информация об аутизме, развитии, оценке, повседневной поддержке и благополучии семьи.',
        topics: [
          { id: 'autism-basics', title: 'Что такое аутизм', description: 'Основные понятия, разнообразие проявлений, сильные стороны и потребности в поддержке.' },
          { id: 'development', title: 'Развитие ребёнка', description: 'Этапы развития, индивидуальные различия и ситуации, которые стоит обсудить со специалистом.' },
          { id: 'assessment', title: 'Оценка и заключение', description: 'Чем отличаются наблюдение, скрининг, комплексная оценка и клиническое заключение.' },
          { id: 'support', title: 'Подходы к поддержке', description: 'Как оценивать цели, доказательства, безопасность и соответствие поддержки потребностям ребёнка.' },
          { id: 'daily-life', title: 'Повседневная жизнь семьи', description: 'Коммуникация, сенсорные потребности, сон, питание, школа и благополучие близких.' },
          { id: 'faq', title: 'Частые вопросы и словарь', description: 'Короткие ответы на распространённые вопросы и объяснения терминов без стигматизации.' },
        ],
      },
      research: {
        title: 'Наука простыми словами',
        description:
          'Разборы исследований: что изучали авторы, что они обнаружили и какие ограничения важно учитывать.',
        topics: [
          { id: 'research-reviews', title: 'Разборы новых исследований', description: 'Вопрос, методы, результаты, ограничения и практическое значение каждой работы.' },
          { id: 'reading-research', title: 'Как читать исследования', description: 'Дизайн исследования, выборка, причинность, статистическая неопределённость и конфликт интересов.' },
          { id: 'causes-and-biology', title: 'Причины и биология', description: 'Осторожные обзоры генетических, средовых и нейробиологических исследований без упрощений.' },
          { id: 'support-evidence', title: 'Доказательства о поддержке', description: 'Что известно об эффективности, безопасности и применимости разных подходов.' },
          { id: 'kazakhstan-research', title: 'Исследования в Казахстане', description: 'Публикации и проекты, относящиеся к Казахстану и Центральной Азии.' },
          { id: 'research-participation', title: 'Участие в исследованиях', description: 'В будущем — только проекты с прозрачной организацией, этикой, критериями и условиями участия.' },
        ],
      },
      'help-kazakhstan': {
        title: 'Помощь в Казахстане',
        description:
          'Общие сведения о доступных маршрутах поддержки и проверенные ссылки на организации и службы.',
        topics: [
          { id: 'getting-help', title: 'С чего начать', description: 'Общая карта возможных шагов и государственных источников без индивидуальных медицинских советов.' },
          { id: 'assessment-support', title: 'Оценка и сопровождение', description: 'Типы учреждений и специалистов, их роли и вопросы для проверки квалификации.' },
          { id: 'education', title: 'Детский сад и школа', description: 'Образовательные маршруты, инклюзивная поддержка и официальные источники информации.' },
          { id: 'rights-benefits', title: 'Права и социальная поддержка', description: 'Государственные меры, документы и ссылки с обязательной датой проверки.' },
          { id: 'organisations', title: 'Организации и службы', description: 'Проверенные внешние ссылки с географией, типом помощи и датой последней проверки.' },
          { id: 'service-checklist', title: 'Как проверить услугу', description: 'Квалификация, прозрачность стоимости, доказательные заявления, безопасность и жалобы.' },
        ],
      },
      learning: {
        title: 'Обучение',
        description:
          'Autism School Kazakhstan и отобранные внешние курсы, лекции и вебинары для родителей и специалистов.',
        topics: [
          { id: 'autism-school', title: 'Autism School Kazakhstan', description: 'Собственная образовательная программа проекта с ясно обозначенными целями и ответственностью.' },
          { id: 'parents-learning', title: 'Для родителей', description: 'Курсы и лекции о понимании аутизма, поддержке ребёнка и благополучии семьи.' },
          { id: 'professionals-learning', title: 'Для специалистов', description: 'Отдельная подборка обучения с указанием аудитории и статуса организатора.' },
          { id: 'events', title: 'События и вебинары', description: 'Даты, формат, язык, стоимость, организатор и прямая ссылка на первоисточник.' },
          { id: 'external-courses', title: 'Внешние курсы', description: 'Нейтральные карточки ресурсов без автоматического одобрения со стороны проекта.' },
          { id: 'learning-checklist', title: 'Как выбрать обучение', description: 'Проверка программы, квалификации преподавателей, заявлений об эффективности и условий оплаты.' },
        ],
      },
      professionals: {
        title: 'Специалистам',
        description:
          'Вторичный раздел с доказательно-информированными материалами и принципами уважительной работы с семьями.',
        topics: [
          { id: 'guidelines', title: 'Руководства и стандарты', description: 'Проверенные профессиональные документы с областью применения и датой версии.' },
          { id: 'family-communication', title: 'Коммуникация с семьями', description: 'Понятное информирование, совместные решения и уважение к опыту семьи.' },
          { id: 'assessment-context', title: 'Контекст оценки', description: 'Роли разных специалистов, ограничения инструментов и недопустимость дистанционной диагностики сайтом.' },
          { id: 'evidence-support', title: 'Доказательно-информированная поддержка', description: 'Баланс исследований, клинической компетентности, целей человека и семейного контекста.' },
          { id: 'ethics', title: 'Этика и безопасность', description: 'Информированное согласие, конфиденциальность, управление рисками и недопустимые обещания.' },
          { id: 'cpd', title: 'Обучение и события', description: 'Курсы, вебинары и материалы без заявления об аккредитации, если она не подтверждена.' },
        ],
      },
      about: {
        title: 'О проекте',
        description:
          'Цели, редакционная ответственность, медицинские границы, приватность и развитие проекта.',
        topics: [
          { id: 'mission', title: 'Миссия и структура брендов', description: 'Central Asia Autism Hub, Autism Hub Kazakhstan и Autism School Kazakhstan.' },
          { id: 'editorial', title: 'Редакционная политика', description: 'Как один автор фиксирует источники, проверку, обновления, исправления и личную ответственность.' },
          { id: 'evidence-safety', title: 'Доказательная и медицинская безопасность', description: 'Границы информационного ресурса и правила для медицинских и терапевтических утверждений.' },
          { id: 'privacy', title: 'Приватность и данные', description: 'Какие личные и медицинские данные сайт не собирает и как может использовать обезличенную аналитику.' },
          { id: 'accessibility', title: 'Дизайн и доступность', description: 'Цель WCAG 2.2 AA, понятный язык, клавиатурная навигация и сообщения о барьерах.' },
          { id: 'contact', title: 'Контакты и исправления', description: 'Как сообщить об ошибке, устаревшей ссылке или проблеме доступности без передачи медицинских данных.' },
        ],
      },
    },
  },
  kk: {
    skipLink: 'Негізгі мазмұнға өту',
    primaryNavigation: 'Негізгі навигация',
    languageNavigation: 'Тілді таңдау',
    languageLabel: 'Тіл',
    homeLabel: 'Басты бет',
    eyebrow: 'Қазақстандағы отбасыларға арналған ақпараттық ресурс',
    title: 'Аутизм туралы — түсінікті, ұқыпты және дереккөздерге сүйене отырып',
    lead:
      'Ата-аналарға арналған тексерілетін ақпаратты бір жерге жинаймыз: негізгі білім, ғылыми түсіндірмелер, оқу және Қазақстандағы қолдау жөніндегі навигация.',
    heroPoints: ['Ең алдымен — ата-аналарға', 'Русский, қазақша және English', 'Дереккөздер және материалдарды тексеру күндері'],
    statusTitle: 'Бета-нұсқа.',
    statusText:
      'Материалдар мен бөлімдер дереккөздер мен аудармалар тексерілгеннен кейін біртіндеп қосылады.',
    heroPrimaryAction: 'Негізгі ақпараттан бастау',
    heroSecondaryAction: 'Ата-аналарға арналған материалдар',
    heroProfessionalAction: 'Мамандарға',
    exploreTitle: 'Сайттан не табасыз',
    exploreText:
      'Алты тұрақты бөлім отбасыларға арналған ақпаратты, жергілікті ресурстарды, ғылыми түсіндірмелерді және оқуды біріктіреді.',
    principlesTitle: 'Ақпаратпен қалай жұмыс істейміз',
    principlesText:
      'Әр материал үшін түсінікті түсіндіру, тексерілетін дереккөздер және көрінетін жаңарту күні қарастырылған.',
    principles: [
      { title: 'Түсінікті тіл', description: 'Қажетті терминдерді түсіндіреміз және практикалық қорытындыны ғылыми егжей-тегжейден ажыратамыз.' },
      { title: 'Тексерілетін дереккөздер', description: 'Бастапқы дереккөздерді, дәлел деңгейін, белгісіздікті және маңызды шектеулерді көрсетеміз.' },
      { title: 'Жаңарту күні', description: 'Материалдың қашан жарияланғанын, тексерілгенін және соңғы рет жаңартылғанын көрсетеміз.' },
      { title: 'Қазақстан контексті', description: 'Жергілікті ұйымдарды, құжаттарды, білім беру және әлеуметтік бағыттарды бөлек тексереміз.' },
    ],
    principlesBoundary:
      'Сайт диагноз қоймайды және кәсіби кеңесті алмастырмайды.',
    topicsTitle: 'Бөлім тақырыптары',
    topicsText: 'Бұл карта бөлімге қандай материалдар кіретінін көрсетеді. Жариялау мазмұн мен аудармалар тексерілгеннен кейін басталады.',
    sectionStatus: 'Материалдар дайындалып жатыр',
    sectionStatusText: 'Қазір құрылым мен редакциялық талаптар бекітілді. Тексерілмеген медициналық немесе жергілікті ақпарат жарияланбайды.',
    backHome: 'Басты бетке оралу',
    footerBoundary: 'Ақпараттық-білім беру ресурсы. Диагноз қоймайды және маман кеңесін алмастырмайды.',
    footerStatus: 'Техникалық нұсқа — мазмұндық материалдар әлі жарияланған жоқ.',
    footerNavigation: 'Жоба саясаты мен ақпараты',
    footerLinks: { editorial: 'Редакциялық саясат', privacy: 'Құпиялық және деректер', accessibility: 'Қолжетімділік', contact: 'Байланыс' },
    repositoryLabel: 'Жобаның GitHub репозиторийі',
    sections: {
      parents: {
        title: 'Ата-аналарға',
        description: 'Аутизм, даму, бағалау, күнделікті қолдау және отбасының әл-ауқаты туралы түсінікті ақпарат.',
        topics: [
          { id: 'autism-basics', title: 'Аутизм деген не', description: 'Негізгі ұғымдар, көріністердің әртүрлілігі, күшті жақтар және қолдау қажеттіліктері.' },
          { id: 'development', title: 'Баланың дамуы', description: 'Даму кезеңдері, жеке айырмашылықтар және маманмен талқылауға болатын жағдайлар.' },
          { id: 'assessment', title: 'Бағалау және қорытынды', description: 'Бақылау, скрининг, кешенді бағалау және клиникалық қорытындының айырмашылығы.' },
          { id: 'support', title: 'Қолдау тәсілдері', description: 'Мақсаттарды, дәлелдерді, қауіпсіздікті және баланың қажеттіліктеріне сәйкестікті бағалау.' },
          { id: 'daily-life', title: 'Отбасының күнделікті өмірі', description: 'Қарым-қатынас, сенсорлық қажеттіліктер, ұйқы, тамақтану, мектеп және жақындардың әл-ауқаты.' },
          { id: 'faq', title: 'Жиі қойылатын сұрақтар мен сөздік', description: 'Кең таралған сұрақтарға қысқа жауаптар және терминдерді стигмасыз түсіндіру.' },
        ],
      },
      research: {
        title: 'Ғылым қарапайым тілмен',
        description: 'Зерттеулерді түсіндіру: не зерттелді, қандай нәтиже алынды және қандай шектеулер маңызды.',
        topics: [
          { id: 'research-reviews', title: 'Жаңа зерттеулерге шолу', description: 'Әр жұмыстың сұрағы, әдістері, нәтижелері, шектеулері және практикалық маңызы.' },
          { id: 'reading-research', title: 'Зерттеуді қалай оқу керек', description: 'Зерттеу дизайны, іріктеме, себептілік, статистикалық белгісіздік және мүдделер қақтығысы.' },
          { id: 'causes-and-biology', title: 'Себептер және биология', description: 'Генетикалық, қоршаған орта және нейробиологиялық зерттеулерге сақ шолу.' },
          { id: 'support-evidence', title: 'Қолдау туралы дәлелдер', description: 'Әртүрлі тәсілдердің тиімділігі, қауіпсіздігі және қолданылуы туралы не белгілі.' },
          { id: 'kazakhstan-research', title: 'Қазақстандағы зерттеулер', description: 'Қазақстан мен Орталық Азияға қатысты жарияланымдар мен жобалар.' },
          { id: 'research-participation', title: 'Зерттеулерге қатысу', description: 'Болашақта — ұйымы, этикасы, критерийлері және қатысу шарттары ашық жобалар ғана.' },
        ],
      },
      'help-kazakhstan': {
        title: 'Қазақстандағы көмек',
        description: 'Қолдау жолдары туралы жалпы ақпарат және ұйымдар мен қызметтерге тексерілген сілтемелер.',
        topics: [
          { id: 'getting-help', title: 'Неден бастау керек', description: 'Жеке медициналық кеңессіз ықтимал қадамдар мен мемлекеттік дереккөздердің жалпы картасы.' },
          { id: 'assessment-support', title: 'Бағалау және сүйемелдеу', description: 'Мекемелер мен мамандардың түрлері, олардың рөлі және біліктілікті тексеру сұрақтары.' },
          { id: 'education', title: 'Балабақша және мектеп', description: 'Білім беру бағыттары, инклюзивті қолдау және ресми ақпарат көздері.' },
          { id: 'rights-benefits', title: 'Құқықтар және әлеуметтік қолдау', description: 'Мемлекеттік шаралар, құжаттар және міндетті тексеру күні бар сілтемелер.' },
          { id: 'organisations', title: 'Ұйымдар және қызметтер', description: 'Географиясы, көмек түрі және соңғы тексеру күні көрсетілген сыртқы сілтемелер.' },
          { id: 'service-checklist', title: 'Қызметті қалай тексеруге болады', description: 'Біліктілік, бағаның ашықтығы, дәлелдік мәлімдемелер, қауіпсіздік және шағымдар.' },
        ],
      },
      learning: {
        title: 'Оқу',
        description: 'Autism School Kazakhstan және ата-аналар мен мамандарға арналған іріктелген сыртқы курстар, дәрістер мен вебинарлар.',
        topics: [
          { id: 'autism-school', title: 'Autism School Kazakhstan', description: 'Мақсаттары мен жауапкершілігі нақты көрсетілген жобаның өз білім беру бағдарламасы.' },
          { id: 'parents-learning', title: 'Ата-аналарға', description: 'Аутизмді түсіну, баланы қолдау және отбасының әл-ауқаты туралы курстар мен дәрістер.' },
          { id: 'professionals-learning', title: 'Мамандарға', description: 'Аудиториясы мен ұйымдастырушы мәртебесі көрсетілген жеке оқу топтамасы.' },
          { id: 'events', title: 'Іс-шаралар және вебинарлар', description: 'Күні, форматы, тілі, құны, ұйымдастырушысы және бастапқы дереккөзге тікелей сілтеме.' },
          { id: 'external-courses', title: 'Сыртқы курстар', description: 'Жоба автоматты түрде мақұлдамайтын ресурстардың бейтарап карточкалары.' },
          { id: 'learning-checklist', title: 'Оқуды қалай таңдау керек', description: 'Бағдарламаны, оқытушылардың біліктілігін, тиімділік мәлімдемелерін және төлем шарттарын тексеру.' },
        ],
      },
      professionals: {
        title: 'Мамандарға',
        description: 'Дәлелдерді ескеретін материалдар және отбасылармен құрметпен жұмыс істеу қағидаттары.',
        topics: [
          { id: 'guidelines', title: 'Нұсқаулықтар мен стандарттар', description: 'Қолданылу саласы мен нұсқа күні көрсетілген тексерілген кәсіби құжаттар.' },
          { id: 'family-communication', title: 'Отбасылармен қарым-қатынас', description: 'Түсінікті ақпарат, бірлескен шешімдер және отбасы тәжірибесіне құрмет.' },
          { id: 'assessment-context', title: 'Бағалау контексті', description: 'Әртүрлі мамандардың рөлі, құралдардың шектеулері және сайт арқылы диагностикаға жол бермеу.' },
          { id: 'evidence-support', title: 'Дәлелге негізделген қолдау', description: 'Зерттеулер, кәсіби құзырет, адамның мақсаттары және отбасы контекстінің теңгерімі.' },
          { id: 'ethics', title: 'Этика және қауіпсіздік', description: 'Ақпараттандырылған келісім, құпиялық, тәуекелдерді басқару және орынсыз уәделер.' },
          { id: 'cpd', title: 'Оқу және іс-шаралар', description: 'Расталмаған жағдайда аккредитация туралы мәлімдемесіз курстар, вебинарлар және материалдар.' },
        ],
      },
      about: {
        title: 'Жоба туралы',
        description: 'Жобаның мақсаттары, редакциялық жауапкершілік, медициналық шекаралар, құпиялық және даму жоспары.',
        topics: [
          { id: 'mission', title: 'Миссия және бренд құрылымы', description: 'Central Asia Autism Hub, Autism Hub Kazakhstan және Autism School Kazakhstan.' },
          { id: 'editorial', title: 'Редакциялық саясат', description: 'Бір автор дереккөздерді, тексеруді, жаңартуларды, түзетулерді және жеке жауапкершілікті қалай тіркейді.' },
          { id: 'evidence-safety', title: 'Дәлелдік және медициналық қауіпсіздік', description: 'Ақпараттық ресурс шекаралары және медициналық мәлімдемелерге арналған ережелер.' },
          { id: 'privacy', title: 'Құпиялық және деректер', description: 'Сайт қандай жеке және медициналық деректерді жинамайды және иесіздендірілген аналитиканы қалай қолдана алады.' },
          { id: 'accessibility', title: 'Дизайн және қолжетімділік', description: 'WCAG 2.2 AA мақсаты, түсінікті тіл, пернетақта навигациясы және кедергілер туралы хабарлау.' },
          { id: 'contact', title: 'Байланыс және түзетулер', description: 'Медициналық деректерді жібермей қате, ескірген сілтеме немесе қолжетімділік мәселесі туралы хабарлау.' },
        ],
      },
    },
  },
  en: {
    skipLink: 'Skip to main content',
    primaryNavigation: 'Primary navigation',
    languageNavigation: 'Language selection',
    languageLabel: 'Language',
    homeLabel: 'Home',
    eyebrow: 'An information resource for families in Kazakhstan',
    title: 'Autism information — clear, careful, and grounded in sources',
    lead: 'We are bringing reliable information for parents into one place: core knowledge, research explainers, learning, and navigation to support in Kazakhstan.',
    heroPoints: ['Parents first', 'Русский, қазақша, and English', 'Sources and review dates for materials'],
    statusTitle: 'Beta version.',
    statusText: 'Materials and sections are being added progressively after source and translation checks.',
    heroPrimaryAction: 'Start with core information',
    heroSecondaryAction: 'Resources for parents',
    heroProfessionalAction: 'For professionals',
    exploreTitle: 'What you will find here',
    exploreText: 'Six permanent sections bring together information for families, local resources, research explainers, and learning.',
    principlesTitle: 'How we handle information',
    principlesText: 'Each material is designed to provide a clear explanation, verifiable sources, and a visible update date.',
    principles: [
      { title: 'Plain language', description: 'We explain necessary terms and separate practical meaning from scientific detail.' },
      { title: 'Verifiable sources', description: 'We identify primary sources, strength of evidence, uncertainty, and important limitations.' },
      { title: 'Update date', description: 'We show when material was published, checked, and most recently updated.' },
      { title: 'Kazakhstan context', description: 'We separately verify local organisations, documents, education, and social-support pathways.' },
    ],
    principlesBoundary:
      'The site does not diagnose autism or replace professional advice.',
    topicsTitle: 'Topics in this section',
    topicsText: 'This map shows the materials planned for the section. Publication will begin after content and translations have been checked.',
    sectionStatus: 'Materials are being prepared',
    sectionStatusText: 'The structure and editorial requirements are now defined. Unverified medical or local information is not published.',
    backHome: 'Return to the home page',
    footerBoundary: 'Information and education resource. It does not diagnose autism or replace professional advice.',
    footerStatus: 'Technical version — substantive materials have not yet been published.',
    footerNavigation: 'Project policies and information',
    footerLinks: { editorial: 'Editorial policy', privacy: 'Privacy and data', accessibility: 'Accessibility', contact: 'Contact' },
    repositoryLabel: 'Project repository on GitHub',
    sections: {
      parents: {
        title: 'For Parents',
        description: 'Clear information about autism, development, assessment, everyday support, and family wellbeing.',
        topics: [
          { id: 'autism-basics', title: 'What autism is', description: 'Core concepts, varied presentations, strengths, and support needs.' },
          { id: 'development', title: 'Child development', description: 'Developmental milestones, individual differences, and concerns to discuss with a professional.' },
          { id: 'assessment', title: 'Assessment and diagnosis', description: 'How observation, screening, comprehensive assessment, and a clinical diagnosis differ.' },
          { id: 'support', title: 'Approaches to support', description: 'How to consider goals, evidence, safety, and fit with a child’s needs.' },
          { id: 'daily-life', title: 'Everyday family life', description: 'Communication, sensory needs, sleep, eating, school, and family wellbeing.' },
          { id: 'faq', title: 'Frequently asked questions and glossary', description: 'Short answers to common questions and non-stigmatising explanations of terms.' },
        ],
      },
      research: {
        title: 'Research Explained',
        description: 'Research summaries covering what was studied, what was reported, and which limitations matter.',
        topics: [
          { id: 'research-reviews', title: 'New research explainers', description: 'The question, methods, findings, limitations, and practical meaning of each study.' },
          { id: 'reading-research', title: 'How to read research', description: 'Study design, sampling, causality, statistical uncertainty, and conflicts of interest.' },
          { id: 'causes-and-biology', title: 'Causes and biology', description: 'Cautious reviews of genetic, environmental, and neurobiological research without oversimplification.' },
          { id: 'support-evidence', title: 'Evidence about support', description: 'What is known about the effectiveness, safety, and applicability of different approaches.' },
          { id: 'kazakhstan-research', title: 'Research in Kazakhstan', description: 'Publications and projects relevant to Kazakhstan and Central Asia.' },
          { id: 'research-participation', title: 'Research participation', description: 'In future, only projects with transparent organisations, ethics, criteria, and participation terms.' },
        ],
      },
      'help-kazakhstan': {
        title: 'Help in Kazakhstan',
        description: 'General information about support pathways and verified links to relevant organisations and services.',
        topics: [
          { id: 'getting-help', title: 'Where to begin', description: 'A general map of possible steps and official sources, without individual medical advice.' },
          { id: 'assessment-support', title: 'Assessment and ongoing support', description: 'Types of services and professionals, their roles, and questions for checking qualifications.' },
          { id: 'education', title: 'Kindergarten and school', description: 'Education pathways, inclusive support, and official information sources.' },
          { id: 'rights-benefits', title: 'Rights and social support', description: 'State measures, documents, and links with a mandatory review date.' },
          { id: 'organisations', title: 'Organisations and services', description: 'Verified external links with location, support type, and the date last checked.' },
          { id: 'service-checklist', title: 'How to check a service', description: 'Qualifications, transparent costs, evidence claims, safety, and complaints processes.' },
        ],
      },
      learning: {
        title: 'Learning',
        description: 'Autism School Kazakhstan and selected external courses, lectures, and webinars for parents and professionals.',
        topics: [
          { id: 'autism-school', title: 'Autism School Kazakhstan', description: 'The project’s own learning programme, with clearly stated goals and responsibility.' },
          { id: 'parents-learning', title: 'For parents', description: 'Courses and lectures about understanding autism, supporting a child, and family wellbeing.' },
          { id: 'professionals-learning', title: 'For professionals', description: 'A separate learning selection with the audience and organiser status identified.' },
          { id: 'events', title: 'Events and webinars', description: 'Dates, format, language, price, organiser, and a direct link to the original source.' },
          { id: 'external-courses', title: 'External courses', description: 'Neutral resource cards without automatic endorsement by the project.' },
          { id: 'learning-checklist', title: 'How to choose learning', description: 'Checking the programme, educator qualifications, efficacy claims, and payment terms.' },
        ],
      },
      professionals: {
        title: 'For Professionals',
        description: 'A secondary section with evidence-informed resources and principles for respectful work with families.',
        topics: [
          { id: 'guidelines', title: 'Guidelines and standards', description: 'Verified professional documents with their scope and version date.' },
          { id: 'family-communication', title: 'Communication with families', description: 'Clear information, shared decisions, and respect for family experience.' },
          { id: 'assessment-context', title: 'Assessment context', description: 'Professional roles, limitations of tools, and why a website cannot diagnose.' },
          { id: 'evidence-support', title: 'Evidence-informed support', description: 'Balancing research, professional expertise, individual goals, and family context.' },
          { id: 'ethics', title: 'Ethics and safety', description: 'Informed consent, confidentiality, risk management, and unacceptable promises.' },
          { id: 'cpd', title: 'Learning and events', description: 'Courses, webinars, and resources without accreditation claims unless confirmed.' },
        ],
      },
      about: {
        title: 'About',
        description: 'Project purpose, editorial responsibility, medical boundaries, privacy, and future development.',
        topics: [
          { id: 'mission', title: 'Mission and brand structure', description: 'Central Asia Autism Hub, Autism Hub Kazakhstan, and Autism School Kazakhstan.' },
          { id: 'editorial', title: 'Editorial policy', description: 'How one author records sources, checks, updates, corrections, and personal responsibility.' },
          { id: 'evidence-safety', title: 'Evidence and medical safety', description: 'The boundaries of an information resource and rules for medical and therapeutic claims.' },
          { id: 'privacy', title: 'Privacy and data', description: 'Which personal and medical data the site does not collect and how anonymised analytics may be used.' },
          { id: 'accessibility', title: 'Design and accessibility', description: 'The WCAG 2.2 AA target, plain language, keyboard navigation, and reporting barriers.' },
          { id: 'contact', title: 'Contact and corrections', description: 'How to report an error, outdated link, or accessibility problem without sharing medical data.' },
        ],
      },
    },
  },
};

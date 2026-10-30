import type { Locale } from '../site.config';

/** Verified Kazakhstan and international online announcements only. Never publish unverified
 * dates, organisers, registration links or translations.
 * ISO dates follow the Asia/Almaty calendar; expiresOn is the final useful day.
 * The homepage suppresses expired records at build and on the visitor's device.
 */
export type AnnouncementKind = 'webinar' | 'event' | 'course' | 'announcement';
export type AnnouncementAudience = 'parents' | 'professionals' | 'everyone';
export type AnnouncementFormat = 'online' | 'in-person' | 'hybrid';
export type AnnouncementCost = 'free' | 'paid' | 'unknown';

export interface KazakhstanAnnouncement {
  id: string;
  kind: AnnouncementKind;
  audience: AnnouncementAudience;
  format: AnnouncementFormat;
  cost: AnnouncementCost;
  beginsOn: string;
  expiresOn: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  organiser: Record<Locale, string>;
  city?: Record<Locale, string>;
  sourceUrl: string;
  imageSrc: string;
  imageAlt: Record<Locale, string>;
  imageKind: 'official-brand' | 'organiser-logo' | 'organiser-image' | 'editorial-illustration' | 'owner-supplied-photo' | 'stock-photo';
  isPublished: boolean;
  sourceVerified: boolean;
}

/** Only published after verification against each organiser's primary source. */
export const KZ_ANNOUNCEMENTS: KazakhstanAnnouncement[] = [
  {
    id: 'divergent-autism-education-webinar-2026-10-27',
    kind: 'webinar',
    audience: 'everyone',
    format: 'online',
    cost: 'free',
    beginsOn: '2026-10-27',
    expiresOn: '2026-10-27',
    title: {
      ru: 'Аутизм и обучение: как сделать образование доступнее',
      kk: 'Аутизм және оқыту: білім беруді қалай қолжетімді етуге болады',
      en: 'Autism in Education: Learn, Teach and Thrive Differently',
    },
    summary: {
      ru: '27 октября, 16:00-17:00 по Казахстану. Онлайн-вебинар Nat Hawley об аутизме, обучении и доступной образовательной среде. Язык английский. Для бесплатного участия выберите билет Community Access на странице организатора.',
      kk: '27 қазан, Қазақстан уақытымен 16:00-17:00. Nat Hawley жүргізетін аутизм, оқу және қолжетімді білім беру ортасы туралы ағылшын тіліндегі онлайн вебинар. Тегін қатысу үшін ұйымдастырушы парақшасынан Community Access билетін таңдаңыз.',
      en: '27 October, 16:00-17:00 Kazakhstan time (UTC+5). Nat Hawley explores autism, learning and inclusive educational design. In English. Select the free Community Access ticket when registering.',
    },
    organiser: {
      ru: 'Divergent Thinking / Nat Hawley',
      kk: 'Divergent Thinking / Nat Hawley',
      en: 'Divergent Thinking / Nat Hawley',
    },
    sourceUrl: 'https://events.humanitix.com/autism-in-education-learn-teach-and-thrive-differently/tickets?dateId=6abc4bf147d5608a11f12bac',
    imageSrc: 'https://static.wixstatic.com/media/9f5551_ee88ccf4c3094f74bce74fae139da432~mv2.png',
    imageAlt: {
      ru: 'Официальный логотип Divergent Thinking. Не индивидуальная афиша вебинара.',
      kk: 'Divergent Thinking ұйымының ресми логотипі. Вебинардың жеке афишасы емес.',
      en: 'Official Divergent Thinking logo, not a dedicated webinar poster.',
    },
    imageKind: 'organiser-logo',
    isPublished: false,
    sourceVerified: true,
  },
  {
    id: 'twinkl-autism-girls-secondary-school-2026-10-28',
    kind: 'webinar',
    audience: 'professionals',
    format: 'online',
    cost: 'free',
    beginsOn: '2026-10-28',
    expiresOn: '2026-10-28',
    title: {
      ru: 'Аутизм у девочек в школе: позднее распознавание и поддержка',
      kk: 'Мектептегі қыз балалардағы аутизм: кеш анықтау және қолдау',
      en: 'Autism and Girls at Secondary School (Conduit Festival)',
    },
    summary: {
      ru: '28 октября, 21:00-23:00 по Казахстану. Бесплатный онлайн-фестиваль Twinkl TeachMeet для педагогов. Выступление Dr Catriona Stewart об аутизме у девочек запланировано на 22:00-23:00. Язык английский.',
      kk: '28 қазан, Қазақстан уақытымен 21:00-23:00. Педагогтерге арналған Twinkl TeachMeet тегін онлайн іс-шарасы. Dr Catriona Stewart қыз балалардағы аутизм туралы 22:00-23:00 аралығында баяндама жасайды. Тілі ағылшын.',
      en: '28 October, 21:00-23:00 Kazakhstan time (UTC+5). Free Twinkl TeachMeet online event for educators. Dr Catriona Stewart speaks about autism in girls from 22:00 to 23:00. In English.',
    },
    organiser: {
      ru: 'Twinkl TeachMeet',
      kk: 'Twinkl TeachMeet',
      en: 'Twinkl TeachMeet',
    },
    sourceUrl: 'https://www.twinkl.co.uk/events/teachmeet/Conduit-Festival-of-Learning-Day-Three',
    imageSrc: 'https://images.twinkl.co.uk/tw1n/image/private/t_630/image_repo/teach_events/teachmeet-fb-events-profile-image-1615892637.jpg',
    imageAlt: {
      ru: 'Официальный логотип Twinkl TeachMeet с изображением руки и лампы. Не индивидуальная афиша выступления.',
      kk: 'Қол мен шам бейнеленген Twinkl TeachMeet ресми логотипі. Баяндаманың жеке афишасы емес.',
      en: 'Official Twinkl TeachMeet logo showing a hand and a lightbulb, not a dedicated event poster.',
    },
    imageKind: 'organiser-logo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'uchmet-inclusive-learning-autism-2026-10-31',
    kind: 'webinar',
    audience: 'professionals',
    format: 'online',
    cost: 'free',
    beginsOn: '2026-10-31',
    expiresOn: '2026-10-31',
    title: {
      ru: 'Доступная образовательная среда для детей с аутизмом',
      kk: 'Аутизмі бар балаларға қолжетімді білім беру ортасын қалыптастыру',
      en: 'Creating an accessible learning environment for autistic children',
    },
    summary: {
      ru: '31 октября, 14:00-15:30 по Казахстану. Бесплатный прямой эфир «УчМет» на русском языке для педагогов и специалистов об особых образовательных потребностях детей с РАС. Сертификат и доступ к материалам предоставляются платно.',
      kk: '31 қазан, Қазақстан уақытымен 14:00-15:30. «УчМет» ұйымының аутизмі бар балалардың ерекше білім беру қажеттіліктері туралы орыс тіліндегі тегін онлайн вебинары. Сертификат пен материалдарға қол жеткізу ақылы.',
      en: '31 October, 14:00-15:30 Kazakhstan time (UTC+5). A free live Russian-language UchMet webinar for educators on accessible learning environments for autistic children. Certificates and access to materials cost extra.',
    },
    organiser: {
      ru: 'УчМет',
      kk: 'УчМет',
      en: 'UchMet',
    },
    sourceUrl: 'https://www.uchmet.ru/events/item/4197389/',
    imageSrc: 'https://www.uchmet.ru/imgs/uchmet/680x300.png',
    imageAlt: {
      ru: 'Официальный фирменный баннер образовательного портала «УчМет», не афиша конкретного вебинара.',
      kk: '«УчМет» білім беру порталының ресми фирмалық баннері, нақты вебинардың афишасы емес.',
      en: 'Official UchMet education portal banner, not a dedicated webinar poster.',
    },
    imageKind: 'organiser-logo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'beyim-preschool-inclusive-support-2026-10-19',
    kind: 'course',
    audience: 'professionals',
    format: 'online',
    cost: 'paid',
    beginsOn: '2026-10-19',
    expiresOn: '2026-10-19',
    title: {
      ru: 'Педагогическая поддержка дошкольников с особыми образовательными потребностями',
      kk: 'Ерекше білім беру қажеттіліктері бар мектепке дейінгі балаларға педагогикалық қолдау',
      en: 'Educational support for preschool children with special educational needs',
    },
    summary: {
      ru: 'Онлайн-курс Beyim Learn по работе в инклюзивной дошкольной среде. 80 академических часов; ближайшая заявленная группа стартует 19 октября. Стоимость и места уточняйте перед регистрацией.',
      kk: 'Beyim Learn платформасындағы инклюзивті мектепке дейінгі ортада жұмыс істеуге арналған 80 академиялық сағаттық онлайн курс. Келесі жарияланған топ 19 қазанда басталады. Бағасы мен бос орындарды тіркелу алдында нақтылаңыз.',
      en: 'An 80-academic-hour Beyim Learn online course on inclusive preschool education. The next advertised group starts on 19 October. Check price and availability before registering.',
    },
    organiser: { ru: 'Beyim Learn', kk: 'Beyim Learn', en: 'Beyim Learn' },
    sourceUrl: 'https://beyim.edu.kz/learn/inclusive-support-preschool-children-special-needs',
    imageSrc: 'images/events/beyim-preschool-user-photo.webp',
    imageAlt: {
      ru: 'Фотография, предоставленная пользователем: педагог помогает детям дошкольного возраста во время творческого занятия. Не фотография самого курса Beyim Learn.',
      kk: 'Пайдаланушы ұсынған сурет: педагог мектепке дейінгі балаларға шығармашылық сабақта көмектесуде. Beyim Learn курсының нақты фотосуреті емес.',
      en: 'User-provided photograph of a teacher helping preschool children during an art activity, not a photograph of the Beyim Learn course itself.',
    },
    imageKind: 'owner-supplied-photo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'tamyr-education-forum-2026-10-27',
    kind: 'event',
    audience: 'professionals',
    format: 'in-person',
    cost: 'free',
    beginsOn: '2026-10-27',
    expiresOn: '2026-10-27',
    title: {
      ru: 'Tamyr Education Forum 2026',
      kk: 'Tamyr Education Forum 2026',
      en: 'Tamyr Education Forum 2026',
    },
    summary: {
      ru: 'Форум об образовательном неравенстве, поддерживающей школьной среде и сотрудничестве образовательных инициатив. Участие бесплатное, нужна предварительная регистрация; количество мест ограничено.',
      kk: 'Білім берудегі теңсіздік, қолдаушы мектеп ортасы және білім беру бастамаларының серіктестігі туралы форум. Қатысу тегін, алдын ала тіркелу қажет; орын саны шектеулі.',
      en: 'A forum addressing educational inequality, supportive school environments and partnerships between education initiatives. Free participation with advance registration; places are limited.',
    },
    organiser: { ru: 'Tamyr Platform / EA Charity', kk: 'Tamyr Platform / EA Charity', en: 'Tamyr Platform / EA Charity' },
    city: { ru: 'Алматы, Narxoz Business School', kk: 'Алматы, Narxoz Business School', en: 'Almaty, Narxoz Business School' },
    sourceUrl: 'https://tamyrplatform.com/blog/registraciya-tamyr-education-forum-2026/',
    imageSrc: 'https://tamyrplatform.com/app/uploads/2026/07/group-18739.png',
    imageAlt: {
      ru: 'Официальный графический знак Tamyr Education Forum 2026.',
      kk: 'Tamyr Education Forum 2026 ресми графикалық белгісі.',
      en: 'Official Tamyr Education Forum 2026 wordmark.',
    },
    imageKind: 'official-brand',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'satr-inclusive-education-conference-2026-10-29',
    kind: 'event',
    audience: 'everyone',
    format: 'hybrid',
    cost: 'free',
    beginsOn: '2026-10-29',
    expiresOn: '2026-10-30',
    title: {
      ru: 'Конференция Центра САТР: инклюзивное образование и междисциплинарная поддержка',
      kk: 'САТР орталығының конференциясы: инклюзивті білім және пәнаралық қолдау',
      en: 'SATR Centre conference: inclusive education and interdisciplinary support',
    },
    summary: {
      ru: 'Международная конференция о включении детей с инвалидностью в образование, ранней поддержке и взаимодействии специалистов. Очное участие по регистрации; также анонсированы прямые трансляции.',
      kk: 'Мүгедектігі бар балалардың білімге қатысуы, ерте қолдау және мамандардың өзара әрекеттестігі туралы халықаралық конференция. Офлайн қатысуға тіркелу қажет; тікелей эфир де жоспарланған.',
      en: 'An international conference on inclusion in education, early support and cross-disciplinary cooperation. Registration is required for in-person attendance; live streams are also announced.',
    },
    organiser: { ru: 'Центр САТР', kk: 'САТР орталығы', en: 'SATR Centre' },
    city: { ru: 'Алматы, LuxHall', kk: 'Алматы, LuxHall', en: 'Almaty, LuxHall' },
    sourceUrl: 'https://conference-satr.kz/',
    imageSrc: 'images/events/satr-logo.svg',
    imageAlt: {
      ru: 'Логотип Центра САТР: голубой орнамент с зелёным растением и надписью «САТР».',
      kk: 'САТР орталығының логотипі: жасыл өсімдік бейнеленген көгілдір өрнек және «САТР» жазуы.',
      en: 'SATR Centre logo with a blue ornamental design, green plant motif and SATR lettering.',
    },
    imageKind: 'organiser-logo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'astana-aba-specialist-course-2026-10-31',
    kind: 'course',
    audience: 'professionals',
    format: 'in-person',
    cost: 'paid',
    beginsOn: '2026-10-31',
    expiresOn: '2026-11-08',
    title: {
      ru: 'Обучение ABA для специалистов: очный курс в Астане',
      kk: 'Мамандарға арналған ABA оқуы: Астанадағы офлайн курс',
      en: 'ABA training for professionals: in-person course in Astana',
    },
    summary: {
      ru: '31 октября - 8 ноября, Астана, центр Balance. Очный курс ABA-школы Юлии Эрц по принципам и методам прикладного анализа поведения, включая работу с детьми с аутизмом. Стоимость по странице организатора - 600 евро. Наличие мест и условия участия уточняйте при регистрации.',
      kk: '31 қазан - 8 қараша, Астана, Balance орталығы. Юлия Эрцтің ABA мектебі өткізетін мінез-құлықты қолданбалы талдау әдістері бойынша офлайн курс, оның ішінде аутизмі бар балалармен жұмыс істеу тақырыптары қамтылады. Ұйымдастырушы көрсеткен баға - 600 еуро. Орындар мен қатысу шарттарын тіркелу кезінде нақтылаңыз.',
      en: '31 October - 8 November, Astana, Balance centre. An in-person ABA School of Yulia Erts course on applied behaviour analysis, including topics relevant to supporting autistic children. Organiser-listed price: €600. Confirm places and participation terms before registering.',
    },
    organiser: { ru: 'ABA-школа Юлии Эрц', kk: 'Юлия Эрцтің ABA мектебі', en: 'ABA School of Yulia Erts' },
    city: { ru: 'Астана, центр Balance', kk: 'Астана, Balance орталығы', en: 'Astana, Balance centre' },
    sourceUrl: 'https://aba-kurs.com/services/course/106268/',
    imageSrc: 'images/editorial/photos/parent-task-analysis-notes.jpg',
    imageAlt: {
      ru: 'Стоковая фотография Pexels: канцелярские принадлежности на зелёной поверхности. Иллюстрация обучения, не фотография курса в Астане.',
      kk: 'Pexels сток фотосуреті: жасыл беттегі кеңсе құралдары. Оқу тақырыбына арналған, Астанадағы курстың фотосуреті емес.',
      en: 'Pexels stock photo of stationery on a green surface, illustrating learning and not the actual Astana course.',
    },
    imageKind: 'stock-photo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'almaty-sensory-integration-training-2026-11-14',
    kind: 'event',
    audience: 'professionals',
    format: 'in-person',
    cost: 'unknown',
    beginsOn: '2026-11-14',
    expiresOn: '2026-11-15',
    title: {
      ru: 'Сенсорная интеграция: семинар для коррекционных педагогов в Алматы',
      kk: 'Сенсорлық интеграция: Алматыдағы арнайы педагогтерге арналған семинар',
      en: 'Sensory integration: a workshop for special educators in Almaty',
    },
    summary: {
      ru: '14-15 ноября, Алматы. Практический семинар центра «Умай», модуль 1: вводные сведения о сенсорной обработке, обсуждение практических упражнений и работы с оборудованием. Стоимость, адрес и наличие мест уточняйте непосредственно у организатора. Анонс не является рекомендацией метода лечения.',
      kk: '14-15 қараша, Алматы. «Умай» орталығы ұйымдастыратын тәжірибелік семинардың бірінші модулі: сенсорлық өңдеу туралы кіріспе мәлімет, жаттығулар мен құрал-жабдықтарды қолдану мәселелері. Бағасын, нақты мекенжайын және бос орындарды ұйымдастырушыдан нақтылаңыз. Бұл хабарландыру емдеу әдісін ұсыну болып саналмайды.',
      en: '14-15 November, Almaty. Module 1 of a practical Umai Centre seminar introducing sensory processing, exercises and equipment-based activities. Confirm the price, exact venue and available places with the organiser. Listing the event is not an endorsement of a treatment approach.',
    },
    organiser: { ru: 'Центр «Умай»', kk: '«Умай» орталығы', en: 'Umai Centre' },
    city: { ru: 'Алматы', kk: 'Алматы', en: 'Almaty' },
    sourceUrl: 'https://www.umai-center.kz/services/training/sensory-integration-almaty-november-2026',
    imageSrc: 'images/editorial/photos/parent-sensory-headphones.jpg',
    imageAlt: {
      ru: 'Стоковая фотография Pexels: наушники и предметы для сенсорных занятий. Тематическое изображение, не фотография семинара.',
      kk: 'Pexels сток фотосуреті: құлаққап пен сенсорлық сабақтарға арналған заттар. Тақырыптық сурет, семинар фотосуреті емес.',
      en: 'Pexels stock photo of headphones and sensory objects, an illustrative image rather than a photograph of the seminar.',
    },
    imageKind: 'stock-photo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'ari-multimodal-hand-gestures-2026-11-18',
    kind: 'webinar',
    audience: 'everyone',
    format: 'online',
    cost: 'free',
    beginsOn: '2026-11-18',
    expiresOn: '2026-11-18',
    title: {
      ru: 'Жесты и речь: поддержка коммуникации у нейроотличных людей',
      kk: 'Ым-ишара мен сөйлеу: нейроәртүрлі адамдардың қарым-қатынасын қолдау',
      en: 'Hand gestures and speech: supporting language development in neurodiverse people',
    },
    summary: {
      ru: 'Бесплатный вебинар Autism Research Institute на английском языке. Исследования восприятия речи и жестов с использованием отслеживания взгляда и ЭЭГ. Регистрация на сайте организатора.',
      kk: 'Autism Research Institute ұйымдастыратын ағылшын тіліндегі тегін вебинар. Көз қозғалысын бақылау және ЭЭГ арқылы сөйлеу мен ым-ишараны қабылдау зерттеулері. Тіркелу ұйымдастырушы сайтында.',
      en: 'A free English-language Autism Research Institute webinar on speech and gesture comprehension, including eye-tracking and EEG research. Register with the organiser.',
    },
    organiser: {
      ru: 'Autism Research Institute',
      kk: 'Autism Research Institute',
      en: 'Autism Research Institute',
    },
    sourceUrl: 'https://autism.org/webinar/using-multimodal-communication-with-hand-gestures-to-support-language-development-in-neurodiverse-individuals/',
    imageSrc: 'images/editorial/photos/event-ari-gestures-sign-language.jpg',
    imageAlt: {
      ru: 'Стоковая фотография Pexels: крупный план рук, выполняющих жесты. Тематическая иллюстрация коммуникации, не официальная афиша вебинара.',
      kk: 'Pexels сток фотосуреті: ым-ишара жасап тұрған қолдар. Қарым-қатынас тақырыбына арналған, ұйымдастырушының ресми афишасы емес.',
      en: 'Pexels stock photograph of hands making sign-language gestures; used to illustrate communication, not as the official event banner.',
    },
    imageKind: 'stock-photo',
    isPublished: true,
    sourceVerified: true,
  },
  {
    id: 'ari-gi-symptoms-behavior-2026-12-02',
    kind: 'webinar',
    audience: 'everyone',
    format: 'online',
    cost: 'free',
    beginsOn: '2026-12-02',
    expiresOn: '2026-12-02',
    title: {
      ru: 'Аутизм и желудочно-кишечные симптомы: обзор исследований 2026 года',
      kk: 'Аутизм және асқазан-ішек белгілері: 2026 жылғы зерттеулерге шолу',
      en: '2026 research updates: gastrointestinal symptoms and behavior in autism',
    },
    summary: {
      ru: 'Бесплатный вебинар Autism Research Institute на английском языке. Исследователь Bradley Ferguson представит новые данные о связи желудочно-кишечных симптомов и поведения при аутизме.',
      kk: 'Autism Research Institute ұйымдастыратын ағылшын тіліндегі тегін вебинар. Зерттеуші Bradley Ferguson аутизмдегі асқазан-ішек белгілері мен мінез-құлықтың байланысы туралы деректерді талқылайды.',
      en: 'A free English-language Autism Research Institute webinar. Researcher Bradley Ferguson discusses emerging findings on gastrointestinal symptoms and behavior in autism.',
    },
    organiser: {
      ru: 'Autism Research Institute',
      kk: 'Autism Research Institute',
      en: 'Autism Research Institute',
    },
    sourceUrl: 'https://autism.org/webinar/2026-research-updates-gi-symptoms-behavior/',
    imageSrc: 'images/editorial/photos/event-ari-gi-anatomical-model.jpg',
    imageAlt: {
      ru: 'Стоковая фотография Pexels: учебная анатомическая модель с органами пищеварения. Не официальная афиша вебинара.',
      kk: 'Pexels сток фотосуреті: ас қорыту мүшелері көрсетілген анатомиялық оқу моделі. Ұйымдастырушының ресми афишасы емес.',
      en: 'Pexels stock photograph of an educational anatomical model showing digestive organs, not the organiser’s official event banner.',
    },
    imageKind: 'stock-photo',
    isPublished: true,
    sourceVerified: true,
  },
];

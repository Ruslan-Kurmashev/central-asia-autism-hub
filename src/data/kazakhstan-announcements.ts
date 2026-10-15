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

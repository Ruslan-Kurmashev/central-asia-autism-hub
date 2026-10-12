import type { Locale } from '../site.config';

export type LocalizedText = Record<Locale, string>;
export type KazakhstanDocumentGroupId =
  | 'education-support'
  | 'healthcare-diagnosis'
  | 'psychological-practice'
  | 'social-support'
  | 'rights-and-data';

export type PlannedKazakhstanDocument = {
  id: string;
  title: LocalizedText;
  priority: 'P0' | 'P1' | 'P2';
  // Connect a real published article by using this translationKey in its
  // content frontmatter. Never generate a link from an editorial-plan title.
  translationKey: string;
};

export type KazakhstanDocumentGroup = {
  id: KazakhstanDocumentGroupId;
  icon: 'education' | 'healthcare' | 'psychology' | 'social' | 'rights';
  title: LocalizedText;
  description: LocalizedText;
  documents: PlannedKazakhstanDocument[];
};

const document = (id: string, priority: PlannedKazakhstanDocument['priority'], ru: string, kk: string, en: string): PlannedKazakhstanDocument => ({
  id, priority, title: { ru, kk, en }, translationKey: 'professionals-kz-' + id,
});

// This is an editorial publication roadmap, NOT a register of currently valid
// legislation. Check current validity, date, official Adilet record and scope
// individually before publishing any document-specific article.
export const kazakhstanDocumentGroups: KazakhstanDocumentGroup[] = [
  {
    id: 'education-support',
    icon: 'education',
    title: {
      ru: 'Образование и психолого-педагогическая поддержка',
      kk: 'Білім беру және психологиялық-педагогикалық қолдау',
      en: 'Education and psycho-pedagogical support',
    },
    description: {
      ru: 'Образовательные потребности, ПМПК, сопровождение в школе, специальные условия и организация поддержки.',
      kk: 'Білім беру қажеттіліктерін бағалау, ПМПК, мектептегі сүйемелдеу, арнайы жағдайлар мен қолдау.',
      en: 'Educational needs, assessment commissions, school support, accommodations and services.',
    },
    documents: [
      document('education-law','P0','Закон РК «Об образовании» № 319-III','ҚР «Білім туралы» заңы № 319-III','Law on Education No. 319-III'),
      document('education-needs-order-4','P0','Приказ № 4: оценка особых образовательных потребностей','№ 4 бұйрық: ерекше білім беру қажеттіліктерін бағалау','Order No. 4: assessment of special educational needs'),
      document('school-support-order-92','P0','Приказ № 92: служба психолого-педагогического сопровождения','№ 92 бұйрық: психологиялық-педагогикалық қолдау қызметі','Order No. 92: psycho-pedagogical support service'),
      document('special-support-standard-117','P0','Приказ № 117: стандарт специальной психолого-педагогической поддержки','№ 117 бұйрық: арнайы психологиялық-педагогикалық қолдау стандарты','Order No. 117: special psycho-pedagogical support standard'),
      document('education-organisations-order-385','P0','Приказ № 385: типовые правила деятельности организаций образования','№ 385 бұйрық: білім беру ұйымдары қызметінің үлгілік қағидалары','Order No. 385: standard rules for educational organisations'),
      document('pmpk-services-rules','P0','Правила оказания услуг психолого-медико-педагогической консультации (ПМПК)','Психологиялық-медициналық-педагогикалық консультация (ПМПК) қызметтері қағидалары','Rules for psycho-medical-pedagogical consultation services'),
      document('psychological-support-centres-264','P1','Приказ № 264: центры психологической поддержки','№ 264 бұйрық: психологиялық қолдау орталықтары','Order No. 264: psychological support centres'),
      document('special-support-state-order-532','P1','Приказ № 532: государственный образовательный заказ на специальную поддержку','№ 532 бұйрық: арнайы қолдауға мемлекеттік білім беру тапсырысы','Order No. 532: public procurement of special educational support'),
    ],
  },
  {
    id: 'healthcare-diagnosis',
    icon: 'healthcare',
    title: {
      ru: 'Здравоохранение, раннее выявление и диагностика',
      kk: 'Денсаулық сақтау, ерте анықтау және диагностика',
      en: 'Healthcare, early identification and diagnosis',
    },
    description: {
      ru: 'Педиатрическая помощь, профилактические осмотры, психическое здоровье и клинические маршруты.',
      kk: 'Педиатриялық көмек, профилактикалық қарап-тексеру, психикалық денсаулық және клиникалық бағыттау.',
      en: 'Paediatric care, preventive assessments, mental health and clinical care pathways.',
    },
    documents: [
      document('health-code-360','P0','Кодекс РК «О здоровье народа и системе здравоохранения» № 360-VI','ҚР «Халық денсаулығы және денсаулық сақтау жүйесі туралы» кодексі № 360-VI','Health Code No. 360-VI'),
      document('paediatric-care-standard-11','P0','Приказ № 11: стандарт организации педиатрической помощи','№ 11 бұйрық: педиатриялық көмекті ұйымдастыру стандарты','Order No. 11: standard for paediatric care'),
      document('mental-health-standard-224','P0','Приказ № ҚР ДСМ-224/2020: помощь в области психического здоровья','№ ҚР ДСМ-224/2020 бұйрық: психикалық денсаулық саласындағы көмек','Order No. ҚР ДСМ-224/2020: mental healthcare services'),
      document('preventive-examinations-264','P1','Приказ № ҚР ДСМ-264/2020: профилактические медицинские осмотры','№ ҚР ДСМ-264/2020 бұйрық: профилактикалық медициналық қарап-тексеру','Order No. ҚР ДСМ-264/2020: preventive medical examinations'),
      document('autism-clinical-protocol','P0','Клинический протокол «Аутизм»: проверка актуальной редакции','«Аутизм» клиникалық хаттамасы: қолданыстағы редакциясын тексеру','Autism clinical protocol: current-version verification required'),
    ],
  },
  {
    id: 'psychological-practice',
    icon: 'psychology',
    title: {
      ru: 'Психологическая деятельность и профессиональная квалификация',
      kk: 'Психологиялық қызмет және кәсіби біліктілік',
      en: 'Psychological practice and professional qualifications',
    },
    description: {
      ru: 'Правовые рамки психологической деятельности, квалификация специалистов и профессиональные обязанности.',
      kk: 'Психологиялық қызметтің құқықтық негіздері, мамандардың біліктілігі мен кәсіби міндеттері.',
      en: 'Legal scope of psychological practice, professional qualifications and responsibilities.',
    },
    documents: [
      document('psychological-activity-law-332','P0','Закон РК «О психологической деятельности» № 332-VIII','ҚР «Психологиялық қызмет туралы» заңы № 332-VIII','Law on Psychological Practice No. 332-VIII'),
      document('teacher-qualifications-order-338','P1','Приказ № 338: квалификационные характеристики педагогов','№ 338 бұйрық: педагогтер лауазымдарының біліктілік сипаттамалары','Order No. 338: qualification requirements for education professionals'),
      document('teacher-status-law-293','P1','Закон РК «О статусе педагога» № 293-VI','ҚР «Педагог мәртебесі туралы» заңы № 293-VI','Law on the Status of Teachers No. 293-VI'),
    ],
  },
  {
    id: 'social-support',
    icon: 'social',
    title: {
      ru: 'Социальная поддержка, инвалидность и межведомственные услуги',
      kk: 'Әлеуметтік қолдау, мүгедектік және ведомствоаралық қызметтер',
      en: 'Social support, disability and interagency services',
    },
    description: {
      ru: 'Социальные услуги, медико-социальная экспертиза, коррекционная поддержка и координация ведомств.',
      kk: 'Әлеуметтік қызметтер, медициналық-әлеуметтік сараптама, түзете қолдау және ведомстволардың өзара іс-қимылы.',
      en: 'Social services, disability assessment, developmental support and interagency coordination.',
    },
    documents: [
      document('child-correction-support-law-343','P0','Закон № 343: социальная и медико-педагогическая коррекционная поддержка детей','№ 343 заң: балаларды әлеуметтік және медициналық-педагогикалық түзете қолдау','Law No. 343: social and medico-pedagogical support for children'),
      document('social-code-224','P1','Социальный кодекс РК № 224-VII','ҚР Әлеуметтік кодексі № 224-VII','Social Code No. 224-VII'),
      document('disability-assessment-order-260','P1','Приказ № 260: правила медико-социальной экспертизы','№ 260 бұйрық: медициналық-әлеуметтік сараптама қағидалары','Order No. 260: medical and social disability assessment'),
      document('social-service-joint-order','P1','Совместный приказ № 49/54/7: стандарты социального обслуживания','№ 49/54/7 бірлескен бұйрық: әлеуметтік қызмет көрсету стандарттары','Joint Order No. 49/54/7: social service standards'),
      document('special-social-services-order-165','P1','Приказ № 165: специальные социальные услуги в сфере образования','№ 165 бұйрық: білім беру саласындағы арнаулы әлеуметтік қызметтер','Order No. 165: specialised social services in education'),
    ],
  },
  {
    id: 'rights-and-data',
    icon: 'rights',
    title: {
      ru: 'Права человека, персональные данные и инклюзивная политика',
      kk: 'Адам құқықтары, дербес деректер және инклюзивті саясат',
      en: 'Human rights, personal data and inclusive policy',
    },
    description: {
      ru: 'Права ребёнка, защита персональных данных, доступность и государственные меры по инклюзии.',
      kk: 'Бала құқықтары, дербес деректерді қорғау, қолжетімділік және инклюзивті саясат шаралары.',
      en: 'Children’s rights, data protection, accessibility and national inclusion policy.',
    },
    documents: [
      document('children-rights-law-345','P0','Закон РК «О правах ребенка» № 345-II','ҚР «Қазақстан Республикасындағы баланың құқықтары туралы» заңы № 345-II','Law on the Rights of the Child No. 345-II'),
      document('personal-data-law-94','P0','Закон РК «О персональных данных и их защите» № 94-V','ҚР «Дербес деректер және оларды қорғау туралы» заңы № 94-V','Law on Personal Data and Its Protection No. 94-V'),
      document('disability-convention-ratification-288','P1','Закон № 288-V: ратификация Конвенции о правах инвалидов','№ 288-V заң: Мүгедектердің құқықтары туралы конвенцияны ратификациялау','Law No. 288-V: ratification of the Convention on the Rights of Persons with Disabilities'),
      document('inclusion-policy-2025-2030','P2','Концепция инклюзивной политики Казахстана на 2025–2030 годы','Қазақстанның 2025–2030 жылдарға арналған инклюзивті саясат тұжырымдамасы','Kazakhstan Inclusive Policy Concept 2025–2030'),
    ],
  },
];

export const kazakhstanDocumentCount = kazakhstanDocumentGroups.reduce((sum, group) => sum + group.documents.length, 0);


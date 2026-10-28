import type { Locale } from '../site.config';

export interface TeamMember {
  id: string;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  profile: Record<Locale, string[]>;
  initials: Record<Locale, string>;
  photo?: string;
  photoAlt?: Record<Locale, string>;
  confirmed: boolean;
  publicProfileApproved: boolean;
}

/**
 * Display only confirmed project team members with an approved public profile.
 * Authors, advisers and independent reviewers are not core team members by default.
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ruslan-kurmashev',
    name: { ru: 'Руслан Курмашев MD, MSc', kk: 'Руслан Курмашев MD, MSc', en: 'Ruslan Kurmashev MD, MSc' },
    role: {
      ru: 'Основатель AutismHub',
      kk: 'AutismHub негізін қалаушы',
      en: 'Founder of AutismHub',
    },
    profile: {
      ru: [
        'Врач по образованию, магистр вычислительной биологии (Munster Technological University, Ирландия).',
        'Окончил Казахский национальный медицинский университет имени С. Д. Асфендиярова, прошёл подготовку по общей врачебной практике.',
        'Имеет практический опыт нейрореабилитации детей с особенностями развития. Является внештатным координатором по вопросам диагностики аутизма при Министерстве здравоохранения Республики Казахстан.',
        'Автор научных публикаций, посвящённых раннему выявлению аутизма и его биологическим механизмам.',
        'Создал AutismHub, чтобы сделать научно обоснованную информацию об аутизме более понятной и доступной для родителей и специалистов в Казахстане.',
      ],
      kk: [
        'Білімі бойынша дәрігер, есептеу биологиясы саласының магистрі (Munster Technological University, Ирландия).',
        'С. Д. Асфендияров атындағы Қазақ ұлттық медицина университетін бітіріп, жалпы дәрігерлік практика бойынша даярлықтан өткен.',
        'Даму ерекшеліктері бар балалардың нейрооңалту саласында практикалық тәжірибесі бар. Қазақстан Республикасы Денсаулық сақтау министрлігі жанындағы аутизмді диагностикалау мәселелері бойынша штаттан тыс үйлестіруші.',
        'Аутизмді ерте анықтау мен оның биологиялық механизмдеріне арналған ғылыми жарияланымдардың авторы.',
        'AutismHub жобасын Қазақстандағы ата-аналар мен мамандарға аутизм туралы ғылыми негізделген ақпаратты түсінікті әрі қолжетімді ету үшін құрды.',
      ],
      en: [
        'Medical doctor by training and a master’s graduate in computational biology (Munster Technological University, Ireland).',
        'Graduated from Asfendiyarov Kazakh National Medical University and completed general practice training.',
        'Has practical experience in neurorehabilitation for children with developmental differences. Serves as an external coordinator on autism diagnosis matters affiliated with the Ministry of Health of the Republic of Kazakhstan.',
        'Author of scientific publications on early autism identification and its biological mechanisms.',
        'Founded AutismHub to make scientifically grounded information about autism clearer and more accessible to parents and professionals in Kazakhstan.',
      ],
    },
    initials: { ru: 'РК', kk: 'РК', en: 'RK' },
    photo: '/central-asia-autism-hub/images/team/ruslan-kurmashev.webp',
    photoAlt: {
      ru: 'Портрет Руслана Курмашева',
      kk: 'Руслан Курмашевтің портреті',
      en: 'Portrait of Ruslan Kurmashev',
    },
    confirmed: true,
    publicProfileApproved: true,
  },  {
    id: 'adina-yessimova',
    name: { ru: 'Адина Есимова MD', kk: 'Адина Есимова MD', en: 'Adina Yessimova MD' },
    role: {
      ru: 'Специалист по медицине и аналитике данных',
      kk: 'Медицина және деректерді талдау маманы',
      en: 'Medical and Data Analytics Specialist',
    },
    profile: {
      ru: [
        'Врач по образованию, специалист в области анализа медицинских данных и искусственного интеллекта.',
        'Окончила Казахский национальный медицинский университет имени С. Д. Асфендиярова. Получила квалификацию Higher Diploma in Data Analytics в City Colleges (Дублин, Ирландия).',
        'Имеет опыт клинической работы, анализа данных и оценки качества систем искусственного интеллекта. Работала над вопросами инклюзивной коммуникации и адаптации взаимодействия с детьми с особенностями развития.',
        'Участвовала в исследовательской работе по применению машинного обучения к данным, связанным с аутизмом.',
        'В AutismHub занимается подготовкой и развитием информационных материалов, объединяя медицинские знания с современными методами анализа данных.',
      ],
      kk: [
        'Білімі бойынша дәрігер, медициналық деректерді талдау және жасанды интеллект саласының маманы.',
        'С. Д. Асфендияров атындағы Қазақ ұлттық медицина университетін бітірген. Ирландияның Дублин қаласындағы City Colleges оқу орнында Data Analytics мамандығы бойынша Higher Diploma біліктілігін алған.',
        'Клиникалық жұмыс, деректерді талдау және жасанды интеллект жүйелерінің сапасын бағалау тәжірибесі бар. Даму ерекшеліктері бар балалармен инклюзивті қарым-қатынас пен өзара әрекеттесу тәсілдерін бейімдеу бағытында жұмыс істеген.',
        'Аутизмге қатысты деректерге машиналық оқытуды қолдану жөніндегі зерттеу жұмысына қатысқан.',
        'AutismHub жобасында медициналық білім мен деректерді талдау тәсілдерін біріктіріп, ақпараттық материалдарды дайындауға және дамытуға қатысады.',
      ],
      en: [
        'Medical doctor by training, specialising in healthcare data analytics and artificial intelligence.',
        'Graduated from Asfendiyarov Kazakh National Medical University and earned a Higher Diploma in Data Analytics from City Colleges, Dublin, Ireland.',
        'Has experience in clinical care, data analysis and evaluating the quality of AI systems. Has worked on inclusive communication and adapting interactions for children with developmental differences.',
        'Contributed to research applying machine learning to autism-related datasets.',
        'At AutismHub, helps develop accessible educational resources by bringing together medical knowledge and data analytics.',
      ],
    },
    initials: { ru: 'АЕ', kk: 'АЕ', en: 'AY' },
    photo: '/central-asia-autism-hub/images/team/adina-yessimova.webp',
    photoAlt: {
      ru: 'Портрет Адины Есимовой',
      kk: 'Адина Есимованың портреті',
      en: 'Portrait of Adina Yessimova',
    },
    confirmed: true,
    publicProfileApproved: true,
  },
  {
    id: 'nikolai-belous',
    name: { ru: 'Николай Белоус', kk: 'Николай Белоус', en: 'Nikolai Belous' },
    role: {
      ru: 'Специалист по инженерии данных и цифровой инфраструктуре',
      kk: 'Деректер инженериясы және цифрлық инфрақұрылым маманы',
      en: 'Data Engineering and Digital Infrastructure Specialist',
    },
    profile: {
      ru: [
        'Инженер данных с опытом разработки аналитических систем, обработки больших массивов данных и автоматизации процессов.',
        'Окончил Национальный исследовательский университет «МИЭТ» (Россия) по направлению «Электроника и наноэлектроника».',
        'Имеет опыт создания хранилищ медицинских данных и работы с Python, SQL, Apache Spark и ETL/ELT-процессами.',
        'Имеет опыт в исследовательских проектах, связанных с аутизмом и цифровой поддержкой семей.',
        'В AutismHub будет отвечать за развитие технической инфраструктуры, автоматизацию процессов и внедрение цифровых инструментов.',
      ],
      kk: [
        'Талдау жүйелерін әзірлеу, үлкен көлемдегі деректерді өңдеу және жұмыс үдерістерін автоматтандыру тәжірибесі бар деректер инженері.',
        'Ресейдегі «МИЭТ» Ұлттық зерттеу университетін «Электроника және наноэлектроника» мамандығы бойынша бітірген.',
        'Медициналық деректер қоймаларын құру және Python, SQL, Apache Spark, ETL/ELT үдерістерімен жұмыс істеу тәжірибесі бар.',
        'Аутизмге және отбасыларды цифрлық қолдауға қатысты зерттеу жобаларында жұмыс істеу тәжірибесі бар.',
        'AutismHub жобасында техникалық инфрақұрылымды дамытуға, үдерістерді автоматтандыруға және цифрлық құралдарды енгізуге жауапты болады.',
      ],
      en: [
        'Data engineer experienced in developing analytical systems, processing large datasets, and automating workflows.',
        'Graduated from the National Research University of Electronic Technology (MIET), Russia, with a degree in Electronics and Nanoelectronics.',
        'Has experience building medical data warehouses and working with Python, SQL, Apache Spark, and ETL/ELT pipelines.',
        'Has experience in research projects related to autism and digital support for families.',
        'At AutismHub, will be responsible for developing technical infrastructure, automating workflows, and implementing digital tools.',
      ],
    },
    initials: { ru: 'НБ', kk: 'НБ', en: 'NB' },
    photo: '/central-asia-autism-hub/images/team/nikolai-belous.webp',
    photoAlt: {
      ru: 'Портрет Николая Белоуса',
      kk: 'Николай Белоустың портреті',
      en: 'Portrait of Nikolai Belous',
    },
    confirmed: true,
    publicProfileApproved: true,
  },

];

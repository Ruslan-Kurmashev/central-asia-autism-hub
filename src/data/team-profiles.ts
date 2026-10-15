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
    name: { ru: 'Руслан Курмашев', kk: 'Руслан Курмашев', en: 'Ruslan Kurmashev' },
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
  },
];

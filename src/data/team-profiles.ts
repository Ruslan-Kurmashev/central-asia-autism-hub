import type { Locale } from '../site.config';

export interface TeamMember {
  id: string;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  profile: Record<Locale, string>;
  responsibilities: Record<Locale, string[]>;
  initials: Record<Locale, string>;
  photo?: string;
  photoAlt?: Record<Locale, string>;
  confirmed: boolean;
  publicProfileApproved: boolean;
}

/**
 * Actual project team only, not prospective collaborators or scientific
 * advisers. Add contributors after their role has been confirmed and their
 * public bio/photo has been approved. Independent reviewers are listed on
 * /about/experts only if their independent work has truly occurred.
 * No invented headshots, positions, certifications, employers or partners.
 */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'ruslan-kurmashev',
    name: { ru: 'Руслан Курмашев', kk: 'Руслан Курмашев', en: 'Ruslan Kurmashev' },
    role: {
      ru: 'Основатель и руководитель проекта',
      kk: 'Жобаның негізін қалаушы және жетекшісі',
      en: 'Founder and project lead',
    },
    profile: {
      ru: 'Развивает Autism Hub Kazakhstan как открытый информационно-образовательный ресурс для семей и специалистов. Координирует содержание платформы, организацию публикаций и развитие сайта.',
      kk: 'Autism Hub Kazakhstan платформасын отбасылар мен мамандарға арналған ашық ақпараттық-білім беру ресурс ретінде дамытады. Контентті, жарияланымдарды және сайтты дамыту жұмысын үйлестіреді.',
      en: 'Develops Autism Hub Kazakhstan as an open educational and information resource for families and professionals. Coordinates its content, publications and website development.',
    },
    responsibilities: {
      ru: ['Развитие платформы', 'Подготовка и обновление материалов', 'Редакционная координация'],
      kk: ['Платформаны дамыту', 'Материалдарды дайындау және жаңарту', 'Редакциялық жұмысты үйлестіру'],
      en: ['Platform development', 'Preparing and updating resources', 'Editorial coordination'],
    },
    initials: { ru: 'РК', kk: 'РК', en: 'RK' },
    confirmed: true,
    publicProfileApproved: true,
  },
];

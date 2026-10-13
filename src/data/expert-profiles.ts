import type { Locale } from '../site.config';

export type ExpertContribution = 'author' | 'consultant' | 'reviewer';

export interface ExpertPublicProfile {
  id: string;
  name: Record<Locale, string>;
  professionalTitle: Record<Locale, string>;
  specialisation: Record<Locale, string>;
  biography: Record<Locale, string>;
  qualifications: Record<Locale, string>;
  contribution: Record<Locale, string>;
  roles: ExpertContribution[];
  photo?: string;
  photoAlt?: Record<Locale, string>;
  professionalLinks?: { label: string; url: string }[];
  materials?: {
    title: Record<Locale, string>;
    path: Record<Locale, string>;
    role: ExpertContribution;
  }[];
  participationConfirmed: boolean;
  consentToPublish: boolean;
}

/**
 * Editorially confirmed and consented profiles only.
 * Do not add prospective advisers, unconfirmed reviewers, invented
 * qualifications, or publication links without a documented contribution.
 * Publication is gated by participationConfirmed and consentToPublish.
 * No registration, personal-data collection, or backend is involved.
 */
export const EXPERT_PUBLIC_PROFILES: ExpertPublicProfile[] = [];

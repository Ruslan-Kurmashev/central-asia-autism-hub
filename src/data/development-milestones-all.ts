import type { Locale } from '../site.config';
import {
  DEVELOPMENT_MILESTONES as DEVELOPMENT_MILESTONES_RU,
  type MilestoneAge,
  type MilestoneItem,
  type MilestoneLocaleContent,
  type MilestoneSection,
} from './development-milestones';
import { DEVELOPMENT_MILESTONES_EN } from './development-milestones.en';
import { DEVELOPMENT_MILESTONES_KK } from './development-milestones.kk';

export const DEVELOPMENT_MILESTONES: Partial<Record<Locale, MilestoneLocaleContent>> = {
  ...DEVELOPMENT_MILESTONES_RU,
  kk: DEVELOPMENT_MILESTONES_KK,
  en: DEVELOPMENT_MILESTONES_EN,
};

export type {
  MilestoneAge,
  MilestoneItem,
  MilestoneLocaleContent,
  MilestoneSection,
};

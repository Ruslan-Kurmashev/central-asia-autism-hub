import { SITE } from '../site.config';

/**
 * Public project contact channels. Add URLs only after creating and verifying the accounts.
 * One shared project inbox; no per-team-member addresses or unverified placeholders.
 * Instagram is a personal account used for outreach, not an official project profile.
 * Financial donations are not enabled while the organisation and payment details are pending.
 */
export const CONTACT_CHANNELS: {
  email: string | null;
  linkedin: string | null;
  telegram: string | null;
  instagramPersonal: string | null;
  githubRepository: string;
  githubIssues: string;
} = {
  email: null,
  linkedin: null,
  telegram: null,
  instagramPersonal: null,
  githubRepository: SITE.repositoryUrl,
  githubIssues: SITE.repositoryUrl + '/issues/new?template=website-feedback.yml',
};

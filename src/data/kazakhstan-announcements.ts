import type { Locale } from '../site.config';

/** Verified external Kazakhstan announcements only. Never publish unverified
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
  isPublished: boolean;
  sourceVerified: boolean;
}

/** Intentionally empty until primary-source confirmation and editorial approval. */
export const KZ_ANNOUNCEMENTS: KazakhstanAnnouncement[] = [];

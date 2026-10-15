/** Rich demo session: system welcome, user thread, AI reply with all recommendation types. */
import type {Message} from '../../types';

/**
 * Builds a time-relative seed transcript anchored to `Date.now()`.
 * Human / further AI rows append when the user taps a recommendation card.
 */
function buildFullAstrologySession(): Message[] {
  const now = Date.now();
  /** ISO timestamp `minutesAgo` before the build anchor (`now`). */
  const t = (minutesAgo: number) =>
    new Date(now - minutesAgo * 60_000).toISOString();

  return [
    {
      id: 'sys-1',
      type: 'system',
      text: 'Your session with AI Astrologer has started.',
      createdAt: t(45),
    },
    {
      id: 'user-1',
      type: 'user',
      text: 'Can you tell me about my career this year?',
      createdAt: t(44),
    },
    {
      id: 'user-2',
      type: 'user',
      text: 'Especially Saturn and job changes.',
      createdAt: t(43),
    },
    {
      id: 'ai-1',
      type: 'ai',
      text: 'I can already see a strong Saturn influence in your chart. Based on this, here are a few recommendations that may help you.',
      createdAt: t(42),
      recommendations: [
        {
          id: 'reco-gem-1',
          type: 'gemstone',
          title: 'Blue Sapphire',
          subtitle: 'Recommended for Saturn',
        },
        {
          id: 'reco-tarot-1',
          type: 'tarot',
          title: 'Career Tarot Reading',
        },
        {
          id: 'reco-consult-1',
          type: 'consultation',
          title: 'Talk to an Astrologer',
        },
        {
          id: 'reco-article-1',
          type: 'article',
          title: 'Understanding Saturn Mahadasha',
        },
        {
          id: 'reco-promo-1',
          type: 'promotion',
          title: 'Navratri Consultation Offer',
          subtitle: '20% off first session',
        },
      ],
    },
  ];
}

/**
 * Primary load API — rebuilds timestamps on each call so “Today” labels stay plausible.
 *
 * @returns Fresh copy of the full demo session messages.
 */
export function getFullAstrologySession(): Message[] {
  return buildFullAstrologySession();
}

/**
 * One-time snapshot for static imports; prefer {@link getFullAstrologySession} in data sources
 * so relative times do not freeze at module load in long-lived dev sessions.
 */
export const FULL_ASTROLOGY_SESSION: Message[] = buildFullAstrologySession();

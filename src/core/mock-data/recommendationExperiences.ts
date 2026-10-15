/** Template message sequences keyed by recommendation type — hydrated on card select. */
import type {Message} from '../types';

/**
 * Static templates keyed by {@link RecommendationType} string.
 * {@link experienceFactory} clones rows with fresh ids/timestamps when the user taps a card.
 */
export const RECOMMENDATION_EXPERIENCES: Record<string, Message[]> = {
  gemstone: [
    {
      id: 'tpl-gem-ai',
      type: 'ai',
      text: 'Blue Sapphire (Neelam) strengthens Saturn. Prefer a natural stone set in silver on your middle finger after chanting Om Sham Shanicharaya Namah.',
      createdAt: '',
      recommendations: [
        {
          id: 'tpl-gem-promo',
          type: 'promotion',
          title: 'Gemstone Lab Report Pack',
          subtitle: 'Free authenticity check',
        },
      ],
    },
  ],
  tarot: [
    {
      id: 'tpl-tarot-ai',
      type: 'ai',
      text: 'Career Tarot: The Hermit reversed asks you to stop overthinking and take one visible career step this week. The Chariot supports interviews after Wednesday.',
      createdAt: '',
      recommendations: [
        {
          id: 'tpl-tarot-article',
          type: 'article',
          title: 'Saturday Career Remedy',
          subtitle: 'Simple oil lamp ritual',
        },
      ],
    },
  ],
  consultation: [
    {
      id: 'tpl-consult-sys',
      type: 'system',
      text: 'Connecting you with a human astrologer…',
      createdAt: '',
    },
    {
      id: 'tpl-consult-human',
      type: 'human',
      text: 'Namaste — I am reviewing your D10 career chart now. Ask me anything about job timing or interviews.',
      createdAt: '',
    },
  ],
  article: [
    {
      id: 'tpl-article-ai',
      type: 'ai',
      text: 'Saturn Mahadasha often brings delayed but lasting growth. Discipline, skill depth, and ethical work compound — especially when Jupiter supports from the 10th or 11th.',
      createdAt: '',
    },
  ],
  promotion: [
    {
      id: 'tpl-promo-sys',
      type: 'system',
      text: 'Offer unlocked for your session.',
      createdAt: '',
    },
    {
      id: 'tpl-promo-ai',
      type: 'ai',
      text: 'Navratri Consultation Offer: 20% off your first 30-minute live session this week. Tap Talk to an Astrologer anytime to continue.',
      createdAt: '',
      recommendations: [
        {
          id: 'tpl-promo-consult',
          type: 'consultation',
          title: 'Talk to an Astrologer',
        },
      ],
    },
  ],
};

/** Fallback transcript when a recommendation type has no dedicated mock experience. */
export const UNKNOWN_EXPERIENCE: Message[] = [
  {
    id: 'tpl-unknown',
    type: 'ai',
    text: 'This experience is coming soon. We will notify you when it is ready for your chart.',
    createdAt: '',
  },
];

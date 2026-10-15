/** Mock composer send outcomes: default AI reply, failure keyword, human handoff. */
import type {Message} from '../types';

/**
 * Keywords and template messages used by the mock conversation data source
 * when simulating send success, failure, and astrologer routing.
 */
export const SEND_SCENARIOS = {
  /** User text containing this substring triggers a failed send in mocks. */
  failKeyword: 'fail',
  /** Default AI response appended after a successful user send (hydrated on use). */
  defaultAiReply: {
    id: 'tpl-send-ai',
    type: 'ai',
    text: 'Based on your question, Saturn asks for steady effort over the next 90 days. Explore a remedy or speak with an astrologer if timing feels urgent.',
    createdAt: '',
    recommendations: [
      {
        id: 'tpl-send-tarot',
        type: 'tarot',
        title: 'Quick Timing Tarot',
      },
      {
        id: 'tpl-send-consult',
        type: 'consultation',
        title: 'Talk to an Astrologer',
      },
    ],
  } as Message,
  /** User text containing this substring triggers human handoff templates. */
  humanHandoffKeyword: 'astrologer',
  /** System + human rows appended together for live astrologer routing. */
  humanHandoff: [
    {
      id: 'tpl-send-sys',
      type: 'system',
      text: 'Routing your question to a human astrologer…',
      createdAt: '',
    },
    {
      id: 'tpl-send-human',
      type: 'human',
      text: 'I am here. Share your birth city and preferred job domain for sharper timing.',
      createdAt: '',
    },
  ] as Message[],
  /**
   * After handoff (consultation card or keyword), consumed one-by-one on each send.
   * When the queue empties, {@link resumeAiReply} is used once and the session returns to AI.
   */
  postHandoffHumanReplies: [
    {
      id: 'tpl-send-human-q1',
      type: 'human',
      text: 'From your D10, mid-April looks stronger for interviews — avoid Mercury retro mid-month. Share your exact birth time if you want dasha precision.',
      createdAt: '',
    },
    {
      id: 'tpl-send-human-q2',
      type: 'human',
      text: 'Wednesday and Friday mornings suit follow-ups. Keep Saturdays for skill work, not cold outreach. I will step out briefly — AI can cover remedies meanwhile.',
      createdAt: '',
    },
  ] as Message[],
  /** AI takes over after the post-handoff human reply queue is exhausted. */
  resumeAiReply: {
    id: 'tpl-send-ai-resume',
    type: 'ai',
    text: 'I can continue while the astrologer steps out. Want a gemstone suggestion or a short tarot check for this week?',
    createdAt: '',
    recommendations: [
      {
        id: 'tpl-resume-gem',
        type: 'gemstone',
        title: 'Saturn Gemstone Pick',
      },
      {
        id: 'tpl-resume-tarot',
        type: 'tarot',
        title: 'Quick Timing Tarot',
      },
    ],
  } as Message,
};

/** Mock message templates returned after like/dislike feedback on AI bubbles. */
import type {Message} from '../types';

/**
 * Catalog of system/AI follow-ups keyed by feedback action and dislike reason.
 * Timestamps and ids are replaced when templates are hydrated for append.
 */
export const FEEDBACK_RESPONSES = {
  /** Single acknowledgment row after a positive rating. */
  like: [
    {
      id: 'tpl-like-sys',
      type: 'system',
      text: 'Thanks — your feedback helps improve guidance.',
      createdAt: '',
    },
  ] as Message[],
  /** Per-reason transcript snippets for negative feedback. */
  dislikeReasons: {
    Inaccurate: [
      {
        id: 'tpl-dislike-inaccurate',
        type: 'system',
        text: 'Noted: response felt inaccurate. We will refine chart weighting.',
        createdAt: '',
      },
      {
        id: 'tpl-dislike-inaccurate-ai',
        type: 'ai',
        text: 'Would you like a second pass focused only on your 10th house and current dasha?',
        createdAt: '',
      },
    ] as Message[],
    'Too Generic': [
      {
        id: 'tpl-dislike-generic',
        type: 'system',
        text: 'Noted: too generic. Next answers will use more chart specifics.',
        createdAt: '',
      },
    ] as Message[],
    "Didn't Help": [
      {
        id: 'tpl-dislike-help',
        type: 'system',
        text: "Noted: didn't help. Try a recommendation card or consult a human astrologer.",
        createdAt: '',
      },
    ] as Message[],
    'Too Long': [
      {
        id: 'tpl-dislike-long',
        type: 'system',
        text: 'Noted: too long. Future replies will stay shorter.',
        createdAt: '',
      },
    ] as Message[],
  },
};

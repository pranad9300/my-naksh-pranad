/** Recommendation card types and payload attached to AI messages. */

/** Known experience kinds; string union allows forward-compatible mock types. */
export const RecommendationType = {
  Gemstone: 'gemstone',
  Tarot: 'tarot',
  Consultation: 'consultation',
  Article: 'article',
  Promotion: 'promotion',
} as const;

/** Card category used to resolve follow-up experience templates. */
export type RecommendationType =
  | (typeof RecommendationType)[keyof typeof RecommendationType]
  | (string & {});

/** Horizontal card shown under an AI bubble; selection triggers experience resolution. */
export type Recommendation = {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle?: string;
};

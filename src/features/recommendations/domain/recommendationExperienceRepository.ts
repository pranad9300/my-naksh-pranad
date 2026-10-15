/**
 * Recommendations domain port: map a card selection to experience message templates.
 */
import type {Message, Recommendation} from '../../../core/types';

/** Resolves mock (or future live) experiences after the user taps a recommendation. */
export type RecommendationExperienceRepository = {
  /** Returns messages to append after typing delay (hydrated upstream). */
  resolve(recommendation: Recommendation): Message[];
};

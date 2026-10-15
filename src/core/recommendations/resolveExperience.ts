/** Strategy entry for mapping a recommendation card to its follow-up message sequence. */
import {experienceFactory} from '../factories/experienceFactory';
import type {Message, Recommendation} from '../types';

/**
 * Resolves experience messages for a user-selected recommendation.
 * Delegates to {@link experienceFactory.fromRecommendation} so callers stay decoupled from mock catalogs.
 *
 * @param recommendation - Card payload from an AI message.
 * @returns Hydrated messages ready to append to the conversation store.
 */
export function resolveExperience(recommendation: Recommendation): Message[] {
  return experienceFactory.fromRecommendation(recommendation);
}

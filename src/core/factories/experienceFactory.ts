/** Turns recommendation selections and template lists into append-ready message sequences. */
import {
  RECOMMENDATION_EXPERIENCES,
  UNKNOWN_EXPERIENCE,
} from '../mock-data';
import type {Message, Recommendation} from '../types';
import {messageFactory} from './messageFactory';

/** Maps mock experience templates to hydrated messages for the store. */
export const experienceFactory = {
  /**
   * Resolves the follow-up transcript for a tapped recommendation card.
   * Unknown types fall back to {@link UNKNOWN_EXPERIENCE}.
   */
  fromRecommendation(recommendation: Recommendation): Message[] {
    const templates =
      RECOMMENDATION_EXPERIENCES[recommendation.type] ?? UNKNOWN_EXPERIENCE;
    return templates.map(template => messageFactory.hydrateTemplate(template));
  },

  /**
   * Hydrates an arbitrary template list (e.g. send mock or feedback ack).
   * Same id/timestamp rules as {@link messageFactory.hydrateTemplate}.
   */
  fromTemplates(templates: Message[]): Message[] {
    return templates.map(template => messageFactory.hydrateTemplate(template));
  },
};

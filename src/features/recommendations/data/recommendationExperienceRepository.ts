/**
 * Recommendation experience repository — delegates to core strategy registry.
 */
import {resolveExperience} from '../../../core/recommendations/resolveExperience';
import {
  RecommendationType,
  type Message,
  type Recommendation,
} from '../../../core/types';
import type {RecommendationExperienceRepository} from '../domain/recommendationExperienceRepository';

type Options = {
  /** Mock-only: arm post-handoff human replies when consultation joins. */
  onHumanJoined?: () => void;
};

/**
 * Factory for {@link RecommendationExperienceRepository} using {@link resolveExperience}.
 */
export function createRecommendationExperienceRepository(
  options: Options = {},
): RecommendationExperienceRepository {
  return {
    /** @inheritdoc RecommendationExperienceRepository.resolve */
    resolve(recommendation: Recommendation): Message[] {
      if (recommendation.type === RecommendationType.Consultation) {
        options.onHumanJoined?.();
      }
      return resolveExperience(recommendation);
    },
  };
}

/** Composition root — wires mock data sources to feature repository implementations. */
import {createConversationRepository} from '../features/conversation/data/conversationRepository';
import {createMockConversationDataSource} from '../features/conversation/data/mockConversationDataSource';
import {createRecommendationExperienceRepository} from '../features/recommendations/data/recommendationExperienceRepository';

const dataSource = createMockConversationDataSource();

/**
 * Conversation port bound to the mock data source.
 * Swap implementation here when adding a real backend — UI imports this singleton only via navigation wiring.
 */
export const conversationRepository =
  createConversationRepository(dataSource);

/**
 * Recommendation experience port (resolve + append flow).
 * Consultation join arms the mock human-reply queue on the shared data source.
 */
export const recommendationExperienceRepository =
  createRecommendationExperienceRepository({
    onHumanJoined: () => dataSource.activateHumanSession(),
  });
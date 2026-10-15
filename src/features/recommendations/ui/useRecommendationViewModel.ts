/**
 * Recommendation selection view-model: typing affordance then append experience messages.
 */
import {useCallback} from 'react';
import type {Recommendation} from '../../../core/types';
import {appendWithTyping} from '../../../core/utils/appendWithTyping';
import {useMessagesStore} from '../../conversation/ui/messagesStore';
import type {ConversationMessage} from '../../conversation/types';
import type {RecommendationExperienceRepository} from '../domain/recommendationExperienceRepository';

type Args = {
  repository: RecommendationExperienceRepository;
};

/**
 * Handles recommendation card selection: typing affordance then mock experience append.
 */
export function useRecommendationViewModel({repository}: Args) {
  const appendMessages = useMessagesStore(state => state.appendMessages);
  const removeMessage = useMessagesStore(state => state.removeMessage);

  /** Resolves experience messages and appends them after a typing placeholder. */
  const selectRecommendation = useCallback(
    async (recommendation: Recommendation) => {
      const followUps = repository
        .resolve(recommendation)
        .map(message => message as ConversationMessage);

      await appendWithTyping({
        appendMessages,
        removeMessage,
        followUps,
        delayMs: 500,
        idPrefix: 'typing-reco',
      });
    },
    [appendMessages, removeMessage, repository],
  );

  return {selectRecommendation};
}

/**
 * Conversation repository implementation — delegates to an injected data source.
 */
import type {ConversationRepository} from '../domain/conversationRepository';
import type {ConversationMessage} from '../types';
import type {MockConversationDataSource} from './mockConversationDataSource';

/**
 * Adapts a {@link MockConversationDataSource} (or future remote source) to {@link ConversationRepository}.
 */
export function createConversationRepository(
  dataSource: MockConversationDataSource,
): ConversationRepository {
  return {
    /** @inheritdoc ConversationRepository.loadMessages */
    loadMessages(): Promise<ConversationMessage[]> {
      return dataSource.fetchMessages();
    },

    /** @inheritdoc ConversationRepository.sendMessage */
    sendMessage(text: string, replyToId?: string) {
      return dataSource.postMessage(text, replyToId);
    },
  };
}

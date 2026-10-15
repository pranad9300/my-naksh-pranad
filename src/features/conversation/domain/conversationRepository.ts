/**
 * Conversation domain port: load history and send user messages (no UI or mock details).
 */
import type {ConversationMessage} from '../types';

/** Persistence/API contract wired in `dependencies.ts`. */
export type ConversationRepository = {
  /** Fetches the initial message list for the active session. */
  loadMessages(): Promise<ConversationMessage[]>;

  /**
   * Persists a user message and returns server-side follow-ups (AI/human/system).
   * @param text - Trimmed message body.
   * @param replyToId - Optional AI message id when replying in-thread.
   */
  sendMessage(
    text: string,
    replyToId?: string,
  ): Promise<{user: ConversationMessage; followUps: ConversationMessage[]}>;
};

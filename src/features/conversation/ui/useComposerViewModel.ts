/**
 * Composer view-model: draft text, reply target, optimistic send, and retry.
 */
import {useCallback, useMemo, useState} from 'react';
import {messageFactory} from '../../../core/factories/messageFactory';
import type {ConversationRepository} from '../domain/conversationRepository';
import type {ConversationMessage} from '../types';
import {SendStatus} from '../types';
import {useMessagesStore} from './messagesStore';

type Args = {
  repository: ConversationRepository;
};

/**
 * Owns composer ephemeral state and coordinates optimistic updates with the repository.
 */
export function useComposerViewModel({repository}: Args) {
  const [draft, setDraft] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const messages = useMessagesStore(state => state.messages);
  const upsertMessage = useMessagesStore(state => state.upsertMessage);
  const appendMessages = useMessagesStore(state => state.appendMessages);
  const removeMessage = useMessagesStore(state => state.removeMessage);
  const updateMessage = useMessagesStore(state => state.updateMessage);

  const replyPreview = useMemo(() => {
    if (!replyToId) {
      return null;
    }
    return messages.find(message => message.id === replyToId) ?? null;
  }, [messages, replyToId]);

  /** Begins a reply thread targeting an AI message id. */
  /** Sets the AI message id used as reply context for the next send. */
  const startReply = useCallback((messageId: string) => {
    setReplyToId(messageId);
  }, []);

  /** Clears the reply preview above the composer. */
  /** Clears reply context and hides the composer preview. */
  const cancelReply = useCallback(() => {
    setReplyToId(null);
  }, []);

  /**
   * Optimistically upserts a Sending user row, then swaps in repository result
   * or marks Failed for Retry.
   */
  /** Optimistic send: upsert, repository post, replace or mark failed. */
  const sendMessage = useCallback(async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    const optimisticBase = messageFactory.user(text, replyToId ?? undefined);
    const optimistic: ConversationMessage = {
      ...optimisticBase,
      sendStatus: SendStatus.Sending,
    };

    upsertMessage(optimistic);
    setDraft('');
    const activeReply = replyToId;
    setReplyToId(null);

    try {
      const result = await repository.sendMessage(
        text,
        activeReply ?? undefined,
      );
      removeMessage(optimistic.id);
      upsertMessage(result.user);
      appendMessages(result.followUps);
    } catch {
      updateMessage(optimistic.id, {sendStatus: SendStatus.Failed});
    }
  }, [
    appendMessages,
    draft,
    removeMessage,
    replyToId,
    repository,
    updateMessage,
    upsertMessage,
  ]);

  /** Re-posts a Failed user message without requiring retyping. */
  /** Re-attempts send for a failed user message by id. */
  const retrySend = useCallback(
    async (messageId: string) => {
      const message = useMessagesStore
        .getState()
        .messages.find(item => item.id === messageId);
      if (!message || message.type !== 'user') {
        return;
      }

      updateMessage(messageId, {sendStatus: SendStatus.Sending});
      try {
        const result = await repository.sendMessage(
          message.text,
          message.replyToId,
        );
        removeMessage(messageId);
        upsertMessage(result.user);
        appendMessages(result.followUps);
      } catch {
        updateMessage(messageId, {sendStatus: SendStatus.Failed});
      }
    },
    [appendMessages, removeMessage, repository, updateMessage, upsertMessage],
  );

  return {
    draft,
    setDraft,
    replyPreview,
    startReply,
    cancelReply,
    sendMessage,
    retrySend,
  };
}

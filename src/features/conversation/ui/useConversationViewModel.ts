/**
 * Conversation screen view-model: load state, timeline, message actions, and feedback side effects.
 */
import {useCallback, useEffect, useMemo, useState} from 'react';
import {clipboard} from '../../../core/adapters/clipboard';
import {experienceFactory} from '../../../core/factories/experienceFactory';
import {FEEDBACK_RESPONSES} from '../../../core/mock-data';
import {buildTimeline} from '../../../core/utils/buildTimeline';
import {appendWithTyping} from '../../../core/utils/appendWithTyping';
import type {ConversationRepository} from '../domain/conversationRepository';
import type {ConversationMessage, DislikeReason} from '../types';
import {FeedbackValue} from '../types';
import type {MessageAction} from './components/MessageActionsModal';
import {useMessagesStore} from './messagesStore';

/** Initial fetch lifecycle for the message list. */
export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

type Args = {
  repository: ConversationRepository;
  onStartReply: (messageId: string) => void;
};

/**
 * Conversation VM: load/timeline, message actions modal, like/dislike side effects.
 * Keeps draft/load flags out of Zustand (messages store only).
 */
export function useConversationViewModel({repository, onStartReply}: Args) {
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [messageActions, setMessageActions] = useState<MessageAction[] | null>(
    null,
  );

  const messages = useMessagesStore(state => state.messages);
  const setMessages = useMessagesStore(state => state.setMessages);
  const appendMessages = useMessagesStore(state => state.appendMessages);
  const updateMessage = useMessagesStore(state => state.updateMessage);
  const removeMessage = useMessagesStore(state => state.removeMessage);

  /** Loads messages from the repository into the messages store. */
  const loadConversation = useCallback(async () => {
    setLoadStatus('loading');
    setLoadError(null);
    try {
      const next = await repository.loadMessages();
      setMessages(next);
      setLoadStatus('ready');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load conversation.';
      setLoadError(message);
      setLoadStatus('error');
    }
  }, [repository, setMessages]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  const timeline = useMemo(() => buildTimeline(messages), [messages]);

  /** Copies message text via the clipboard adapter. */
  const copyMessage = useCallback((message: ConversationMessage) => {
    clipboard.copyText(message.text);
  }, []);

  /** Removes a message locally (mock delete — no remote call). */
  const deleteMessage = useCallback(
    (messageId: string) => {
      removeMessage(messageId);
    },
    [removeMessage],
  );

  /** Dismisses the long-press actions modal. */
  const closeMessageActions = useCallback(() => {
    setMessageActions(null);
  }, []);

  /** Builds reply/copy/delete actions for the selected AI or human message. */
  const showMessageActions = useCallback(
    (message: ConversationMessage) => {
      setMessageActions([
        {label: 'Reply', onPress: () => onStartReply(message.id)},
        {label: 'Copy', onPress: () => copyMessage(message)},
        {
          label: 'Delete',
          destructive: true,
          onPress: () => deleteMessage(message.id),
        },
      ]);
    },
    [copyMessage, deleteMessage, onStartReply],
  );

  /** Records like feedback and appends mock acknowledgment with typing. */
  const likeMessage = useCallback(
    (messageId: string) => {
      updateMessage(messageId, {
        feedback: FeedbackValue.Like,
        dislikeReason: undefined,
      });
      void appendWithTyping({
        appendMessages,
        removeMessage,
        followUps: experienceFactory
          .fromTemplates(FEEDBACK_RESPONSES.like)
          .map(message => message as ConversationMessage),
        delayMs: 450,
        idPrefix: 'typing-fb',
      });
    },
    [appendMessages, removeMessage, updateMessage],
  );

  /** Records dislike feedback and reveals reason chips in the bubble. */
  const dislikeMessage = useCallback(
    (messageId: string) => {
      updateMessage(messageId, {feedback: FeedbackValue.Dislike});
    },
    [updateMessage],
  );

  /** Persists dislike reason and appends tailored mock follow-up with typing. */
  const selectDislikeReason = useCallback(
    (messageId: string, reason: DislikeReason) => {
      updateMessage(messageId, {
        feedback: FeedbackValue.Dislike,
        dislikeReason: reason,
      });
      const templates = FEEDBACK_RESPONSES.dislikeReasons[reason] ?? [];
      void appendWithTyping({
        appendMessages,
        removeMessage,
        followUps: experienceFactory
          .fromTemplates(templates)
          .map(message => message as ConversationMessage),
        delayMs: 450,
        idPrefix: 'typing-fb',
      });
    },
    [appendMessages, removeMessage, updateMessage],
  );

  return {
    timeline,
    messages,
    loadStatus,
    loadError,
    loadConversation,
    showMessageActions,
    messageActions,
    closeMessageActions,
    likeMessage,
    dislikeMessage,
    selectDislikeReason,
  };
}

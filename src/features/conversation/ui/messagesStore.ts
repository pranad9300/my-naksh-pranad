/**
 * Zustand store for conversation message list only (see AGENTS.md — no draft/reply here).
 */
import {createStore} from '../../../core/adapters/state';
import type {ConversationMessage} from '../types';

type MessagesState = {
  messages: ConversationMessage[];
  setMessages: (messages: ConversationMessage[]) => void;
  appendMessages: (messages: ConversationMessage[]) => void;
  upsertMessage: (message: ConversationMessage) => void;
  updateMessage: (id: string, patch: Partial<ConversationMessage>) => void;
  removeMessage: (id: string) => void;
};

/** Conversation messages only — ephemeral UI stays in view-models. */
export const useMessagesStore = createStore<MessagesState>((set, get) => ({
  messages: [],

  /** Replaces the entire list (typically after load). */
  setMessages(messages) {
    set({messages});
  },

  /** Appends one or more messages in order; no-op when empty. */
  appendMessages(messages) {
    if (messages.length === 0) {
      return;
    }
    set({messages: [...get().messages, ...messages]});
  },

  /** Inserts or replaces by message id (optimistic send). */
  upsertMessage(message) {
    const existing = get().messages;
    const index = existing.findIndex(item => item.id === message.id);
    if (index === -1) {
      set({messages: [...existing, message]});
      return;
    }
    const next = existing.slice();
    next[index] = message;
    set({messages: next});
  },

  /** Shallow-merges fields onto a message by id. */
  updateMessage(id, patch) {
    set({
      messages: get().messages.map(message =>
        message.id === id ? {...message, ...patch} : message,
      ),
    });
  },

  /** Drops a message by id (e.g. remove typing placeholder). */
  removeMessage(id) {
    set({
      messages: get().messages.filter(message => message.id !== id),
    });
  },
}));

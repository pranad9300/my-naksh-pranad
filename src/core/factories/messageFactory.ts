/** Factory for constructing {@link Message} rows with stable id/timestamp rules. */
import {MessageType, type Message, type Recommendation} from '../types';

/** Monotonic suffix so rapid creates in the same millisecond stay unique. */
let sequence = 0;

/**
 * Generates a time- and sequence-based id when the caller does not supply one.
 *
 * @param prefix - Usually the message type slug (e.g. `user`, `ai`).
 */
function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
}

/** Input shape for {@link messageFactory.create}; all fields except type/text are optional. */
export type MessageDraft = {
  type: Message['type'];
  text: string;
  recommendations?: Recommendation[];
  replyToId?: string;
  id?: string;
  createdAt?: string;
};

/** Central creation API — keeps id, ISO timestamps, and reco cloning in one place. */
export const messageFactory = {
  /**
   * Builds a full message from a draft, applying defaults for id and `createdAt`.
   * Recommendation objects are shallow-cloned so templates are not mutated live.
   */
  create(draft: MessageDraft): Message {
    return {
      id: draft.id ?? nextId(draft.type),
      type: draft.type,
      text: draft.text,
      createdAt: draft.createdAt ?? new Date().toISOString(),
      recommendations: draft.recommendations?.map(item => ({...item})),
      replyToId: draft.replyToId,
    };
  },

  /** System/info row (centered styling in the conversation UI). */
  system(text: string): Message {
    return messageFactory.create({type: MessageType.System, text});
  },

  /**
   * End-user message bubble.
   *
   * @param replyToId - When set, UI can show a quote/reply affordance.
   */
  user(text: string, replyToId?: string): Message {
    return messageFactory.create({
      type: MessageType.User,
      text,
      replyToId,
    });
  },

  /**
   * AI astrologer bubble, optionally with recommendation cards below the text.
   */
  ai(text: string, recommendations?: Recommendation[]): Message {
    return messageFactory.create({
      type: MessageType.Ai,
      text,
      recommendations,
    });
  },

  /** Live human astrologer bubble after handoff. */
  human(text: string): Message {
    return messageFactory.create({type: MessageType.Human, text});
  },

  /**
   * Clone a mock/template row with fresh ids and timestamps for live append.
   * Used when hydrating catalog templates into the messages store.
   */
  hydrateTemplate(template: Message): Message {
    return messageFactory.create({
      type: template.type,
      text: template.text,
      recommendations: template.recommendations,
      replyToId: template.replyToId,
    });
  },
};

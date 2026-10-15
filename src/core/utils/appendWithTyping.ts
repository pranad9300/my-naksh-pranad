/** Shared AI “typing” choreography before appending follow-up messages. */
import {messageFactory} from '../factories/messageFactory';
import {MessageType, type Message} from '../types';
import {delay} from './delay';

/**
 * Message row that may render as a transient typing indicator (`isTyping` is UI-only).
 */
export type TypingCapableMessage = Message & {
  isTyping?: boolean;
};

/** Dependencies injected from the messages store / view-model (keeps this util pure). */
type AppendWithTypingOptions<T extends TypingCapableMessage> = {
  appendMessages: (messages: T[]) => void;
  removeMessage: (id: string) => void;
  followUps: T[];
  /** Mock “thinking” pause before follow-ups appear. */
  delayMs?: number;
  /** Prefix for the ephemeral typing row id so concurrent flows do not collide. */
  idPrefix?: string;
};

/**
 * Appends a short AI typing placeholder, waits, removes it, then appends follow-ups.
 * Shared by recommendation select and feedback ack so both paths feel the same.
 *
 * @param options - Store mutators, follow-up rows, and optional timing/id overrides.
 */
export async function appendWithTyping<T extends TypingCapableMessage>(
  options: AppendWithTypingOptions<T>,
): Promise<void> {
  const {
    appendMessages,
    removeMessage,
    followUps,
    delayMs = 500,
    idPrefix = 'typing',
  } = options;

  const typingId = `${idPrefix}-${Date.now()}`;
  const typing = {
    ...messageFactory.create({
      id: typingId,
      type: MessageType.Ai,
      text: '',
    }),
    isTyping: true,
  } as T;

  appendMessages([typing]);
  await delay(delayMs);
  removeMessage(typingId);
  appendMessages(followUps);
}

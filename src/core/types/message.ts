/** Shared chat message model and sender role constants. */
import type {Recommendation} from './recommendation';

/** Discriminator for who sent a row and how the UI should render it. */
export const MessageType = {
  User: 'user',
  Ai: 'ai',
  Human: 'human',
  System: 'system',
} as const;

/** Union of all {@link MessageType} string values. */
export type MessageType = (typeof MessageType)[keyof typeof MessageType];

/** Persisted conversation row: text payload, optional reco cards, optional reply thread. */
export type Message = {
  id: string;
  type: MessageType;
  text: string;
  createdAt: string;
  recommendations?: Recommendation[];
  replyToId?: string;
};

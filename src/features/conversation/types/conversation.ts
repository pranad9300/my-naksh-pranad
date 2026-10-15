/**
 * Conversation feature types: send/feedback enums and the extended message shape.
 */
import type {Message} from '../../../core/types';

/** Outbound user message delivery state shown in the bubble footer. */
export const SendStatus = {
  Sending: 'sending',
  Sent: 'sent',
  Failed: 'failed',
} as const;

export type SendStatus = (typeof SendStatus)[keyof typeof SendStatus];

/** Thumbs up/down selection on an AI message. */
export const FeedbackValue = {
  Like: 'like',
  Dislike: 'dislike',
} as const;

export type FeedbackValue = (typeof FeedbackValue)[keyof typeof FeedbackValue];

/** Preset reasons shown after the user dislikes an AI reply. */
export const DislikeReason = {
  Inaccurate: 'Inaccurate',
  TooGeneric: 'Too Generic',
  DidntHelp: "Didn't Help",
  TooLong: 'Too Long',
} as const;

export type DislikeReason =
  (typeof DislikeReason)[keyof typeof DislikeReason];

/** Core message plus conversation-only UI and delivery metadata. */
export type ConversationMessage = Message & {
  sendStatus?: SendStatus;
  feedback?: FeedbackValue;
  dislikeReason?: DislikeReason;
  /** Transient AI typing row while mock experience loads. */
  isTyping?: boolean;
};

/** Ordered list of dislike chips matching {@link DislikeReason} labels. */
export const DISLIKE_REASONS: DislikeReason[] = [
  DislikeReason.Inaccurate,
  DislikeReason.TooGeneric,
  DislikeReason.DidntHelp,
  DislikeReason.TooLong,
];

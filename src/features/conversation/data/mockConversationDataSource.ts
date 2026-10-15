/**
 * Mock conversation HTTP-style API for assessments (delays, keywords, session fixtures).
 */
import {experienceFactory} from '../../../core/factories/experienceFactory';
import {messageFactory} from '../../../core/factories/messageFactory';
import {
  getFullAstrologySession,
  SEND_SCENARIOS,
} from '../../../core/mock-data';
import {MessageType, type Message} from '../../../core/types';
import {delay} from '../../../core/utils/delay';
import type {ConversationMessage} from '../types';
import {SendStatus} from '../types';

/** Low-level fetch/post surface used by {@link createConversationRepository}. */
export type MockConversationDataSource = {
  /** Simulated GET of session messages. */
  fetchMessages(): Promise<ConversationMessage[]>;
  /** Simulated POST of a user message and AI/human follow-ups. */
  postMessage(
    text: string,
    replyToId?: string,
  ): Promise<{user: ConversationMessage; followUps: ConversationMessage[]}>;
  /** Arms post-handoff human reply queue (consultation card or keyword join). */
  activateHumanSession(): void;
};

function hydrateFollowUps(templates: Message[]): ConversationMessage[] {
  return experienceFactory
    .fromTemplates(templates)
    .map(message => message as ConversationMessage);
}

/**
 * In-memory conversation API used for the assessment (no real backend).
 * Options force empty / load-error paths without a settings screen.
 */
export function createMockConversationDataSource(
  options: {failLoad?: boolean; empty?: boolean} = {},
): MockConversationDataSource {
  /** Remaining human reply templates after consultation / keyword handoff. */
  let humanReplyQueue: Message[] = [];
  /** After the human queue empties, the next send uses {@link SEND_SCENARIOS.resumeAiReply}. */
  let useResumeAiNext = false;

  const armHumanSession = () => {
    humanReplyQueue = SEND_SCENARIOS.postHandoffHumanReplies.map(template => ({
      ...template,
    }));
    useResumeAiNext = true;
  };

  return {
    activateHumanSession: armHumanSession,

    /** Applies delay, optional failure/empty flags, then hydrates session fixtures. */
    async fetchMessages() {
      await delay(700);
      if (options.failLoad) {
        throw new Error('Unable to load conversation.');
      }
      if (options.empty) {
        return [];
      }
      humanReplyQueue = [];
      useResumeAiNext = false;
      return getFullAstrologySession().map(message => ({
        ...message,
        recommendations: message.recommendations?.map(item => ({...item})),
        sendStatus:
          message.type === MessageType.User ? SendStatus.Sent : undefined,
      }));
    },

    /**
     * Simulates send latency, fail keyword, human handoff, post-handoff human
     * replies, then AI resume / default AI reply.
     */
    async postMessage(text: string, replyToId?: string) {
      await delay(900);
      const trimmed = text.trim();
      if (trimmed.toLowerCase() === SEND_SCENARIOS.failKeyword) {
        throw new Error('Failed to send message.');
      }

      const user: ConversationMessage = {
        ...messageFactory.user(trimmed, replyToId),
        sendStatus: SendStatus.Sent,
      };

      if (trimmed.toLowerCase().includes(SEND_SCENARIOS.humanHandoffKeyword)) {
        armHumanSession();
        return {
          user,
          followUps: hydrateFollowUps(SEND_SCENARIOS.humanHandoff),
        };
      }

      if (humanReplyQueue.length > 0) {
        const next = humanReplyQueue.shift()!;
        return {user, followUps: hydrateFollowUps([next])};
      }

      if (useResumeAiNext) {
        useResumeAiNext = false;
        return {
          user,
          followUps: hydrateFollowUps([SEND_SCENARIOS.resumeAiReply]),
        };
      }

      return {
        user,
        followUps: hydrateFollowUps([SEND_SCENARIOS.defaultAiReply]),
      };
    },
  };
}

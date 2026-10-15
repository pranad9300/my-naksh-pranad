/**
 * Renders a single timeline message: bubbles, recommendations, feedback, and send status.
 */
import React, {memo, useCallback} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {HorizontalCardList} from '../../../../core/components/HorizontalCardList';
import {
  MessageType,
  type GroupPosition,
  type Recommendation,
} from '../../../../core/types';
import {formatMessageTime} from '../../../../core/utils/formatMessageTime';
import {renderRecommendationCard} from '../../../recommendations/ui/registry';
import type {ConversationMessage, DislikeReason} from '../../types';
import {SendStatus} from '../../types';
import {FeedbackRow} from './FeedbackRow';
import {TypingIndicator} from './TypingIndicator';

type MessageBubbleProps = {
  message: ConversationMessage;
  groupPosition: GroupPosition;
  onLongPressMessage: (message: ConversationMessage) => void;
  onRecommendationPress: (recommendation: Recommendation) => void;
  onLike: (messageId: string) => void;
  onDislike: (messageId: string) => void;
  onSelectDislikeReason: (messageId: string, reason: DislikeReason) => void;
  onRetry: (messageId: string) => void;
};

/** Memoized row for user, AI, human, system, and typing messages. */
export const MessageBubble = memo(function MessageBubble({
  message,
  groupPosition,
  onLongPressMessage,
  onRecommendationPress,
  onLike,
  onDislike,
  onSelectDislikeReason,
  onRetry,
}: MessageBubbleProps) {
  const isUser = message.type === MessageType.User;
  const isSystem = message.type === MessageType.System;
  const isAi = message.type === MessageType.Ai;
  const isHuman = message.type === MessageType.Human;
  const timeLabel = formatMessageTime(message.createdAt);
  const canLongPress = isAi || isHuman;

  /** Opens reply/copy/delete for AI and human astrologer text (not cards/feedback). */
  const handleLongPress = useCallback(() => {
    if (canLongPress) {
      onLongPressMessage(message);
    }
  }, [canLongPress, message, onLongPressMessage]);

  if (message.isTyping) {
    return <TypingIndicator />;
  }

  if (isSystem) {
    return (
      <View style={styles.systemWrap}>
        <View style={styles.systemChip}>
          <Text style={styles.systemText}>{message.text}</Text>
        </View>
        {timeLabel ? <Text style={styles.systemTime}>{timeLabel}</Text> : null}
      </View>
    );
  }

  const radius = bubbleRadius(isUser, groupPosition);

  return (
    <View
      style={[
        styles.row,
        isUser ? styles.rowUser : styles.rowOther,
        groupMargin(groupPosition),
      ]}>
      <View
        style={[
          styles.bubble,
          isUser && styles.userBubble,
          isAi && styles.aiBubble,
          isHuman && styles.humanBubble,
          radius,
        ]}>
        <Pressable onLongPress={handleLongPress} delayLongPress={280}>
          {!isUser ? (
            <Text style={styles.sender}>
              {isAi ? 'AI Assistant' : 'Astrologer'}
            </Text>
          ) : null}
          <Text style={[styles.text, isUser && styles.userText]}>
            {message.text}
          </Text>

          {message.sendStatus && message.sendStatus !== SendStatus.Sent ? (
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                {message.sendStatus === SendStatus.Sending
                  ? 'Sending...'
                  : 'Failed'}
              </Text>
              {message.sendStatus === SendStatus.Failed ? (
                <Pressable onPress={() => onRetry(message.id)}>
                  <Text style={styles.retry}>Retry</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </Pressable>

        {isAi && message.recommendations?.length ? (
          <HorizontalCardList
            data={message.recommendations}
            keyExtractor={item => item.id}
            renderItem={item =>
              renderRecommendationCard(item, onRecommendationPress)
            }
            style={styles.recoList}
          />
        ) : null}

        {isAi ? (
          <FeedbackRow
            feedback={message.feedback}
            dislikeReason={message.dislikeReason}
            onLike={() => onLike(message.id)}
            onDislike={() => onDislike(message.id)}
            onSelectReason={reason => onSelectDislikeReason(message.id, reason)}
          />
        ) : null}
      </View>
      {timeLabel ? (
        <Text style={[styles.time, isUser && styles.timeUser]}>{timeLabel}</Text>
      ) : null}
    </View>
  );
});

/** Corner radii for grouped chat bubbles (first/middle/last/single). */
function bubbleRadius(isUser: boolean, position: GroupPosition) {
  const base = 18;
  const tight = 6;
  if (position === 'single') {
    return {borderRadius: base};
  }
  if (isUser) {
    if (position === 'first') {
      return {
        borderTopLeftRadius: base,
        borderTopRightRadius: base,
        borderBottomLeftRadius: base,
        borderBottomRightRadius: tight,
      };
    }
    if (position === 'middle') {
      return {
        borderTopLeftRadius: base,
        borderTopRightRadius: tight,
        borderBottomLeftRadius: base,
        borderBottomRightRadius: tight,
      };
    }
    return {
      borderTopLeftRadius: base,
      borderTopRightRadius: tight,
      borderBottomLeftRadius: base,
      borderBottomRightRadius: base,
    };
  }

  if (position === 'first') {
    return {
      borderTopLeftRadius: base,
      borderTopRightRadius: base,
      borderBottomLeftRadius: tight,
      borderBottomRightRadius: base,
    };
  }
  if (position === 'middle') {
    return {
      borderTopLeftRadius: tight,
      borderTopRightRadius: base,
      borderBottomLeftRadius: tight,
      borderBottomRightRadius: base,
    };
  }
  return {
    borderTopLeftRadius: tight,
    borderTopRightRadius: base,
    borderBottomLeftRadius: base,
    borderBottomRightRadius: base,
  };
}

/** Vertical spacing between messages in the same sender group. */
function groupMargin(position: GroupPosition) {
  if (position === 'middle' || position === 'last') {
    return {marginTop: 2};
  }
  return {marginTop: 10};
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowOther: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '86%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#2F5D50',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4D9CB',
  },
  humanBubble: {
    backgroundColor: '#F3E6D5',
    borderWidth: 1,
    borderColor: '#E0CFB8',
  },
  sender: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B635A',
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: '#1F1A14',
  },
  userText: {
    color: '#FFFFFF',
  },
  systemWrap: {
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 24,
    gap: 4,
  },
  systemChip: {
    backgroundColor: '#E8E2D8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  systemText: {
    fontSize: 12,
    color: '#6B635A',
    textAlign: 'center',
  },
  systemTime: {
    fontSize: 11,
    color: '#9A9084',
  },
  statusRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#D7C4A8',
  },
  retry: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  recoList: {
    marginTop: 8,
  },
  time: {
    marginTop: 3,
    fontSize: 11,
    color: '#9A9084',
    paddingHorizontal: 4,
  },
  timeUser: {
    textAlign: 'right',
  },
});

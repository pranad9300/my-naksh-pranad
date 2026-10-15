/**
 * Like/dislike controls and expandable dislike reason chips on AI messages.
 */
import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {
  DISLIKE_REASONS,
  type DislikeReason,
  type FeedbackValue,
} from '../../types';

type FeedbackRowProps = {
  feedback?: FeedbackValue;
  dislikeReason?: DislikeReason;
  onLike: () => void;
  onDislike: () => void;
  onSelectReason: (reason: DislikeReason) => void;
};

/** Memoized feedback UI; long-press lives on the bubble, not this row. */
export const FeedbackRow = memo(function FeedbackRow({
  feedback,
  dislikeReason,
  onLike,
  onDislike,
  onSelectReason,
}: FeedbackRowProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.actions}>
        <Pressable
          onPress={onLike}
          style={[styles.chip, feedback === 'like' && styles.chipActive]}>
          <Text style={styles.chipText}>👍 Like</Text>
        </Pressable>
        <Pressable
          onPress={onDislike}
          style={[styles.chip, feedback === 'dislike' && styles.chipActive]}>
          <Text style={styles.chipText}>👎 Dislike</Text>
        </Pressable>
      </View>

      {feedback === 'dislike' ? (
        <Animated.View entering={FadeInDown.duration(180)} style={styles.reasons}>
          {DISLIKE_REASONS.map(reason => (
            <Pressable
              key={reason}
              onPress={() => onSelectReason(reason)}
              style={[
                styles.reason,
                dislikeReason === reason && styles.reasonActive,
              ]}>
              <Text style={styles.reasonText}>{reason}</Text>
            </Pressable>
          ))}
        </Animated.View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginTop: 6,
    gap: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#EFE8DE',
  },
  chipActive: {
    backgroundColor: '#D7C4A8',
  },
  chipText: {
    fontSize: 12,
    color: '#1F1A14',
  },
  reasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reason: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9D0C4',
  },
  reasonActive: {
    borderColor: '#8B5E34',
    backgroundColor: '#F3E6D5',
  },
  reasonText: {
    fontSize: 12,
    color: '#3A3228',
  },
});

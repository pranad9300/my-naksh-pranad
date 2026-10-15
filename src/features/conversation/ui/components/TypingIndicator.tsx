/**
 * Transient AI “typing” bubble with animated dots (`isTyping` messages).
 */
import React, {memo, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** Single pulsing dot; staggered via Reanimated delay. */
function Dot({delay}: {delay: number}) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 320}),
          withTiming(0.3, {duration: 320}),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const style = useAnimatedStyle(() => ({opacity: opacity.value}));

  return <Animated.View style={[styles.dot, style]} />;
}

/** Memoized three-dot typing affordance for mock AI latency. */
export const TypingIndicator = memo(function TypingIndicator() {
  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <Text style={styles.label}>AI Assistant</Text>
        <View style={styles.dots}>
          <Dot delay={0} />
          <Dot delay={120} />
          <Dot delay={240} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    marginTop: 10,
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4D9CB',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B635A',
  },
  dots: {
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#6B635A',
  },
});

/**
 * Recommendation card registry — one visual per RecommendationType (open/closed).
 */
import React, {memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  RecommendationType,
  type Recommendation,
} from '../../../core/types';

type CardProps = {
  recommendation: Recommendation;
  onPress: (recommendation: Recommendation) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Shared pressable card chrome with spring scale feedback.
 * Fixed height keeps the AI bubble strip compact.
 */
function RecommendationCardShell({
  recommendation,
  onPress,
  accent,
  emoji,
}: CardProps & {accent: string; emoji: string}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <AnimatedPressable
      onPress={() => onPress(recommendation)}
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.card, {borderColor: accent}, animatedStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>
          {recommendation.title}
        </Text>
        {recommendation.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {recommendation.subtitle}
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

/** Gemstone experience card. */
const GemstoneCard = memo(function GemstoneCard(props: CardProps) {
  return <RecommendationCardShell {...props} accent="#3B6EA5" emoji="💎" />;
});

/** Tarot experience card. */
const TarotCard = memo(function TarotCard(props: CardProps) {
  return <RecommendationCardShell {...props} accent="#7A4E9B" emoji="🔮" />;
});

/** Human consultation CTA card. */
const ConsultationCard = memo(function ConsultationCard(props: CardProps) {
  return <RecommendationCardShell {...props} accent="#C26A3A" emoji="👨‍🏫" />;
});

/** Educational article card. */
const ArticleCard = memo(function ArticleCard(props: CardProps) {
  return <RecommendationCardShell {...props} accent="#2F6F4E" emoji="📰" />;
});

/** Promotional offer card. */
const PromotionCard = memo(function PromotionCard(props: CardProps) {
  return <RecommendationCardShell {...props} accent="#B8860B" emoji="🎁" />;
});

/** Fallback when recommendation.type is unknown. */
const FallbackCard = memo(function FallbackCard(props: CardProps) {
  return <RecommendationCardShell {...props} accent="#6B6B6B" emoji="✨" />;
});

/** Maps recommendation type string → memoized card component. */
const REGISTRY: Record<string, React.ComponentType<CardProps>> = {
  [RecommendationType.Gemstone]: GemstoneCard,
  [RecommendationType.Tarot]: TarotCard,
  [RecommendationType.Consultation]: ConsultationCard,
  [RecommendationType.Article]: ArticleCard,
  [RecommendationType.Promotion]: PromotionCard,
};

/**
 * Picks the registered card for a recommendation (or fallback).
 *
 * @param recommendation - Card model from an AI message
 * @param onPress - Select handler from the recommendation VM
 */
export function renderRecommendationCard(
  recommendation: Recommendation,
  onPress: (recommendation: Recommendation) => void,
) {
  const Card = REGISTRY[recommendation.type] ?? FallbackCard;
  return <Card recommendation={recommendation} onPress={onPress} />;
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 88,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 4,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  copy: {
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F1A14',
  },
  subtitle: {
    fontSize: 11,
    color: '#6B635A',
  },
});

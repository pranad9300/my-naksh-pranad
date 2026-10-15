/**
 * Full-screen placeholders while the conversation loads, fails, or is empty.
 */
import React, {memo} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';

/** Spinner shown during initial repository fetch. */
export const LoadingState = memo(function LoadingState() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color="#2F5D50" />
      <Text style={styles.copy}>Loading conversation...</Text>
    </View>
  );
});

/** Copy when load succeeded but the session has no messages. */
export const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Start your conversation.</Text>
      <Text style={styles.copy}>Ask anything about your chart.</Text>
    </View>
  );
});

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

/** Error message with retry wired to {@link useConversationViewModel.loadConversation}. */
export const ErrorState = memo(function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{message}</Text>
      <Pressable onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Retry</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1A14',
    textAlign: 'center',
  },
  copy: {
    fontSize: 14,
    color: '#6B635A',
    textAlign: 'center',
  },
  button: {
    marginTop: 6,
    backgroundColor: '#2F5D50',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

/**
 * Modal sheet of actions shown after long-press on an AI or human message bubble.
 */
import React, {memo} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

/** One tappable row in {@link MessageActionsModal}. */
export type MessageAction = {
  label: string;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  visible: boolean;
  actions: MessageAction[];
  onClose: () => void;
};

/** Memoized centered action sheet; closes before invoking an action handler. */
export const MessageActionsModal = memo(function MessageActionsModal({
  visible,
  actions,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Message actions</Text>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Close">
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          {actions.map(action => (
            <Pressable
              key={action.label}
              style={styles.action}
              onPress={() => {
                onClose();
                action.onPress();
              }}>
              <Text
                style={[
                  styles.actionLabel,
                  action.destructive && styles.destructive,
                ]}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 16, 12, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  close: {
    fontSize: 18,
    color: '#6B635A',
    paddingHorizontal: 4,
    lineHeight: 22,
  },
  action: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2F5D50',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  destructive: {
    color: '#B42318',
  },
});

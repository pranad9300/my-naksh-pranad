/**
 * Bottom composer: multiline input, send control, and optional reply preview.
 */
import React, {memo} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MessageType} from '../../../../core/types';
import type {ConversationMessage} from '../../types';

type ComposerProps = {
  draft: string;
  replyPreview: ConversationMessage | null;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
  onCancelReply: () => void;
};

/** Memoized composer bar; respects safe-area bottom inset. */
export const Composer = memo(function Composer({
  draft,
  replyPreview,
  onChangeDraft,
  onSend,
  onCancelReply,
}: ComposerProps) {
  const insets = useSafeAreaInsets();
  const canSend = draft.trim().length > 0;

  return (
    <View style={[styles.wrap, {paddingBottom: Math.max(insets.bottom, 10)}]}>
      {replyPreview ? (
        <View style={styles.replyPreview}>
          <View style={styles.replyCopy}>
            <Text style={styles.replyLabel}>
              {replyPreview.type === MessageType.Human
                ? 'Replying to Astrologer'
                : 'Replying to AI'}
            </Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyPreview.text}
            </Text>
          </View>
          <Pressable onPress={onCancelReply} hitSlop={8}>
            <Text style={styles.cancel}>✕</Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.row}>
        <TextInput
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Ask about your chart..."
          placeholderTextColor="#9A9084"
          style={styles.input}
          multiline
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          style={[styles.send, !canSend && styles.sendDisabled]}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D9D0C4',
    backgroundColor: '#FBF8F3',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFE8DE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
  },
  replyCopy: {
    flex: 1,
    gap: 2,
  },
  replyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5E34',
  },
  replyText: {
    fontSize: 13,
    color: '#3A3228',
  },
  cancel: {
    fontSize: 16,
    color: '#6B635A',
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#D9D0C4',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: '#1F1A14',
    backgroundColor: '#FFFFFF',
  },
  send: {
    backgroundColor: '#2F5D50',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendDisabled: {
    opacity: 0.4,
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

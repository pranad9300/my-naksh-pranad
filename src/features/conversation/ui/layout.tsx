/**
 * Conversation feature layout: timeline list, composer, and AI message actions modal.
 */
import React, {useCallback, useEffect, useRef} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import {Screen} from '../../../core/components/Screen';
import type {TimelineItem} from '../../../core/types';
import type {RecommendationExperienceRepository} from '../../recommendations/domain/recommendationExperienceRepository';
import {useRecommendationViewModel} from '../../recommendations/ui/useRecommendationViewModel';
import type {ConversationRepository} from '../domain/conversationRepository';
import type {ConversationMessage} from '../types';
import {Composer} from './components/Composer';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from './components/ConversationStates';
import {DateSeparator} from './components/DateSeparator';
import {MessageActionsModal} from './components/MessageActionsModal';
import {MessageBubble} from './components/MessageBubble';
import {useComposerViewModel} from './useComposerViewModel';
import {useConversationViewModel} from './useConversationViewModel';

type ConversationLayoutProps = {
  conversationRepository: ConversationRepository;
  recommendationRepository: RecommendationExperienceRepository;
};

/**
 * Wires conversation, composer, and recommendation view-models into the chat screen.
 */
export function ConversationLayout({
  conversationRepository,
  recommendationRepository,
}: ConversationLayoutProps) {
  const listRef = useRef<FlatList<TimelineItem<ConversationMessage>>>(null);
  const previousCountRef = useRef(0);

  const composer = useComposerViewModel({
    repository: conversationRepository,
  });
  const conversation = useConversationViewModel({
    repository: conversationRepository,
    onStartReply: composer.startReply,
  });
  const recommendations = useRecommendationViewModel({
    repository: recommendationRepository,
  });

  useEffect(() => {
    if (conversation.loadStatus === 'ready') {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({animated: false});
      });
    }
  }, [conversation.loadStatus]);

  useEffect(() => {
    if (conversation.messages.length > previousCountRef.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({animated: true});
      });
    }
    previousCountRef.current = conversation.messages.length;
  }, [conversation.messages.length]);

  /** Renders a date chip or memoized message bubble for one timeline row. */
  /** Renders date separators or {@link MessageBubble} rows for the FlatList. */
  const renderItem = useCallback<
    ListRenderItem<TimelineItem<ConversationMessage>>
  >(
    ({item}) => {
      if (item.kind === 'date') {
        return <DateSeparator label={item.label} />;
      }

      return (
        <MessageBubble
          message={item.message}
          groupPosition={item.groupPosition}
          onLongPressMessage={conversation.showMessageActions}
          onRecommendationPress={recommendations.selectRecommendation}
          onLike={conversation.likeMessage}
          onDislike={conversation.dislikeMessage}
          onSelectDislikeReason={conversation.selectDislikeReason}
          onRetry={composer.retrySend}
        />
      );
    },
    [
      composer.retrySend,
      conversation.dislikeMessage,
      conversation.likeMessage,
      conversation.selectDislikeReason,
      conversation.showMessageActions,
      recommendations.selectRecommendation,
    ],
  );

  /** Stable timeline item id for list keys. */
  /** Stable FlatList keys from timeline item ids. */
  const keyExtractor = useCallback(
    (item: TimelineItem<ConversationMessage>) => item.id,
    [],
  );

  /** Keeps the list pinned while an optimistic Sending row is growing the content. */
  const onContentSizeChange = useCallback(() => {
    if (
      conversation.messages.some(message => message.sendStatus === 'sending')
    ) {
      listRef.current?.scrollToEnd({animated: true});
    }
  }, [conversation.messages]);

  let body: React.ReactNode;
  if (
    conversation.loadStatus === 'loading' ||
    conversation.loadStatus === 'idle'
  ) {
    body = <LoadingState />;
  } else if (conversation.loadStatus === 'error') {
    body = (
      <ErrorState
        message={conversation.loadError ?? 'Unable to load conversation.'}
        onRetry={conversation.loadConversation}
      />
    );
  } else if (conversation.timeline.length === 0) {
    body = <EmptyState />;
  } else {
    body = (
      <FlatList
        ref={listRef}
        data={conversation.timeline}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        extraData={conversation.messages}
        onContentSizeChange={onContentSizeChange}
      />
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Conversation</Text>
          <Text style={styles.subtitle}>
            MyNaksh astrology experiences
          </Text>
        </View>
        <View style={styles.flex}>{body}</View>
        {conversation.loadStatus === 'ready' ? (
          <Composer
            draft={composer.draft}
            replyPreview={composer.replyPreview}
            onChangeDraft={composer.setDraft}
            onSend={composer.sendMessage}
            onCancelReply={composer.cancelReply}
          />
        ) : null}
      </KeyboardAvoidingView>
      <MessageActionsModal
        visible={conversation.messageActions != null}
        actions={conversation.messageActions ?? []}
        onClose={conversation.closeMessageActions}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D9D0C4',
    gap: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F1A14',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B635A',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
});

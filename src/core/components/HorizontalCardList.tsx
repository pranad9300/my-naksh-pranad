/** Horizontal FlatList wrapper for recommendation cards under AI bubbles. */
import React, {type ReactElement, useCallback} from 'react';
import {FlatList, StyleSheet, View, type ViewStyle} from 'react-native';

/** Generic props for rendering a row of same-height cards. */
type HorizontalCardListProps<T> = {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactElement;
  contentContainerStyle?: ViewStyle;
  style?: ViewStyle;
};

/**
 * Short horizontal card strip with fixed height so parent bubbles stay compact.
 * FlatList delivers presses more reliably than nested ScrollView in message rows.
 */
export function HorizontalCardList<T>({
  data,
  keyExtractor,
  renderItem,
  contentContainerStyle,
  style,
}: HorizontalCardListProps<T>) {
  /** FlatList row renderer — wraps each card for consistent horizontal spacing. */
  const render = useCallback(
    ({item, index}: {item: T; index: number}) => (
      <View style={styles.item}>{renderItem(item, index)}</View>
    ),
    [renderItem],
  );

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyExtractor}
      renderItem={render}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      style={[styles.list, style]}
      contentContainerStyle={[styles.content, contentContainerStyle]}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    height: 100,
    flexGrow: 0,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 4,
    gap: 10,
  },
  item: {
    flexShrink: 0,
  },
});

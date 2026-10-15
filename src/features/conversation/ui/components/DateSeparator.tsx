/** Centered day label inserted between message groups in the timeline. */
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type DateSeparatorProps = {
  label: string;
};

/** Memoized timeline date chip. */
export const DateSeparator = memo(function DateSeparator({
  label,
}: DateSeparatorProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 12,
    color: '#6B635A',
    backgroundColor: '#E8E2D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
    borderRadius: 10,
  },
});

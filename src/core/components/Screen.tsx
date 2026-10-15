/** Safe-area screen shell shared by feature layouts (top/sides only — composer owns bottom inset). */
import React, {type ReactNode} from 'react';
import {StyleSheet, View, type ViewStyle} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

/** Props for {@link Screen}. */
type ScreenProps = {
  children: ReactNode;
  style?: ViewStyle;
};

/**
 * Full-screen container with safe area on top and horizontal edges.
 * Bottom inset is intentionally omitted so the conversation composer can clear the home indicator.
 */
export function Screen({children, style}: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={[styles.body, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F4EF',
  },
  body: {
    flex: 1,
  },
});

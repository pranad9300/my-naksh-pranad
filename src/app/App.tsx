/** React Native app root — gesture handler, safe area, and navigation shell. */
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native';
import {RootNavigator} from './navigation/RootNavigator';

/**
 * Top-level component registered with the native host.
 * Wraps navigation in providers required by gestures and safe-area hooks.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

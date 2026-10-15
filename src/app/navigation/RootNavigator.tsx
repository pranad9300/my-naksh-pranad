/** Native stack navigation and screen wiring for the conversation feature. */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ConversationLayout} from '../../features/conversation/ui/layout';
import {
  conversationRepository,
  recommendationExperienceRepository,
} from '../dependencies';

/** Typed route names for the root stack (extend when adding screens). */
export type RootStackParamList = {
  Conversation: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Application navigation tree: single conversation screen with repositories injected.
 * Header hidden — conversation layout owns its own chrome.
 */
export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Conversation">
          {() => (
            <ConversationLayout
              conversationRepository={conversationRepository}
              recommendationRepository={recommendationExperienceRepository}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

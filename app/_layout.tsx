import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '../src/context/AppContext';
import { Toast } from '../src/components/Toast';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <Toast />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.background,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
              fontWeight: '700',
            },
            contentStyle: {
              backgroundColor: Colors.background,
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="class/[id]"
            options={{
              title: 'Детали практики',
              headerBackTitle: 'Назад',
            }}
          />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}

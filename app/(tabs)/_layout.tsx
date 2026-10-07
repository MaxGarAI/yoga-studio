import React from 'react';
import { Tabs } from 'expo-router';
import { Text, Platform } from 'react-native';
import { Colors } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.cardBg,
          borderTopColor: Colors.cardBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Расписание',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Мои записи',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎟</Text>,
        }}
      />
      <Tabs.Screen
        name="memberships"
        options={{
          title: 'Абонементы',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✨</Text>,
        }}
      />
      <Tabs.Screen
        name="instructors"
        options={{
          title: 'Тренеры',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🧘‍♀️</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}

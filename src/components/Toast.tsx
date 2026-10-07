import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { notificationToast, dismissToast } = useApp();

  if (!notificationToast) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} onPress={dismissToast} style={styles.toast}>
        <View style={styles.dot} />
        <Text style={styles.text}>{notificationToast}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.lg,
    ...Shadows.glow,
    maxWidth: 500,
    width: '100%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginRight: 10,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});

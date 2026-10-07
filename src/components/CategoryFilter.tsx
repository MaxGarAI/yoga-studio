import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { YogaCategory } from '../types';

const CATEGORIES: YogaCategory[] = [
  'Все',
  'Хатха-йога',
  'Виньяса-флоу',
  'Аэройога',
  'Инь-йога',
  'Аштанга',
  'Sound Healing',
  'Медитация и пранаяма',
];

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.chip,
                isSelected && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  chipActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

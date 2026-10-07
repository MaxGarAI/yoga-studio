import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { Instructor } from '../types';

interface InstructorCardProps {
  instructor: Instructor;
  onPress?: () => void;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Image source={{ uri: instructor.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{instructor.name}</Text>
          <Text style={styles.title}>{instructor.title}</Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.ratingText}>{instructor.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsText}>({instructor.reviewsCount} отзывов)</Text>
          </View>
        </View>
      </View>

      <Text style={styles.bio}>{instructor.bio}</Text>

      <View style={styles.specialtiesRow}>
        {instructor.specialties.map((spec, i) => (
          <View key={i} style={styles.specTag}>
            <Text style={styles.specText}>{spec}</Text>
          </View>
        ))}
      </View>

      <View style={styles.experienceRow}>
        <Text style={styles.expLabel}>Опыт & регалии:</Text>
        <Text style={styles.expValue}>{instructor.experience}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  title: {
    fontSize: 13,
    color: Colors.primaryLight,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  star: {
    color: Colors.gold,
    fontSize: 14,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  reviewsText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bio: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  specTag: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  specText: {
    fontSize: 11,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  experienceRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 10,
  },
  expLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  expValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

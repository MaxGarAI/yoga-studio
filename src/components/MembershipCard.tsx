import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { MembershipPlan } from '../types';

interface MembershipCardProps {
  plan: MembershipPlan;
  isCurrent?: boolean;
  onBuy: () => void;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({ plan, isCurrent, onBuy }) => {
  return (
    <View
      style={[
        styles.card,
        plan.isPopular && styles.cardPopular,
        isCurrent && styles.cardCurrent,
      ]}
    >
      {/* Badge */}
      {plan.isPopular && (
        <View style={styles.badgePopular}>
          <Text style={styles.badgePopularText}>Хит продаж</Text>
        </View>
      )}
      {plan.isTrial && (
        <View style={styles.badgeTrial}>
          <Text style={styles.badgeTrialText}>Специальная цена</Text>
        </View>
      )}
      {isCurrent && (
        <View style={styles.badgeCurrent}>
          <Text style={styles.badgeCurrentText}>Ваш текущий тариф</Text>
        </View>
      )}

      <Text style={styles.title}>{plan.title}</Text>
      <Text style={styles.description}>{plan.description}</Text>

      {/* Pricing */}
      <View style={styles.priceRow}>
        <Text style={styles.price}>{plan.price.toLocaleString('ru-RU')} ₽</Text>
        {plan.originalPrice && (
          <Text style={styles.originalPrice}>
            {plan.originalPrice.toLocaleString('ru-RU')} ₽
          </Text>
        )}
      </View>

      <Text style={styles.validityText}>
        Срок действия: {plan.validityDays} дней
        {plan.classesCount !== 'unlimited'
          ? ` • ${plan.classesCount} тренировок`
          : ' • Безлимитные посещения'}
      </Text>

      {/* Features List */}
      <View style={styles.featuresList}>
        {plan.features.map((feature, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Buy Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onBuy}
        style={[
          styles.button,
          plan.isPopular && styles.buttonPopular,
          isCurrent && styles.buttonCurrent,
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            isCurrent && styles.buttonCurrentText,
          ]}
        >
          {isCurrent ? 'Продлить абонемент' : 'Купить абонемент'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    position: 'relative',
    ...Shadows.card,
  },
  cardPopular: {
    borderColor: Colors.gold,
    backgroundColor: Colors.cardBgElevated,
  },
  cardCurrent: {
    borderColor: Colors.primary,
  },
  badgePopular: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgePopularText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textInverse,
    textTransform: 'uppercase',
  },
  badgeTrial: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeTrialText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textInverse,
    textTransform: 'uppercase',
  },
  badgeCurrent: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  badgeCurrentText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryLight,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  validityText: {
    fontSize: 13,
    color: Colors.goldLight,
    fontWeight: '600',
    marginBottom: 18,
  },
  featuresList: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 14,
    marginBottom: 20,
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkIcon: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  button: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  buttonPopular: {
    backgroundColor: Colors.gold,
    borderColor: Colors.goldLight,
  },
  buttonCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonCurrentText: {
    color: Colors.textInverse,
  },
});

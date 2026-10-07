import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { MembershipCard } from '../../src/components/MembershipCard';
import { MembershipPlan } from '../../src/types';

export default function MembershipsScreen() {
  const { membershipPlans, user, buyMembership } = useApp();
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<MembershipPlan | null>(null);

  const handleConfirmPurchase = () => {
    if (selectedPlanForPurchase) {
      buyMembership(selectedPlanForPurchase);
      setSelectedPlanForPurchase(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Абонементы" subtitle="Тарифы и клубные карты студии" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Membership status card */}
          {user.activeSubscription && (
            <View style={styles.activeCard}>
              <View style={styles.activeCardTop}>
                <View>
                  <Text style={styles.activeCardSub}>Ваш активный абонемент</Text>
                  <Text style={styles.activeCardTitle}>
                    {user.activeSubscription.planTitle}
                  </Text>
                </View>
                <View style={styles.activeStatusPill}>
                  <Text style={styles.activeStatusPillText}>Активен</Text>
                </View>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {user.activeSubscription.remainingClasses}
                  </Text>
                  <Text style={styles.statLabel}>Осталось практик</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {user.activeSubscription.validUntil}
                  </Text>
                  <Text style={styles.statLabel}>Действует до</Text>
                </View>
              </View>
            </View>
          )}

          {/* Intro text */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Выберите подходящий тариф</Text>
            <Text style={styles.sectionSub}>
              Все абонементы дают доступ ко всем направлениям йоги и залам студии
            </Text>
          </View>

          {/* Plans list */}
          {membershipPlans.map((plan) => {
            const isCurrent = user.activeSubscription?.planId === plan.id;
            return (
              <MembershipCard
                key={plan.id}
                plan={plan}
                isCurrent={isCurrent}
                onBuy={() => setSelectedPlanForPurchase(plan)}
              />
            );
          })}

          {/* Studio perks info */}
          <View style={styles.perksBox}>
            <Text style={styles.perksTitle}>В каждом абонементе включено:</Text>
            <View style={styles.perksGrid}>
              <View style={styles.perkItem}>
                <Text style={styles.perkIcon}>🧘‍♀️</Text>
                <Text style={styles.perkText}>Премиальные коврики Manduka</Text>
              </View>
              <View style={styles.perkItem}>
                <Text style={styles.perkIcon}>🍵</Text>
                <Text style={styles.perkText}>Травяной сбор и вода в чайной зоне</Text>
              </View>
              <View style={styles.perkItem}>
                <Text style={styles.perkIcon}>🚿</Text>
                <Text style={styles.perkText}>Душевые с органической косметикой</Text>
              </View>
              <View style={styles.perkItem}>
                <Text style={styles.perkIcon}>🔒</Text>
                <Text style={styles.perkText}>Индивидуальные шкафчики с замком</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Purchase Confirmation Modal */}
        <Modal
          visible={!!selectedPlanForPurchase}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedPlanForPurchase(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Подтверждение покупки</Text>
              {selectedPlanForPurchase && (
                <>
                  <Text style={styles.modalPlanName}>
                    {selectedPlanForPurchase.title}
                  </Text>
                  <Text style={styles.modalPrice}>
                    {selectedPlanForPurchase.price.toLocaleString('ru-RU')} ₽
                  </Text>
                  <Text style={styles.modalSub}>
                    Срок действия: {selectedPlanForPurchase.validityDays} дней с момента активации.
                  </Text>

                  <View style={styles.paymentMethodMock}>
                    <Text style={styles.mockPayTitle}>Способ оплаты:</Text>
                    <View style={styles.cardPreview}>
                      <Text style={styles.cardPreviewText}>💳 Банковская карта / СБП (•••• 4412)</Text>
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={handleConfirmPurchase}
                      style={styles.modalConfirmBtn}
                    >
                      <Text style={styles.modalConfirmText}>Оплатить {selectedPlanForPurchase.price} ₽</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedPlanForPurchase(null)}
                      style={styles.modalCancelBtn}
                    >
                      <Text style={styles.modalCancelText}>Отмена</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  activeCard: {
    backgroundColor: Colors.cardBgElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.glow,
  },
  activeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activeCardSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  activeCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  activeStatusPill: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  activeStatusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: BorderRadius.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.goldLight,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.cardBorder,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  perksBox: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: Spacing.sm,
  },
  perksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  perksGrid: {
    gap: 12,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkIcon: {
    fontSize: 18,
  },
  perkText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.glow,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  modalPlanName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryLight,
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  paymentMethodMock: {
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
  },
  mockPayTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  cardPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardPreviewText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  modalActions: {
    gap: 10,
  },
  modalConfirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  modalCancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});

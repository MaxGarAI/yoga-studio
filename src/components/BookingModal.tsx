import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { YogaClass } from '../types';
import { useApp } from '../context/AppContext';

interface BookingModalProps {
  visible: boolean;
  yogaClass: YogaClass | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  yogaClass,
  onClose,
  onSuccess,
}) => {
  const { user, bookClass, joinWaitlist } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'membership' | 'single'>('membership');
  const [errorText, setErrorText] = useState<string | null>(null);

  if (!yogaClass) return null;

  const hasMembership =
    user.activeSubscription &&
    (user.activeSubscription.totalClasses === 'unlimited' ||
      (typeof user.activeSubscription.remainingClasses === 'number' &&
        user.activeSubscription.remainingClasses > 0));

  const spotsLeft = yogaClass.capacity - yogaClass.bookedCount;
  const isFull = spotsLeft <= 0;

  const handleConfirm = () => {
    setErrorText(null);
    if (isFull) {
      const res = joinWaitlist(yogaClass.id);
      if (res.success) {
        onSuccess();
      } else {
        setErrorText(res.message);
      }
      return;
    }

    const useMembership = paymentMethod === 'membership' && !!hasMembership;
    const res = bookClass(yogaClass.id, useMembership);
    if (res.success) {
      onSuccess();
    } else {
      setErrorText(res.message);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isFull ? 'Лист ожидания' : 'Запись на практику'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Class Info summary */}
            <View style={styles.classInfoBox}>
              <Text style={styles.classTitle}>{yogaClass.title}</Text>
              <Text style={styles.classInstructor}>Преподаватель: {yogaClass.instructorName}</Text>
              <View style={styles.rowItem}>
                <Text style={styles.infoLabel}>Дата и время:</Text>
                <Text style={styles.infoValue}>
                  {yogaClass.date}, {yogaClass.startTime} – {yogaClass.endTime}
                </Text>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.infoLabel}>Зал:</Text>
                <Text style={styles.infoValue}>{yogaClass.room}</Text>
              </View>
              <View style={styles.rowItem}>
                <Text style={styles.infoLabel}>Доступность:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    isFull ? styles.textError : styles.textPrimary,
                  ]}
                >
                  {isFull ? 'Все места заняты' : `Свободно ${spotsLeft} из ${yogaClass.capacity}`}
                </Text>
              </View>
            </View>

            {/* Payment Method Selector (if not full) */}
            {!isFull && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Способ списания / оплаты</Text>

                {/* Membership Option */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!hasMembership}
                  onPress={() => setPaymentMethod('membership')}
                  style={[
                    styles.optionCard,
                    paymentMethod === 'membership' && hasMembership && styles.optionCardActive,
                    !hasMembership && styles.optionCardDisabled,
                  ]}
                >
                  <View style={styles.radio}>
                    {paymentMethod === 'membership' && hasMembership && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>По абонементу</Text>
                    {hasMembership ? (
                      <Text style={styles.optionSub}>
                        {user.activeSubscription?.planTitle} (осталось{' '}
                        {user.activeSubscription?.remainingClasses} занятий)
                      </Text>
                    ) : (
                      <Text style={[styles.optionSub, styles.textMuted]}>
                        Нет активного абонемента с занятиями
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* Single Pass Option */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setPaymentMethod('single')}
                  style={[
                    styles.optionCard,
                    paymentMethod === 'single' && styles.optionCardActive,
                  ]}
                >
                  <View style={styles.radio}>
                    {paymentMethod === 'single' && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={styles.optionTitle}>Разовая оплата</Text>
                    <Text style={styles.optionSub}>
                      {yogaClass.price} ₽ (оплата при посещении или картой)
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Studio rules alert */}
            <View style={styles.rulesBox}>
              <Text style={styles.rulesTitle}>Правила отмены</Text>
              <Text style={styles.rulesText}>
                Бесплатная отмена записи доступна не позднее чем за 3 часа до начала тренировки.
                При более поздней отмене занятие списывается с абонемента.
              </Text>
            </View>

            {errorText && <Text style={styles.errorText}>{errorText}</Text>}
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirm}
              style={[
                styles.confirmButton,
                isFull && styles.waitlistConfirmBtn,
              ]}
            >
              <Text
                style={[
                  styles.confirmBtnText,
                  isFull && styles.waitlistConfirmBtnText,
                ]}
              >
                {isFull ? 'Встать в лист ожидания' : 'Подтвердить запись'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.glow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  body: {
    padding: Spacing.md,
  },
  classInfoBox: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  classInstructor: {
    fontSize: 13,
    color: Colors.primary,
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  textPrimary: {
    color: Colors.primaryLight,
  },
  textError: {
    color: Colors.error,
  },
  textMuted: {
    color: Colors.textMuted,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 8,
  },
  optionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(78, 186, 135, 0.08)',
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  optionSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  rulesBox: {
    backgroundColor: 'rgba(229, 192, 123, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  rulesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.goldLight,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  rulesText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  waitlistConfirmBtn: {
    backgroundColor: Colors.gold,
  },
  waitlistConfirmBtnText: {
    color: Colors.textInverse,
  },
});

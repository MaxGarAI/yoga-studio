import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { QrModal } from '../../src/components/QrModal';
import { Booking } from '../../src/types';
import { useRouter } from 'expo-router';

export default function BookingsScreen() {
  const { bookings, cancelBooking } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [selectedBookingForQr, setSelectedBookingForQr] = useState<Booking | null>(null);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'active' || b.status === 'waitlist'
  );
  const historyBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : historyBookings;

  const handleCancel = (booking: Booking) => {
    // Check if within safe time
    const res = cancelBooking(booking.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Мои записи" subtitle="Ваши билеты и история тренировок" />

        {/* Tab switchers */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'upcoming' && styles.tabBtnTextActive,
              ]}
            >
              Предстоящие ({upcomingBookings.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'history' && styles.tabBtnTextActive,
              ]}
            >
              История & Отмены
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <FlatList
          data={displayedList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isActive = item.status === 'active';
            const isWaitlist = item.status === 'waitlist';
            const isCancelled = item.status === 'cancelled';

            return (
              <View style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text style={styles.timeText}>
                      {item.startTime} – {item.endTime}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isActive && styles.statusActive,
                      isWaitlist && styles.statusWaitlist,
                      isCancelled && styles.statusCancelled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        isActive && styles.statusTextActive,
                        isWaitlist && styles.statusTextWaitlist,
                        isCancelled && styles.statusTextCancelled,
                      ]}
                    >
                      {isActive
                        ? 'Подтверждено'
                        : isWaitlist
                        ? 'Лист ожидания'
                        : 'Отменено'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.classTitle}>{item.className}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaItem}>🧘‍♀️ {item.instructorName}</Text>
                  <Text style={styles.metaItem}>📍 {item.room}</Text>
                </View>

                {/* Actions */}
                {isActive && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setSelectedBookingForQr(item)}
                      style={styles.qrButton}
                    >
                      <Text style={styles.qrButtonText}>📱 QR-пропуск</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleCancel(item)}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Отменить</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isWaitlist && (
                  <View style={styles.waitlistNotice}>
                    <Text style={styles.waitlistNoticeText}>
                      Вам придет push-уведомление, как только кто-то отменит запись.
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleCancel(item)}
                      style={styles.cancelWaitlistBtn}
                    >
                      <Text style={styles.cancelWaitlistText}>Покинуть лист ожидания</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎫</Text>
              <Text style={styles.emptyTitle}>
                {activeTab === 'upcoming'
                  ? 'У вас пока нет активных записей'
                  : 'История посещений пуста'}
              </Text>
              <Text style={styles.emptySub}>
                {activeTab === 'upcoming'
                  ? 'Выберите удобное время в расписании и запишитесь на практику!'
                  : 'Все завершенные и отмененные тренировки будут отображаться здесь.'}
              </Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)')}
                  style={styles.goScheduleBtn}
                >
                  <Text style={styles.goScheduleBtnText}>Перейти к расписанию</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* QR pass Modal */}
        <QrModal
          visible={!!selectedBookingForQr}
          booking={selectedBookingForQr}
          onClose={() => setSelectedBookingForQr(null)}
        />
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.cardBgElevated,
    borderRadius: BorderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tabBtnActive: {
    backgroundColor: Colors.surfaceLight,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  bookingCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dateBlock: {
    gap: 2,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.goldLight,
    textTransform: 'uppercase',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusActive: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statusWaitlist: {
    backgroundColor: Colors.goldMuted,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  statusCancelled: {
    backgroundColor: 'rgba(224, 108, 117, 0.15)',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextActive: {
    color: Colors.primary,
  },
  statusTextWaitlist: {
    color: Colors.gold,
  },
  statusTextCancelled: {
    color: Colors.error,
  },
  classTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  metaItem: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 12,
  },
  qrButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  qrButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  waitlistNotice: {
    backgroundColor: Colors.surfaceLight,
    padding: 10,
    borderRadius: BorderRadius.sm,
    marginTop: 6,
  },
  waitlistNoticeText: {
    fontSize: 12,
    color: Colors.goldLight,
    lineHeight: 16,
    marginBottom: 6,
  },
  cancelWaitlistBtn: {
    alignSelf: 'flex-start',
  },
  cancelWaitlistText: {
    fontSize: 11,
    color: Colors.error,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
    marginBottom: 20,
  },
  goScheduleBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  goScheduleBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});

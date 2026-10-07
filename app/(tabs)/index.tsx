import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { DaySelector } from '../../src/components/DaySelector';
import { CategoryFilter } from '../../src/components/CategoryFilter';
import { ClassCard } from '../../src/components/ClassCard';
import { BookingModal } from '../../src/components/BookingModal';
import { AddClassModal } from '../../src/components/AddClassModal';
import { ClassAttendeesModal } from '../../src/components/ClassAttendeesModal';
import { YogaClass } from '../../src/types';
import { useRouter } from 'expo-router';

export default function ScheduleScreen() {
  const { classes, selectedDate, selectedCategory, user } = useApp();
  const router = useRouter();

  const [bookingTarget, setBookingTarget] = useState<YogaClass | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addClassModalVisible, setAddClassModalVisible] = useState(false);
  const [attendeesTarget, setAttendeesTarget] = useState<YogaClass | null>(null);

  // Filter classes by selected date and category
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const matchDate = c.date === selectedDate;
      const matchCategory =
        selectedCategory === 'Все' || c.category === selectedCategory;
      return matchDate && matchCategory;
    });
  }, [classes, selectedDate, selectedCategory]);

  const handleOpenBooking = (yogaClass: YogaClass) => {
    setBookingTarget(yogaClass);
    setModalVisible(true);
  };

  const handleOpenDetails = (yogaClass: YogaClass) => {
    router.push({
      pathname: '/class/[id]',
      params: { id: yogaClass.id },
    });
  };

  const handleOpenAttendees = (yogaClass: YogaClass) => {
    setAttendeesTarget(yogaClass);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header />

        {/* Admin Action Bar (Only visible when user is Admin) */}
        {user.role === 'admin' ? (
          <View style={styles.adminBanner}>
            <View style={styles.adminBannerInfo}>
              <Text style={styles.adminBannerBadge}>🛡 Режим Администратора</Text>
              <Text style={styles.adminBannerText}>Управление расписанием и группами</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.addClassBtn}
              onPress={() => setAddClassModalVisible(true)}
            >
              <Text style={styles.addClassBtnText}>➕ Добавить практику</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Client Active Subscription Bar */
          user.activeSubscription && (
            <View style={styles.subscriptionBanner}>
              <View style={styles.subBannerLeft}>
                <Text style={styles.subBannerIcon}>✨</Text>
                <View>
                  <Text style={styles.subBannerTitle}>{user.activeSubscription.planTitle}</Text>
                  <Text style={styles.subBannerSub}>
                    Осталось занятий: {user.activeSubscription.remainingClasses} • до{' '}
                    {user.activeSubscription.validUntil}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/memberships')}
                style={styles.subBannerAction}
              >
                <Text style={styles.subBannerActionText}>Продлить</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        <DaySelector />
        <CategoryFilter />

        {/* Classes List */}
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ClassCard
              yogaClass={item}
              onPress={() => handleOpenDetails(item)}
              onBookPress={() => handleOpenBooking(item)}
              onAdminManage={() => handleOpenAttendees(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🧘</Text>
              <Text style={styles.emptyTitle}>На эту дату занятий не найдено</Text>
              <Text style={styles.emptySub}>
                {user.role === 'admin'
                  ? 'Вы можете нажать кнопку "Добавить практику" выше, чтобы создать занятие на эту дату.'
                  : 'Попробуйте выбрать другой день в календаре или изменить фильтр направления.'}
              </Text>
            </View>
          }
        />

        {/* Booking Confirmation Modal (Client) */}
        <BookingModal
          visible={modalVisible}
          yogaClass={bookingTarget}
          onClose={() => setModalVisible(false)}
          onSuccess={() => setModalVisible(false)}
        />

        {/* Add Class Modal (Admin Only) */}
        <AddClassModal
          visible={addClassModalVisible}
          onClose={() => setAddClassModalVisible(false)}
        />

        {/* Class Attendees / Roster Modal (Admin Only) */}
        <ClassAttendeesModal
          visible={!!attendeesTarget}
          yogaClass={attendeesTarget}
          onClose={() => setAttendeesTarget(null)}
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
  adminBanner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    padding: 12,
    backgroundColor: 'rgba(229, 192, 123, 0.12)',
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.gold,
    ...Shadows.glow,
  },
  adminBannerInfo: {
    flex: 1,
  },
  adminBannerBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gold,
    textTransform: 'uppercase',
  },
  adminBannerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addClassBtn: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  addClassBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  subscriptionBanner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
    padding: 12,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.primaryDark,
  },
  subBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  subBannerIcon: {
    fontSize: 18,
  },
  subBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  subBannerSub: {
    fontSize: 11,
    color: Colors.primaryLight,
    marginTop: 2,
  },
  subBannerAction: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  subBannerActionText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
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
  },
});

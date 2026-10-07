import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { YogaClass } from '../types';
import { useApp } from '../context/AppContext';

interface ClassCardProps {
  yogaClass: YogaClass;
  onPress: () => void;
  onBookPress: () => void;
  onAdminManage?: () => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  yogaClass,
  onPress,
  onBookPress,
  onAdminManage,
}) => {
  const { bookings, user, getClassAttendees } = useApp();

  const isBooked = bookings.some(
    (b) => b.classId === yogaClass.id && b.userId === user.id && b.status === 'active'
  );
  const isWaitlist = bookings.some(
    (b) => b.classId === yogaClass.id && b.userId === user.id && b.status === 'waitlist'
  );

  const attendees = getClassAttendees(yogaClass.id);
  const activeAttendeesCount = attendees.filter((a) => a.status === 'active').length;
  const spotsLeft = yogaClass.capacity - activeAttendeesCount;
  const isFull = spotsLeft <= 0;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={user.role === 'admin' && onAdminManage ? onAdminManage : onPress}
      style={[
        styles.card,
        isBooked && styles.cardBooked,
        user.role === 'admin' && styles.cardAdmin,
      ]}
    >
      {/* Top row: Time, Duration & Status Badge */}
      <View style={styles.topRow}>
        <View style={styles.timeGroup}>
          <Text style={styles.timeText}>{yogaClass.startTime}</Text>
          <Text style={styles.durationText}>– {yogaClass.endTime} ({yogaClass.durationMinutes} мин)</Text>
        </View>

        {user.role === 'admin' ? (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>
              👥 Записано: {activeAttendeesCount}/{yogaClass.capacity}
            </Text>
          </View>
        ) : isBooked ? (
          <View style={styles.bookedBadge}>
            <Text style={styles.bookedBadgeText}>✓ Вы записаны</Text>
          </View>
        ) : isWaitlist ? (
          <View style={styles.waitlistBadge}>
            <Text style={styles.waitlistBadgeText}>В листе ожидания</Text>
          </View>
        ) : isFull ? (
          <View style={styles.fullBadge}>
            <Text style={styles.fullBadgeText}>Мест нет</Text>
          </View>
        ) : (
          <View style={[styles.spotsBadge, spotsLeft <= 3 && styles.spotsBadgeLow]}>
            <Text style={[styles.spotsText, spotsLeft <= 3 && styles.spotsTextLow]}>
              {spotsLeft <= 3 ? `Осталось ${spotsLeft} места` : `${spotsLeft} мест`}
            </Text>
          </View>
        )}
      </View>

      {/* Main title & category */}
      <Text style={styles.title}>{yogaClass.title}</Text>
      
      <View style={styles.metaRow}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{yogaClass.category}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{yogaClass.level}</Text>
        </View>
        <View style={styles.roomTag}>
          <Text style={styles.roomTagText}>{yogaClass.room}</Text>
        </View>
      </View>

      {/* Instructor info and Action Button */}
      <View style={styles.bottomRow}>
        <View style={styles.instructorInfo}>
          <Image source={{ uri: yogaClass.instructorAvatar }} style={styles.instructorAvatar} />
          <View>
            <Text style={styles.instructorName}>{yogaClass.instructorName}</Text>
            <Text style={styles.priceText}>{yogaClass.price} ₽ или абонемент</Text>
          </View>
        </View>

        {user.role === 'admin' ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onAdminManage}
            style={styles.adminManageButton}
          >
            <Text style={styles.adminManageButtonText}>👥 Журнал группы</Text>
          </TouchableOpacity>
        ) : isBooked ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.detailsButton}
          >
            <Text style={styles.detailsButtonText}>Билет & QR</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBookPress}
            style={[
              styles.bookButton,
              isFull && styles.waitlistButton,
            ]}
          >
            <Text style={[styles.bookButtonText, isFull && styles.waitlistButtonText]}>
              {isFull ? 'Лист ожидания' : 'Записаться'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.card,
  },
  cardBooked: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardBgElevated,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  timeText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  durationText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  spotsBadge: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  spotsBadgeLow: {
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  spotsText: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '600',
  },
  spotsTextLow: {
    color: Colors.warning,
    fontWeight: '700',
  },
  fullBadge: {
    backgroundColor: 'rgba(224, 108, 117, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  fullBadgeText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
  },
  bookedBadge: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  bookedBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '700',
  },
  waitlistBadge: {
    backgroundColor: Colors.goldMuted,
    borderColor: Colors.gold,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  waitlistBadgeText: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tag: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  roomTag: {
    backgroundColor: 'rgba(229, 192, 123, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  roomTagText: {
    fontSize: 11,
    color: Colors.goldLight,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  instructorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  instructorName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  priceText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  waitlistButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  waitlistButtonText: {
    color: Colors.gold,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
  },
  detailsButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  cardAdmin: {
    borderColor: 'rgba(229, 192, 123, 0.4)',
  },
  adminBadge: {
    backgroundColor: 'rgba(229, 192, 123, 0.15)',
    borderColor: Colors.gold,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  adminBadgeText: {
    fontSize: 12,
    color: Colors.goldLight,
    fontWeight: '700',
  },
  adminManageButton: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminManageButtonText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
});

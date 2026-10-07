import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { YogaClass, Booking } from '../types';
import { useApp } from '../context/AppContext';

interface ClassAttendeesModalProps {
  visible: boolean;
  yogaClass: YogaClass | null;
  onClose: () => void;
}

export const ClassAttendeesModal: React.FC<ClassAttendeesModalProps> = ({
  visible,
  yogaClass,
  onClose,
}) => {
  const { getClassAttendees, toggleAttendeeCheckIn, deleteClass, user } = useApp();

  if (!yogaClass) return null;

  const attendees = getClassAttendees(yogaClass.id);
  const activeAttendees = attendees.filter((a) => a.status === 'active');
  const waitlistAttendees = attendees.filter((a) => a.status === 'waitlist');
  const attendedCount = activeAttendees.filter((a) => a.attended).length;

  const handleDelete = () => {
    deleteClass(yogaClass.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.badgeAdmin}>🛡 Панель администратора</Text>
              <Text style={styles.headerTitle}>Журнал записи участников</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Class Summary */}
          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>{yogaClass.title}</Text>
            <Text style={styles.classMeta}>
              📅 {yogaClass.date} • ⏰ {yogaClass.startTime} – {yogaClass.endTime} • 📍 {yogaClass.room}
            </Text>
            <Text style={styles.instructorText}>Преподаватель: {yogaClass.instructorName}</Text>

            {/* Attendance Counter */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>
                  {activeAttendees.length} / {yogaClass.capacity}
                </Text>
                <Text style={styles.statLabel}>Записано</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: Colors.primaryLight }]}>
                  {attendedCount}
                </Text>
                <Text style={styles.statLabel}>Отмечено (Чек-ин)</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={[styles.statNum, { color: Colors.goldLight }]}>
                  {waitlistAttendees.length}
                </Text>
                <Text style={styles.statLabel}>Лист ожидания</Text>
              </View>
            </View>
          </View>

          {/* Attendees List */}
          <View style={styles.listContainer}>
            <Text style={styles.sectionHeading}>
              Список группы ({activeAttendees.length}):
            </Text>

            <FlatList
              data={activeAttendees}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={[styles.attendeeItem, item.attended && styles.attendeeItemAttended]}>
                  <View style={styles.indexCircle}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                  </View>

                  <View style={styles.attendeeInfo}>
                    <Text style={styles.attendeeName}>{item.userName}</Text>
                    <Text style={styles.attendeePhone}>{item.userPhone}</Text>
                    <Text style={styles.paymentType}>
                      {item.usedMembershipId ? 'По абонементу' : `Оплачено разово (${item.pricePaid || yogaClass.price} ₽)`}
                    </Text>
                  </View>

                  {/* Check-in button */}
                  <TouchableOpacity
                    style={[styles.checkInBtn, item.attended && styles.checkInBtnActive]}
                    onPress={() => toggleAttendeeCheckIn(item.id)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.checkInText, item.attended && styles.checkInTextActive]}>
                      {item.attended ? '✓ Пришел' : 'Отметить'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={styles.emptyText}>На это занятие еще никто не записался</Text>
                </View>
              }
            />

            {/* Waitlist (if any) */}
            {waitlistAttendees.length > 0 && (
              <View style={styles.waitlistSection}>
                <Text style={styles.waitlistHeading}>
                  Лист ожидания ({waitlistAttendees.length}):
                </Text>
                {waitlistAttendees.map((w, i) => (
                  <View key={w.id} style={styles.waitlistItem}>
                    <Text style={styles.waitlistNum}>{i + 1}.</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.waitlistName}>{w.userName}</Text>
                      <Text style={styles.waitlistPhone}>{w.userPhone}</Text>
                    </View>
                    <Text style={styles.waitlistBadge}>Ожидает место</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Admin Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.deleteClassBtn}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteClassText}>🗑 Отменить / Удалить занятие</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>Закрыть</Text>
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
    maxWidth: 520,
    maxHeight: '92%',
    borderWidth: 1,
    borderColor: Colors.gold,
    ...Shadows.glow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  badgeAdmin: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.gold,
    textTransform: 'uppercase',
    marginBottom: 2,
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
  classInfo: {
    padding: Spacing.md,
    backgroundColor: Colors.cardBgElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  classMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  instructorText: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontWeight: '600',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: 8,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.cardBorder,
  },
  listContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    padding: 10,
    borderRadius: BorderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  attendeeItemAttended: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(78, 186, 135, 0.08)',
  },
  indexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  indexText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  attendeePhone: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginTop: 1,
  },
  paymentType: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  checkInBtn: {
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
  },
  checkInBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
  },
  checkInText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  checkInTextActive: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  waitlistSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  waitlistHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.goldLight,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  waitlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  waitlistNum: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '700',
    width: 20,
  },
  waitlistName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  waitlistPhone: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  waitlistBadge: {
    fontSize: 10,
    color: Colors.goldLight,
    backgroundColor: 'rgba(229, 192, 123, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    gap: 10,
  },
  deleteClassBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(224, 108, 117, 0.12)',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteClassText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  doneBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});

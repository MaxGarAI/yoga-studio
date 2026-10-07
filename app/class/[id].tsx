import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { BookingModal } from '../../src/components/BookingModal';
import { QrModal } from '../../src/components/QrModal';

export default function ClassDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { classes, bookings } = useApp();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const yogaClass = classes.find((c) => c.id === id);

  if (!yogaClass) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Практика не найдена</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Вернуться назад</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const activeBooking = bookings.find(
    (b) => b.classId === yogaClass.id && b.status === 'active'
  );
  const isWaitlist = bookings.some(
    (b) => b.classId === yogaClass.id && b.status === 'waitlist'
  );

  const spotsLeft = yogaClass.capacity - yogaClass.bookedCount;
  const isFull = spotsLeft <= 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.imageWrapper}>
            <Image source={{ uri: yogaClass.image }} style={styles.heroImage} />
            <View style={styles.imageOverlay} />
            <View style={styles.imageContent}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{yogaClass.category}</Text>
              </View>
              <Text style={styles.title}>{yogaClass.title}</Text>
            </View>
          </View>

          <View style={styles.content}>
            {/* Quick Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Время</Text>
                <Text style={styles.metricValue}>
                  {yogaClass.startTime} – {yogaClass.endTime}
                </Text>
                <Text style={styles.metricSub}>{yogaClass.durationMinutes} минут</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Уровень</Text>
                <Text style={styles.metricValue}>{yogaClass.level}</Text>
                <Text style={styles.metricSub}>Интенсивность: {'🔥'.repeat(yogaClass.intensity)}</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Зал</Text>
                <Text style={styles.metricValue}>{yogaClass.room.split(' ')[0]}</Text>
                <Text style={styles.metricSub}>{yogaClass.room.split('(')[1]?.replace(')', '') || 'Основной'}</Text>
              </View>
            </View>

            {/* Instructor Card */}
            <View style={styles.instructorSection}>
              <Text style={styles.sectionTitle}>Преподаватель</Text>
              <View style={styles.instructorCard}>
                <Image
                  source={{ uri: yogaClass.instructorAvatar }}
                  style={styles.instructorAvatar}
                />
                <View style={styles.instructorInfo}>
                  <Text style={styles.instructorName}>{yogaClass.instructorName}</Text>
                  <Text style={styles.instructorRole}>Ведущий мастер практики</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>О занятии</Text>
              <Text style={styles.descriptionText}>{yogaClass.description}</Text>
            </View>

            {/* Benefits */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Что дает эта практика:</Text>
              <View style={styles.benefitsList}>
                {yogaClass.benefits.map((benefit, idx) => (
                  <View key={idx} style={styles.benefitItem}>
                    <Text style={styles.benefitBullet}>✦</Text>
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Equipment */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Инвентарь и подготовка</Text>
              <View style={styles.equipmentBox}>
                {yogaClass.equipmentNeeded.map((eq, idx) => (
                  <View key={idx} style={styles.equipmentItem}>
                    <Text style={styles.equipmentCheck}>✓</Text>
                    <Text style={styles.equipmentText}>{eq}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Стоимость</Text>
            <Text style={styles.priceValue}>{yogaClass.price} ₽</Text>
            <Text style={styles.pricePassText}>или по абонементу</Text>
          </View>

          {activeBooking ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setQrModalVisible(true)}
              style={styles.actionBooked}
            >
              <Text style={styles.actionBookedText}>✓ Вы записаны (QR)</Text>
            </TouchableOpacity>
          ) : isWaitlist ? (
            <View style={styles.actionWaitlist}>
              <Text style={styles.actionWaitlistText}>Вы в листе ожидания</Text>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setModalVisible(true)}
              style={[
                styles.actionBook,
                isFull && styles.actionWaitlistBtn,
              ]}
            >
              <Text
                style={[
                  styles.actionBookText,
                  isFull && styles.actionWaitlistBtnText,
                ]}
              >
                {isFull ? 'В лист ожидания' : 'Записаться'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Booking & QR Modals */}
        <BookingModal
          visible={modalVisible}
          yogaClass={yogaClass}
          onClose={() => setModalVisible(false)}
          onSuccess={() => setModalVisible(false)}
        />

        <QrModal
          visible={qrModalVisible}
          booking={activeBooking || null}
          onClose={() => setQrModalVisible(false)}
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
  scrollView: {
    flex: 1,
  },
  imageWrapper: {
    height: 240,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(13, 20, 18, 0.55)',
  },
  imageContent: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    marginBottom: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textInverse,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 28,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.lg,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 11,
    color: Colors.primaryLight,
  },
  metricDivider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.cardBorder,
    alignSelf: 'center',
  },
  instructorSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  instructorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.cardBg,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  instructorRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitBullet: {
    color: Colors.gold,
    fontSize: 12,
  },
  benefitText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  equipmentBox: {
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  equipmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  equipmentCheck: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  equipmentText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.glow,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  pricePassText: {
    fontSize: 10,
    color: Colors.primaryLight,
  },
  actionBook: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  actionBookText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  actionWaitlistBtn: {
    backgroundColor: Colors.gold,
  },
  actionWaitlistBtnText: {
    color: Colors.textInverse,
  },
  actionBooked: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  actionBookedText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  actionWaitlist: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.gold,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  actionWaitlistText: {
    color: Colors.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  backBtnText: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
});

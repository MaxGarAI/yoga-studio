import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { AuthModal } from '../../src/components/AuthModal';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, toggleNotifications, toggleSms, switchRole, classes, bookings } = useApp();
  const router = useRouter();

  const [authModalVisible, setAuthModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Мой профиль" subtitle="Настройки аккаунта и права доступа" showProfileAvatar={false} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* User Profile Card */}
          <View style={[styles.userCard, user.role === 'admin' && styles.userCardAdmin]}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <View style={styles.roleBadgeContainer}>
                <View style={[styles.roleBadge, user.role === 'admin' ? styles.roleBadgeAdmin : styles.roleBadgeClient]}>
                  <Text style={[styles.roleBadgeText, user.role === 'admin' ? styles.roleBadgeTextAdmin : styles.roleBadgeTextClient]}>
                    {user.role === 'admin' ? '🛡 Администратор студии' : '👤 Клиент студии'}
                  </Text>
                </View>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          {/* Role Switcher & Auth Section */}
          <View style={styles.authSection}>
            <View style={styles.authRow}>
              <TouchableOpacity
                style={styles.authButton}
                onPress={() => setAuthModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.authButtonText}>🔑 Войти / Регистрация</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleRoleBtn,
                  user.role === 'admin' ? styles.toggleRoleToClient : styles.toggleRoleToAdmin,
                ]}
                onPress={() => switchRole(user.role === 'admin' ? 'client' : 'admin')}
                activeOpacity={0.85}
              >
                <Text style={styles.toggleRoleText}>
                  {user.role === 'admin' ? 'Переключить на Клиента' : 'Переключить на Админа'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Admin Stats Overview (if admin) or Client Stats */}
          {user.role === 'admin' ? (
            <View style={styles.adminStatsCard}>
              <Text style={styles.adminStatsTitle}>Сводка администратора</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>📅</Text>
                  <Text style={styles.statNumber}>{classes.length}</Text>
                  <Text style={styles.statLabel}>Занятий в базе</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>👥</Text>
                  <Text style={styles.statNumber}>
                    {bookings.filter((b) => b.status === 'active').length}
                  </Text>
                  <Text style={styles.statLabel}>Всего броней</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statIcon}>🧘‍♀️</Text>
                  <Text style={styles.statNumber}>4</Text>
                  <Text style={styles.statLabel}>Инструктора</Text>
                </View>
              </View>
            </View>
          ) : (
            /* Client Stats Row */
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🧘‍♀️</Text>
                <Text style={styles.statNumber}>{user.attendedClassesCount}</Text>
                <Text style={styles.statLabel}>Посещений</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statNumber}>{(user.totalMinutes / 60).toFixed(0)} ч</Text>
                <Text style={styles.statLabel}>В практике</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={styles.statNumber}>{user.currentStreak}</Text>
                <Text style={styles.statLabel}>Недели стрик</Text>
              </View>
            </View>
          )}

          {/* Active Membership Widget (Client only) */}
          {user.role === 'client' && (
            <View style={styles.membershipWidget}>
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetTitle}>Текущий абонемент</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/memberships')}>
                  <Text style={styles.widgetAction}>Все тарифы →</Text>
                </TouchableOpacity>
              </View>
              {user.activeSubscription ? (
                <View style={styles.subInfoBox}>
                  <Text style={styles.subTitle}>{user.activeSubscription.planTitle}</Text>
                  <Text style={styles.subDetail}>
                    Осталось занятий: <Text style={styles.textHighlight}>{user.activeSubscription.remainingClasses}</Text>
                  </Text>
                  <Text style={styles.subDetail}>
                    Действует до: <Text style={styles.textHighlight}>{user.activeSubscription.validUntil}</Text>
                  </Text>
                </View>
              ) : (
                <Text style={styles.noSubText}>У вас нет активного абонемента</Text>
              )}
            </View>
          )}

          {/* Notifications Settings */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Уведомления и напоминания</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>Push-напоминания</Text>
                <Text style={styles.settingDesc}>
                  Уведомлять за 2 часа до начала занятия
                </Text>
              </View>
              <Switch
                value={user.notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryDark }}
                thumbColor={user.notificationsEnabled ? Colors.primary : Colors.textMuted}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingTextGroup}>
                <Text style={styles.settingLabel}>SMS-информирование</Text>
                <Text style={styles.settingDesc}>
                  Сообщения об отмене или замене тренера
                </Text>
              </View>
              <Switch
                value={user.smsReminders}
                onValueChange={toggleSms}
                trackColor={{ false: Colors.surfaceLight, true: Colors.primaryDark }}
                thumbColor={user.smsReminders ? Colors.primary : Colors.textMuted}
              />
            </View>
          </View>

          {/* Studio Location & Contacts */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>О студии Prana</Text>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📍</Text>
              <View>
                <Text style={styles.contactTitle}>Адрес студии</Text>
                <Text style={styles.contactValue}>ул. Большая Полянка, д. 28, стр. 1 (м. Полянка)</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞</Text>
              <View>
                <Text style={styles.contactTitle}>Ресепшн / WhatsApp</Text>
                <Text style={styles.contactValue}>+7 (495) 789-32-10 (с 07:30 до 22:00)</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>🕒</Text>
              <View>
                <Text style={styles.contactTitle}>Режим работы</Text>
                <Text style={styles.contactValue}>Ежедневно с 07:00 до 22:30</Text>
              </View>
            </View>
          </View>

          {/* Studio Rules */}
          <View style={styles.rulesCard}>
            <Text style={styles.rulesCardTitle}>Правила посещения студии</Text>
            <Text style={styles.rulesCardText}>
              • Приходите за 10-15 минут до начала практики для спокойного переодевания.{'\n'}
              • Пожалуйста, переводите телефоны в беззвучный режим.{'\n'}
              • Студия предоставляет коврики, пледы и полотенца бесплатно.
            </Text>
          </View>
        </ScrollView>

        {/* Auth Modal */}
        <AuthModal
          visible={authModalVisible}
          onClose={() => setAuthModalVisible(false)}
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
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.sm,
    ...Shadows.card,
  },
  userCardAdmin: {
    borderColor: Colors.gold,
    backgroundColor: Colors.cardBgElevated,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  roleBadgeClient: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  roleBadgeAdmin: {
    backgroundColor: 'rgba(229, 192, 123, 0.15)',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  roleBadgeTextClient: {
    color: Colors.primaryLight,
  },
  roleBadgeTextAdmin: {
    color: Colors.goldLight,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.primaryLight,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  authSection: {
    marginBottom: Spacing.md,
  },
  authRow: {
    flexDirection: 'row',
    gap: 10,
  },
  authButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  authButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRoleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  toggleRoleToAdmin: {
    backgroundColor: 'rgba(229, 192, 123, 0.15)',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  toggleRoleToClient: {
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  toggleRoleText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  adminStatsCard: {
    backgroundColor: Colors.cardBgElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gold,
    marginBottom: Spacing.md,
  },
  adminStatsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.goldLight,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  membershipWidget: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.md,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  widgetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  widgetAction: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  subInfoBox: {
    backgroundColor: Colors.surfaceLight,
    padding: 12,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.goldLight,
    marginBottom: 2,
  },
  subDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textHighlight: {
    color: Colors.text,
    fontWeight: '700',
  },
  noSubText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 10,
  },
  contactItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 18,
  },
  contactTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  rulesCard: {
    backgroundColor: 'rgba(229, 192, 123, 0.08)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
    marginBottom: Spacing.lg,
  },
  rulesCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.goldLight,
    marginBottom: 6,
  },
  rulesCardText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

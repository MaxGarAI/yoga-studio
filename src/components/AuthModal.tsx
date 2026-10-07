import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const { loginUser, registerUser, switchRole } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginInput, setLoginInput] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const handleLogin = (role: 'client' | 'admin' = 'client') => {
    loginUser(loginInput || (role === 'admin' ? 'admin@pranayoga.ru' : '+7 (999) 123-45-67'), role);
    onClose();
  };

  const handleRegister = () => {
    if (!regName.trim() || !regPhone.trim()) return;
    registerUser(regName, regPhone, regEmail);
    onClose();
  };

  const handleQuickRole = (role: 'client' | 'admin') => {
    switchRole(role);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {tab === 'login' ? 'Вход в аккаунт' : 'Регистрация нового клиента'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'login' && styles.tabBtnActive]}
              onPress={() => setTab('login')}
            >
              <Text style={[styles.tabBtnText, tab === 'login' && styles.tabBtnTextActive]}>
                Вход
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, tab === 'register' && styles.tabBtnActive]}
              onPress={() => setTab('register')}
            >
              <Text style={[styles.tabBtnText, tab === 'register' && styles.tabBtnTextActive]}>
                Новый клиент
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {tab === 'login' ? (
              <View style={styles.form}>
                <Text style={styles.inputLabel}>Телефон или Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+7 (___) ___-__-__ или email"
                  placeholderTextColor={Colors.textMuted}
                  value={loginInput}
                  onChangeText={setLoginInput}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => handleLogin('client')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>Войти по SMS / Коду</Text>
                </TouchableOpacity>

                {/* Quick Role Switchers for testing */}
                <View style={styles.quickAccessSection}>
                  <Text style={styles.quickAccessTitle}>Быстрый вход для демонстрации:</Text>
                  
                  <TouchableOpacity
                    style={styles.demoClientBtn}
                    onPress={() => handleQuickRole('client')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.demoClientText}>👤 Войти как Клиент (Екатерина)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.demoAdminBtn}
                    onPress={() => handleQuickRole('admin')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.demoAdminText}>🛡 Войти как Администратор студии</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.form}>
                <Text style={styles.inputLabel}>Ваше имя</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Имя и Фамилия"
                  placeholderTextColor={Colors.textMuted}
                  value={regName}
                  onChangeText={setRegName}
                />

                <Text style={styles.inputLabel}>Номер телефона</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+7 (999) 000-00-00"
                  placeholderTextColor={Colors.textMuted}
                  value={regPhone}
                  onChangeText={setRegPhone}
                  keyboardType="phone-pad"
                />

                <Text style={styles.inputLabel}>Email (для чеков и билетов)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@mail.ru"
                  placeholderTextColor={Colors.textMuted}
                  value={regEmail}
                  onChangeText={setRegEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.giftBanner}>
                  <Text style={styles.giftIcon}>🎁</Text>
                  <Text style={styles.giftText}>
                    При регистрации вы сразу получаете 1 бесплатное пробное занятие в подарок!
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleRegister}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>Зарегистрироваться</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
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
    maxWidth: 440,
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
    fontSize: 17,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBgElevated,
    margin: Spacing.md,
    marginBottom: Spacing.xs,
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
  body: {
    padding: Spacing.md,
  },
  form: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: Colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },
  giftBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(229, 192, 123, 0.12)',
    borderWidth: 1,
    borderColor: Colors.gold,
    borderRadius: BorderRadius.md,
    padding: 12,
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  giftIcon: {
    fontSize: 22,
  },
  giftText: {
    fontSize: 12,
    color: Colors.goldLight,
    flex: 1,
    lineHeight: 16,
  },
  quickAccessSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    paddingTop: 16,
    gap: 10,
  },
  quickAccessTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  demoClientBtn: {
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
  },
  demoClientText: {
    color: Colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
  },
  demoAdminBtn: {
    backgroundColor: 'rgba(229, 192, 123, 0.15)',
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.md,
  },
  demoAdminText: {
    color: Colors.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
});

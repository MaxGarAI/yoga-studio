import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showProfileAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Prana Yoga Studio',
  subtitle = 'Гармония тела и сознания',
  showProfileAvatar = true,
}) => {
  const { user } = useApp();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {showProfileAvatar && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.avatarButton}
        >
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          {user.activeSubscription && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{user.activeSubscription.remainingClasses}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    position: 'relative',
    marginLeft: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  activeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
});

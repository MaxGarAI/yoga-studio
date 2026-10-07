import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Colors, Spacing } from '../../src/constants/theme';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { InstructorCard } from '../../src/components/InstructorCard';

export default function InstructorsScreen() {
  const { instructors } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Преподаватели" subtitle="Сертифицированные мастера йоги" />

        <FlatList
          data={instructors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InstructorCard instructor={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.introBox}>
              <Text style={styles.introText}>
                Наши инструкторы регулярно повышают квалификацию в Индии, на Бали и в ведущих школах мира.
                Каждая практика адаптируется под ваш уровень подготовки и состояние здоровья.
              </Text>
            </View>
          }
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
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  introBox: {
    marginBottom: Spacing.md,
    padding: 12,
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  introText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

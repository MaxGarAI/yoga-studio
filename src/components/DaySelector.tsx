import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const DaySelector: React.FC = () => {
  const { selectedDate, setSelectedDate } = useApp();

  // Generate 7 days starting from today
  const days = Array.from({ length: 7 }).map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() + index);
    const isoDate = d.toISOString().split('T')[0];
    
    // Russian weekdays
    const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = [
      'янв', 'фев', 'мар', 'апр', 'май', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ];

    const isToday = index === 0;
    const isTomorrow = index === 1;
    const label = isToday ? 'Сегодня' : isTomorrow ? 'Завтра' : weekdays[d.getDay()];

    return {
      dateStr: isoDate,
      dayNumber: d.getDate(),
      month: months[d.getMonth()],
      weekday: weekdays[d.getDay()],
      label,
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((item) => {
          const isSelected = selectedDate === item.dateStr;
          return (
            <TouchableOpacity
              key={item.dateStr}
              activeOpacity={0.7}
              onPress={() => setSelectedDate(item.dateStr)}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardActive,
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelActive,
                ]}
              >
                {item.label}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberActive,
                ]}
              >
                {item.dayNumber}
              </Text>
              <Text
                style={[
                  styles.dayMonth,
                  isSelected && styles.dayMonthActive,
                ]}
              >
                {item.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    gap: 10,
  },
  dayCard: {
    width: 68,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.cardBg,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryLight,
    ...Shadows.glow,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dayLabelActive: {
    color: Colors.textInverse,
    fontWeight: '700',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  dayNumberActive: {
    color: Colors.textInverse,
  },
  dayMonth: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dayMonthActive: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
});

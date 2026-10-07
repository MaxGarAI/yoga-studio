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
import { YogaCategory, YogaLevel } from '../types';

interface AddClassModalProps {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: YogaCategory[] = [
  'Хатха-йога',
  'Виньяса-флоу',
  'Аэройога',
  'Инь-йога',
  'Аштанга',
  'Sound Healing',
  'Медитация и пранаяма',
];

const LEVELS: YogaLevel[] = [
  'Все уровни',
  'Для начинающих',
  'Средний',
  'Продвинутый',
];

const ROOMS = [
  'Зал "Лотос" (Большой)',
  'Зал "Воздух" (Гамаки)',
  'Зал "Шанти" (Медитативный)',
];

export const AddClassModal: React.FC<AddClassModalProps> = ({ visible, onClose }) => {
  const { instructors, addClass, selectedDate } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<YogaCategory>('Хатха-йога');
  const [level, setLevel] = useState<YogaLevel>('Все уровни');
  const [selectedInstructorId, setSelectedInstructorId] = useState(instructors[0]?.id || '');
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:15');
  const [room, setRoom] = useState(ROOMS[0]);
  const [capacity, setCapacity] = useState('12');
  const [price, setPrice] = useState('1300');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;

    const instructor = instructors.find((i) => i.id === selectedInstructorId) || instructors[0];

    addClass({
      title: title.trim(),
      category,
      level,
      instructorId: instructor.id,
      instructorName: instructor.name,
      instructorAvatar: instructor.avatar,
      date: date.trim() || selectedDate,
      startTime: startTime.trim() || '19:00',
      endTime: endTime.trim() || '20:15',
      durationMinutes: 75,
      room,
      capacity: parseInt(capacity, 10) || 12,
      price: parseInt(price, 10) || 1300,
      description: description.trim() || 'Практика йоги для укрепления тела, улучшения гибкости и восстановления внутреннего баланса.',
      benefits: ['Укрепление осанки', 'Снятие стресса', 'Повышение энергии'],
      equipmentNeeded: ['Коврик', 'Блоки для йоги'],
      intensity: 3,
      image: instructor.avatar,
    });

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
              <Text style={styles.headerTitle}>Добавить тренировку в расписание</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.label}>Название практики</Text>
            <TextInput
              style={styles.input}
              placeholder="например: Вечерний Виньяса-Флоу"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* Category selection */}
            <Text style={styles.label}>Направление йоги</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Instructor selection */}
            <Text style={styles.label}>Преподаватель</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {instructors.map((inst) => (
                <TouchableOpacity
                  key={inst.id}
                  style={[styles.chip, selectedInstructorId === inst.id && styles.chipActive]}
                  onPress={() => setSelectedInstructorId(inst.id)}
                >
                  <Text style={[styles.chipText, selectedInstructorId === inst.id && styles.chipTextActive]}>
                    {inst.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Date & Time Row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Дата (ГГГГ-ММ-ДД)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2026-09-24"
                  placeholderTextColor={Colors.textMuted}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Время (с – по)</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="19:00"
                    placeholderTextColor={Colors.textMuted}
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="20:15"
                    placeholderTextColor={Colors.textMuted}
                    value={endTime}
                    onChangeText={setEndTime}
                  />
                </View>
              </View>
            </View>

            {/* Room */}
            <Text style={styles.label}>Зал проведения</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
              {ROOMS.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, room === r && styles.chipActive]}
                  onPress={() => setRoom(r)}
                >
                  <Text style={[styles.chipText, room === r && styles.chipTextActive]}>
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Level & Capacity & Price */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Вместимость зала</Text>
                <TextInput
                  style={styles.input}
                  placeholder="12"
                  placeholderTextColor={Colors.textMuted}
                  value={capacity}
                  onChangeText={setCapacity}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Разовая цена (₽)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1300"
                  placeholderTextColor={Colors.textMuted}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Description */}
            <Text style={styles.label}>Описание практики</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Кратко опишите особенности и акценты этого класса..."
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.submitBtnText}>Опубликовать в расписании</Text>
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
    maxWidth: 480,
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
  body: {
    padding: Spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 13,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  chipsScroll: {
    marginBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.gold,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.goldLight,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  submitBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  submitBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700',
  },
});

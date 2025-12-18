/**
 * Начальное состояние Zustand store
 * 
 * Все дефолтные значения для state приложения.
 * Разделение начального состояния улучшает читаемость.
 * 
 * @module app/store/initialState
 * @updated 23 ноября 2025 - миграция categories → tags
 * @updated 1 декабря 2025 - прямой импорт initializeHabitTags для избежания циклической зависимости
 * @updated 2 декабря 2025 - добавлены дефолтные разделы с цветами
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 * @updated 5 декабря 2025 - инлайн дефолтные теги для избежания циклических зависимостей
 */

import type { HabitsState } from './types';
import { initialFiltersState } from './slices/filters';
import type { Tag, Section, HabitType } from '@/entities/habit';
import type { ColorVariant } from '@/shared/constants/colors';

/**
 * Дефолтные теги привычек с предустановленными цветами
 * Объявлены инлайн для избежания циклических зависимостей
 */
const DEFAULT_HABIT_TAGS: Tag[] = [
  { name: 'health', color: 'emerald' as ColorVariant },
  { name: 'study', color: 'indigo' as ColorVariant },
  { name: 'work', color: 'purple' as ColorVariant },
  { name: 'sports', color: 'orange' as ColorVariant },
  { name: 'nutrition', color: 'lime' as ColorVariant },
  { name: 'sleep', color: 'sky' as ColorVariant },
  { name: 'creativity', color: 'fuchsia' as ColorVariant },
  { name: 'selfDevelopment', color: 'teal' as ColorVariant },
  { name: 'relationships', color: 'rose' as ColorVariant },
  { name: 'finance', color: 'amber' as ColorVariant },
  { name: 'home', color: 'stone' as ColorVariant },
];

/**
 * Дефолтные разделы привычек с предустановленными цветами
 * Объявлены инлайн для избежания циклических зависимостей
 */
const DEFAULT_HABIT_SECTIONS: Section[] = [
  { name: 'other', color: 'gray' as ColorVariant },
  { name: 'morning', color: 'amber' as ColorVariant },
  { name: 'day', color: 'sky' as ColorVariant },
  { name: 'evening', color: 'indigo' as ColorVariant },
];

/**
 * Начальное состояние формы добавления привычки
 */
const getInitialFormState = () => ({
  name: '',
  description: '',
  startDate: new Date().toISOString().split('T')[0] ?? '',
  icon: 'target',
  tags: [] as string[],
  section: 'other',
  type: 'binary' as const,
  frequency: {
    type: 'by_days_of_week' as const,
    count: 7,
    period: 7,
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  },
  reminders: [],
  measurable: {
    unit: '',
    targetValue: '',
    targetType: 'min' as const,
  },
  notesEnabled: false,
  timerEnabled: false,
  timerDefaultMinutes: 0,
  timerDefaultSeconds: 0,
  currentStep: 1 as const,
  openPicker: null,
  isInitialized: false,
});

/**
 * Начальное состояние store (только данные, без actions)
 */
export const getInitialState = () => {
  const initialTags = DEFAULT_HABIT_TAGS;

  return {
    // ==================== ДАННЫЕ ====================
    habits: [],
    tags: initialTags,
    sections: DEFAULT_HABIT_SECTIONS,
    vacationPeriods: [],

  // ==================== UI СОСТОЯНИЕ ====================
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),

    // ==================== МОДАЛЬНЫЕ ОКНА ====================
    numericInputModal: null,
    statsModal: null,
    noteModal: null,
    isMonthYearPickerOpen: false,
    isAddHabitModalOpen: false,
    
    // ==================== ФОРМА ДОБАВЛЕНИЯ ПРИВЫЧКИ ====================
    addHabitForm: getInitialFormState(),
    
    // ==================== ФИЛЬТРЫ ====================
    ...initialFiltersState,
  };
};

/**
 * Основной интерфейс store приложения
 * Объединяет все слайсы
 * 
 * @module app/store/types
 */

import type { Habit, HabitData, Tag, Section, FrequencyConfig, Reminder } from '@/entities/habit';
import type { VacationSlice } from '@/entities/vacation';
import type { LanguageSlice } from './slices/language';
import type { FiltersState, FiltersActions } from './slices/filters';

/**
 * Интерфейс формы добавления/редактирования привычки
 */
export interface AddHabitForm {
  /** Название привычки */
  name: string;
  /** Описание привычки */
  description: string;
  /** Дата начала привычки */
  startDate: string;
  /** Иконка привычки */
  icon: string;
  /** Выбранные теги */
  tags: string[];
  /** Выбранный раздел */
  section: string;
  /** Тип привычки */
  type: 'binary' | 'measurable';
  /** Конфигурация частоты */
  frequency: FrequencyConfig;
  /** Массив напоминаний */
  reminders: Reminder[];
  /** Настройки измеримой привычки */
  measurable: {
    unit: string;
    targetValue: string;
    targetType: 'min' | 'max';
  };
  /** Включены ли заметки */
  notesEnabled: boolean;
  /** Включён ли таймер */
  timerEnabled: boolean;
  /** Дефолтные минуты таймера */
  timerDefaultMinutes: number;
  /** Дефолтные секунды таймера */
  timerDefaultSeconds: number;
  /** Текущий шаг формы */
  currentStep: 1 | 2 | 3 | 4 | 5;
  /** Открытый пикер */
  openPicker: 'icon' | 'color' | 'section' | 'tags' | 'unit' | null;
  /** Флаг инициализации формы */
  isInitialized: boolean;
}

/**
 * Интерфейс состояния и actions для привычек
 */
export interface HabitsState {
  // ==================== ДАННЫЕ ====================
  /** Список всех привычек */
  habits: Habit[];
  /** Список тегов */
  tags: Tag[];
  /** Список разделов */
  sections: Section[];

  // ==================== UI СОСТОЯНИЕ ====================
  /** Выбранный месяц (0-11) */
  selectedMonth: number;
  /** Выбранный год */
  selectedYear: number;

  // ==================== МОДАЛЬНЫЕ ОКНА ====================
  /** Модальное окно ввода числового значения */
  numericInputModal: { habitId: string; date: string } | null;
  /** Модальное окно статистики */
  statsModal: { habitId: string } | null;
  /** Модальное окно заметки к привычке */
  noteModal: { habitId: string; date: string } | null;

  // ==================== ФОРМА ДОБАВЛЕНИЯ ПРИВЫЧКИ ====================
  /** Форма добавления/редактирования привычки */
  addHabitForm: AddHabitForm;

  // ==================== ACTIONS: HABITS ====================
  /** Добавить привычку */
  addHabit: (habitData: HabitData) => void;
  /** Удалить привычку */
  deleteHabit: (habitId: string) => void;
  /** Обновить данные привычки */
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  /** Переключить выполнение привычки (бинарная) или открыть модалку ввода (измеримая) */
  toggleCompletion: (habitId: string, date: string) => void;
  /** Переместить привычку в списке (drag-n-drop) */
  moveHabit: (dragIndex: number, hoverIndex: number) => void;
  /** Архивировать привычку */
  archiveHabit: (habitId: string) => void;
  /** Разархивировать привычку */
  unarchiveHabit: (habitId: string) => void;
  /** Загрузить привычки с сервера */
  loadHabitsFromServer: () => Promise<void>;

  // ==================== ACTIONS: UI ====================
  /** Установить выбранную дату (месяц и год) */
  setSelectedDate: (month: number, year: number) => void;

  // ==================== ACTIONS: MODALS ====================
  /** Открыть модальное окно ввода числового значения */
  openNumericInputModal: (habitId: string, date: string) => void;
  /** Закрыть модальное окно ввода числового значения */
  closeNumericInputModal: () => void;
  /** Открыть модальное окно статистики */
  openStatsModal: (habitId: string) => void;
  /** Закрыть модальное окно статистики */
  closeStatsModal: () => void;
  /** Открыть модальное окно заметки к привычке */
  openNoteModal: (habitId: string, date: string) => void;
  /** Закрыть модальное окно заметки к привычке */
  closeNoteModal: () => void;

  // ==================== ACTIONS: ADD HABIT FORM ====================
  /** Установить название привычки */
  setFormName: (name: string) => void;
  /** Установить описание привычки */
  setFormDescription: (description: string) => void;
  /** Установить дату начала привычки */
  setFormStartDate: (date: string) => void;
  /** Установить иконку привычки */
  setFormIcon: (icon: string) => void;
  /** Установить теги привычки */
  setFormTags: (tags: string[]) => void;
  /** Установить раздел привычки */
  setFormSection: (section: string) => void;
  /** Установить тип привычки */
  setFormType: (type: 'binary' | 'measurable') => void;
  /** Установить конфигурацию частоты */
  setFormFrequency: (frequency: FrequencyConfig) => void;
  /** Установить массив напоминаний */
  setFormReminders: (reminders: Reminder[]) => void;
  /** Добавить напоминание */
  addFormReminder: (reminder: Reminder) => void;
  /** Удалить напоминание */
  removeFormReminder: (reminderId: string) => void;
  /** Обновить время напоминания */
  updateFormReminderTime: (reminderId: string, time: string) => void;
  /** Установить единицу измерения */
  setFormUnit: (unit: string) => void;
  /** Установить целевое значение */
  setFormTargetValue: (value: string) => void;
  /** Установить тип цели */
  setFormTargetType: (type: 'min' | 'max') => void;
  /** Установить включение заметок */
  setFormNotesEnabled: (enabled: boolean) => void;
  /** Установить включение таймера */
  setFormTimerEnabled: (enabled: boolean) => void;
  /** Установить дефолтные минуты таймера */
  setFormTimerDefaultMinutes: (minutes: number) => void;
  /** Установить дефолтные секунды таймера */
  setFormTimerDefaultSeconds: (seconds: number) => void;
  /** Перейти к следующему шагу */
  goToNextStep: () => void;
  /** Вернуться к предыдущему шагу */
  goToPreviousStep: () => void;
  /** Перейти к конкретному шагу */
  goToStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  /** Открыть пикер */
  openFormPicker: (picker: 'icon' | 'color' | 'section' | 'tags' | 'unit') => void;
  /** Закрыть пикер */
  closeFormPicker: () => void;
  /** Сбросить форму */
  resetForm: () => void;
  /** Инициализировать форму редактирования */
  initializeEditForm: (habit: Habit) => void;

  // ==================== ACTIONS: TAGS ====================
  /** Добавить тег */
  addTag: (name: string, color: string) => void;
  /** Удалить тег */
  deleteTag: (name: string) => void;
  /** Обновить тег */
  updateTag: (oldName: string, newName: string, newColor: string) => void;

  // ==================== ACTIONS: SECTIONS ====================
  /** Добавить раздел */
  addSection: (name: string, color: string) => void;
  /** Удалить раздел */
  deleteSection: (name: string) => void;
  /** Обновить раздел */
  updateSection: (oldName: string, newName: string, newColor: string) => void;

  // ==================== ACTIONS: INTERNAL ====================
  /** Пересчитать силу всех привычек */
  recalculateAllStrength: () => void;
  /** Обновить числовое значение для измеримой привычки */
  updateNumericValue: (habitId: string, date: string, value: number) => void;
}

/**
 * Основной интерфейс store приложения
 * Объединяет все слайсы
 */
export type AppStore = HabitsState & VacationSlice & LanguageSlice & FiltersState & FiltersActions;
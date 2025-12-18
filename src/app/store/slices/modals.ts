/**
 * Modals Slice - управление модальными окнами
 * 
 * Содержит actions для открытия/закрытия всех модальных окон:
 * - AddHabitModal (создание привычки)
 * - EditHabitModal (редактирование привычки)
 * - NumericInputModal
 * - StatsModal
 * - MonthYearPicker
 * - NoteModal
 * 
 * @module app/store/slices/modals
 * @updated 1 декабря 2025 - удалена ManageHabitsModal
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 * @updated 5 декабря 2025 - добавлена EditHabitModal (FSD разделение create/edit)
 * @updated 18 декабря 2025 - удалена TimerModal (управляется через useTimerStore)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';

/**
 * Создает slice с actions для модальных окон
 */
export const createModalsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<
    HabitsState,
    | 'openAddHabitModal'
    | 'closeAddHabitModal'
    | 'openEditHabitModal'
    | 'closeEditHabitModal'
    | 'openNumericInputModal'
    | 'closeNumericInputModal'
    | 'openStatsModal'
    | 'closeStatsModal'
    | 'openMonthYearPicker'
    | 'closeMonthYearPicker'
    | 'openNoteModal'
    | 'closeNoteModal'
  >
> = (set, get) => ({
  openAddHabitModal: () => {
    set({ isAddHabitModalOpen: true });
  },

  closeAddHabitModal: () => {
    set({ isAddHabitModalOpen: false });
  },

  openEditHabitModal: (habitId) => {
    const habit = get().habits.find(h => h.id === habitId);
    if (habit) {
      set({ 
        habitToEdit: habit,
        isEditHabitModalOpen: true 
      });
      
      // Инициализировать форму данными привычки
      get().initializeAddHabitForm({
        name: habit.name,
        description: habit.description,
        icon: habit.icon,
        tags: habit.tags,
        section: habit.section,
        type: habit.type,
        frequency: habit.frequency,
        reminders: habit.reminders,
        unit: habit.unit,
        targetValue: habit.targetValue?.toString(),
        targetType: habit.targetType,
        notesEnabled: habit.notesEnabled,
      });
    }
  },

  closeEditHabitModal: () => {
    set({ 
      isEditHabitModalOpen: false,
      habitToEdit: null 
    });
    // Очистить форму при закрытии
    get().resetAddHabitForm();
  },

  openNumericInputModal: (habitId, date) => {
    set({ numericInputModal: { habitId, date } });
  },

  closeNumericInputModal: () => {
    set({ numericInputModal: null });
  },

  openStatsModal: (habitId, monthYearKey) => {
    set({ statsModal: { habitId, monthYearKey } });
  },

  closeStatsModal: () => {
    set({ statsModal: null });
  },

  openMonthYearPicker: () => {
    set({ isMonthYearPickerOpen: true });
  },

  closeMonthYearPicker: () => {
    set({ isMonthYearPickerOpen: false });
  },

  openNoteModal: (habitId, date) => {
    set({ noteModal: { habitId, date } });
  },

  closeNoteModal: () => {
    set({ noteModal: null });
  },
});
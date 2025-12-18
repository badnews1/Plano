/**
 * Habits Slice - управление привычками
 * 
 * Содержит все CRUD операции и логику работы с привычками:
 * - Добавление, удаление, обновление
 * - Переключение выполнения (бинарные и измеримые)
 * - Drag-n-drop перемещение
 * - Архивирование и разархивирование
 * 
 * @module app/store/slices/habits
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import type { Habit, HabitData } from '@/entities/habit';
import { recalculateStrength } from '@/entities/habit/lib/strength/strengthCalculator';
import { formatDate } from '@/shared/lib/date';
import { habitLogger } from '@/shared/lib/logger';
import { 
  createHabitOnServer, 
  updateHabitOnServer, 
  deleteHabitOnServer,
  fetchHabitsFromServer,
  syncHabitsWithConflictResolution
} from '@/entities/habit/api/habitSync';

/**
 * Создает slice с actions для работы с привычками
 */
export const createHabitsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<
    HabitsState,
    | 'addHabit'
    | 'deleteHabit'
    | 'updateHabit'
    | 'toggleCompletion'
    | 'moveHabit'
    | 'archiveHabit'
    | 'unarchiveHabit'
    | 'loadHabitsFromServer'
  >
> = (set, get) => ({
  addHabit: (habitData) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      description: habitData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), // Добавляем timestamp для синхронизации
      startDate: habitData.startDate,
      completions: {},
      frequency: habitData.frequency,
      icon: habitData.icon,
      tags: habitData.tags || [],
      section: habitData.section || 'other',
      type: habitData.type,
      unit: habitData.unit,
      targetValue: habitData.targetValue,
      targetType: habitData.targetType,
      reminders: habitData.reminders || [], // ← Добавлено: сохраняем напоминания
      notesEnabled: habitData.notesEnabled ?? false, // ← Добавлено: сохраняем настройку заметок
      timerEnabled: habitData.timerEnabled ?? false, // ← Добавлено: сохраняем настройку таймера
      timerDefaultMinutes: habitData.timerDefaultMinutes ?? 0, // ← Добавлено: дефолтные минуты таймера
      timerDefaultSeconds: habitData.timerDefaultSeconds ?? 0, // ← Добавлено: дефолтные секунды таймера
      strength: 0,
      lastStrengthUpdate: new Date().toISOString(),
      strengthBaseline: 0,
    };

    // 🔇 Отключаем шумный лог добавления привычки
    // habitLogger.info('Добавлена новая привычка', {
    //   name: newHabit.name,
    //   type: newHabit.type,
    //   id: newHabit.id,
    // });

    set((state) => ({
      habits: [...state.habits, newHabit],
    }));

    // Синхронизация с сервером
    createHabitOnServer(newHabit);
  },

  deleteHabit: (habitId) => {
    const habit = get().habits.find((h) => h.id === habitId);

    if (habit) {
      habitLogger.info('Удалена привычка', { name: habit.name, id: habitId });
    }

    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
    }));

    // Синхронизация с сервером
    deleteHabitOnServer(habitId);
  },

  updateHabit: (habitId, updates) => {
    // Добавляем timestamp обновления
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updatesWithTimestamp } : habit
      ),
    }));

    habitLogger.debug('Обновлена привычка', { habitId, updates });

    // Синхронизация с сервером
    updateHabitOnServer(habitId, updatesWithTimestamp);
  },

  toggleCompletion: (habitId, date) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);

    if (!habit) return;

    // ✅ Fix: доступ по индексу может вернуть undefined
    const currentValue = habit.completions[date] ?? undefined;

    // Для бинарных привычек
    if (habit.type === 'binary') {
      const newCompletions = { ...habit.completions };

      if (currentValue === true) {
        // Клик: true → удаляем (возврат к пустому состоянию)
        delete newCompletions[date];
        
        // Если были включены заметки, удаляем и заметку
        if (habit.notesEnabled && habit.notes && habit.notes[date]) {
          const newNotes = { ...habit.notes };
          delete newNotes[date];
          
          const updatedHabit = {
            ...habit,
            completions: newCompletions,
            notes: newNotes,
          };
          
          const habitWithStrength = recalculateStrength(updatedHabit, date, state.vacationPeriods);
          
          set((state) => ({
            habits: state.habits.map((h) => (h.id === habitId ? habitWithStrength : h)),
          }));
          
          // Синхронизация с сервером
          updateHabitOnServer(habitId, { completions: newCompletions, notes: newNotes });
        } else {
          const updatedHabit = {
            ...habit,
            completions: newCompletions,
          };
          
          const habitWithStrength = recalculateStrength(updatedHabit, date, state.vacationPeriods);
          
          set((state) => ({
            habits: state.habits.map((h) => (h.id === habitId ? habitWithStrength : h)),
          }));
          
          // Синхронизация с сервером
          updateHabitOnServer(habitId, { completions: newCompletions });
        }
      } else {
        // Клик: undefined → true (выполнено)
        newCompletions[date] = true;

        const updatedHabit = {
          ...habit,
          completions: newCompletions,
        };

        // Пересчитываем силу привычки (передаём дату изменения для корректного пересчёта)
        const habitWithStrength = recalculateStrength(updatedHabit, date, state.vacationPeriods);

        set((state) => ({
          habits: state.habits.map((h) => (h.id === habitId ? habitWithStrength : h)),
        }));
        
        // Синхронизация с сервером
        updateHabitOnServer(habitId, { completions: newCompletions });
        
        // Если включены заметки, открываем модалку заметки
        if (habit.notesEnabled) {
          state.openNoteModal(habitId, date);
        }
      }
    }
    // Для измеримых привычек - открываем модальное окно
    else if (habit.type === 'measurable') {
      state.openNumericInputModal(habitId, date);
    }
  },

  moveHabit: (dragIndex, hoverIndex) => {
    const state = get();
    const newHabits = [...state.habits];
    const [draggedHabit] = newHabits.splice(dragIndex, 1);
    
    // ✅ Fix: splice может вернуть undefined если индекс некорректный
    if (!draggedHabit) return;
    
    newHabits.splice(hoverIndex, 0, draggedHabit);

    set({ habits: newHabits });
    habitLogger.debug('Привычка перемещена', { from: dragIndex, to: hoverIndex });
  },

  archiveHabit: (habitId) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId ? { ...habit, isArchived: true } : habit
      ),
    }));

    habitLogger.info('Привычка архивирована', { habitId });
  },

  unarchiveHabit: (habitId) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId ? { ...habit, isArchived: false } : habit
      ),
    }));

    habitLogger.info('Привычка разархивирована', { habitId });
  },

  loadHabitsFromServer: async () => {
    try {
      const localHabits = get().habits;
      
      // Синхронизируем с разрешением конфликтов
      const mergedHabits = await syncHabitsWithConflictResolution(localHabits);
      
      set({ habits: mergedHabits });
      console.log('✅ Привычки синхронизированы с сервером (с разрешением конфликтов):', mergedHabits.length);
    } catch (error) {
      console.error('❌ Ошибка синхронизации привычек с сервером:', error);
    }
  },
});
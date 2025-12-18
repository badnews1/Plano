/**
 * Internal Slice - внутренние системные actions
 * 
 * Содержит служебные actions, которые не должны вызываться напрямую из UI:
 * - Обновление силы привычек при загрузке приложения
 * 
 * @module app/store/slices/internal
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import { recalculateStrength } from '@/entities/habit/lib/strength/strengthCalculator';
import { storageLogger } from '@/shared/lib/logger';

/**
 * Создает slice с внутренними системными actions
 */
export const createInternalSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'updateHabitsStrength'>
> = (set, get) => ({
  updateHabitsStrength: () => {
    const state = get();
    const today = new Date();

    const updatedHabits = state.habits.map((habit) => {
      const lastUpdate = habit.lastStrengthUpdate ? new Date(habit.lastStrengthUpdate) : null;

      // Миграция: добавляем дефолтный section если его нет
      const migratedHabit = habit.section ? habit : { ...habit, section: 'other' };

      // Обновляем только если прошел хотя бы 1 день
      if (!lastUpdate || today.toDateString() !== lastUpdate.toDateString()) {
        return recalculateStrength(migratedHabit, undefined, state.vacationPeriods);
      }

      return migratedHabit;
    });

    set({ habits: updatedHabits });
    // 🔇 Отключаем шумный лог обновления силы
    // storageLogger.info('Сила привычек обновлена', { count: updatedHabits.length });
  },
});
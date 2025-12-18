/**
 * UI Slice - управление интерфейсом приложения
 * 
 * Содержит actions для:
 * - Выбор месяца/года
 * 
 * @module app/store/slices/ui
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';

/**
 * Создает slice с UI actions
 */
export const createUISlice: StateCreator<HabitsState, [], [], Pick<HabitsState, 'setSelectedDate'>> = (set) => ({
  setSelectedDate: (month, year) => {
    set({ selectedMonth: month, selectedYear: year });
  },
});

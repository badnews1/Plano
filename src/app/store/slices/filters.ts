/**
 * Slice для управления фильтрами привычек
 * 
 * @description
 * Управляет состоянием фильтрации привычек:
 * - Выбранные теги
 * - Выбранные разделы
 * - Выбранные типы
 * - Флаг "Без тега"
 * 
 * @module app/store/slices/filters
 * @created 5 декабря 2025
 */

import type { StateCreator } from 'zustand';
import type { AppStore } from '../types';

/**
 * Интерфейс состояния фильтров
 */
export interface FiltersState {
  // ==================== ФИЛЬТРЫ ====================
  /** Выбранные теги для фильтрации */
  selectedFilterCategories: Set<string>;
  /** Выбранные разделы для фильтрации */
  selectedFilterSections: Set<string>;
  /** Выбранные типы привычек для фильтрации */
  selectedFilterTypes: Set<'binary' | 'measurable'>;
  /** Показывать ли привычки без тегов */
  showFilterUncategorized: boolean;
}

/**
 * Интерфейс действий для фильтров
 */
export interface FiltersActions {
  // ==================== ACTIONS: ФИЛЬТРЫ ====================
  /** Переключить категорию (тег) в фильтре */
  toggleFilterCategory: (category: string) => void;
  /** Переключить раздел в фильтре */
  toggleFilterSection: (section: string) => void;
  /** Переключить тип привычки в фильтре */
  toggleFilterType: (type: 'binary' | 'measurable') => void;
  /** Переключить показ привычек без тегов */
  toggleFilterUncategorized: () => void;
  /** Очистить все фильтры */
  clearAllFilters: () => void;
}

/**
 * Начальное состояние фильтров
 */
export const initialFiltersState: FiltersState = {
  selectedFilterCategories: new Set<string>(),
  selectedFilterSections: new Set<string>(),
  selectedFilterTypes: new Set<'binary' | 'measurable'>(),
  showFilterUncategorized: false,
};

/**
 * Slice для управления фильтрами
 */
export const createFiltersSlice: StateCreator<
  AppStore,
  [],
  [],
  FiltersState & FiltersActions
> = (set) => ({
  // Начальное состояние
  ...initialFiltersState,

  // Actions
  toggleFilterCategory: (category: string) =>
    set((state) => {
      const newCategories = new Set(state.selectedFilterCategories);
      if (newCategories.has(category)) {
        newCategories.delete(category);
      } else {
        newCategories.add(category);
      }
      return { selectedFilterCategories: newCategories };
    }),

  toggleFilterSection: (section: string) =>
    set((state) => {
      const newSections = new Set(state.selectedFilterSections);
      if (newSections.has(section)) {
        newSections.delete(section);
      } else {
        newSections.add(section);
      }
      return { selectedFilterSections: newSections };
    }),

  toggleFilterType: (type: 'binary' | 'measurable') =>
    set((state) => {
      const newTypes = new Set(state.selectedFilterTypes);
      if (newTypes.has(type)) {
        newTypes.delete(type);
      } else {
        newTypes.add(type);
      }
      return { selectedFilterTypes: newTypes };
    }),

  toggleFilterUncategorized: () =>
    set((state) => ({
      showFilterUncategorized: !state.showFilterUncategorized,
    })),

  clearAllFilters: () =>
    set({
      selectedFilterCategories: new Set<string>(),
      selectedFilterSections: new Set<string>(),
      selectedFilterTypes: new Set<'binary' | 'measurable'>(),
      showFilterUncategorized: false,
    }),
});

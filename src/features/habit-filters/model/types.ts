/**
 * Типы для системы фильтрации привычек
 * 
 * @description
 * Интерфейсы для управления состоянием фильтров, их действиями и результатами.
 * Используются в UI компонентах фильтрации и в хуках фильтрации.
 * 
 * Типы фильтров:
 * - По тегам/категориям (включая "без тега")
 * - По разделам/секциям
 * - По типам привычек (binary/measurable)
 * 
 * @module features/habit-filters/model
 * @created 29 ноября 2025 - миграция на FSD архитектуру
 * @updated 30 ноября 2025 - переименование из filter-habits в habit-filters
 */

import type { Habit, HabitType } from '@/entities/habit/model/types';

/**
 * Состояние фильтров привычек
 */
export interface HabitsFilterState {
  /** Показывать ли привычки без категории (без тегов) */
  showUncategorized: boolean;
  /** Set выбранных категорий/тегов для фильтрации */
  selectedCategories: Set<string>;
  /** Set выбранных разделов/секций для фильтрации */
  selectedSections: Set<string>;
  /** Set выбранных типов привычек (binary/measurable) */
  selectedTypes: Set<HabitType>;
}

/**
 * Результат работы фильтра
 */
export interface HabitsFilterResult {
  /** Отфильтрованный массив привычек */
  filteredHabits: Habit[];
  /** Количество активных фильтров */
  activeFiltersCount: number;
  /** Есть ли активные фильтры */
  hasActiveFilters: boolean;
}

/**
 * Действия для управления фильтрами
 */
export interface HabitsFilterActions {
  /** Переключить фильтр "без категории" (без тегов) */
  toggleUncategorized: () => void;
  /** Переключить фильтр по конкретной категории/тегу */
  toggleCategory: (categoryName: string) => void;
  /** Переключить фильтр по конкретному разделу/секции */
  toggleSection: (sectionName: string) => void;
  /** Переключить фильтр по типу привычки (binary/measurable) */
  toggleType: (type: HabitType) => void;
  /** Сбросить все фильтры к дефолтным значениям */
  clearAllFilters: () => void;
}

/**
 * Конфигурация фильтра для кастомизации поведения
 */
export interface HabitsFilterConfig {
  /** Начальное состояние фильтров (partial) */
  initialState?: Partial<HabitsFilterState>;
  /** Включить фильтрацию по категориям/тегам */
  enableCategoryFilter?: boolean;
  /** Включить фильтрацию по разделам/секциям */
  enableSectionFilter?: boolean;
  /** Включить фильтрацию по типам привычек */
  enableTypeFilter?: boolean;
  /** Включить фильтрацию "без категории" */
  enableUncategorizedFilter?: boolean;
}

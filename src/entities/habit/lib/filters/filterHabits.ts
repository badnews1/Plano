/**
 * Функция для фильтрации привычек
 * 
 * @description
 * Чистая функция для фильтрации привычек без привязки к React.
 * Используется для применения фильтров из store.
 * 
 * @module entities/habit/lib/filters/filterHabits
 * @created 5 декабря 2025
 */

import type { Habit, HabitType } from '../../model/types';

/**
 * Параметры фильтрации
 */
export interface FilterHabitsParams {
  /** Выбранные теги/категории */
  selectedCategories: Set<string>;
  /** Выбранные разделы */
  selectedSections: Set<string>;
  /** Выбранные типы привычек */
  selectedTypes: Set<HabitType>;
  /** Показывать ли привычки без тегов */
  showUncategorized: boolean;
}

/**
 * Фильтрует привычки на основе заданных параметров
 * 
 * @param habits - массив привычек
 * @param params - параметры фильтрации
 * @returns отфильтрованный массив привычек
 * 
 * @example
 * ```ts
 * const filtered = filterHabits(habits, {
 *   selectedCategories: new Set(['work']),
 *   selectedSections: new Set(),
 *   selectedTypes: new Set(),
 *   showUncategorized: false,
 * });
 * ```
 */
export function filterHabits(
  habits: Habit[],
  params: FilterHabitsParams
): Habit[] {
  const {
    selectedCategories,
    selectedSections,
    selectedTypes,
    showUncategorized,
  } = params;

  return habits.filter((habit) => {
    // Фильтр по категориям/тегам с поддержкой "Без тега"
    // Если есть выбранные категории ИЛИ включен showUncategorized - применяем фильтр
    if (selectedCategories.size > 0 || showUncategorized) {
      const hasNoTags = !habit.tags || habit.tags.length === 0;
      const hasSelectedTag = habit.tags && habit.tags.some(tag => selectedCategories.has(tag));
      
      // Если есть выбранные категории, но НЕТ showUncategorized
      if (selectedCategories.size > 0 && !showUncategorized) {
        // Показываем только привычки с выбранными тегами
        if (!hasSelectedTag) return false;
      }
      // Если showUncategorized включен, но НЕТ выбранных категорий
      else if (showUncategorized && selectedCategories.size === 0) {
        // Показываем только привычки БЕЗ тегов
        if (!hasNoTags) return false;
      }
      // Если и showUncategorized, и есть выбранные категории
      else if (showUncategorized && selectedCategories.size > 0) {
        // Показываем привычки БЕЗ тегов ИЛИ с выбранными тегами (OR логика)
        if (!hasNoTags && !hasSelectedTag) return false;
      }
    }

    // Фильтр по секциям/разделам
    if (
      selectedSections.size > 0 &&
      !selectedSections.has(habit.section || 'other')
    ) {
      return false;
    }

    // Фильтр по типам привычек (OR логика)
    // Если есть выбранные типы - применяем фильтр
    if (selectedTypes.size > 0) {
      // Показываем только привычки выбранных типов
      if (!selectedTypes.has(habit.type)) {
        return false;
      }
    }

    return true;
  });
}

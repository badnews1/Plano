/**
 * useHabitsFilter - хук для фильтрации привычек
 * 
 * @description
 * Содержит всю логику фильтрации привычек без привязки к UI.
 * Может использоваться в любом компоненте приложения.
 * 
 * Особенности:
 * - Фильтрация по тегам/категориям (включая "без тега")
 * - Фильтрация по разделам/секциям
 * - Фильтрация по типам привычек (binary/measurable)
 * - Подсчёт активных фильтров
 * - Оптимизация через useMemo
 * - Конфигурируемое поведение
 * 
 * @module features/habit-filters/lib/useHabitsFilter
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker/shared/hooks/use-habits-filter
 * @updated 30 ноября 2025 - переименование из filter-habits в habit-filters
 */

import { useState, useMemo } from 'react';
import type { Habit, HabitType } from '@/entities/habit/model/types';
import { getActiveHabits } from '@/entities/habit';
import type {
  HabitsFilterState,
  HabitsFilterResult,
  HabitsFilterActions,
  HabitsFilterConfig,
} from '../model/types';

/**
 * Универсальный хук для фильтрации привычек
 * 
 * @param habits - массив привычек для фильтрации
 * @param config - конфигурация поведения фильтра
 * @returns объект с состоянием, действиями и результатами фильтрации
 * 
 * @example
 * ```tsx
 * const { state, actions, result } = useHabitsFilter(habits, {
 *   initialState: {
 *     showUncategorized: false,
 *   },
 *   enableTypeFilter: false
 * });
 * 
 * // Использование результатов
 * const { filteredHabits, hasActiveFilters } = result;
 * 
 * // Использование действий
 * const { toggleCategory, clearAllFilters } = actions;
 * ```
 */
export function useHabitsFilter(
  habits: Habit[],
  config: HabitsFilterConfig = {}
) {
  // Деструктуризация конфига с дефолтными значениями
  const {
    initialState = {},
    enableCategoryFilter = true,
    enableSectionFilter = true,
    enableTypeFilter = true,
    enableUncategorizedFilter = true,
  } = config;

  // State фильтров
  const [showUncategorized, setShowUncategorized] = useState(
    initialState.showUncategorized ?? false
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialState.selectedCategories ?? new Set()
  );
  const [selectedSections, setSelectedSections] = useState<Set<string>>(
    initialState.selectedSections ?? new Set()
  );
  const [selectedTypes, setSelectedTypes] = useState<Set<HabitType>>(
    initialState.selectedTypes ?? new Set()
  );

  // Действия для управления фильтрами
  const toggleUncategorized = () => {
    setShowUncategorized(!showUncategorized);
  };

  const toggleCategory = (categoryName: string) => {
    const newSet = new Set(selectedCategories);
    if (newSet.has(categoryName)) {
      newSet.delete(categoryName);
    } else {
      newSet.add(categoryName);
    }
    setSelectedCategories(newSet);
  };

  const toggleSection = (sectionName: string) => {
    const newSet = new Set(selectedSections);
    if (newSet.has(sectionName)) {
      newSet.delete(sectionName);
    } else {
      newSet.add(sectionName);
    }
    setSelectedSections(newSet);
  };

  const toggleType = (type: HabitType) => {
    const newSet = new Set(selectedTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedTypes(newSet);
  };

  const clearAllFilters = () => {
    setShowUncategorized(false);
    setSelectedCategories(new Set());
    setSelectedSections(new Set());
    setSelectedTypes(new Set());
  };

  // Вычисление наличия активных фильтров
  const hasActiveFilters = useMemo(() => {
    return (
      showUncategorized === true ||
      selectedCategories.size > 0 ||
      selectedSections.size > 0 ||
      selectedTypes.size > 0
    );
  }, [showUncategorized, selectedCategories, selectedSections, selectedTypes]);

  // Подсчет количества активных фильтров
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (showUncategorized) count++;
    count += selectedCategories.size;
    count += selectedSections.size;
    count += selectedTypes.size;
    return count;
  }, [showUncategorized, selectedCategories, selectedSections, selectedTypes]);

  // Фильтрация привычек на основе текущих настроек
  const filteredHabits = useMemo(() => {
    // 1. Сначала исключаем архивные привычки
    const activeHabits = getActiveHabits(habits);
    
    // 2. Затем применяем остальные фильтры
    return activeHabits.filter((habit) => {
      // Фильтр по категориям/тегам с поддержкой "Без тега"
      // Если есть выбранные категории ИЛИ включен showUncategorized - применяем фильтр
      if (enableCategoryFilter && (selectedCategories.size > 0 || showUncategorized)) {
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
        enableSectionFilter &&
        selectedSections.size > 0 &&
        !selectedSections.has(habit.section || 'other')
      ) {
        return false;
      }

      // Фильтр по типам привычек (OR логика)
      // Если есть выбранные типы - применяем фильтр
      if (enableTypeFilter && selectedTypes.size > 0) {
        // Показываем только привычки выбранных типов
        if (!selectedTypes.has(habit.type)) {
          return false;
        }
      }

      return true;
    });
  }, [
    habits,
    showUncategorized,
    selectedCategories,
    selectedSections,
    selectedTypes,
    enableUncategorizedFilter,
    enableCategoryFilter,
    enableSectionFilter,
    enableTypeFilter,
  ]);

  // Формирование возвращаемого объекта

  // Текущее состояние фильтров
  const state: HabitsFilterState = {
    showUncategorized,
    selectedCategories,
    selectedSections,
    selectedTypes,
  };

  // Действия для изменения состояния
  const actions: HabitsFilterActions = {
    toggleUncategorized,
    toggleCategory,
    toggleSection,
    toggleType,
    clearAllFilters,
  };

  // Результаты фильтрации
  const result: HabitsFilterResult = {
    filteredHabits,
    activeFiltersCount,
    hasActiveFilters,
  };

  return {
    state,
    actions,
    result,
  };
}
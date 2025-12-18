/**
 * HabitsFilterDropdown - умный компонент для фильтрации привычек
 * 
 * @description
 * "Умный" компонент, который:
 * - Использует хук useHabitsFilter для логики фильтрации
 * - Подготавливает данные из entities/habit с помощью утилит
 * - Передаёт секции фильтров в generic FilterDropdown
 * 
 * Интеграция:
 * - Логика: features/habit-filters/lib/useHabitsFilter
 * - Утилиты: entities/habit/lib/filters
 * - UI: shared/ui/filter-dropdown/FilterDropdown
 * 
 * @module features/habit-filters/ui
 * @created 29 ноября 2025 - рефакторинг на FSD архитектуру
 * @updated 30 ноября 2025 - переименование из filter-habits в habit-filters
 * @updated 30 ноября 2025 - исправлен антипаттерн: useMemo → useEffect для side-effects
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHabitsStore, useShallow } from '@/app/store';
import { useTranslatedTagName } from '@/entities/tag';
import { useTranslatedSectionName } from '@/entities/section';
import type { Habit } from '@/entities/habit';
import {
  getUniqueSections,
  countByTag,
  countBySection,
  countByType,
  countUncategorized,
  hasUncategorizedHabits,
} from '@/entities/habit';
import type { FilterSection } from '@/shared/types';
import { FilterDropdown } from '@/shared/ui/filter-dropdown';

interface Tag {
  name: string;
  color?: string;
}

interface HabitsFilterDropdownProps {
  /** Массив привычек для фильтрации */
  habits: Habit[];
  /** Массив тегов для отображения в фильтре */
  tags: Tag[];
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Callback для переключения открытия/закрытия */
  onToggleOpen: () => void;
  /** Дополнительные CSS классы */
  className?: string;
  /** Callback для получения отфильтрованных привычек */
  onFilteredHabitsChange?: (filteredHabits: Habit[]) => void;
}

/**
 * Умный компонент для фильтрации привычек
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <HabitsFilterDropdown
 *   habits={habits}
 *   tags={tags}
 *   isOpen={isOpen}
 *   onToggleOpen={() => setIsOpen(!isOpen)}
 *   onFilteredHabitsChange={(filtered) => setFilteredHabits(filtered)}
 * />
 * ```
 */
export function HabitsFilterDropdown({
  habits,
  tags,
  isOpen,
  onToggleOpen,
  className,
  onFilteredHabitsChange,
}: HabitsFilterDropdownProps) {
  const { t } = useTranslation('habits');
  const getTranslatedTagName = useTranslatedTagName();
  const getTranslatedSectionName = useTranslatedSectionName();
  
  // Получаем state фильтров и actions из store
  const {
    selectedFilterCategories,
    selectedFilterSections,
    selectedFilterTypes,
    showFilterUncategorized,
    toggleFilterCategory,
    toggleFilterSection,
    toggleFilterType,
    toggleFilterUncategorized,
    clearAllFilters,
  } = useHabitsStore(
    useShallow((state) => ({
      selectedFilterCategories: state.selectedFilterCategories,
      selectedFilterSections: state.selectedFilterSections,
      selectedFilterTypes: state.selectedFilterTypes,
      showFilterUncategorized: state.showFilterUncategorized,
      toggleFilterCategory: state.toggleFilterCategory,
      toggleFilterSection: state.toggleFilterSection,
      toggleFilterType: state.toggleFilterType,
      toggleFilterUncategorized: state.toggleFilterUncategorized,
      clearAllFilters: state.clearAllFilters,
    }))
  );

  // Проверяем есть ли активные фильтры
  const hasActiveFilters =
    selectedFilterCategories.size > 0 ||
    selectedFilterSections.size > 0 ||
    selectedFilterTypes.size > 0 ||
    showFilterUncategorized;

  // Подсчёт количества привычек
  const counts = useMemo(() => ({
    tags: countByTag(habits),
    sections: countBySection(habits),
    types: countByType(habits),
    uncategorized: countUncategorized(habits),
  }), [habits]);

  // Получаем уникальные секции
  const availableSections = useMemo(() => getUniqueSections(habits), [habits]);

  // Подготавливаем секции фильтров для generic компонента
  const filterSections: FilterSection[] = useMemo(() => {
    const sections: FilterSection[] = [];

    // Секция "Теги"
    const tagOptions = [];
    
    // Опция "Без тега"
    if (hasUncategorizedHabits(habits)) {
      tagOptions.push({
        id: 'uncategorized',
        label: t('manage.filters.uncategorized'),
        checked: showFilterUncategorized,
        count: counts.uncategorized,
        onChange: toggleFilterUncategorized,
      });
    }
    
    // Опции для каждого тега
    tags.forEach((tag) => {
      const translatedName = getTranslatedTagName(tag.name);
      tagOptions.push({
        id: tag.name,
        label: translatedName,
        checked: selectedFilterCategories.has(tag.name),
        count: counts.tags.get(tag.name) || 0,
        onChange: () => toggleFilterCategory(tag.name),
      });
    });

    sections.push({
      id: 'tags',
      title: t('manage.filters.tags'),
      options: tagOptions,
    });

    // Секция "Разделы"
    const sectionOptions = availableSections.map((section) => ({
      id: section,
      label: getTranslatedSectionName(section),
      checked: selectedFilterSections.has(section),
      count: counts.sections.get(section) || 0,
      onChange: () => toggleFilterSection(section),
    }));

    sections.push({
      id: 'sections',
      title: t('manage.filters.sections'),
      options: sectionOptions,
    });

    // Секция "Тип отслеживания"
    sections.push({
      id: 'types',
      title: t('manage.filters.trackingType'),
      options: [
        {
          id: 'binary',
          label: t('type.binary'),
          checked: selectedFilterTypes.has('binary'),
          count: counts.types.binary,
          onChange: () => toggleFilterType('binary'),
        },
        {
          id: 'measurable',
          label: t('type.measurable'),
          checked: selectedFilterTypes.has('measurable'),
          count: counts.types.measurable,
          onChange: () => toggleFilterType('measurable'),
        },
      ],
    });

    return sections;
  }, [habits, tags, selectedFilterCategories, selectedFilterSections, selectedFilterTypes, showFilterUncategorized, toggleFilterCategory, toggleFilterSection, toggleFilterType, toggleFilterUncategorized, counts, availableSections, t, getTranslatedTagName, getTranslatedSectionName]);

  return (
    <FilterDropdown
      sections={filterSections}
      hasActiveFilters={hasActiveFilters}
      onClearAll={clearAllFilters}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      className={className}
    />
  );
}
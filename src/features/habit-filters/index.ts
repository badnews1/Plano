/**
 * Public API фичи habit-filters
 * 
 * @description
 * Фича фильтрации привычек по различным критериям:
 * - По тегам/категориям
 * - По разделам/секциям
 * - По типам (binary/measurable)
 * 
 * @module features/habit-filters
 * @created 29 ноября 2025 - миграция на FSD архитектуру
 * @updated 30 ноября 2025 - переименование из filter-habits в habit-filters
 */

// Хук фильтрации
export { useHabitsFilter } from './lib';

// UI компоненты
export { HabitsFilterDropdown } from './ui';
export { HabitsFilterButton } from './ui/HabitsFilterButton';

// Типы реэкспортируются из model для удобства
export type {
  HabitsFilterState,
  HabitsFilterResult,
  HabitsFilterActions,
  HabitsFilterConfig,
} from './model';
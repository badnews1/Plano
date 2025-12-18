/**
 * Public API для фильтрации привычек
 * 
 * @module entities/habit/lib/filters
 */

// Экспортируем утилиты фильтрации из родительской директории
export {
  getUniqueSections,
  getUniqueTags,
  countByTag,
  countBySection,
  countByType,
  countUncategorized,
  hasUncategorizedHabits,
} from '../filters';

export {
  filterHabits,
  type FilterHabitsParams,
} from './filterHabits';

export {
  getActiveHabits,
  getArchivedHabits,
  isHabitArchived,
} from './archiveUtils';

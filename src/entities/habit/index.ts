// Утилиты из lib
export {
  isHabitCompletedForDate,
  isDateAutoSkipped,
  shouldShowAutoSkip,
  getAdjustedMonthlyGoal,
  isSystemSection,
  isSystemTag,
  filterHabits,
  type FilterHabitsParams,
  getActiveHabits,
  getArchivedHabits,
  isHabitArchived,
  groupHabitsBySection,
  getSectionOrder,
  getSectionColor,
  getUniqueSections,
  getUniqueTags,
  countByTag,
  countBySection,
  countByType,
  countUncategorized,
  hasUncategorizedHabits,
  recalculateStrength,
  getCompletionValueForDate,
  calculateMonthlyProgress,
  type MonthlyProgressResult,
} from './lib';

// Public API для entities/habit
export {
  // Константы
  EMA_PERIOD,
  EMA_ALPHA,
  DEFAULT_SECTION,
  DEFAULT_SECTIONS,
  DEFAULT_SECTIONS_WITH_COLORS,
  SYSTEM_SECTION_KEYS,
  // Типы
  type HabitType,
  type Mood,
  type FrequencyType,
  type FrequencyConfig,
  type Reminder,
  type Habit,
  type HabitData,
  type MeasurableSettings,
  type Tag,
  type Section,
  type DateConfig,
  // Хуки
  useHabitActions,
  useHabits,
  useHabitUnitGroups,
  useLocalizedUnit,
} from './model';

// API синхронизации
export {
  fetchHabitsFromServer,
  createHabitOnServer,
  updateHabitOnServer,
  deleteHabitOnServer,
  syncAllHabitsToServer,
} from './api/habitSync';

// UI компоненты
export { TargetTypePicker } from './ui/TargetTypePicker';
export { FrequencyTwoColumn } from './ui/frequency';
export { DailyProgressBars, MonthlyCircle, TopHabitsRanking, DailyStatsRows, DailyCompletionAreaChart } from './ui/stats';
export { HabitNameCell } from './ui/HabitNameCell';
export { HabitProgressCell } from './ui/HabitProgressCell';
export { HabitFormModalTabs, type HabitFormModalTabsProps } from './ui/HabitFormModalTabs';
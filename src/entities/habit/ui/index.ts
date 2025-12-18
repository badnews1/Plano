/**
 * UI компоненты для entities/habit
 * 
 * @module entities/habit/ui
 * @updated 30 ноября 2025 - миграция FrequencyTwoColumn из features/frequency
 * @updated 30 ноября 2025 - миграция stats компонентов из features/statistics
 * @updated 2 декабря 2025 - добавлены HabitNameCell и HabitProgressCell для calendar widget
 * @updated 8 декабря 2025 - добавлены новые UI компоненты для модалки создания привычки
 * @updated 12 декабря 2025 - удалены неиспользуемые компоненты (HabitSectionSelect, HabitNotes, HabitReminders)
 */

export { TargetTypePicker } from './TargetTypePicker';
export { FrequencyTwoColumn } from './frequency';
export { DailyProgressBars, MonthlyCircle, TopHabitsRanking, DailyStatsRows, DailyCompletionAreaChart } from './stats';

// Ячейки для calendar widget
export { HabitNameCell } from './HabitNameCell';
export { HabitProgressCell } from './HabitProgressCell';

// Новые компоненты для модалки создания привычки (дизайн с кнопками)
export { DaysSelector } from './DaysSelector';
export { FrequencyButtons } from './FrequencyButtons';
export { HabitRemindersCards } from './HabitRemindersCards';
export { HabitTypePickerButtons } from './HabitTypePickerButtons';
export { IntervalInput } from './IntervalInput';
export { SectionButtons } from './SectionButtons';
export { TimesSlider } from './TimesSlider';

// Форма привычки (используется в создании и редактировании)
export { HabitFormModalTabs } from './HabitFormModalTabs';
/**
 * Компоненты для управления привычками
 * 
 * Используются на странице /manage для редактирования привычек
 * 
 * @module features/habit-manage
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 1 декабря 2025 - удалена ManageHabitsModal, перенесено на страницу /manage
 */

// Main components
export { HabitsList } from './ui/HabitsList';

// Dialogs
export { DeleteDialog } from './ui/DeleteDialog';

// Habit Item and sub-components
export { HabitItem } from './ui/HabitItem';
export { HabitFrequencySection } from './ui/HabitFrequencySection';
export { HabitMeasurableSettingsSection } from './ui/HabitMeasurableSettingsSection';
export { HabitNameEditor } from './ui/HabitNameEditor';
export { HabitRemindersSection } from './ui/HabitRemindersSection';

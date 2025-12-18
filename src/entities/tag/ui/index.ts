/**
 * UI компоненты для entities/tag
 * 
 * @module entities/tag/ui
 * @updated 30 ноября 2025 - миграция TagPicker из features/tag-picker
 * @updated 8 декабря 2025 - добавлен TagButtonsSelector для новой модалки создания привычки
 */

export { TagPickerTrigger } from './TagPickerTrigger';
export type { TagPickerTriggerProps } from './TagPickerTrigger';

// Generic TagPicker
export { TagPicker } from './TagPicker';
export type * from './TagPicker/TagPicker.types';

// Обёртка для привычек
export { HabitTagPicker } from './HabitTagPicker';
export type { HabitTagPickerProps } from './HabitTagPicker';

// Новый компонент для модалки создания привычки (дизайн с кнопками)
export { TagButtonsSelector } from './TagButtonsSelector';
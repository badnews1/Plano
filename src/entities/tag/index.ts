/**
 * 📦 Public API для entities/tag
 * 
 * Слайс для сущности Tag в FSD архитектуре.
 * Экспортирует типы данных и UI компоненты.
 * 
 * @module entities/tag
 * @updated 30 ноября 2025 - миграция TagPicker из features/tag-picker
 * @updated 2 декабря 2025 - добавлен хук useTranslatedTagName для мультиязычности
 */

// Типы данных (model)
export type { BaseTag } from './model/types';

// UI компоненты
export { TagPickerTrigger } from './ui/TagPickerTrigger';
export type { TagPickerTriggerProps } from './ui/TagPickerTrigger';

// Generic TagPicker
export { TagPicker } from './ui/TagPicker';
export type * from './ui/TagPicker/TagPicker.types';

// Обёртка для привычек
export { HabitTagPicker } from './ui/HabitTagPicker';
export type { HabitTagPickerProps } from './ui/HabitTagPicker';

// Хуки
export { useTranslatedTagName } from './lib/useTranslatedTagName';

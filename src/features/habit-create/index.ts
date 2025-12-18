/**
 * Публичный API фичи habit-create
 * 
 * @description
 * Экспортирует компоненты и типы для добавления привычек
 * 
 * @module features/habit-create
 * @created 29 ноября 2025 - миграция на FSD
 * @updated 30 ноября 2025 - переименование add-habit → habit-create
 * @updated 8 декабря 2025 - добавлена новая модалка AddHabitModalTabs
 * @updated 10 декабря 2025 - удалён старый AddHabitModal (без табов)
 */

export { AddHabitModalTabs } from './ui/AddHabitModalTabs';
export type { AddHabitModalProps } from './model/types';
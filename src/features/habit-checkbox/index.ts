/**
 * Фича отметки выполнения привычки
 * 
 * Предоставляет компоненты для отметки привычек:
 * - HabitCheckbox: чекбокс в календарной сетке (бинарные и измеримые)
 * - NumericInputModal: модальное окно для ввода числовых значений (измеримые)
 * 
 * Для бинарных: галочка/пауза/пусто
 * Для измеримых: галочка/прогресс/пусто + модальное окно для ввода
 * 
 * @module features/habit-checkbox
 * @migrated 30 ноября 2025 - миграция на FSD
 */

export { HabitCheckbox } from './ui/HabitCheckbox';
export { NumericInputModal } from './ui/NumericInputModal';

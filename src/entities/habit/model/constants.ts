/**
 * Константы для сущности Habit
 * 
 * @module entities/habit/model/constants
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker
 */

import type { Section } from './types';

// ========================================
// Расчёт силы привычки (EMA алгоритм)
// ========================================

/**
 * Период EMA (Exponential Moving Average) для расчёта силы привычки
 * 
 * N = 32 означает период ~1 месяц (окно влияния)
 * 
 * Чем больше N, тем более плавно меняется сила:
 * - N = 10 → быстрая реакция на изменения
 * - N = 32 → баланс (текущее значение) ✅
 * - N = 100 → очень медленная реакция
 */
export const EMA_PERIOD = 32;

/**
 * Коэффициент EMA (рассчитанный из периода)
 * alpha = 1 / N
 * 
 * Используется в формуле:
 * strength_new = strength_old × (1 - alpha) + completion × alpha
 */
export const EMA_ALPHA = 1 / EMA_PERIOD;

// ========================================
// Разделы для привычек
// ========================================

/**
 * Ключи системных разделов (используются для переводов)
 */
export const SYSTEM_SECTION_KEYS = {
  other: 'other',
  morning: 'morning',
  day: 'day',
  evening: 'evening',
} as const;

export const DEFAULT_SECTION = SYSTEM_SECTION_KEYS.other;

/**
 * Дефолтные разделы с цветами
 * 
 * Стандартные разделы для группировки привычек по времени дня.
 * Названия разделов хранятся как ключи для переводов (en: other, morning, day, evening).
 * Цвета подобраны интуитивно:
 * - other (Другие): серый (нейтральный, как "Без тега")
 * - morning (Утро): янтарный (тёплый утренний свет)
 * - day (День): голубой (небо)
 * - evening (Вечер): индиго (сумерки)
 */
export const DEFAULT_SECTIONS_WITH_COLORS: Section[] = [
  { name: SYSTEM_SECTION_KEYS.other, color: 'gray' },
  { name: SYSTEM_SECTION_KEYS.morning, color: 'amber' },
  { name: SYSTEM_SECTION_KEYS.day, color: 'sky' },
  { name: SYSTEM_SECTION_KEYS.evening, color: 'indigo' },
];

/**
 * Названия дефолтных разделов (для обратной совместимости)
 */
export const DEFAULT_SECTIONS = DEFAULT_SECTIONS_WITH_COLORS.map(s => s.name);

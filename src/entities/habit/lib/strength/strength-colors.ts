/**
 * Утилиты для работы с цветами силы привычки
 * 
 * @module entities/habit/lib/strength/strength-colors
 * @created 9 декабря 2025
 */

/**
 * Функция динамического вычисления цвета на основе значения силы привычки
 * 
 * Использует градацию силы привычки:
 * - Starting (0-19%): красный
 * - Developing (20-39%): оранжевый
 * - Building (40-59%): синий
 * - Strong (60-79%): индиго
 * - Mastered (80-100%): зелёный
 * 
 * @param value - Значение силы (0-100)
 * @returns HEX цвет
 */
export function getStrengthColor(value: number): string {
  if (value >= 80) return '#22c55e'; // green-500 - Mastered
  if (value >= 60) return '#6366f1'; // indigo-500 - Strong
  if (value >= 40) return '#3b82f6'; // blue-500 - Building
  if (value >= 20) return '#f59e0b'; // amber-500 - Developing
  return '#ef4444'; // red-500 - Starting
}

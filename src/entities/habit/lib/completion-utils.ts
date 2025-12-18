/**
 * Утилиты для работы с выполнением привычек (completions)
 * 
 * @module entities/habit/lib/completion-utils
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker/features/habits/utils
 */

import type { Habit } from '../model/types';

/**
 * Получает пропорциональное значение выполнения (0-100) для расчёта EMA
 * 
 * Для бинарных привычек: возвращает 100 если выполнено, 0 если нет
 * 
 * Для измеримых привычек: возвращает пропорциональное значение на основе факта vs цели
 * 
 * Примеры для targetType 'min' (не меньше):
 *   - Цель: 10 страниц, Факт: 9  → 90%  (частичное выполнение засчитывается)
 *   - Цель: 10 страниц, Факт: 10 → 100% (цель достигнута)
 *   - Цель: 10 страниц, Факт: 15 → 100% (ограничено максимумом, перевыполнение не штрафуется)
 * 
 * Примеры для targetType 'max' (не больше):
 *   - Цель: 5 сигарет, Факт: 0  → 100% (идеально)
 *   - Цель: 5 сигарет, Факт: 5  → 100% (на пределе)
 *   - Цель: 5 сигарет, Факт: 7.5 → 50%  (50% превышения = 50% штрафа)
 *   - Цель: 5 сигарет, Факт: 10 → 0%   (100% превышения = полный штраф)
 * 
 * @param habit - Привычка для расчёта
 * @param dateStr - Дата в формате строки (YYYY-MM-DD)
 * @returns Пропорциональное значение от 0 до 100
 */
export function getCompletionValueForDate(habit: Habit, dateStr: string): number {
  const value = habit.completions?.[dateStr];
  
  // Если нет значения, возвращаем 0
  if (value === undefined || value === null || value === false) {
    return 0;
  }
  
  // Для binary типа - возвращаем 100 или 0
  if (habit.type === 'binary') {
    return value === true ? 100 : 0;
  }
  
  // Для measurable типа - рассчитываем пропорциональное значение
  if (habit.type === 'measurable') {
    // Если значение true (старый формат) - возвращаем 100
    if (value === true) return 100;
    
    // Если значение число - рассчитываем пропорцию
    if (typeof value === 'number') {
      const targetValue = habit.targetValue;
      const targetType = habit.targetType || 'min';
      
      // Если нет цели, считаем любое положительное число как 100
      if (targetValue === undefined || targetValue === null || targetValue === 0) {
        return value > 0 ? 100 : 0;
      }
      
      // Рассчитываем пропорциональное значение
      if (targetType === 'min') {
        // Для "не меньше": пропорция от 0 до 100, ограниченная максимумом в 100
        // Например: цель 10, выполнено 9 → 90%, выполнено 10 → 100%, выполнено 15 → 100%
        const proportion = (value / targetValue) * 100;
        return Math.min(proportion, 100);
      } else { // max
        // Для "не больше": 100% если <= цели, штраф если превышено
        // Например: цель 5, выполнено 0 → 100%, выполнено 5 → 100%, выполнено 10 → 0%
        if (value <= targetValue) {
          return 100;
        } else {
          // Превышение: штраф пропорционально превышению
          const excess = value - targetValue;
          const penalty = (excess / targetValue) * 100;
          return Math.max(100 - penalty, 0);
        }
      }
    }
    
    return 0;
  }
  
  return 0;
}

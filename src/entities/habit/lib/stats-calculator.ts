/**
 * Утилиты для расчёта статистики привычек
 * 
 * @module entities/habit/lib
 * @created 6 декабря 2025
 */

import type { Habit, VacationPeriod } from '../model/types';
import { isHabitCompletedForDate } from './habit-utils';
import { getAdjustedMonthlyGoal } from './goal-calculator';

/**
 * Результат расчёта месячного прогресса
 */
export interface MonthlyProgressResult {
  /** Общее количество выполненных действий */
  totalCompleted: number;
  /** Общее количество запланированных действий (цель) */
  totalPossible: number;
  /** Процент выполнения (0-100) */
  percentage: number;
}

/**
 * Рассчитывает общий прогресс за месяц для всех привычек
 * 
 * Алгоритм:
 * 1. Для каждой привычки получаем месячную цель через getAdjustedMonthlyGoal
 * 2. Суммируем все цели = totalPossible
 * 3. Для каждого дня считаем выполненные привычки
 * 4. Суммируем выполнения = totalCompleted
 * 5. Процент = (totalCompleted / totalPossible) * 100
 * 
 * @param habits - Список привычек
 * @param allMonthDates - Все даты месяца в формате YYYY-MM-DD
 * @param vacationPeriods - Периоды отпуска
 * @returns Объект с результатами расчёта
 * 
 * @example
 * ```typescript
 * const result = calculateMonthlyProgress(habits, allMonthDates, vacationPeriods);
 * console.log(result.percentage); // 85
 * console.log(`${result.totalCompleted}/${result.totalPossible}`); // 17/20
 * ```
 */
export function calculateMonthlyProgress(
  habits: Habit[],
  allMonthDates: string[],
  vacationPeriods: VacationPeriod[] = []
): MonthlyProgressResult {
  // Рассчитываем общее количество возможных выполнений
  let totalPossible = 0;
  habits.forEach(habit => {
    const goalValue = getAdjustedMonthlyGoal(habit, allMonthDates, vacationPeriods);
    totalPossible += goalValue;
  });
  
  // Считаем фактическое количество выполнений
  let totalCompleted = 0;
  allMonthDates.forEach(dateStr => {
    const completedOnDay = habits.filter(habit => 
      isHabitCompletedForDate(habit, dateStr)
    ).length;
    totalCompleted += completedOnDay;
  });

  // Рассчитываем процент выполнения
  const percentage = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;

  // Защита от NaN
  return {
    totalCompleted: isNaN(totalCompleted) ? 0 : totalCompleted,
    totalPossible: isNaN(totalPossible) ? 0 : totalPossible,
    percentage: isNaN(percentage) ? 0 : percentage,
  };
}

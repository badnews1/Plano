/**
 * Утилиты для работы с архивными привычками
 * 
 * @description
 * Функции для фильтрации активных и архивных привычек.
 * 
 * @module entities/habit/lib/filters/archiveUtils
 * @created 5 декабря 2025
 */

import type { Habit } from '../../model/types';

/**
 * Получить только активные (неархивированные) привычки
 * 
 * @param habits - массив всех привычек
 * @returns массив активных привычек
 * 
 * @example
 * ```ts
 * const activeHabits = getActiveHabits(allHabits);
 * ```
 */
export function getActiveHabits(habits: Habit[]): Habit[] {
  return habits.filter(habit => !habit.isArchived);
}

/**
 * Получить только архивные привычки
 * 
 * @param habits - массив всех привычек
 * @returns массив архивных привычек
 * 
 * @example
 * ```ts
 * const archivedHabits = getArchivedHabits(allHabits);
 * ```
 */
export function getArchivedHabits(habits: Habit[]): Habit[] {
  return habits.filter(habit => habit.isArchived === true);
}

/**
 * Проверить, является ли привычка архивной
 * 
 * @param habit - привычка для проверки
 * @returns true если привычка архивирована
 * 
 * @example
 * ```ts
 * if (isHabitArchived(habit)) {
 *   // привычка в архиве
 * }
 * ```
 */
export function isHabitArchived(habit: Habit): boolean {
  return habit.isArchived === true;
}

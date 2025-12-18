/**
 * Логика работы с периодами отдыха
 */

import type { VacationPeriod, VacationPeriodStatus } from '../model/types';

/**
 * Проверяет, попадает ли дата в период отдыха для конкретной привычки
 */
export function isDateInVacation(
  dateStr: string,
  habitId: string,
  vacationPeriods: VacationPeriod[]
): boolean {
  return vacationPeriods.some((period) => {
    // Проверяем, что дата попадает в диапазон
    const isInRange = dateStr >= period.startDate && dateStr <= period.endDate;
    
    if (!isInRange) {
      return false;
    }
    
    // Проверяем, применяется ли период к этой привычке
    if (period.applyToAll) {
      return true;
    }
    
    return period.habitIds.includes(habitId);
  });
}

/**
 * Находит период отдыха для данной даты и привычки
 */
export function getVacationPeriodForDate(
  dateStr: string,
  habitId: string,
  vacationPeriods: VacationPeriod[]
): VacationPeriod | undefined {
  return vacationPeriods.find((period) => {
    // Проверяем, что дата попадает в диапазон
    const isInRange = dateStr >= period.startDate && dateStr <= period.endDate;
    
    if (!isInRange) {
      return false;
    }
    
    // Проверяем, применяется ли период к этой привычке
    if (period.applyToAll) {
      return true;
    }
    
    return period.habitIds.includes(habitId);
  });
}

/**
 * Определяет статус периода отдыха
 */
export function getVacationPeriodStatus(
  period: VacationPeriod,
  todayStr: string
): VacationPeriodStatus {
  if (todayStr > period.endDate) {
    return 'past';
  }
  
  if (todayStr < period.startDate) {
    return 'upcoming';
  }
  
  return 'active';
}

/**
 * Проверяет, является ли период прошедшим
 */
export function isPeriodPast(period: VacationPeriod, todayStr: string): boolean {
  return todayStr > period.endDate;
}

/**
 * Проверяет, пересекается ли новый период с существующими
 */
export function isDateRangeOverlapping(
  startDate: string,
  endDate: string,
  existingPeriods: VacationPeriod[],
  excludePeriodId?: string
): boolean {
  return existingPeriods.some((period) => {
    // Пропускаем период, который редактируем
    if (excludePeriodId && period.id === excludePeriodId) {
      return false;
    }
    
    // Проверяем пересечение диапазонов
    // Период 1: [start1, end1]
    // Период 2: [start2, end2]
    // НЕ пересекаются, если: end1 < start2 ИЛИ end2 < start1
    // Пересекаются, если: НЕ (end1 < start2 ИЛИ end2 < start1)
    const notOverlapping = endDate < period.startDate || period.endDate < startDate;
    return !notOverlapping;
  });
}

/**
 * Сортирует периоды по близости к текущей дате
 * - Активные и запланированные: по дате начала (ближайшие сверху)
 * - Прошедшие: всегда в конце, последние прошедшие сверху
 */
export function sortVacationPeriods(
  periods: VacationPeriod[],
  todayStr: string
): VacationPeriod[] {
  return [...periods].sort((a, b) => {
    const statusA = getVacationPeriodStatus(a, todayStr);
    const statusB = getVacationPeriodStatus(b, todayStr);
    
    const isPastA = statusA === 'past';
    const isPastB = statusB === 'past';
    
    // Прошедшие всегда в конце
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    
    // Если оба прошедшие - сортируем по дате окончания (последние прошедшие сверху)
    if (isPastA && isPastB) {
      return b.endDate.localeCompare(a.endDate);
    }
    
    // Активные и запланированные - по дате начала (ближайшие сверху)
    return a.startDate.localeCompare(b.startDate);
  });
}

/**
 * Подсчитывает количество дней в периоде отдыха для конкретной привычки
 * Используется для корректировки целей при расчёте статистики
 */
export function countVacationDaysInPeriod(
  dates: string[],
  habitId: string,
  vacationPeriods: VacationPeriod[]
): number {
  return dates.filter(dateStr => isDateInVacation(dateStr, habitId, vacationPeriods)).length;
}
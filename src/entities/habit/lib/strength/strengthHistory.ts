/**
 * Расчёт истории силы привычек для графика
 * 
 * @module entities/habit/lib/strength
 * @created 22 ноября 2025
 * @migrated 30 ноября 2025 - перенос из /features/strength в /entities/habit
 */

import type { Habit } from '../../model/types';
import { EMA_PERIOD } from '../../model/constants';
import { getCompletionValueForDate } from '../completion-utils';

/**
 * Интерфейс для одного шага истории силы привычки
 */
export interface StrengthHistoryPoint {
  date: string;
  strength: number;
}

/**
 * Опции для расчёта истории силы привычки
 */
export interface StrengthHistoryOptions {
  /** Начальная дата (по умолчанию: самая ранняя галочка или дата создания) */
  startDate?: Date;
  /** Конечная дата (по умолчанию: сегодня) */
  endDate?: Date;
  /** Начальное значение силы (по умолчанию: 0) */
  initialStrength?: number;
  /** Округлять ли значения силы (по умолчанию: true) */
  round?: boolean;
}

/**
 * Применяет один шаг EMA алгоритма
 * 
 * Формула: strength_new = strength_old × (1 - alpha) + completion × alpha
 * где alpha = 1 / N (N = период EMA)
 * 
 * @param currentStrength - Текущая сила привычки (0-100)
 * @param completionValue - Значение выполнения за день (0-100)
 * @param period - Период EMA (по умолчанию: EMA_PERIOD = 32)
 * @returns Новое значение силы привычки
 * 
 * @example
 * const newStrength = applyEMAStep(50, 100, 32);
 * // 50 × (1 - 1/32) + 100 × (1/32) = 50 × 0.96875 + 100 × 0.03125 = 51.5625
 */
export function applyEMAStep(
  currentStrength: number,
  completionValue: number,
  period: number = EMA_PERIOD
): number {
  const alpha = 1 / period;
  return currentStrength * (1 - alpha) + completionValue * alpha;
}

/**
 * Рассчитывает полную историю силы привычки по дням
 * 
 * Эта функция делает полный пересчёт от начала до конца,
 * применяя EMA алгоритм для каждого дня с учётом:
 * - Выполнения привычки (галочки)
 * - Заморозки (намеренные пропуски - не влияют на силу)
 * - Пропорционального выполнения (для measurable привычек)
 * 
 * @param habit - Привычка для расчёта истории
 * @param options - Опции расчёта
 * @returns Массив точек истории силы привычки (дата + сила)
 * 
 * @example
 * // Простейший случай - вся история до сегодня
 * const history = calculateStrengthHistory(habit);
 * 
 * // Кастомный период
 * const history = calculateStrengthHistory(habit, {
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-01-31'),
 *   initialStrength: 50
 * });
 */
export function calculateStrengthHistory(
  habit: Habit,
  options: StrengthHistoryOptions = {}
): StrengthHistoryPoint[] {
  /**
   * Находит самую раннюю дату с данными (галочки или пропуски)
   */
  function findEarliestDateWithData(habit: Habit): Date {
    // Собираем все даты с галочками и пропусками
    const allDates = [
      ...Object.entries(habit.completions || {})
        .filter(([_, value]) => value === true || typeof value === 'number')
        .map(([date, _]) => date),
      ...Object.entries(habit.skipped || {})
        .filter(([_, value]) => value === true)
        .map(([date, _]) => date)
    ];
    
    // Если есть данные, возвращаем самую раннюю дату
    if (allDates.length > 0) {
      // ✅ Fix: доступ по индексу может вернуть undefined
      const earliestDateStr = allDates.sort()[0];
      if (earliestDateStr) {
        const earliestDate = new Date(earliestDateStr);
        earliestDate.setHours(0, 0, 0, 0);
        return earliestDate;
      }
    }
    
    // Иначе возвращаем дату создания привычки
    const createdAt = new Date(habit.createdAt);
    createdAt.setHours(0, 0, 0, 0);
    return createdAt;
  }

  // Определяем параметры расчёта
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // ✅ Fix: split может вернуть undefined
  const todayStr = today.toISOString().split('T')[0] ?? today.toISOString();
  
  const startDate = options.startDate || findEarliestDateWithData(habit);
  const endDate = options.endDate || today;
  const round = options.round !== undefined ? options.round : true;
  
  const history: StrengthHistoryPoint[] = [];
  let strength = options.initialStrength || 0;
  
  let currentDate = new Date(startDate);
  
  // Проходим по каждому дню от startDate до endDate
  while (currentDate <= endDate) {
    // ✅ Fix: split может вернуть undefined
    const dateStr = currentDate.toISOString().split('T')[0] ?? currentDate.toISOString();
    
    // Не обрабатываем будущие дни
    if (dateStr > todayStr) {
      break;
    }
    
    const isSkipped = habit.skipped?.[dateStr] === true;
    
    // Применяем EMA (кроме дней с заморозкой)
    if (isSkipped) {
      // ЗАМОРОЗКА: сила не меняется
      // Ничего не делаем, strength остаётся прежней
    } else {
      // Получаем пропорциональное значение выполнения (0-100)
      const completionValue = getCompletionValueForDate(habit, dateStr);
      
      // Применяем один шаг EMA
      strength = applyEMAStep(strength, completionValue, EMA_PERIOD);
    }
    
    // Добавляем точку в историю
    history.push({
      date: dateStr,
      strength: round ? Math.round(strength) : strength
    });
    
    // Переходим к следующему дню
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return history;
}
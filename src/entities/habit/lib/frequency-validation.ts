/**
 * Утилиты валидации для настроек частоты выполнения привычки
 * 
 * @module entities/habit/lib
 * @created 22 ноября 2025
 * @migrated 30 ноября 2025 - перенос из /features/frequency в /entities/habit
 */

import type { FrequencyType } from '../model/types';

/**
 * Максимальные значения для разных типов частоты
 */
export const FREQUENCY_LIMITS = {
  n_times_week: {
    min: 1,
    max: 7, // Не больше дней в неделе
  },
  n_times_month: {
    min: 1,
    max: 31, // Не больше дней в месяце
  },
  every_n_days: {
    min: 1,
    max: 365, // Максимум год
  },
} as const;

/**
 * Результат валидации
 */
export interface ValidationResult {
  /** Валидное ли значение */
  isValid: boolean;
  /** Скорректированное значение (если нужна коррекция) */
  value?: number;
  /** Причина невалидности */
  reason?: string;
}

/**
 * Базовая проверка числового значения
 * Проверяет на NaN, отрицательные числа, ноль
 */
function validateNumber(value: number | undefined): ValidationResult {
  // undefined - валидно (пустое поле)
  if (value === undefined) {
    return { isValid: true };
  }

  // Проверка на NaN
  if (Number.isNaN(value)) {
    return { isValid: false, reason: 'NaN' };
  }

  // Проверка на отрицательные числа
  if (value < 0) {
    return { isValid: false, reason: 'negative' };
  }

  // Проверка на ноль
  if (value === 0) {
    return { isValid: false, reason: 'zero' };
  }

  return { isValid: true, value };
}

/**
 * Валидация count для конкретного типа частоты
 */
export function validateCount(
  value: number | undefined,
  type: FrequencyType,
  period?: number
): ValidationResult {
  // Базовая проверка
  const baseCheck = validateNumber(value);
  if (!baseCheck.isValid || value === undefined) {
    return baseCheck;
  }

  // Проверка специфичных лимитов для каждого типа
  switch (type) {
    case 'n_times_week': {
      const limits = FREQUENCY_LIMITS.n_times_week;
      if (value > limits.max) {
        return {
          isValid: true,
          value: limits.max,
          reason: 'clamped_to_max',
        };
      }
      return { isValid: true, value };
    }

    case 'n_times_month': {
      const limits = FREQUENCY_LIMITS.n_times_month;
      if (value > limits.max) {
        return {
          isValid: true,
          value: limits.max,
          reason: 'clamped_to_max',
        };
      }
      return { isValid: true, value };
    }

    case 'every_n_days':
      // Для every_n_days count не используется
      return { isValid: true, value };

    case 'by_days_of_week':
      // Для by_days_of_week count не используется
      return { isValid: true, value };

    default: {
      // ✅ Exhaustiveness check - TypeScript выдаст ошибку, если добавится новый тип
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Валидация period для конкретного типа частоты
 */
export function validatePeriod(
  value: number | undefined,
  type: FrequencyType
): ValidationResult {
  // Базовая проверка
  const baseCheck = validateNumber(value);
  if (!baseCheck.isValid || value === undefined) {
    return baseCheck;
  }

  // Проверка специфичных лимитов для каждого типа
  switch (type) {
    case 'every_n_days': {
      const limits = FREQUENCY_LIMITS.every_n_days;
      if (value > limits.max) {
        return {
          isValid: true,
          value: limits.max,
          reason: 'clamped_to_max',
        };
      }
      return { isValid: true, value };
    }

    default: {
      // ✅ Exhaustiveness check - TypeScript выдаст ошибку, если добавится новый тип
      const _exhaustiveCheck: never = type;
      return _exhaustiveCheck;
    }
  }
}

/**
 * Получить минимальное значение для типа частоты
 */
export function getMinValue(type: FrequencyType, param: 'count' | 'period'): number {
  if (param === 'period') {
    return FREQUENCY_LIMITS.every_n_days.min;
  }

  // param === 'count'
  switch (type) {
    case 'n_times_week':
      return FREQUENCY_LIMITS.n_times_week.min;
    case 'n_times_month':
      return FREQUENCY_LIMITS.n_times_month.min;
    default:
      return 1;
  }
}

/**
 * Получить максимальное значение для типа частоты
 */
export function getMaxValue(
  type: FrequencyType,
  param: 'count' | 'period',
  period?: number
): number {
  if (param === 'period') {
    return FREQUENCY_LIMITS.every_n_days.max;
  }

  // param === 'count'
  switch (type) {
    case 'n_times_week':
      return FREQUENCY_LIMITS.n_times_week.max;
    case 'n_times_month':
      return FREQUENCY_LIMITS.n_times_month.max;
    default:
      return 365;
  }
}

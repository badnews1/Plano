/**
 * Утилиты для работы с текстом и числами (i18n версия)
 * 
 * @description
 * Этот файл содержит функции для:
 * - Склонения слов с поддержкой мультиязычности
 * - Склонения единиц измерения
 * - Форматирования чисел
 */

import type { TFunction } from 'i18next';
import { createUnitToKeyMap } from '@/shared/constants/units';

// ============================================
// БАЗОВАЯ ФУНКЦИЯ СКЛОНЕНИЯ ДЛЯ РУССКОГО ЯЗЫКА
// ============================================

/**
 * Определяет форму склонения для русского языка
 * 
 * Правила склонения:
 * - 1, 21, 31, ... (кроме 11) → форма "one" (день, раз, привычка)
 * - 2-4, 22-24, 32-34, ... (кроме 12-14) → форма "few" (дня, раза, привычки)
 * - 0, 5-20, 25-30, ... → форма "many" (дней, раз, привычек)
 * 
 * @param count - число для определения формы
 * @returns 'one' | 'few' | 'many'
 */
function getPluralFormRu(count: number): 'one' | 'few' | 'many' {
  const absCount = Math.floor(Math.abs(count));
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Исключение: 11-14 всегда используют форму "many"
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'many';
  }

  // 1, 21, 31, ... → форма "one"
  if (lastDigit === 1) {
    return 'one';
  }

  // 2-4, 22-24, 32-34, ... → форма "few"
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'few';
  }

  // 0, 5-20, 25-30, ... → форма "many"
  return 'many';
}

/**
 * Определяет форму склонения для английского языка
 * 
 * Правила: 1 → 'one', остальное → 'other'
 * 
 * @param count - число для определения формы
 * @returns 'one' | 'other'
 */
function getPluralFormEn(count: number): 'one' | 'other' {
  return Math.abs(count) === 1 ? 'one' : 'other';
}

// ============================================
// ОБЩИЕ ФУНКЦИИ СКЛОНЕНИЯ (i18n)
// ============================================

/**
 * Склонение слова "день" с поддержкой i18n
 * 
 * @param count - количество дней
 * @param t - функция перевода из react-i18next
 * @param lng - язык ('ru' | 'en')
 * @returns склонённое слово
 * 
 * @example
 * declineDays(1, t, 'ru') // "день"
 * declineDays(2, t, 'ru') // "дня"
 * declineDays(5, t, 'ru') // "дней"
 * declineDays(1, t, 'en') // "day"
 * declineDays(5, t, 'en') // "days"
 */
export function declineDays(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  if (count === undefined || count === null || isNaN(count)) {
    count = 0;
  }

  const absCount = Math.floor(Math.abs(count));

  if (lng === 'ru') {
    const form = getPluralFormRu(absCount);
    return t(`common:plurals.day_${form}`);
  } else {
    const form = getPluralFormEn(absCount);
    return t(`common:plurals.day_${form}`);
  }
}

/**
 * Склонение слова "раз" с поддержкой i18n
 * 
 * @param count - количество раз
 * @param t - функция перевода
 * @param lng - язык ('ru' | 'en')
 * @returns склонённое слово
 */
export function declineTimes(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  if (count === undefined || count === null || isNaN(count)) {
    count = 0;
  }

  const absCount = Math.floor(Math.abs(count));

  if (lng === 'ru') {
    const form = getPluralFormRu(absCount);
    return t(`common:plurals.time_${form}`);
  } else {
    const form = getPluralFormEn(absCount);
    return t(`common:plurals.time_${form}`);
  }
}

/**
 * Склонение слова "привычка" с поддержкой i18n
 * 
 * @param count - количество привычек
 * @param t - функция перевода
 * @param lng - язык ('ru' | 'en')
 * @returns склонённое слово
 */
export function declineHabits(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  if (count === undefined || count === null || isNaN(count)) {
    count = 0;
  }

  const absCount = Math.floor(Math.abs(count));

  if (lng === 'ru') {
    const form = getPluralFormRu(absCount);
    return t(`common:plurals.habit_${form}`);
  } else {
    const form = getPluralFormEn(absCount);
    return t(`common:plurals.habit_${form}`);
  }
}

/**
 * Склонение слова "напоминание" с поддержкой i18n
 * 
 * @param count - количество напоминаний
 * @param t - функция перевода
 * @param lng - язык ('ru' | 'en')
 * @returns склонённое слово
 */
export function declineReminders(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  if (count === undefined || count === null || isNaN(count)) {
    count = 0;
  }

  const absCount = Math.floor(Math.abs(count));

  if (lng === 'ru') {
    const form = getPluralFormRu(absCount);
    return t(`common:plurals.reminder_${form}`);
  } else {
    const form = getPluralFormEn(absCount);
    return t(`common:plurals.reminder_${form}`);
  }
}

// ============================================
// ФОРМАТИРОВАНИЕ С ЧИСЛОМ
// ============================================

/**
 * Форматирует количество дней с правильным склонением
 * 
 * @param count - количество дней
 * @param t - функция перевода
 * @param lng - язык
 * @returns строка вида "5 дней" / "5 days"
 */
export function formatDays(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  const displayCount = (count === undefined || count === null || isNaN(count)) ? 0 : count;
  return `${displayCount} ${declineDays(count, t, lng)}`;
}

/**
 * Форматирует количество раз с правильным склонением
 * 
 * @param count - количество раз
 * @param t - функция перевода
 * @param lng - язык
 * @returns строка вида "5 раз" / "5 times"
 */
export function formatTimes(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  const displayCount = (count === undefined || count === null || isNaN(count)) ? 0 : count;
  return `${displayCount} ${declineTimes(count, t, lng)}`;
}

/**
 * Форматирует количество привычек с правильным склонением
 * 
 * @param count - количество привычек
 * @param t - функция перевода
 * @param lng - язык
 * @returns строка вида "5 привычек" / "5 habits"
 */
export function formatHabits(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  const displayCount = (count === undefined || count === null || isNaN(count)) ? 0 : count;
  return `${displayCount} ${declineHabits(count, t, lng)}`;
}

// ============================================
// СПЕЦИАЛИЗИРОВАННЫЕ ФУНКЦИИ ДЛЯ ЧАСТОТЫ
// ============================================

/**
 * Склонение фразы "раз в неделю" с поддержкой i18n
 * 
 * @param count - количество раз
 * @param t - функция перевода
 * @param lng - язык ('ru' | 'en')
 * @returns "раз в неделю" / "time per week"
 * 
 * @example
 * declineTimesPerWeek(1, t, 'ru') // "раз в неделю"
 * declineTimesPerWeek(2, t, 'ru') // "раза в неделю"
 * declineTimesPerWeek(5, t, 'ru') // "раз в неделю"
 * declineTimesPerWeek(1, t, 'en') // "time per week"
 * declineTimesPerWeek(5, t, 'en') // "times per week"
 */
export function declineTimesPerWeek(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  if (count === undefined || count === null || isNaN(count)) {
    count = 0;
  }

  const absCount = Math.floor(Math.abs(count));

  if (lng === 'ru') {
    const form = getPluralFormRu(absCount);
    return t(`common:plurals.timesPerWeek_${form}`);
  } else {
    const form = getPluralFormEn(absCount);
    return t(`common:plurals.timesPerWeek_${form}`);
  }
}

/**
 * Склонение фразы "раз в месяц" с поддержкой i18n
 * 
 * @param count - количество раз
 * @param t - функция перевода
 * @param lng - язык ('ru' | 'en')
 * @returns "раз в месяц" / "time per month"
 */
export function declineTimesPerMonth(count: number | undefined, t: TFunction, lng: string = 'ru'): string {
  if (count === undefined || count === null || isNaN(count)) {
    count = 0;
  }

  const absCount = Math.floor(Math.abs(count));

  if (lng === 'ru') {
    const form = getPluralFormRu(absCount);
    return t(`common:plurals.timesPerMonth_${form}`);
  } else {
    const form = getPluralFormEn(absCount);
    return t(`common:plurals.timesPerMonth_${form}`);
  }
}

// ============================================
// ЕДИНИЦЫ ИЗМЕРЕНИЯ
// ============================================

/**
 * Склонение единиц измерения в зависимости от числа (i18n)
 * 
 * @param value - Числовое значение
 * @param unit - Единица измерения (может быть на русском или английском)
 * @param t - функция перевода
 * @param lng - язык
 * @returns Правильно склонённая единица измерения
 * 
 * @example
 * declineUnit(1, 'разы', t, 'ru') // "раз"
 * declineUnit(2, 'разы', t, 'ru') // "раза"
 * declineUnit(5, 'разы', t, 'ru') // "раз"
 * declineUnit(5, 'times', t, 'en') // "times"
 */
export function declineUnit(value: number, unit: string, t: TFunction, lng: string = 'ru'): string {
  // Валюты и сокращения не склоняются
  if (unit === 'руб.' || unit === '$' || unit === '€' || unit === 'rub.' ) {
    return unit;
  }

  // Получаем маппинг единиц для текущего языка
  const unitToKeyMap = createUnitToKeyMap(t);

  // Получаем универсальный ключ для единицы (конвертируем локализованное значение в ключ)
  const unitKey = unitToKeyMap[unit] || unit;

  const absValue = Math.floor(Math.abs(value));

  // Для дробных чисел
  if (value % 1 !== 0) {
    if (lng === 'ru') {
      // В русском для дробных всегда используем форму "few" (родительный падеж ед. числа)
      // 1.5 литра, 2.5 килограмма
      const key = `common:plurals.unit_${unitKey}_few`;
      const translation = t(key);
      // Если перевод не найден, возвращаем unit как есть
      return translation === key ? unit : translation;
    } else {
      // В английском для дробных используем множественное число
      const key = `common:plurals.unit_${unitKey}_other`;
      const translation = t(key);
      return translation === key ? unit : translation;
    }
  }

  // Для целых чисел
  if (lng === 'ru') {
    const form = getPluralFormRu(absValue);
    const key = `common:plurals.unit_${unitKey}_${form}`;
    const translation = t(key);
    return translation === key ? unit : translation;
  } else {
    const form = getPluralFormEn(absValue);
    const key = `common:plurals.unit_${unitKey}_${form}`;
    const translation = t(key);
    return translation === key ? unit : translation;
  }
}

// ============================================
// ФОРМАТИРОВАНИЕ ЧИСЕЛ
// ============================================

/**
 * Форматирование больших чисел для компактного отображения в календаре
 * 
 * @param num - Число для форматирования
 * @returns Отформатированная строка
 * 
 * @example
 * formatNumber(999) // "999"
 * formatNumber(10000) // "10k"
 * formatNumber(15500) // "15.5k"
 * formatNumber(100000) // "100k"
 * formatNumber(1500000) // "1.5M"
 * 
 * Правила форматирования:
 * - 0-9999: как есть
 * - 10000-99999: с k и десятичной частью (например: 10k, 15.5k)
 * - 100000-999999: с k, округление (например: 101k, 100k)
 * - 1000000+: с M (например: 1M, 1.5M)
 */
export function formatNumber(num: number): string {
  if (num < 10000) {
    return num.toString();
  } else if (num < 100000) {
    const k = num / 1000;
    const rounded = parseFloat(k.toFixed(1));
    // Если после округления получилось целое число, показываем без .0
    return rounded % 1 === 0 ? `${Math.round(rounded)}k` : `${rounded}k`;
  } else if (num < 1000000) {
    const k = Math.round(num / 1000);
    // Если округление дало >= 1000k, показываем как M
    if (k >= 1000) {
      return '1M';
    }
    return `${k}k`;
  } else {
    const m = num / 1000000;
    const rounded = parseFloat(m.toFixed(1));
    return rounded % 1 === 0 ? `${Math.round(rounded)}M` : `${rounded}M`;
  }
}

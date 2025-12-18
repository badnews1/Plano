/**
 * Утилита для работы с переводами единиц измерения
 */

import { getTranslatedUnit } from '@/shared/constants/units';

/**
 * Получить ключ единицы из локализованного значения
 * 
 * @param unitValue - ключ единицы измерения (times, minutes и т.д.)
 * @returns ключ единицы измерения
 */
export function getUnitKey(unitValue: string): string {
  return unitValue;
}

/**
 * Получить локализованное значение единицы по ключу
 * 
 * @param unitKey - ключ единицы
 * @param t - функция перевода из react-i18next
 * @returns локализованное значение единицы
 * 
 * @example
 * getLocalizedUnit('times', t) // RU: "разы", EN: "times"
 * getLocalizedUnit('minutes', t) // RU: "минуты", EN: "minutes"
 */
export function getLocalizedUnit(unitKey: string, t: (key: string) => string): string {
  return getTranslatedUnit(unitKey, t);
}

/**
 * Конвертировать сохранённую единицу в текущую локализацию
 * 
 * @param savedUnit - ключ единицы измерения (times, minutes и т.д.)
 * @param t - функция перевода из react-i18next
 * @returns локализованное значение для текущего языка
 * 
 * @example
 * convertUnitToCurrentLanguage('kilometers', t)
 * // RU: "километры"
 * // EN: "kilometers"
 */
export function convertUnitToCurrentLanguage(savedUnit: string, t: (key: string) => string): string {
  return getTranslatedUnit(savedUnit, t);
}

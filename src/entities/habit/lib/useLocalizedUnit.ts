/**
 * Хук для получения локализованного значения единицы измерения
 * 
 * Конвертирует сохранённое значение единицы (которое может быть на любом языке)
 * в текущую локализацию приложения.
 * 
 * @module entities/habit/lib/useLocalizedUnit
 * @created 2 декабря 2025
 */

import { useTranslation } from 'react-i18next';
import { convertUnitToCurrentLanguage } from '@/shared/lib/units';

/**
 * Хук для получения локализованного значения единицы
 * 
 * @param savedUnit - сохранённое значение единицы (может быть на русском или английском)
 * @returns локализованное значение для текущего языка приложения
 * 
 * @example
 * ```tsx
 * const unit = useLocalizedUnit('километры'); // Вернёт "километры" (RU) или "kilometers" (EN)
 * ```
 */
export function useLocalizedUnit(savedUnit: string): string {
  const { t } = useTranslation('units');
  
  return convertUnitToCurrentLanguage(savedUnit, t);
}

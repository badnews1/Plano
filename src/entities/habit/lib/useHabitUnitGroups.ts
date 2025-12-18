/**
 * Хук для получения локализованных групп единиц измерения для привычек
 * 
 * @module entities/habit/lib/useHabitUnitGroups
 * @created 2 декабря 2025
 * @updated 2 декабря 2025 - рефакторинг для использования DRY через UNIT_DEFINITIONS
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  COUNTING_UNIT_KEYS,
  TIME_UNIT_KEYS,
  DISTANCE_UNIT_KEYS,
  WEIGHT_UNIT_KEYS,
  VOLUME_UNIT_KEYS,
  CALORIE_UNIT_KEYS,
  READING_UNIT_KEYS,
  CURRENCY_UNIT_KEYS,
  getTranslatedUnit,
} from '@/shared/constants/units';
import type { UnitGroup } from '@/shared/ui/unit-picker';

/**
 * Хук для получения локализованных групп единиц измерения
 */
export function useHabitUnitGroups(): UnitGroup[] {
  const { t } = useTranslation('units');

  return useMemo(
    () => [
      {
        label: t('units.groups.counting'),
        units: COUNTING_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
      },
      {
        label: t('units.groups.time'),
        units: TIME_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
      },
      {
        label: t('units.groups.distance'),
        units: DISTANCE_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
      },
      {
        label: t('units.groups.health'),
        units: [
          ...CALORIE_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
          ...WEIGHT_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
          ...VOLUME_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
        ],
      },
      {
        label: t('units.groups.reading'),
        units: READING_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
      },
      {
        label: t('units.groups.finance'),
        units: CURRENCY_UNIT_KEYS.map(key => getTranslatedUnit(key, t)),
      },
    ],
    [t]
  );
}

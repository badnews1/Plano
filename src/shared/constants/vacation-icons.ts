import React from 'react';
import { type LucideIcon } from '@/shared/assets/icons/system';
import {
  Pill,
  Plane,
  Gift,
  Home,
  Mountain,
  Briefcase,
  Heart,
  Snowflake,
  CloudRain,
  Palmtree,
} from 'lucide-react';

/**
 * Единый источник всех иконок для режима отдыха
 * VACATION_ICON_MAP и типы генерируются автоматически из этого массива
 */
export const VACATION_ICON_OPTIONS = [
  { key: 'pill', Icon: Pill },
  { key: 'plane', Icon: Plane },
  { key: 'palmtree', Icon: Palmtree },
  { key: 'gift', Icon: Gift },
  { key: 'home', Icon: Home },
  { key: 'mountain', Icon: Mountain },
  { key: 'briefcase', Icon: Briefcase },
  { key: 'heart', Icon: Heart },
  { key: 'snowflake', Icon: Snowflake },
  { key: 'cloudRain', Icon: CloudRain },
] as const;

/**
 * Тип для элемента опции иконки режима отдыха
 */
export type VacationIconOption = typeof VACATION_ICON_OPTIONS[number];

/**
 * Тип для ключей иконок режима отдыха (автоматически извлекается из VACATION_ICON_OPTIONS)
 */
export type VacationIconKey = typeof VACATION_ICON_OPTIONS[number]['key'];

/**
 * VACATION_ICON_MAP генерируется автоматически из VACATION_ICON_OPTIONS
 * Используется для быстрого доступа к иконке по ключу
 */
export const VACATION_ICON_MAP = Object.fromEntries(
  VACATION_ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])
) as Record<VacationIconKey, LucideIcon | React.FC<{ className?: string }>>;

/**
 * Функция для получения опций иконок режима отдыха с переводами
 * @param t - функция перевода из react-i18next
 * @returns массив опций иконок с переведенными labels
 */
export const getVacationIconOptions = (t: (key: string) => string) => {
  return VACATION_ICON_OPTIONS.map(({ key, Icon }) => ({
    key,
    label: t(`vacation:icons.${key}`),
    Icon,
  }));
};

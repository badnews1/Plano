/**
 * Типы для системы переводов
 * 
 * @module shared/locales/types
 * @created 18 декабря 2025 - добавлена полная типизация для автодополнения
 * 
 * Этот файл экспортирует типы всех переводов для использования
 * в расширении react-i18next и обеспечения type-safety
 */

// Импорт типов из английских переводов (используем как базу для типизации)
import type commonEn from './en/common';
import type habitsEn from './en/habits';
import type validationEn from './en/validation';
import type statsEn from './en/stats';
import type appEn from './en/app';
import type uiEn from './en/ui';
import type tagsEn from './en/tags';
import type sectionsEn from './en/sections';
import type unitsEn from './en/units';
import type iconsEn from './en/icons';
import type vacationEn from './en/vacation';
import type timerEn from './en/timer';
import type adminEn from './en/admin';
import type landingEn from './en/landing';
import type authEn from './en/auth';

/**
 * Типы для каждого namespace переводов
 * Извлекаем внутренние типы из экспортированных объектов
 * 
 * Примечание: некоторые файлы оборачивают переводы в namespace (common.ts → common: {...}),
 * а другие экспортируют плоский объект. Типы извлекаются соответствующим образом.
 */
export type CommonTranslation = typeof commonEn.common;
export type HabitsTranslation = typeof habitsEn;
export type ValidationTranslation = typeof validationEn;
export type StatsTranslation = typeof statsEn.stats;
export type AppTranslation = typeof appEn.app;
export type UiTranslation = typeof uiEn.ui;
export type TagsTranslation = typeof tagsEn.tags;
export type SectionsTranslation = typeof sectionsEn;
export type UnitsTranslation = typeof unitsEn.units;
export type IconsTranslation = typeof iconsEn.icons;
export type VacationTranslation = typeof vacationEn;
export type TimerTranslation = typeof timerEn;
export type AdminTranslation = typeof adminEn.admin;
export type LandingTranslation = typeof landingEn.landing;
export type AuthTranslation = typeof authEn.auth;

/**
 * Объединенный тип всех ресурсов переводов
 * Используется для типизации react-i18next
 */
export interface Resources {
  common: CommonTranslation;
  habits: HabitsTranslation;
  validation: ValidationTranslation;
  stats: StatsTranslation;
  app: AppTranslation;
  ui: UiTranslation;
  tags: TagsTranslation;
  sections: SectionsTranslation;
  units: UnitsTranslation;
  icons: IconsTranslation;
  vacation: VacationTranslation;
  timer: TimerTranslation;
  admin: AdminTranslation;
  landing: LandingTranslation;
  auth: AuthTranslation;
}

/**
 * Тип для всех возможных namespace
 */
export type Namespace = keyof Resources;

/**
 * Namespace по умолчанию
 */
export type DefaultNS = 'common';

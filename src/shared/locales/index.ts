/**
 * Public API для модуля локализации
 * 
 * Экспортируем файлы переводов для использования в конфигурации i18n
 * и типы для обеспечения type-safety
 * 
 * ==================== ТИПИЗАЦИЯ ПЕРЕВОДОВ ====================
 * 
 * Все переводы полностью типизированы! После обновления файлов переводов
 * типы автоматически обновляются благодаря TypeScript.
 * 
 * Использование:
 * ```typescript
 * import { useTranslation } from 'react-i18next';
 * 
 * // Автодополнение работает для всех ключей
 * const { t } = useTranslation('habits');
 * t('habit.title')  // ✅ Автодополнение
 * t('invalid.key')  // ❌ Ошибка TypeScript
 * ```
 * 
 * Файлы типизации:
 * - /src/types/i18next.d.ts - расширение react-i18next
 * - /src/shared/locales/types.ts - типы для всех namespace
 * - /src/shared/lib/i18n/typed-translation.ts - утилиты
 */

// ==================== ТИПЫ ====================
export type {
  CommonTranslation,
  HabitsTranslation,
  ValidationTranslation,
  StatsTranslation,
  AppTranslation,
  UiTranslation,
  TagsTranslation,
  SectionsTranslation,
  UnitsTranslation,
  IconsTranslation,
  VacationTranslation,
  TimerTranslation,
  AdminTranslation,
  LandingTranslation,
  AuthTranslation,
  Resources,
  Namespace,
  DefaultNS,
} from './types';

// ==================== АНГЛИЙСКИЕ ПЕРЕВОДЫ ====================
// Английские переводы
export { default as commonEn } from './en/common';
export { default as habitsEn } from './en/habits';
export { default as validationEn } from './en/validation';
export { default as statsEn } from './en/stats';
export { default as appEn } from './en/app';
export { default as uiEn } from './en/ui';
export { default as tagsEn } from './en/tags';
export { default as sectionsEn } from './en/sections';
export { default as unitsEn } from './en/units';
export { default as iconsEn } from './en/icons';
export { default as vacationEn } from './en/vacation';
export { default as timerEn } from './en/timer';
export { default as adminEn } from './en/admin';
export { default as landingEn } from './en/landing';
export { default as authEn } from './en/auth';

// ==================== РУССКИЕ ПЕРЕВОДЫ ====================
// Русские переводы
export { default as commonRu } from './ru/common';
export { default as habitsRu } from './ru/habits';
export { default as validationRu } from './ru/validation';
export { default as statsRu } from './ru/stats';
export { default as appRu } from './ru/app';
export { default as uiRu } from './ru/ui';
export { default as tagsRu } from './ru/tags';
export { default as sectionsRu } from './ru/sections';
export { default as unitsRu } from './ru/units';
export { default as iconsRu } from './ru/icons';
export { default as vacationRu } from './ru/vacation';
export { default as timerRu } from './ru/timer';
export { default as adminRu } from './ru/admin';
export { default as landingRu } from './ru/landing';
export { default as authRu } from './ru/auth';
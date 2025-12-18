/**
 * Типы настроек пользователя
 * 
 * @module entities/user/model/types
 * @created 17 декабря 2025
 */

/**
 * Тема приложения
 */
export type Theme = 'light' | 'dark';

/**
 * Язык приложения
 */
export type Language = 'ru' | 'en';

/**
 * Настройки пользователя
 * Синхронизируются между устройствами
 */
export interface UserSettings {
  /** Тема приложения */
  theme: Theme;
  /** Язык приложения */
  language: Language;
  /** Дата последнего обновления (ISO формат) - используется для Last Write Wins */
  updatedAt: string;
}

/**
 * Профиль пользователя
 */
export interface UserProfile {
  /** ID пользователя */
  id: string;
  /** Email пользователя */
  email: string;
  /** Имя пользователя */
  name?: string;
  /** URL аватара */
  avatarUrl?: string;
  /** Настройки пользователя */
  settings: UserSettings;
}

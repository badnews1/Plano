/**
 * Типы для языков приложения
 * 
 * @module shared/types/language
 * @created 18 декабря 2025 - создано для исправления циклической зависимости в FSD
 */

/**
 * Поддерживаемые языки приложения
 */
export type Language = 'en' | 'ru';

/**
 * Список всех поддерживаемых языков
 */
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'ru'];

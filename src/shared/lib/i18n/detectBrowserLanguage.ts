/**
 * Утилита для определения языка браузера пользователя
 * 
 * @module shared/lib/i18n/detectBrowserLanguage
 * @created 17 декабря 2025
 */

import type { Language } from '@/shared/types/language';
import { SUPPORTED_LANGUAGES } from '@/shared/types/language';

/**
 * Определяет предпочитаемый язык из настроек браузера
 * 
 * Алгоритм:
 * 1. Проверяет navigator.language (основной язык браузера)
 * 2. Проверяет navigator.languages (список предпочитаемых языков)
 * 3. Возвращает первый поддерживаемый язык или 'en' по умолчанию
 * 
 * Примеры:
 * - 'ru-RU' → 'ru'
 * - 'en-US' → 'en'
 * - 'fr-FR' → 'en' (французский не поддерживается, используем fallback)
 * 
 * @returns Код языка ('en' | 'ru')
 */
export function detectBrowserLanguage(): Language {
  // Функция для извлечения кода языка из локали (например, 'ru-RU' -> 'ru')
  const extractLanguageCode = (locale: string): string => {
    return locale.split('-')[0].toLowerCase();
  };
  
  // Проверяем navigator.language (основной язык)
  if (typeof navigator !== 'undefined' && navigator.language) {
    const languageCode = extractLanguageCode(navigator.language);
    if (SUPPORTED_LANGUAGES.includes(languageCode as Language)) {
      return languageCode as Language;
    }
  }
  
  // Проверяем navigator.languages (список предпочитаемых языков)
  if (typeof navigator !== 'undefined' && navigator.languages && navigator.languages.length > 0) {
    for (const locale of navigator.languages) {
      const languageCode = extractLanguageCode(locale);
      if (SUPPORTED_LANGUAGES.includes(languageCode as Language)) {
        return languageCode as Language;
      }
    }
  }
  
  // Fallback на английский, если не нашли поддерживаемый язык
  return 'en';
}

/**
 * Получает язык из localStorage или определяет из браузера
 * 
 * Приоритет:
 * 1. Сохраненный язык в localStorage
 * 2. Язык браузера
 * 3. Английский по умолчанию
 * 
 * @param storageKey - Ключ для localStorage (по умолчанию 'app-language')
 * @returns Код языка
 */
export function getInitialLanguage(storageKey: string = 'app-language'): Language {
  // Проверяем localStorage
  try {
    const savedLanguage = localStorage.getItem(storageKey);
    if (savedLanguage === 'en' || savedLanguage === 'ru') {
      return savedLanguage;
    }
  } catch {
    // Если localStorage недоступен (SSR или ошибка), продолжаем
  }
  
  // Определяем из браузера
  return detectBrowserLanguage();
}
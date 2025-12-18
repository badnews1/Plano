/**
 * Хук для получения переведённого названия тега
 * 
 * @description
 * Проверяет, является ли тег системным, и возвращает переведённое название.
 * Для пользовательских тегов возвращает оригинальное название.
 * 
 * @module entities/tag/lib/useTranslatedTagName
 * @created 2 декабря 2025
 */

import { useTranslation } from 'react-i18next';
import { isSystemTag } from '@/entities/habit';

/**
 * Хук для получения переведённого названия тега
 * 
 * @returns Функция для получения переведённого названия тега
 * 
 * @example
 * ```typescript
 * const getTranslatedTagName = useTranslatedTagName();
 * const displayName = getTranslatedTagName('health'); // "Health" или "Здоровье"
 * ```
 */
export function useTranslatedTagName() {
  const { t } = useTranslation('tags');
  
  return (tagName: string): string => {
    if (isSystemTag(tagName)) {
      return t(`tags.defaultTags.${tagName}`);
    }
    
    return tagName;
  };
}

/**
 * Хук для получения переведённого названия раздела
 * 
 * @description
 * Проверяет, является ли раздел системным, и возвращает переведённое название.
 * Для пользовательских разделов возвращает оригинальное название.
 * 
 * @module entities/section/lib/useTranslatedSectionName
 * @created 2 декабря 2025
 */

import { useTranslation } from 'react-i18next';
import { isSystemSection } from '@/entities/habit';

/**
 * Хук для получения переведённого названия раздела
 * 
 * @returns Функция для получения переведённого названия раздела
 * 
 * @example
 * ```typescript
 * const getTranslatedSectionName = useTranslatedSectionName();
 * const displayName = getTranslatedSectionName('morning'); // "Morning" или "Утро"
 * ```
 */
export function useTranslatedSectionName() {
  const { t } = useTranslation('sections');
  
  return (sectionName: string): string => {
    if (isSystemSection(sectionName)) {
      const key = `defaultSections.${sectionName}`;
      const translated = t(key);
      
      // Если перевод не найден (вернулся сам ключ), возвращаем оригинальное название
      if (translated === key) {
        return sectionName;
      }
      
      return translated;
    }
    
    return sectionName;
  };
}
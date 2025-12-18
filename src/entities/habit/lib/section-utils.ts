/**
 * Утилиты для работы с разделами привычек
 * 
 * @module entities/habit/lib/section-utils
 * @created 2 декабря 2025
 */

import type { Habit, Section } from '../model/types';
import type { ColorVariant } from '@/shared/constants/colors';
import { DEFAULT_SECTION, SYSTEM_SECTION_KEYS } from '../model/constants';

/**
 * Группировка привычек по разделам
 * 
 * @param habits - массив привычек
 * @returns Map где ключ - название раздела, значение - массив привычек
 */
export function groupHabitsBySection(habits: Habit[]): Map<string, Habit[]> {
  const groups = new Map<string, Habit[]>();
  
  habits.forEach((habit) => {
    const section = habit.section || DEFAULT_SECTION;
    
    if (!groups.has(section)) {
      groups.set(section, []);
    }
    
    groups.get(section)!.push(habit);
  });
  
  return groups;
}

/**
 * Проверяет, является ли раздел системным (дефолтным)
 * 
 * @param sectionName - Название раздела для проверки
 * @returns true если раздел является системным
 * 
 * @example
 * ```typescript
 * isSystemSection('morning') // true
 * isSystemSection('Мой раздел') // false
 * ```
 */
export function isSystemSection(sectionName: string): boolean {
  return (Object.values(SYSTEM_SECTION_KEYS) as string[]).includes(sectionName);
}

/**
 * Получить упорядоченный список разделов
 * Стандартные разделы идут первыми в заданном порядке, затем кастомные по алфавиту,
 * раздел "other" всегда последний
 * 
 * @param sectionNames - массив названий разделов
 * @param allSections - массив всех разделов с цветами
 * @returns упорядоченный массив названий разделов
 */
export function getSectionOrder(sectionNames: string[], allSections: Section[]): string[] {
  // Порядок стандартных разделов (без "other")
  const standardOrder = [
    SYSTEM_SECTION_KEYS.morning,
    SYSTEM_SECTION_KEYS.day,
    SYSTEM_SECTION_KEYS.evening,
  ];
  
  const standardSections = standardOrder.filter(s => sectionNames.includes(s));
  const customSections = sectionNames
    .filter(s => !standardOrder.includes(s) && s !== SYSTEM_SECTION_KEYS.other)
    .sort();
  
  // "other" всегда в конце (если есть)
  const otherSection = sectionNames.includes(SYSTEM_SECTION_KEYS.other) 
    ? [SYSTEM_SECTION_KEYS.other] 
    : [];
  
  return [...standardSections, ...customSections, ...otherSection];
}

/**
 * Получить цвет для раздела по его названию
 * 
 * @param sectionName - название раздела
 * @param sections - массив всех разделов с цветами
 * @returns цветовой вариант из палитры
 */
export function getSectionColor(sectionName: string, sections: Section[]): ColorVariant {
  const section = sections.find(s => s.name === sectionName);
  return section?.color || 'gray'; // Fallback на gray для неизвестных разделов
}
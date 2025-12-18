/**
 * Утилиты для работы с тегами привычек
 * 
 * @description
 * Функции для инициализации и управления тегами привычек.
 * Поддерживает мультиязычность для системных тегов.
 * 
 * @module entities/habit/lib/tag-utils
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker/features/tags/utils
 */

import type { Tag } from '../model/types';
import { categoryLogger } from '@/shared/lib/logger';

/**
 * Ключи переводов для системных тегов
 * Используются для мультиязычной поддержки дефолтных тегов
 */
export const SYSTEM_TAG_KEYS = {
  health: 'health',
  study: 'study',
  work: 'work',
  sports: 'sports',
  nutrition: 'nutrition',
  sleep: 'sleep',
  creativity: 'creativity',
  selfDevelopment: 'selfDevelopment',
  relationships: 'relationships',
  finance: 'finance',
  home: 'home',
} as const;

/**
 * Дефолтные теги привычек с предустановленными цветами и ключами переводов
 * Цвета подобраны так, чтобы максимально отличаться друг от друга
 * 
 * ВАЖНО: name содержит ключ перевода (например, 'health'), который должен быть
 * преобразован в переведённое название через getTranslatedTagName()
 */
const DEFAULT_HABIT_TAGS: Tag[] = [
  { name: SYSTEM_TAG_KEYS.health, color: 'emerald' },
  { name: SYSTEM_TAG_KEYS.study, color: 'indigo' },
  { name: SYSTEM_TAG_KEYS.work, color: 'purple' },
  { name: SYSTEM_TAG_KEYS.sports, color: 'orange' },
  { name: SYSTEM_TAG_KEYS.nutrition, color: 'lime' },
  { name: SYSTEM_TAG_KEYS.sleep, color: 'sky' },
  { name: SYSTEM_TAG_KEYS.creativity, color: 'fuchsia' },
  { name: SYSTEM_TAG_KEYS.selfDevelopment, color: 'teal' },
  { name: SYSTEM_TAG_KEYS.relationships, color: 'rose' },
  { name: SYSTEM_TAG_KEYS.finance, color: 'amber' },
  { name: SYSTEM_TAG_KEYS.home, color: 'stone' },
];

/**
 * Инициализация тегов привычек
 * 
 * Возвращает дефолтные теги. Zustand persist middleware автоматически
 * восстанавливает сохранённые теги из localStorage['habits-storage'].
 * 
 * @returns Массив дефолтных тегов привычек
 * 
 * @example
 * ```typescript
 * const tags = initializeHabitTags();
 * ```
 */
export function initializeHabitTags(): Tag[] {
  categoryLogger.info('✅ Инициализация дефолтных тегов');
  return DEFAULT_HABIT_TAGS;
}

/**
 * Экспорт дефолтных тегов для использования в других модулях
 */
export function getDefaultHabitTags(): Tag[] {
  return DEFAULT_HABIT_TAGS;
}

/**
 * Проверяет, является ли тег системным (дефолтным)
 * 
 * @param tagName - Название тега для проверки
 * @returns true если тег является системным
 * 
 * @example
 * ```typescript
 * isSystemTag('health') // true
 * isSystemTag('Кастомный тег') // false
 * ```
 */
export function isSystemTag(tagName: string): boolean {
  return (Object.values(SYSTEM_TAG_KEYS) as string[]).includes(tagName);
}

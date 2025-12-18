/**
 * Типы данных для сущности Tag
 * 
 * Центральное место для определения структуры тега.
 * Используется во всех слоях: entities, features, widgets.
 * 
 * @module entities/tag/model
 * @created 30 ноября 2025
 */

import type { ColorVariant } from '@/shared/constants/colors';

/**
 * Базовый интерфейс тега
 * 
 * Любой тег в приложении должен соответствовать этому интерфейсу.
 * 
 * @property name - Название тега (уникальное)
 * @property color - Цвет тега из универсальной палитры (20 цветов)
 * 
 * @example
 * ```ts
 * const tag: BaseTag = {
 *   name: 'Здоровье',
 *   color: 'green' // ColorVariant
 * };
 * ```
 */
export interface BaseTag {
  /** Название тега (уникальный идентификатор) */
  name: string;
  
  /** Цвет тега из универсальной палитры (gray, red, blue, green, ...) */
  color: ColorVariant;
}

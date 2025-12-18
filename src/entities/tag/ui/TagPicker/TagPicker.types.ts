/**
 * 🏷️ TagPicker — Типы
 * 
 * Типы для TagPicker на основе Popover (Radix UI)
 * 
 * @module entities/tag/ui/TagPicker
 * @created 28 ноября 2025
 * @migrated 30 ноября 2025 - перенос из features/tag-picker в entities/tag
 */

import type { ColorVariant } from '@/shared/constants/colors';
import type { BaseTag } from '../../model/types';

// Реэкспорт BaseTag для обратной совместимости
export type { BaseTag };

/**
 * Callback для получения количества использований тега
 */
export type GetTagUsageCount = (tagName: string) => number;

/**
 * Props для TagPicker
 */
export interface TagPickerProps<T extends BaseTag = BaseTag> {
  /** Выбранные теги */
  selectedTags: string[];
  /** Callback выбора тегов */
  onSelectTags: (tags: string[]) => void;
  /** Список тегов */
  tags: T[];
  /** 
   * Callback добавления тега
   * @param tag - Название тега
   * @param color - ColorVariant ('blue', 'red', ...) или legacy Tailwind строка
   */
  onAddTag: (tag: string, color?: string | ColorVariant) => void;
  /** Callback удаления тега */
  onDeleteTag: (tag: string) => void;
  /** Функция для получения количества использований тега */
  getTagUsageCount: GetTagUsageCount;
  /** Placeholder для пустого состояния */
  placeholder?: string;
  /** Текст для сообщения об удалении (единственное число) */
  deleteMessageSingular?: string;
  /** Текст для сообщения об удалении (множественное число) */
  deleteMessagePlural?: string;
  /** Открыт ли picker (controlled) */
  open?: boolean;
  /** Callback при изменении состояния открытия */
  onOpenChange?: (open: boolean) => void;
  /** Дочерние элементы (trigger button) */
  children: React.ReactNode;
}

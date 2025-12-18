/**
 * Типы для SectionPicker
 */

import type { ColorVariant } from '@/shared/constants/colors';

/** Локальный тип раздела для SectionPicker */
export interface SectionItem {
  /** Название раздела (ключ перевода или текст) */
  name: string;
  /** Цвет раздела */
  color: ColorVariant;
}

export interface SectionPickerProps {
  /** Список разделов с цветами */
  sections: SectionItem[];
  /** Выбранный раздел (только название) */
  selectedSection: string | null;
  /** Callback выбора раздела */
  onSelectSection: (section: string) => void;
  /** Callback добавления раздела с цветом */
  onAddSection: (name: string, color: ColorVariant) => void;
  /** Callback обновления цвета раздела */
  onUpdateSectionColor?: (name: string, color: ColorVariant) => void;
  /** Callback удаления раздела */
  onDeleteSection: (section: string) => void;
  /** Функция проверки возможности удаления */
  canDelete?: (section: string) => boolean;
  /** Функция получения количества использований раздела */
  getUsageCount?: (section: string) => number;
  /** Форматирование сообщения при удалении раздела */
  formatDeleteMessage?: (sectionName: string, usageCount?: number) => string;
  /** Placeholder для триггера */
  placeholder?: string;
  /** Текст кнопки добавления */
  addButtonText?: string;
  /** Placeholder для input */
  inputPlaceholder?: string;
  /** Максимальная длина названия раздела */
  maxLength?: number;
  /** Controlled состояние открытия */
  open?: boolean;
  /** Callback изменения состояния открытия */
  onOpenChange?: (open: boolean) => void;
  /** Функция для перевода/форматирования названия раздела */
  renderSectionName?: (name: string) => string;
}

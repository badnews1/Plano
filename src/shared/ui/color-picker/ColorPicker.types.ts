/**
 * ColorPicker — типы для компонента выбора цвета
 */

import type { ColorVariant } from '@/shared/constants/colors';

/** Пропсы компонента ColorPicker */
export interface ColorPickerProps {
  /** Текущий выбранный цвет */
  value: ColorVariant;
  /** Колбэк при изменении цвета */
  onChange: (color: ColorVariant) => void;
  /** Open состояние (controlled) */
  open?: boolean;
  /** Колбэк при изменении open состояния */
  onOpenChange?: (open: boolean) => void;
  /** Кастомный триггер (кнопка) */
  children?: React.ReactNode;
  /** CSS класс для триггера */
  className?: string;
}

/**
 * Типы для Modal компонента
 */

import type { ReactNode } from 'react';

/**
 * Уровень z-index модального окна
 * - modal: базовый уровень (1400-1401)
 * - dialog: диалоги поверх модалок (1100)
 * - nested: вложенные модалки (1600)
 */
export type ModalLevel = 'modal' | 'dialog' | 'nested';

/**
 * Размер модального окна
 * - xs: 340px
 * - sm: 400px
 * - md: 500px (default)
 * - lg: 600px
 * - xl: 700px
 * - 2xl: 800px
 * - 4xl: 1000px
 * - 6xl: 1200px
 */
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';

/** Пропсы для Modal.Root */
export interface ModalRootProps {
  /** Содержимое модального окна */
  children: ReactNode;
  /** Уровень z-index */
  level?: ModalLevel;
  /** Callback при закрытии (ESC клавиша) */
  onClose?: () => void;
  /** CSS классы */
  className?: string;
}

/** Пропсы для Modal.Backdrop */
export interface ModalBackdropProps {
  /** Callback при клике на backdrop */
  onClick?: () => void;
}

/** Пропсы для Modal.Container */
export interface ModalContainerProps {
  /** Содержимое контейнера (GradientLine, Header, Content, Footer) */
  children: ReactNode;
  /** Размер модального окна */
  size?: ModalSize;
  /** CSS классы */
  className?: string;
  /** Максимальная высота контейнера */
  maxHeight?: string;
  /** Минимальная высота контейнера */
  minHeight?: string;
}

/** Пропсы для Modal.Content */
export interface ModalContentProps {
  /** Содержимое модального окна */
  children: ReactNode;
  /** Размер модального окна */
  size?: ModalSize;
  /** CSS классы */
  className?: string;
  /** Callback при клике */
  onClick?: (e: React.MouseEvent) => void;
}

/** Пропсы для Modal.Header */
export interface ModalHeaderProps {
  /** Заголовок модального окна */
  title?: string;
  /** Подзаголовок модального окна (опционально) */
  subtitle?: string;
  /** Иконка слева от заголовка (опционально) */
  icon?: ReactNode;
  /** Кастомный контент вместо стандартного title/subtitle (опционально) */
  customContent?: ReactNode;
  /** Callback при нажатии на кнопку закрытия */
  onClose?: () => void;
  /** Показывать ли кнопку закрытия (✕) */
  showCloseButton?: boolean;
}

/** Пропсы для Modal.Footer */
export interface ModalFooterProps {
  /** Содержимое футера */
  children: ReactNode;
  /** CSS классы */
  className?: string;
  /** Скрыть автоматический разделитель сверху */
  hideSeparator?: boolean;
}

/** Пропсы для Modal.CloseButton */
export interface ModalCloseButtonProps {
  /** Callback при нажатии на кнопку */
  onClick: () => void;
  /** CSS классы */
  className?: string;
}

/** Пропсы для Modal.GradientLine */
export interface ModalGradientLineProps {
  /** CSS классы для кастомизации */
  className?: string;
}

/** Пропсы для Modal.FieldTitle */
export interface ModalFieldTitleProps {
  /** Текст заголовка поля */
  children: ReactNode;
  /** CSS классы для кастомизации */
  className?: string;
  /** Обязательное поле (показывает красную звездочку) */
  required?: boolean;
}
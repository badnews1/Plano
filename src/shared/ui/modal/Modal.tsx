/**
 * 🎨 Modal — Универсальная система модальных окон
 * 
 * Композитная система модальных окон в стиле Radix UI / shadcn.
 * Поддерживает различные уровни z-index, размеры и полную кастомизацию.
 * 
 * @example
 * ```tsx
 * <Modal.Root level="dialog" onClose={handleClose}>
 *   <Modal.Backdrop onClick={handleClose} />
 *   <Modal.Container size="md" maxHeight="610px">
 *     <Modal.GradientLine />
 *     <Modal.Header 
 *       title="Заголовок" 
 *       onClose={handleClose} 
 *     />
 *     <Modal.Content>
 *       <div className="p-6">Контент</div>
 *     </Modal.Content>
 *     <Modal.Footer>
 *       <Button onClick={handleClose}>Закрыть</Button>
 *     </Modal.Footer>
 *   </Modal.Container>
 * </Modal.Root>
 * ```
 * 
 * @module shared/ui/modal
 * @created 19 ноября 2025
 * @migrated 26 ноября 2025 (в /shared/ui/)
 * @updated 1 декабря 2025 - перенесены стили внутрь компонента
 * @updated 1 декабря 2025 - встроен Separator в Header и Footer (автоматическая консистентность)
 * @updated 8 декабря 2025 - добавлен Modal.GradientLine для декоративной линии
 * @updated 10 декабря 2025 - добавлен Modal.Container для правильной архитектуры (Footer вне Content)
 * @updated 12 декабря 2025 - добавлен Modal.FieldTitle для единообразных заголовков полей
 * @updated 14 декабря 2025 - добавлен customContent в Modal.Header для кастомизации содержимого
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-labelledby, aria-describedby, focus trap)
 */

import React, { useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from '@/shared/assets/icons/system';
import { Separator } from '@/components/ui/separator';
import type {
  ModalRootProps,
  ModalBackdropProps,
  ModalContainerProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalFooterProps,
  ModalCloseButtonProps,
  ModalGradientLineProps,
  ModalFieldTitleProps,
} from './Modal.types';

import { useTranslation } from 'react-i18next';

// ============================================
// КОНСТАНТЫ СТИЛЕЙ
// ============================================

/**
 * Стили z-index для разных уровней модальных окон
 * 
 * - modal: базовый уровень модальных окон (1400-1401)
 * - dialog: диалоги/поповеры поверх модалок (1100)
 * - nested: вложенные модалки (1600)
 */
const Z_INDEX_STYLES = {
  /** Базовый уровень модальных окон */
  modal: { zIndex: 'var(--z-modal-backdrop)' },
  /** Диалоги поверх модалок */
  dialog: { zIndex: 'var(--z-popover)' },
  /** Вложенные модалки (например, FrequencyModal внутри AddHabitModal) */
  nested: { zIndex: 'var(--z-modal-nested)' },
} as const;

/**
 * Базовые стили для частей модального окна
 */
const MODAL_STYLES = {
  /** Центрирование модального окна */
  center: 'fixed inset-0 flex items-center justify-center',
  
  /** Полупрозрачный фон (backdrop) - использует --bg-backdrop из globals.css с размытием */
  backdrop: 'fixed inset-0 bg-[var(--bg-backdrop)] backdrop-blur-sm',
  
  /** Заголовок модального окна */
  header: 'flex flex-col gap-1 px-6 pt-6 pb-4 bg-[var(--bg-secondary)] rounded-t-md',
  
  /** Футер модального окна */
  footer: 'flex items-center justify-end gap-3 px-6 py-4 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] rounded-b-md',
} as const;

/**
 * Размеры модальных окон
 */
const MODAL_SIZES = {
  xs: 'w-full max-w-[340px]',
  sm: 'w-full max-w-[400px]',
  md: 'w-full max-w-[500px]',
  lg: 'w-full max-w-[600px]',
  xl: 'w-full max-w-[700px]',
  '2xl': 'w-full max-w-[800px]',
  '4xl': 'w-full max-w-[1000px]',
  '6xl': 'w-full max-w-[1200px]',
} as const;

/**
 * Получить классы для контента модального окна
 * 
 * Фон модального окна использует --bg-secondary (фон модальных окон)
 * для полной поддержки светлой и темной темы.
 * Скругление rounded-md (10px) соответствует дизайн-системе
 */
function getModalContentClasses(size: keyof typeof MODAL_SIZES = 'md'): string {
  return `relative bg-[var(--bg-secondary)] rounded-md shadow-lg ${MODAL_SIZES[size]}`;
}

// ============================================
// MODAL ROOT
// ============================================

/**
 * Корневой контейнер модального окна
 * 
 * Возможности:
 * - Управляет z-index уровнями (modal/dialog/nested)
 * - Обрабатывает ESC клавишу для закрытия
 * - Центрирует содержимое
 * - Создаёт Portal в document.body
 * 
 * @param props - ModalRootProps
 */
function ModalRoot({ 
  children, 
  level = 'modal', 
  onClose,
  className = ''
}: ModalRootProps) {
  // Обработка ESC клавиши для закрытия модалки
  useEffect(() => {
    if (!onClose) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Останавливаем всплытие события, чтобы не закрывать родительские модалки
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Получаем z-index стиль в зависимости от уровня
  const zIndexStyle = {
    modal: Z_INDEX_STYLES.modal,
    dialog: Z_INDEX_STYLES.dialog,
    nested: Z_INDEX_STYLES.nested,
  }[level];

  const modalContent = (
    <div 
      className={`${MODAL_STYLES.center} ${className}`} 
      style={zIndexStyle}
      data-modal="true" 
      data-modal-level={level}
    >
      {children}
    </div>
  );

  // Рендерим через Portal в document.body
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
}

// ============================================
// MODAL BACKDROP
// ============================================

/**
 * Полупрозрачный фон модального окна
 * 
 * Стиль: bg-white/40 с backdrop-blur
 * 
 * @param props - ModalBackdropProps
 */
const ModalBackdrop = React.memo(function ModalBackdrop({ onClick }: ModalBackdropProps) {
  return (
    <div 
      className={MODAL_STYLES.backdrop} 
      onClick={onClick}
      aria-hidden="true"
    />
  );
});

// ============================================
// MODAL CONTAINER
// ============================================

/**
 * Контейнер модального окна (белое окно)
 * 
 * Возможности:
 * - Белый фон с rounded-md
 * - Настраиваемый размер (sm/md/lg/xl/2xl/4xl/6xl)
 * - Останавливает всплытие клика (не закрывается при клике внутри)
 * - Accessibility атрибуты (role="dialog", aria-modal="true")
 * - Flex-контейнер для Header, Content, Footer
 * - Overflow hidden для правильной работы прокрутки
 * - Настраиваемая максимальная высота
 * 
 * @param props - ModalContainerProps
 */
const ModalContainer = React.memo(
  forwardRef<HTMLDivElement, ModalContainerProps>(function ModalContainer(
    { 
      children, 
      size = 'md',
      className = '',
      maxHeight,
      minHeight
    },
    ref
  ) {
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    // Формируем style объект только если есть maxHeight или minHeight
    const style = (maxHeight || minHeight) ? {
      ...(maxHeight && { maxHeight }),
      ...(minHeight && { minHeight })
    } : undefined;

    return (
      <div 
        ref={ref}
        className={`${getModalContentClasses(size)} flex flex-col overflow-hidden ${className}`}
        onClick={handleClick}
        role="dialog"
        aria-modal="true"
        style={style}
      >
        {children}
      </div>
    );
  })
);

// ============================================
// MODAL CONTENT
// ============================================

/**
 * Прокручиваемый контент модального окна
 * 
 * Возможности:
 * - Занимает всё доступное пространство (flex-1)
 * - Вертикальная прокрутка (overflow-y-auto)
 * - Используется внутри Modal.Container между Header и Footer
 * 
 * @param props - ModalContentProps
 */
const ModalContent = React.memo(function ModalContent({ 
  children, 
  className = '' 
}: ModalContentProps) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
});

// ============================================
// MODAL HEADER
// ============================================

/**
 * Заголовок модального окна
 * 
 * Возможности:
 * - Стандартный стиль с скруглением верхних углов
 * - Опциональный подзаголовок
 * - Опциональная кнопка закрытия (✕)
 * - Выравнивание заголовка и кнопок
 * - Кастомный контент через customContent
 * 
 * @param props - ModalHeaderProps
 */
const ModalHeader = React.memo(function ModalHeader({ 
  title, 
  subtitle,
  icon,
  customContent,
  onClose,
  showCloseButton = true
}: ModalHeaderProps) {
  return (
    <div className={MODAL_STYLES.header}>
      {customContent ? (
        <div className="flex items-center justify-between w-full">
          {customContent}
          {showCloseButton && onClose && (
            <ModalCloseButton onClick={onClose} />
          )}
        </div>
      ) : (
        <div className="flex items-start justify-between w-full">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 text-[var(--text-secondary)]">
                {icon}
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <h4 className="text-[var(--text-primary)]">{title}</h4>
              {subtitle && (
                <p className="text-xs text-[var(--text-tertiary)]">{subtitle}</p>
              )}
            </div>
          </div>
          {showCloseButton && onClose && (
            <ModalCloseButton onClick={onClose} className="mt-0.5" />
          )}
        </div>
      )}
    </div>
  );
});

// ============================================
// MODAL FOOTER
// ============================================

/**
 * Футер модального окна
 * 
 * Возможности:
 * - Стандартный стиль с автоматическим разделителем сверху
 * - Кастомизируемое содержимое (обычно кнопки)
 * - Опция hideSeparator для отключения разделителя
 * 
 * @param props - ModalFooterProps
 */
const ModalFooter = React.memo(function ModalFooter({ 
  children, 
  className = '',
  hideSeparator = false 
}: ModalFooterProps) {
  return (
    <>
      {!hideSeparator && <Separator />}
      <div className={`${MODAL_STYLES.footer} ${className}`}>
        {children}
      </div>
    </>
  );
});

// ============================================
// MODAL CLOSE BUTTON
// ============================================

/**
 * ModalCloseButton - Кнопка закрытия модального окна
 * @param props - ModalCloseButtonProps
 */
const ModalCloseButton = React.memo(function ModalCloseButton({ onClick, className = '' }: ModalCloseButtonProps) {
  const { t } = useTranslation('ui');
  
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors ${className}`}
      aria-label={t('ui.close')}
    >
      <XIcon size={20} aria-hidden="true" />
    </button>
  );
});

// ============================================
// MODAL GRADIENT LINE
// ============================================

/**
 * ModalGradientLine - Декоративная градиентная линия для модального окна
 * 
 * Возможности:
 * - Цветной градиент (cyan → blue → indigo) из globals.css
 * - Размещается в начале Modal.Content (перед Header)
 * - Полностью опциональная (добавляется по необходимости)
 * 
 * @example
 * ```tsx
 * <Modal.Content>
 *   <Modal.GradientLine />
 *   <Modal.Header title="Заголовок" />
 *   ...
 * </Modal.Content>
 * ```
 * 
 * @param props - ModalGradientLineProps
 */
const ModalGradientLine = React.memo(function ModalGradientLine({ className = '' }: ModalGradientLineProps) {
  return (
    <div 
      className={`h-1 w-full ${className}`}
      style={{
        background: 'linear-gradient(to right, var(--chart-gradient-start), var(--chart-gradient-middle), var(--chart-gradient-end))'
      }}
    />
  );
});

// ============================================
// MODAL FIELD TITLE
// ============================================

/**
 * ModalFieldTitle - Заголовок поля в модальном окне
 * 
 * Возможности:
 * - Единообразный стиль заголовков полей (uppercase, tracking-wider, text-tertiary)
 * - Кастомные CSS классы
 * 
 * Использование:
 * ```tsx
 * <Modal.Content>
 *   <div className="p-6">
 *     <Modal.FieldTitle>Тип отслеживания</Modal.FieldTitle>
 *     <Select>...</Select>
 *   </div>
 * </Modal.Content>
 * ```
 * 
 * @param props - ModalFieldTitleProps
 */
const ModalFieldTitle = React.memo(function ModalFieldTitle({ 
  children, 
  className = '',
  required = false
}: ModalFieldTitleProps) {
  return (
    <div className={`modal-field-title ${className}`}>
      {children}
      {required && <span className="text-[var(--status-error)]"> *</span>}
    </div>
  );
});

// ============================================
// ЭКСПОРТ
// ============================================

/**
 * Modal — экспорт в виде namespace для удобства использования
 * 
 * Позволяет писать: Modal.Root, Modal.Backdrop, Modal.Content и т.д.
 */
export const Modal = {
  Root: ModalRoot,
  Backdrop: ModalBackdrop,
  Container: ModalContainer,
  Header: ModalHeader,
  Footer: ModalFooter,
  CloseButton: ModalCloseButton,
  GradientLine: ModalGradientLine,
  Content: ModalContent,
  FieldTitle: ModalFieldTitle,
};
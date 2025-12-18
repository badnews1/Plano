/**
 * 🎯 ToggleChip - Универсальная переключаемая кнопка-чип с удалением
 * 
 * Компонент на базе shadcn Toggle с анимацией и кнопкой удаления:
 * - При наведении контент смещается влево
 * - Справа появляется кнопка удаления (X)
 * - Поддерживает все 20 цветов из универсальной палитры
 * - Опциональная иконка слева
 * 
 * ИСПОЛЬЗОВАНИЕ:
 * - Теги (tag picker)
 * - Категории (фильтры)
 * - Чипсы выбора (multi-select)
 * - Любые переключаемые элементы с удалением
 * 
 * @example
 * ```tsx
 * // Для тегов
 * <ToggleChip
 *   label="Работа"
 *   variant="blue"
 *   pressed={isSelected}
 *   onPressedChange={setIsSelected}
 *   onDelete={handleDelete}
 *   icon={<Tag />}
 * />
 * 
 * // Для фильтров
 * <ToggleChip
 *   label="Активные"
 *   variant="green"
 *   pressed={showActive}
 *   onPressedChange={setShowActive}
 * />
 * ```
 * 
 * @module shared/ui/toggle-chip
 * @created 28 ноября 2025 (перенос из tag-button)
 * @updated 28 ноября 2025 - переименование TagButton → ToggleChip (универсальный компонент)
 * @updated 2 декабря 2025 - исправление типобезопасности (убран as any)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle } from '@/components/ui/toggle';
import { XIcon } from '@/shared/assets/icons/system';
import { cn } from '@/components/ui/utils';
import type { ColorVariant } from '@/shared/constants/colors';

export interface ToggleChipProps {
  /** Текст чипа */
  label: string;
  /** Цвет чипа из универсальной палитры */
  variant?: ColorVariant;
  /** Состояние нажатия (выбран/не выбран) */
  pressed?: boolean;
  /** Колбэк при изменении состояния */
  onPressedChange?: (pressed: boolean) => void;
  /** Колбэк при удалении (если не передан - кнопка X не показывается) */
  onDelete?: () => void;
  /** Опциональная иконка слева от текста */
  icon?: React.ReactNode;
  /** Отключен ли чип */
  disabled?: boolean;
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Переключаемая кнопка-чип с анимацией и удалением
 */
export const ToggleChip = React.forwardRef<HTMLButtonElement, ToggleChipProps>(
  function ToggleChip({
    label,
    variant = 'gray',
    pressed = false,
    onPressedChange,
    onDelete,
    icon,
    disabled = false,
    className,
  }, ref) {
    const { t } = useTranslation('ui');
    
    return (
      <Toggle
        ref={ref}
        variant={variant}
        size="tag"
        pressed={pressed}
        onPressedChange={onPressedChange}
        disabled={disabled}
        className={cn(
          'group relative text-xs border transition-all',
          className
        )}
      >
        {/* Контент - смещается влево при hover */}
        <div className="flex items-center gap-1 group-hover:-translate-x-2 transition-transform">
          {icon && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
          <span className="flex-shrink-0">{label}</span>
        </div>
        
        {/* Кнопка удаления - абсолютно позиционирована справа */}
        {onDelete && (
          <span
            role="button"
            tabIndex={-1}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }
            }}
            title={t('ui.remove')}
          >
            <XIcon className="hover:text-status-error transition-colors" />
          </span>
        )}
      </Toggle>
    );
  }
);

/**
 * 🎨 OverflowTrigger — Универсальный триггер с overflow для списков элементов
 * 
 * Generic компонент, который отображает:
 * - Массив элементов (переданных через children или items)
 * - Overflow badge (+N) если элементов больше чем влезает
 * - Placeholder если элементов нет
 * - Иконку справа
 * 
 * ВАЖНО: Это полностью глупый компонент!
 * Он не знает про теги, проекты или другие сущности.
 * Принимает готовые React элементы для отображения.
 * 
 * @example
 * ```tsx
 * // Пример с ограничением в 3 элемента:
 * <OverflowTrigger
 *   items={[
 *     <Badge key="1">Работа</Badge>,
 *     <Badge key="2">Спорт</Badge>,
 *     <Badge key="3">Дом</Badge>,
 *     <Badge key="4">Учёба</Badge>,
 *     <Badge key="5">Хобби</Badge>,
 *   ]}
 *   maxVisibleItems={3}  // Покажет только первые 3, остальные в "+2"
 *   placeholder="Выберите элементы"
 *   icon={<ChevronDown />}
 * />
 * 
 * // Результат: [Работа] [Спорт] [Дом] [+2]
 * ```
 * 
 * @module shared/ui/overflow-trigger
 * @created 28 ноября 2025
 */

import React, { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

/**
 * Пропсы OverflowTrigger
 */
export interface OverflowTriggerProps {
  /** Массив React элементов для отображения */
  items?: React.ReactNode[];
  /** Количество элементов, которые не влезли (для +N badge) */
  overflowCount?: number;
  /** Максимальное количество видимых элементов (остальные в счётчик) */
  maxVisibleItems?: number;
  /** Placeholder когда элементов нет */
  placeholder?: React.ReactNode;
  /** Иконка placeholder (слева от текста) */
  placeholderIcon?: React.ReactNode;
  /** Иконка справа (обычно ChevronDown) */
  icon?: React.ReactNode;
  /** Callback клика */
  onClick?: () => void;
  /** Дополнительные классы */
  className?: string;
  /** Открыт ли попап (для стилизации) */
  isOpen?: boolean;
  /** Дополнительные классы для контейнера элементов */
  contentClassName?: string;
}

/**
 * OverflowTrigger - универсальная кнопка-триггер с overflow элементами
 */
export const OverflowTrigger = forwardRef<HTMLButtonElement, OverflowTriggerProps>(
  (
    {
      items = [],
      overflowCount = 0,
      maxVisibleItems = 3,
      placeholder = 'Не выбрано',
      placeholderIcon,
      icon,
      onClick,
      className,
      isOpen,
      contentClassName,
    },
    ref
  ) => {
    const hasItems = items.length > 0;

    // Ограничиваем количество видимых элементов
    const visibleItems = items.slice(0, maxVisibleItems);
    const hiddenItemsCount = Math.max(0, items.length - maxVisibleItems);
    const totalOverflowCount = hiddenItemsCount + overflowCount;

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          // Базовые стили как у Input/Select
          'w-full min-h-9 px-3 py-2 border border-input rounded-md text-base md:text-sm text-left flex items-center gap-2 overflow-hidden',
          // Интерактивные стили
          'cursor-pointer transition-colors focus-visible:outline-none',
          'hover:border-border-focus focus-visible:border-border-focus',
          // Стили для иконок (как в Select)
          '[&_svg:not([class*=\'text-\'])]:text-text-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0',
          // Состояние открытия
          isOpen && 'border-border-focus',
          // Цвет текста
          hasItems ? 'text-text-primary' : 'text-text-tertiary',
          className
        )}
      >
        <div className={cn('flex items-center gap-2 flex-1 overflow-hidden', contentClassName)}>
          {/* Отображаем элементы или placeholder */}
          {hasItems ? (
            <>
              {visibleItems.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}

              {/* Показываем +N если есть overflow */}
              {totalOverflowCount > 0 && (
                <Badge variant="outline" className="flex-shrink-0">
                  +{totalOverflowCount}
                </Badge>
              )}
            </>
          ) : (
            <>
              {placeholderIcon && placeholderIcon}
              <span className="flex-1">{placeholder}</span>
            </>
          )}
        </div>

        {/* Иконка справа */}
        {icon && <div className="flex-shrink-0">{icon}</div>}
      </button>
    );
  }
);

OverflowTrigger.displayName = 'OverflowTrigger';
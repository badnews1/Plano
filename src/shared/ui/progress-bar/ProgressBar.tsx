/**
 * Универсальный компонент прогресс-бара
 * 
 * Кастомная реализация с расширенными возможностями:
 * - Поддержка горизонтальной и вертикальной ориентации
 * - Разные варианты стилизации (solid, gradient, custom)
 * - Различные размеры (xs, sm, md, lg, xl)
 * - Метки (проценты, дроби) с настройкой позиции
 * - Кастомные цвета и градиенты с фоновым эффектом
 * - Динамическое вычисление цвета через colorFunction
 * - Интеграция с дизайн-системой через CSS переменные
 * - Плавные анимации с настраиваемой длительностью
 * 
 * @module shared/ui/progress-bar
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (role, aria-valuenow, aria-valuemin, aria-valuemax)
 */

import React from 'react';
import { cn } from '@/components/ui/utils';

/**
 * Props компонента ProgressBar
 */
export interface ProgressBarProps {
  /** Значение прогресса (0-100) */
  value: number;
  
  /** Ориентация прогресс-бара (по умолчанию 'horizontal') */
  orientation?: 'horizontal' | 'vertical';
  
  /** Вариант стилизации (по умолчанию 'solid') */
  variant?: 'solid' | 'gradient' | 'custom';
  
  /** Размер прогресс-бара (по умолчанию 'md') */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Показывать процент рядом с прогресс-баром */
  showPercentage?: boolean;
  
  /** Показывать дробь (current/max) рядом с прогресс-баром */
  showFraction?: boolean;
  
  /** Текущее значение для отображения в дроби */
  current?: number;
  
  /** Максимальное значение для отображения в дроби */
  max?: number;
  
  /** Позиция метки относительно прогресс-бара (по умолчанию 'right') */
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  /** Цвет фона прогресс-бара (по умолчанию из дизайн-системы) */
  backgroundColor?: string;
  
  /** Цвет заполнения прогресс-бара (по умолчанию зависит от variant) */
  fillColor?: string;
  
  /** Функция для динамического вычисления цвета заполнения на основе значения */
  colorFunction?: (value: number) => string;
  
  /** Показывать полупрозрачный фоновый градиент (только для variant='gradient') */
  showBackgroundGradient?: boolean;
  
  /** Цвета для градиента (обязательно для variant='gradient') */
  gradientColors?: {
    from: string;   // Начальный цвет
    via?: string;   // Промежуточный цвет (опционально)
    to: string;     // Конечный цвет
  };
  
  /** Длительность анимации изменения прогресса в миллисекундах (по умолчанию 300) */
  animationDuration?: number;
  
  /** Дополнительные CSS классы для контейнера */
  className?: string;
  
  /** Дополнительные CSS классы для самого прогресс-бара */
  barClassName?: string;
  
  /** Aria-label для accessibility */
  'aria-label'?: string;
}

/**
 * Универсальный компонент прогресс-бара
 * 
 * Используется для отображения прогресса привычек, силы привычки,
 * статистики выполнения и других числовых показателей
 */
export function ProgressBar({
  value,
  orientation = 'horizontal',
  variant = 'solid',
  size = 'md',
  showPercentage = false,
  showFraction = false,
  current,
  max,
  labelPosition = 'right',
  backgroundColor,
  fillColor,
  colorFunction,
  showBackgroundGradient = false,
  gradientColors,
  animationDuration = 300,
  className,
  barClassName,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  // Размеры для горизонтальной ориентации (высота)
  const horizontalSizes = {
    xs: 'h-1',       // 4px
    sm: 'h-1.5',     // 6px
    md: 'h-[7px]',   // 7px
    lg: 'h-3',       // 12px
    xl: 'h-4',       // 16px
  };
  
  // Размеры для вертикальной ориентации (ширина)
  const verticalSizes = {
    xs: 'w-1',       // 4px
    sm: 'w-1.5',     // 6px
    md: 'w-[7px]',   // 7px
    lg: 'w-3',       // 12px
    xl: 'w-4',       // 16px
  };
  
  // Вычисляем цвет заполнения
  const getFillColor = () => {
    // Приоритет 1: Динамическая функция вычисления цвета
    if (colorFunction) {
      return colorFunction(value);
    }
    
    // Приоритет 2: Кастомный цвет
    if (fillColor) {
      return fillColor;
    }
    
    // Приоритет 3: Вариант solid - используем цвет текста из дизайн-системы
    if (variant === 'solid') {
      return 'var(--text-primary)';
    }
    
    // Приоритет 4: Вариант gradient - строим линейный градиент
    if (variant === 'gradient' && gradientColors) {
      const { from, via, to } = gradientColors;
      
      // Для вертикального - градиент снизу вверх
      if (orientation === 'vertical') {
        return via
          ? `linear-gradient(to top, ${from}, ${via}, ${to})`
          : `linear-gradient(to top, ${from}, ${to})`;
      }
      
      // Для горизонтального - градиент слева направо
      return via
        ? `linear-gradient(to right, ${from}, ${via}, ${to})`
        : `linear-gradient(to right, ${from}, ${to})`;
    }
    
    return undefined;
  };
  
  // Формируем стиль фона (опционально с градиентным эффектом)
  const getBackgroundStyle = () => {
    // Если включён фоновый градиент - создаём полупрозрачный градиент
    if (showBackgroundGradient && gradientColors) {
      const { from, via, to } = gradientColors;
      
      // Строим градиент в зависимости от ориентации
      const gradient = orientation === 'vertical'
        ? via
          ? `linear-gradient(to top, ${from}, ${via}, ${to})`
          : `linear-gradient(to top, ${from}, ${to})`
        : via
          ? `linear-gradient(to right, ${from}, ${via}, ${to})`
          : `linear-gradient(to right, ${from}, ${to})`;
      
      return {
        background: gradient,
        opacity: 0.2, // Полупрозрачность для фонового эффекта
      };
    }
    
    // Обычный фон - используем кастомный цвет или дефолтный из дизайн-системы
    return {
      background: backgroundColor || 'var(--border-secondary)',
    };
  };
  
  // Формируем текст метки
  const label = showPercentage
    ? `${Math.round(value)}%`
    : showFraction && current !== undefined && max !== undefined
    ? `${current} / ${max}`
    : null;
  
  // Определяем ориентацию
  const isVertical = orientation === 'vertical';
  
  // Классы контейнера с учётом ориентации и позиции метки
  const containerClasses = cn(
    'flex items-center gap-2',
    isVertical && 'flex-col-reverse', // Вертикально: метка снизу по умолчанию
    (labelPosition === 'left' || labelPosition === 'top') && 'flex-row-reverse', // Инверсия позиции
    isVertical && labelPosition === 'bottom' && 'flex-col', // Вертикально: метка сверху
    className
  );
  
  // Вычисляем финальные значения для стилей
  const computedFillColor = getFillColor();
  const backgroundStyle = getBackgroundStyle();
  
  // Рендер вертикального прогресс-бара
  if (isVertical) {
    return (
      <div className={containerClasses}>
        {/* Вертикальный прогресс-бар */}
        <div
          className={cn(
            'relative overflow-hidden rounded-full',
            verticalSizes[size],
            barClassName
          )}
          style={{
            height: '100%',
            backgroundColor: backgroundColor || 'var(--border-secondary)',
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel}
        >
          {/* Фоновый градиент (если включён) */}
          {showBackgroundGradient && gradientColors && (
            <div
              className="absolute inset-0 rounded-full"
              style={backgroundStyle}
            />
          )}
          
          {/* Заполнение */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all rounded-full"
            style={{
              height: `${value}%`,
              background: computedFillColor,
              transitionDuration: `${animationDuration}ms`,
            }}
          />
        </div>
        
        {/* Метка */}
        {label && (
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </span>
        )}
      </div>
    );
  }
  
  // Рендер горизонтального прогресс-бара
  return (
    <div className={containerClasses}>
      {/* Горизонтальный прогресс-бар */}
      <div
        className={cn(
          'relative overflow-hidden rounded-full flex-1',
          horizontalSizes[size],
          barClassName
        )}
        style={{
          backgroundColor: backgroundColor || 'var(--border-secondary)',
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        {/* Фоновый градиент (если включён) */}
        {showBackgroundGradient && gradientColors && (
          <div
            className="absolute inset-0 rounded-full"
            style={backgroundStyle}
          />
        )}
        
        {/* Заполнение */}
        <div
          className="absolute left-0 top-0 bottom-0 transition-all rounded-full"
          style={{
            width: `${value}%`,
            background: computedFillColor,
            transitionDuration: `${animationDuration}ms`,
          }}
        />
      </div>
      
      {/* Метка */}
      {label && (
        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </span>
      )}
    </div>
  );
}
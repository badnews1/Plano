/**
 * Универсальная кнопка для отметки выполнения/прогресса
 * 
 * Используется для:
 * - Календарей привычек
 * - Списков задач
 * - Чек-листов
 * - Любых систем отслеживания прогресса
 * 
 * Поддерживает различные состояния, кастомные иконки и содержимое
 * Автоматически управляет цветом иконок через CSS переменные
 * 
 * @module shared/ui/completion-button
 * @updated 18 декабря 2025 - добавлен отсутствующий вариант 'partial' в statusBackgroundColors и 'measurable' в iconColors
 */

import React from 'react';
import { cn } from '@/components/ui/utils';

export interface CompletionButtonProps {
  /** Вариант отображения (определяет цвет фона и иконки) */
  variant?: 'completed' | 'skipped' | 'empty' | 'partial' | 'measurable';
  /** Обработчик клика */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Обработчик правого клика (контекстное меню) */
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Текст подсказки (tooltip) */
  title?: string;
  /** Кастомное содержимое (иконки, прогресс-бары и т.д.) */
  children?: React.ReactNode;
  /** Дополнительные CSS классы */
  className?: string;
  /** Размер кнопки (по умолчанию 20px, мин: 16px, макс: 24px) */
  size?: number;
}

/**
 * Универсальная кнопка выполнения с поддержкой различных состояний
 */
export function CompletionButton({
  variant = 'empty',
  onClick,
  onContextMenu,
  title,
  children,
  className,
  size = 20,
}: CompletionButtonProps) {
  // Маппинг вариантов ячеек на CSS переменные (адаптивно к темной теме)
  const statusBackgroundColors = {
    completed: 'var(--accent-primary-indigo)',      // Галочка
    skipped: 'var(--bg-secondary)',          // Пауза
    empty: 'var(--border-secondary)',          // Пустой
    partial: 'transparent',                  // Частично выполнено (прозрачный фон, CircularProgress управляет своими цветами)
    measurable: 'var(--bg-tertiary)',        // Число (фон для measurable)
  };

  // Маппинг вариантов на цвет иконок (через CSS переменные)
  const iconColors = {
    completed: 'white',                      // Галочка белая на акцентном фоне
    skipped: 'var(--text-secondary)',        // Пауза
    empty: 'white',                          // Иконки белые (стрелочка автопропуска)
    partial: 'var(--text-primary)',          // Основной текст для частичного прогресса
    measurable: 'var(--text-primary)',       // Текст/числа для measurable состояния
  };

  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={title}
      className={cn(
        // Базовые стили
        'rounded-full transition-all hover:scale-105 flex items-center justify-center flex-shrink-0',
        // Кастомные классы
        className
      )}
      style={{
        backgroundColor: statusBackgroundColors[variant],
        // Устанавливаем цвет для всех дочерних элементов (иконок)
        color: iconColors[variant],
        width: size,
        height: size,
      }}
    >
      {children}
    </button>
  );
}
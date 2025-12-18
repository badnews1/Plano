/**
 * Ячейка прогресса привычки
 * 
 * Отображает:
 * - Счётчик "15/31" (слева)
 * - Прогресс-бар
 * - Сила привычки "85%" (справа)
 * - Иконка статистики
 * 
 * Использует Tailwind классы для размеров (соответствие FSD)
 * 
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label на элементах)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3 } from '@/shared/assets/icons/system';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { getStrengthColor } from '@/entities/habit/lib';
import { Button } from '@/components/ui/button';

interface HabitProgressCellProps {
  /** ID привычки для обработки клика по статистике */
  habitId: string;
  /** Количество выполненных дней */
  completedCount: number;
  /** Целевое количество дней */
  goalValue: number;
  /** Сила привычки (0-100) */
  habitStrength?: number;
  /** Callback при клике на иконку статистики */
  onStatsClick?: (habitId: string) => void;
}

export function HabitProgressCell({
  habitId,
  completedCount,
  goalValue,
  habitStrength = 0,
  onStatsClick,
}: HabitProgressCellProps) {
  const { t } = useTranslation('ui');
  
  // Рассчитываем процент выполнения за месяц
  const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
  const safePercentage = isNaN(percentage) ? 0 : percentage;
  
  // Ограничиваем процент на 100% для визуального отображения
  const displayPercentage = Math.min(safePercentage, 100);
  
  // Безопасное значение силы привычки
  const safeStrength = habitStrength && !isNaN(habitStrength) ? Math.round(habitStrength) : 0;

  return (
    <div 
      className="h-8 flex items-center gap-1.5 flex-shrink-0"
    >
      {/* Счётчик "15/31" - 30px */}
      <div className="w-[30px] h-full text-right flex items-center justify-end flex-shrink-0">
        <span 
          className="text-2xs text-text-secondary"
          style={{ fontWeight: 600 }}
          aria-label={`${completedCount} out of ${goalValue} days completed`}
        >
          {completedCount} / {goalValue}
        </span>
      </div>
      
      {/* Прогресс-бар - занимает всё оставшееся место */}
      <div className="flex-1 min-w-0 h-full flex items-center">
        <ProgressBar
          value={displayPercentage}
          max={100}
          size="md"
          orientation="horizontal"
          variant="solid"
          fillColor="var(--accent-primary-indigo)"
          animationDuration={300}
          className="w-full"
          aria-label={`Monthly progress: ${displayPercentage}%`}
        />
      </div>
      
      {/* Сила привычки и иконка статистики */}
      <div className="flex items-center gap-1.5 h-full ml-[8px]">
        {/* Сила привычки - 26px */}
        <div className="w-[26px] h-full text-right flex items-center justify-end flex-shrink-0">
          <span 
            className="text-2xs"
            style={{ 
              fontWeight: 700, 
              color: getStrengthColor(safeStrength)
            }}
            aria-label={`Habit strength: ${safeStrength}%`}
          >
            {safeStrength}%
          </span>
        </div>
        
        {/* Иконка статистики */}
        {onStatsClick && (
          <Button
            variant="ghost"
            size="smallicon"
            onClick={() => onStatsClick(habitId)}
            className="flex-shrink-0"
            title={t('ui.showStatistics')}
            aria-label={t('ui.showStatistics')}
          >
            <BarChart3 className="size-3" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
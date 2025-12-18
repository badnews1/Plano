/**
 * Топ-10 привычек по проценту выполнения за месяц
 * 
 * Отображает рейтинг привычек, отсортированных по проценту выполнения
 * от лучших к худшим. Всегда показывает ровно 10 строк (пустые строки,
 * если привычек меньше 10).
 * 
 * Для каждой привычки показывает:
 * - Градиентная левая граница (от золотого к голубому)
 * - Название привычки (обрезается, если длинное)
 * - Процент выполнения
 * 
 * @module entities/habit/ui/stats
 * @migrated 30 ноября 2025 - перенесено из features/statistics в entities/habit
 * @refactored 1 декабря 2025 - адаптация к темной теме, убрана серая подложка
 * @refactored 2 декабря 2025 - убраны padding и заголовок, чистый entity компонент
 * @refactored 3 декабря 2025 - добавлены градиентные акценты, убраны порядковые номера
 */

import { useEffect, useState } from 'react';
import type { Habit, DateConfig } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';
import { getAdjustedMonthlyGoal } from '../../lib/goal-calculator';
import { useHabitsStore } from '@/app/store';

interface TopHabitsRankingProps {
  /** Список привычек для ранжирования */
  habits: Habit[];
  /** Конфигурация даты с информацией о месяце */
  dateConfig: DateConfig;
}

/**
 * Компонент топ-10 привычек
 * 
 * Алгоритм:
 * 1. Для каждой привычки рассчитывается процент выполнения за месяц
 * 2. Привычки сортируются по проценту (от большего к меньшему)
 * 3. Берутся топ-10 привычек
 * 4. Если привычек меньше 10, остальные строки остаются пустыми
 * 
 * @example
 * ```tsx
 * <TopHabitsRanking
 *   habits={habits}
 *   dateConfig={{
 *     monthDays: [...],
 *     formatDate: (date) => date.toISOString().split('T')[0],
 *     selectedMonth: 10,
 *     selectedYear: 2025
 *   }}
 * />
 * ```
 */
export function TopHabitsRanking({
  habits,
  dateConfig,
}: TopHabitsRankingProps) {
  const { monthDays, formatDate, selectedMonth, selectedYear } = dateConfig;
  const vacationPeriods = useHabitsStore(state => state.vacationPeriods);
  
  const [topHabits, setTopHabits] = useState<{ name: string, percentage: number, completedCount: number }[]>([]);

  // Функция для получения цвета границы в зависимости от ранга
  const getBorderColor = (rank: number) => {
    const colors = [
      'var(--palette-yellow-text)',   // 1 - золотой
      'var(--palette-gray-text)',     // 2 - серебряный
      'var(--palette-amber-text)',    // 3 - бронзовый
      'var(--palette-gray-border)',   // 4 - едва заметный
      'var(--palette-gray-border)',   // 5
      'var(--palette-gray-border)',   // 6
      'var(--palette-gray-border)',   // 7
      'var(--palette-gray-border)',   // 8
      'var(--palette-gray-border)',   // 9
      'var(--palette-gray-border)',   // 10 - самый незаметный
    ];
    return colors[rank - 1];
  };

  // Функция для получения цвета текста названия в зависимости от ранга
  const getTextColor = (rank: number) => {
    const opacities = [1, 0.95, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3];
    return `color-mix(in srgb, var(--text-primary) ${opacities[rank - 1] * 100}%, transparent)`;
  };

  // Функция для получения цвета процента в зависимости от ранга
  const getPercentageColor = (rank: number) => {
    const opacities = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3];
    return `color-mix(in srgb, var(--text-secondary) ${opacities[rank - 1] * 100}%, transparent)`;
  };

  useEffect(() => {
    // Рассчитываем процент выполнения для каждой привычки
    const habitsWithStats = habits.map(habit => {
      const completedCount = monthDays.filter(dayData => isHabitCompletedForDate(habit, formatDate(dayData.date))).length;
      
      // Получаем все даты месяца для расчёта цели
      const allMonthDates = monthDays.map(day => formatDate(day.date));
      
      // Получаем скорректированную месячную цель с учётом отпуска
      const goalValue = getAdjustedMonthlyGoal(habit, allMonthDates, vacationPeriods);
      
      const percentage = goalValue > 0 ? Math.round((completedCount / goalValue) * 100) : 0;
      
      return {
        name: habit.name,
        percentage,
        completedCount,
      };
    });
    
    // Сортируем по проценту (по убыванию)
    habitsWithStats.sort((a, b) => b.percentage - a.percentage);
    
    // Всегда показываем ровно 10 строк
    const displayRows = [];
    for (let i = 0; i < 10; i++) {
      if (i < habitsWithStats.length) {
        displayRows.push(habitsWithStats[i]);
      } else {
        displayRows.push(null);
      }
    }
    
    setTopHabits(displayRows);
  }, [habits, monthDays, formatDate, selectedMonth, selectedYear, vacationPeriods]);

  return (
    <div className="space-y-[5px]">
      {topHabits.map((habit, index) => (
        <div 
          key={`top-habit-${index}`} 
          className="flex items-center h-6 pl-2.5 relative group transition-all duration-200"
          style={{
            borderLeft: habit ? `3px solid ${getBorderColor(index + 1)}` : 'none',
          }}
        >
          {habit ? (
            <>
              {/* Название привычки */}
              <div className="flex-1 min-w-0">
                <span 
                  className="text-xs truncate block group-hover:opacity-80 transition-opacity"
                  style={{ 
                    color: getTextColor(index + 1),
                  }}
                >
                  {habit.name}
                </span>
              </div>
              
              <div className="w-2" />
              
              {/* Процент выполнения */}
              <div className="w-[30px] text-right flex-shrink-0">
                <span 
                  className="text-2xs"
                  style={{ 
                    fontWeight: 600,
                    color: getPercentageColor(index + 1),
                  }}
                >
                  {habit.percentage}%
                </span>
              </div>
            </>
          ) : (
            <div className="w-full" />
          )}
        </div>
      ))}
    </div>
  );
}
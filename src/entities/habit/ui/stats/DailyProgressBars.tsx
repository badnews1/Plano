/**
 * Дневные вертикальные прогресс-бары для визуализации выполнения привычек
 * 
 * UI-компонент для отображения ряда вертикальных столбиков, где каждый столбик
 * показывает процент выполненных привычек за конкретный день месяца.
 * 
 * Учитывает пропущенные привычки (freeze) и автопропуски (→) при расчёте процента выполнения.
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 * @updated 6 декабря 2025 - добавлен учёт автопропусков
 */

import React from 'react';
import type { Habit } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';
import { isDateAutoSkipped } from '../../lib/auto-skip-logic';
import { ProgressBar } from '@/shared/ui/progress-bar';
import { CalendarWeekdaysRow, CalendarDatesRow } from '@/shared/ui/calendar-day-header';
import { useHabitsStore } from '@/app/store';

interface DailyProgressBarsProps {
  /** Массив дней месяца с датами */
  monthDays: { date: Date; day: number }[];
  /** Список привычек для расчёта прогресса */
  habits: Habit[];
  /** Функция форматирования даты в строку (например, "2025-11-30") */
  formatDate: (date: Date) => string;
  /** Функция для получения названия дня недели */
  getDayName?: (date: Date) => string;
}

/**
 * Компонент дневных прогресс-баров
 * 
 * Для каждого дня рассчитывает:
 * - Общее количество привычек
 * - Количество выполненных привычек
 * - Количество пропущенных (freeze) привычек
 * - Количество автопропусков (→) привычек
 * - Процент выполнения = (выполненные / (общие - пропущенные - автопропуски)) * 100
 * 
 * Выравнивание:
 * - Использует grid с равными колонками для каждого дня (синхронизировано с HabitCalendar)
 * - padding px-4 (16px с каждой стороны)
 * 
 * @example
 * ```tsx
 * <DailyProgressBars
 *   monthDays={[{ date: new Date(), day: 1 }, ...]}
 *   habits={habits}
 *   formatDate={(date) => date.toISOString().split('T')[0]}
 * />
 * ```
 */
export const DailyProgressBars = React.memo(function DailyProgressBars({
  monthDays,
  habits,
  formatDate,
  getDayName,
}: DailyProgressBarsProps) {
  const vacationPeriods = useHabitsStore(state => state.vacationPeriods);
  
  return (
    <div className="flex flex-col h-full">
      {/* Вертикальные прогресс-бары */}
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${monthDays.length}, 1fr)`,
          width: '100%',
          flex: 1
        }}
      >
        {monthDays.map((dayData) => {
          const dateStr = formatDate(dayData.date);
          
          // ✅ Фильтруем привычки - учитываем только те, которые уже начались
          const activeHabits = habits.filter(habit => {
            const habitStartDate = habit.startDate || habit.createdAt;
            return dateStr >= habitStartDate;
          });
          
          const totalHabits = activeHabits.length;
          
          // Считаем выполненные привычки
          const completedHabits = activeHabits.filter(
            (habit) => isHabitCompletedForDate(habit, dateStr)
          ).length;
          
          // Считаем пропущенные (freeze) привычки
          const skippedHabits = activeHabits.filter(
            (habit) => habit.skipped?.[dateStr]
          ).length;
          
          // Считаем автопропуски (→) - привычки не требуются по частоте
          const autoSkippedHabits = activeHabits.filter(
            (habit) => isDateAutoSkipped(habit, dateStr, vacationPeriods)
          ).length;
          
          // Корректируем цель с учётом пропущенных и автопропусков
          const adjustedGoal = Math.max(0, totalHabits - skippedHabits - autoSkippedHabits);
          
          // Рассчитываем процент выполнения
          const percentage = adjustedGoal > 0 ? (completedHabits / adjustedGoal) * 100 : 0;
          
          return (
            <div
              key={`progress-${dayData.day}`}
              className="flex flex-col items-center h-full justify-end"
            >
              {/* Вертикальный прогресс-бар */}
              <div className="flex-1 mx-auto" style={{ marginBottom: '4px', width: '100%' }}>
                <ProgressBar 
                  value={percentage} 
                  max={100} 
                  orientation="vertical"
                  fillColor="var(--accent-primary-indigo)"
                  className="h-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Дни недели и даты - под прогресс-барами */}
      {getDayName && (
        <div className="translate-y-[5px]">
          <div className="flex flex-col items-center w-full">
            <CalendarWeekdaysRow
              monthDays={monthDays}
              getDayName={getDayName}
              highlightWeekends={true}
            />
            <CalendarDatesRow monthDays={monthDays} />
          </div>
        </div>
      )}
    </div>
  );
});
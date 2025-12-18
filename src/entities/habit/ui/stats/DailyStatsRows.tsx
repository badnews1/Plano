/**
 * Три строки статистики под графиком дневного прогресса
 * 
 * Отображает для каждого дня месяца:
 * 1. Дни недели
 * 2. Количество выполненных привычек
 * 3. Общее количество привычек с учётом пропусков и автопропусков (adjustedGoal)
 * 
 * adjustedGoal = totalHabits - skippedHabits - autoSkippedHabits
 * 
 * @module entities/habit/ui/stats
 * @migrated 30 ноября 2025 - перенесено из features/statistics в entities/habit
 * @refactored 2 декабря 2025 - убраны mt-4, mt-1, обёрнуто в flex-col с gap
 * @refactored 3 декабря 2025 - заменена строка с процентами на дни недели
 * @updated 6 декабря 2025 - добавлен учёт автопропусков
 */

import type { Habit } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';
import { isDateAutoSkipped } from '../../lib/auto-skip-logic';
import { CalendarWeekdaysRow } from '@/shared/ui/calendar-day-header';
import { useHabitsStore } from '@/app/store';

interface DailyStatsRowsProps {
  habits: Habit[];
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
  getDayName: (date: Date) => string;
  /** Дополнительные CSS классы */
  className?: string;
  /** Inline стили */
  style?: React.CSSProperties;
}

/**
 * Компонент отображает три строки статистики под графиком:
 * - Дни недели для каждого дня
 * - Количество выполненных привычек
 * - Общее количество привычек (с вычетом пропущенных и автопропусченных)
 */
export function DailyStatsRows({
  habits,
  monthDays,
  formatDate,
  getDayName,
  className,
  style,
}: DailyStatsRowsProps) {
  const vacationPeriods = useHabitsStore(state => state.vacationPeriods);
  
  // Используем CSS переменные для padding и gap
  // Синхронизировано с CalendarWeekdaysRow/CalendarDatesRow и DailyProgressBars
  
  // Создаем стиль сетки, идентичный календарю
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${monthDays.length}, 1fr)`,
    width: '100%',
  };
  
  return (
    <div className={`flex flex-col gap-1 ${className || ''}`} style={style}>
      {/* Строка 1: Дни недели */}
      <CalendarWeekdaysRow 
        monthDays={monthDays} 
        getDayName={getDayName}
        highlightWeekends={true}
      />

      {/* Строка 2: Количество выполненных привычек */}
      <div style={gridStyle}>
        {monthDays.map((dayData, dayIndex) => {
          const dateStr = formatDate(dayData.date);
          
          // ✅ Фильтруем привычки - учитываем только те, которые уже начались
          const activeHabits = habits.filter(habit => {
            const habitStartDate = habit.startDate || habit.createdAt;
            return dateStr >= habitStartDate;
          });
          
          const completedHabits = activeHabits.filter(habit => isHabitCompletedForDate(habit, dateStr)).length;

          return (
            <div
              key={`chart-stats-count-${dayIndex}`}
              className="w-full h-3 flex items-center justify-center"
            >
              <span className="text-2xs text-text-secondary" style={{ fontWeight: 500 }}>
                {completedHabits}
              </span>
            </div>
          );
        })}
      </div>

      {/* Строка 3: Общее количество привычек (с учётом пропусков и автопропусков) */}
      <div style={gridStyle}>
        {monthDays.map((dayData, dayIndex) => {
          const dateStr = formatDate(dayData.date);
          
          // ✅ Фильтруем привычки - учитываем только те, которые уже начались
          const activeHabits = habits.filter(habit => {
            const habitStartDate = habit.startDate || habit.createdAt;
            return dateStr >= habitStartDate;
          });
          
          const totalHabits = activeHabits.length;
          const skippedHabits = activeHabits.filter(habit => habit.skipped?.[dateStr]).length;
          
          // Считаем автопропуски (→) - привычки не требуются по частоте
          const autoSkippedHabits = activeHabits.filter(
            habit => isDateAutoSkipped(habit, dateStr, vacationPeriods)
          ).length;
          
          const adjustedGoal = Math.max(0, totalHabits - skippedHabits - autoSkippedHabits);

          return (
            <div
              key={`chart-stats-total-${dayIndex}`}
              className="w-full h-3 flex items-center justify-center"
            >
              <span className="text-2xs text-text-secondary" style={{ fontWeight: 500 }}>
                {adjustedGoal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
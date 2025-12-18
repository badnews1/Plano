/**
 * Виджет дневных столбцов прогресса
 * 
 * Отображает вертикальные столбцы с прогрессом выполнения привычек по дням месяца.
 * 
 * @module widgets/habit-daily-progress-bars
 * @created 30 ноября 2025 - выделено из features/habit-calendar/CalendarHeader
 * @updated 5 декабря 2025 - добавлена поддержка пропса habits для фильтрации
 */

import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import { getDaysInMonth, formatDate, getLocalizedDayName } from '@/shared/lib/date';
import { DailyProgressBars } from '@/entities/habit';
import type { Habit } from '@/entities/habit';

interface HabitDailyProgressBarsProps {
  /** Опциональный массив привычек (если не передан, используется из store) */
  habits?: Habit[];
}

export function HabitDailyProgressBars({ habits: habitsProp }: HabitDailyProgressBarsProps) {
  const { t } = useTranslation();
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем все вызовы store в один с useShallow
  const { habitsFromStore, selectedMonth, selectedYear } = useHabitsStore(
    useShallow((state) => ({
      habitsFromStore: state.habits,
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
    }))
  );

  // Используем переданные habits или из store
  const habits = habitsProp || habitsFromStore;

  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  return (
    <div className="h-full">
      <DailyProgressBars
        monthDays={monthDays}
        habits={habits}
        formatDate={formatDate}
        getDayName={(date: Date) => getLocalizedDayName(date, t)}
      />
    </div>
  );
}
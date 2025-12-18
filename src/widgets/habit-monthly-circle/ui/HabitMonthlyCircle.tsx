/**
 * Виджет месячного кругового прогресса
 * 
 * Отображает круговой индикатор общего прогресса за месяц.
 * 
 * @module widgets/habit-monthly-circle
 * @created 30 ноября 2025 - выделено из features/habit-calendar/CalendarHeader
 * @updated 5 декабря 2025 - добавлена поддержка пропса habits для фильтрации
 */

import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import { getDaysInMonth, formatDate } from '@/shared/lib/date';
import { MonthlyCircle } from '@/entities/habit';
import type { Habit } from '@/entities/habit';

interface HabitMonthlyCircleProps {
  /** Опциональный массив привычек (если не передан, используется из store) */
  habits?: Habit[];
}

export function HabitMonthlyCircle({ habits: habitsProp }: HabitMonthlyCircleProps) {
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
    <MonthlyCircle
      habits={habits}
      monthDays={monthDays}
      formatDate={formatDate}
      selectedMonth={selectedMonth}
      selectedYear={selectedYear}
    />
  );
}
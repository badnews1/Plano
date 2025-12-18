/**
 * Виджет графика дневного прогресса выполнения привычек
 * 
 * Area Chart с градиентной заливкой, показывающий количество
 * выполненных привычек по дням месяца. Включает:
 * - График area chart
 * - Три строки статистики под графиком (дни недели, выполнено, всего)
 * 
 * @module widgets/habit-daily-chart
 * @created 30 ноября 2025 - выделено из features/statistics/StrengthChart
 * @updated 1 декабря 2025 - обёрнут в Card компонент
 * @refactored 2 декабря 2025 - добавлена структура CardContent, убран p-4
 * @refactored 3 декабря 2025 - убран заголовок с днями недели и числами месяца, заменены проценты на дни недели
 */

import type { Habit, DateConfig } from '@/entities/habit';
import { DailyStatsRows, DailyCompletionAreaChart } from '@/entities/habit';
import { Card } from '@/components/ui/card';

interface HabitDailyChartProps {
  /** Список привычек для отображения */
  habits: Habit[];
  /** Конфигурация дат (месяц, форматирование) */
  dateConfig: DateConfig;
}

/**
 * Виджет графика дневного прогресса
 * 
 * Показывает area chart с количеством выполненных привычек по дням.
 * Под графиком три строки:
 * 1. Дни недели
 * 2. Количество выполненных привычек
 * 3. Общее количество привычек (с учётом пропущенных)
 * 
 * adjustedGoal = totalHabits - skippedHabits
 */
export function HabitDailyChart({
  habits,
  dateConfig,
}: HabitDailyChartProps) {
  const { monthDays, formatDate, getDayName } = dateConfig;

  return (
    <Card className="flex flex-col items-center px-[0px] py-[16px] pt-[16px] pr-[0px] pb-[0px] pl-[0px]">
      {/* График */}
      <DailyCompletionAreaChart
        habits={habits}
        monthDays={monthDays}
        formatDate={formatDate}
        className="mt-4 w-full"
      />

      {/* Три строки статистики: дни недели, выполнено, всего */}
      <div className="w-full px-[16px] py-[0px]">
        <DailyStatsRows
          habits={habits}
          monthDays={monthDays}
          formatDate={formatDate}
          getDayName={getDayName}
          className="mt-4 w-full"
        />
      </div>
    </Card>
  );
}
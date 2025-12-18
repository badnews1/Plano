/**
 * График для отображения количества выполненных привычек по дням
 * 
 * Обёртка над переиспользуемым компонентом AreaChart из shared/ui.
 * Содержит бизнес-логику подсчёта выполненных привычек и подготовки данных.
 * 
 * @module entities/habit/ui/stats
 * @migrated 30 ноября 2025 - перенесено из features/statistics в entities/habit
 * @updated 2 декабря 2025 - добавлена мультиязычность
 */

import { useTranslation } from 'react-i18next';
import type { Habit } from '../../model/types';
import { isHabitCompletedForDate } from '../../lib/habit-utils';
import { AreaChart } from '@/shared/ui/area-chart';

interface DailyCompletionAreaChartProps {
  /** Список привычек для подсчёта выполнения */
  habits: Habit[];
  /** Массив дней месяца с датами */
  monthDays: Array<{ day: number; date: Date }>;
  /** Функция форматирования даты в строку */
  formatDate: (date: Date) => string;
  /** Дополнительные CSS классы */
  className?: string;
  /** Inline стили */
  style?: React.CSSProperties;
}

/**
 * Area Chart дневного выполнения привычек
 * 
 * Алгоритм:
 * 1. Для каждого дня считается количество выполненных привычек
 * 2. Подготавливаются данные в формате { label, value }
 * 3. Рендерится через переиспользуемый AreaChart из shared/ui
 * 
 * @example
 * ```tsx
 * <DailyCompletionAreaChart
 *   habits={habits}
 *   monthDays={monthDays}
 *   formatDate={(date) => date.toISOString().split('T')[0]}
 * />
 * ```
 */
export function DailyCompletionAreaChart({
  habits,
  monthDays,
  formatDate,
  className,
  style,
}: DailyCompletionAreaChartProps) {
  const { t, i18n } = useTranslation('stats');
  const currentLanguage = i18n.language;
  
  // Подсчёт выполненных привычек для каждого дня
  const chartData = monthDays.map((dayData) => {
    const dateStr = formatDate(dayData.date);
    
    // ✅ Фильтруем привычки - учитываем только те, которые уже начались
    const activeHabits = habits.filter(habit => {
      const habitStartDate = habit.startDate || habit.createdAt;
      return dateStr >= habitStartDate;
    });
    
    const completedHabits = activeHabits.filter(habit => 
      isHabitCompletedForDate(habit, dateStr)
    ).length;
    
    return {
      label: dateStr, // Храним полную дату для форматирования в tooltip
      value: completedHabits
    };
  });

  return (
    <div className={className} style={style}>
      <AreaChart
        data={chartData}
        height={200}
        color="var(--text-primary)"
        valueLabel={t('charts.completed')}
        showTooltip={true}
        addPaddingPoints={true}
        gradientId="dailyCompletionGradient"
        labelFormatter={(label) => {
          const date = new Date(label);
          return date.toLocaleDateString(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
          });
        }}
      />
    </div>
  );
}
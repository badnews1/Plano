/**
 * Круговой индикатор месячного прогресса привычек (справа вверху)
 * 
 * Композитный компонент, использующий SpeedometerChart для отображения
 * круговой диаграммы в стиле спидометра с процентом выполнения всех привычек за месяц.
 * Учитывает частоту каждой привычки при расчёте общего количества
 * возможных выполнений.
 * 
 * Показывает:
 * - Процент выполнения (0-100%) в стиле спидометра
 * - Количество выполненных / возможных действий
 * - Визуальную круговую диаграмму с разрывом снизу
 * - Декоративные точки по дуге с градиентом прозрачности
 * 
 * @module entities/habit/ui/stats
 * @created 30 ноября 2025 - мигрировано из features/statistics
 * @refactored 1 декабря 2025 - использует CircularProgress из shared/ui
 * @refactored 2 декабря 2025 - использует showLabel из CircularProgress
 * @refactored 7 декабря 2025 - заменён CircularProgress на SpeedometerChart
 * @refactored 8 декабря 2025 - добавлены декоративные точки с градиентом
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit } from '../../model/types';
import { calculateMonthlyProgress } from '../../lib/stats-calculator';
import { SpeedometerChart } from '@/shared/ui/speedometer-chart';
import { useHabitsStore } from '@/app/store';

interface MonthlyCircleProps {
  /** Список привычек для расчёта прогресса */
  habits: Habit[];
  /** Массив дней месяца с датами */
  monthDays: { date: Date; day: number }[];
  /** Функция форматирования даты в строку */
  formatDate: (date: Date) => string;
  /** Выбранный месяц (0-11) */
  selectedMonth: number;
  /** Выбранный год */
  selectedYear: number;
}

/**
 * Круговая диаграмма месячного прогресса
 * 
 * Использует centralized функцию calculateMonthlyProgress для расчёта статистики
 * 
 * @example
 * ```tsx
 * <MonthlyCircle
 *   habits={habits}
 *   monthDays={monthDays}
 *   formatDate={(date) => date.toISOString().split('T')[0]}
 *   selectedMonth={10}
 *   selectedYear={2025}
 * />
 * ```
 */
export function MonthlyCircle({
  habits,
  monthDays,
  formatDate,
  selectedMonth,
  selectedYear,
}: MonthlyCircleProps) {
  const { t } = useTranslation('stats');
  const vacationPeriods = useHabitsStore(state => state.vacationPeriods);
  
  // ⚡ ОПТИМИЗАЦИЯ: мемоизация дат месяца
  const allMonthDates = React.useMemo(
    () => monthDays.map(day => formatDate(day.date)),
    [monthDays, formatDate]
  );
  
  // ⚡ ОПТИМИЗАЦИЯ: мемоизация прогресса
  const { totalCompleted, totalPossible, percentage } = React.useMemo(
    () => calculateMonthlyProgress(habits, allMonthDates, vacationPeriods),
    [habits, allMonthDates, vacationPeriods]
  );

  // Получаем размер круга из CSS переменной
  const [circleSize, setCircleSize] = React.useState(140);

  React.useEffect(() => {
    // Функция для чтения CSS переменной
    const updateCircleSize = () => {
      const size = getComputedStyle(document.documentElement)
        .getPropertyValue('--tracker-circle-size')
        .trim();
      const numericSize = parseInt(size, 10);
      if (!isNaN(numericSize)) {
        setCircleSize(numericSize);
      }
    };

    // Читаем при монтировании
    updateCircleSize();

    // Слушаем изменение размера окна для пересчёта переменной
    window.addEventListener('resize', updateCircleSize);
    
    return () => {
      window.removeEventListener('resize', updateCircleSize);
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center pr-4" style={{ width: 'var(--grid-side-column-right)' }}>
      {/* Круговая диаграмма с градиентом и декоративными точками */}
      <SpeedometerChart 
        progress={percentage} 
        size={circleSize} 
        strokeSize="md"
        showLabel
        label="PROGRESS"
        progressColor="gradient"
        showDots
        dotsColor="var(--bg-tertiary)"
        dotsSize={1}
        dotsOffset={12}
        showInnerDots
        showOuterDots
        innerDotsCount={30}
        outerDotsCount={60}
        outerDotsGradient
      />
    </div>
  );
}
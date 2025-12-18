/**
 * Виджет навигации по месяцам
 * 
 * Отображает название текущего месяца, слоган и кнопку для открытия пикера месяца/года.
 * 
 * @module widgets/habit-month-navigation
 * @created 30 ноября 2025 - выделено из features/habit-calendar/CalendarHeader
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label, role)
 */

import { useHabitsStore, useShallow } from '@/app/store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from '@/shared/assets/icons/system';
import { useTranslation } from 'react-i18next';

export function HabitMonthNavigation() {
  const { t } = useTranslation('common');
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем вызовы store в один с useShallow
  const { selectedMonth, selectedYear, openMonthYearPicker } = useHabitsStore(
    useShallow((state) => ({
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
      openMonthYearPicker: state.openMonthYearPicker,
    }))
  );

  const getMonthName = (month: number) => {
    const months = [
      t('months.full.january'),
      t('months.full.february'),
      t('months.full.march'),
      t('months.full.april'),
      t('months.full.may'),
      t('months.full.june'),
      t('months.full.july'),
      t('months.full.august'),
      t('months.full.september'),
      t('months.full.october'),
      t('months.full.november'),
      t('months.full.december'),
    ];
    return months[month];
  };

  const monthName = getMonthName(selectedMonth);

  return (
    <div 
      className="w-full flex flex-col justify-center items-center pl-4" 
      style={{ 
        height: '100%',
        gap: 'var(--tracker-widget-gap)'
      }}
      role="navigation"
      aria-label="Навигация по месяцам"
    >
      <Button 
        onClick={openMonthYearPicker}
        variant="ghost"
        className="text-text-primary hover:text-text-secondary p-0 h-auto text-3xl"
        aria-label={`Выбрать месяц и год, текущий: ${monthName} ${selectedYear}`}
        style={{ fontSize: 'var(--tracker-month-text-size, 1.875rem)' }}
      >
        <span className="text-text-primary">{monthName.toUpperCase()}</span>
      </Button>
      <span 
        className="text-center text-text-secondary tracking-wider whitespace-pre text-2xs"
        aria-hidden="true"
        style={{ fontSize: 'var(--tracker-slogan-text-size, var(--text-2xs))' }}
      >
        —  S M A L L   S T E P S,   B I G   W I N S  —
      </span>
    </div>
  );
}
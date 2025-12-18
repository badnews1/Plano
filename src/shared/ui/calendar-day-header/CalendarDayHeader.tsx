/**
 * Компоненты шапки календаря
 * 
 * Переиспользуемые компоненты для отображения дней недели и чисел месяца.
 * 
 * @module shared/ui/calendar-day-header
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label, role)
 */

import React from 'react';

// ============================================================================
// CalendarWeekdaysRow
// ============================================================================

interface CalendarWeekdaysRowProps {
  monthDays: { date: Date; day: number }[];
  getDayName: (date: Date) => string;
  /** Применять ли другой цвет для выходных */
  highlightWeekends?: boolean;
}

/**
 * Строка с днями недели для календарной сетки
 */
export function CalendarWeekdaysRow({
  monthDays,
  getDayName,
  highlightWeekends = false,
}: CalendarWeekdaysRowProps) {
  
  // Создаем стиль сетки
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${monthDays.length}, 1fr)`,
    width: '100%',
  };

  // Проверка является ли день выходным (суббота = 6, воскресенье = 0)
  const isWeekend = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <div style={gridStyle} role="row" aria-label="Дни недели">
      {monthDays.map((dayData) => {
        const weekend = isWeekend(dayData.date);
        
        const today = new Date();
        const isToday = 
          dayData.date.getDate() === today.getDate() &&
          dayData.date.getMonth() === today.getMonth() &&
          dayData.date.getFullYear() === today.getFullYear();
        
        const dayName = getDayName(dayData.date);
        
        return (
          <div
            key={`calendar-weekday-${dayData.day}`}
            className="w-full h-3 flex items-center justify-center"
            role="columnheader"
            aria-label={`${dayName}, ${isToday ? 'сегодня' : ''}`}
          >
            <span 
              className="text-2xs uppercase"
              style={{ 
                fontWeight: 500,
                color: isToday 
                  ? 'var(--accent-secondary-indigo)' 
                  : weekend 
                    ? 'var(--text-tertiary)' 
                    : 'var(--text-secondary)'
              }}
              aria-hidden="true"
            >
              {dayName}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// CalendarDatesRow
// ============================================================================

interface CalendarDatesRowProps {
  monthDays: { date: Date; day: number }[];
}

/**
 * Строка с числами месяца для календарной сетки
 */
export function CalendarDatesRow({ monthDays }: CalendarDatesRowProps) {
  
  // Создаем стиль сетки
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${monthDays.length}, 1fr)`,
    width: '100%',
  };

  // Проверка является ли день выходным (суббота = 6, воскресенье = 0)
  const isWeekend = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  return (
    <div style={gridStyle} role="row" aria-label="Числа месяца">
      {monthDays.map((dayData) => {
        const weekend = isWeekend(dayData.date);
        
        const today = new Date();
        const isToday = 
          dayData.date.getDate() === today.getDate() &&
          dayData.date.getMonth() === today.getMonth() &&
          dayData.date.getFullYear() === today.getFullYear();
        
        return (
          <div
            key={`calendar-date-${dayData.day}`}
            className="w-full h-3 flex flex-col items-center justify-center relative"
            style={{ fontWeight: isToday ? 700 : 400 }}
            role="columnheader"
            aria-label={`${dayData.day} число${isToday ? ', сегодня' : ''}`}
          >
            <span 
              className="text-2xs"
              style={{ 
                color: isToday 
                  ? 'var(--accent-secondary-indigo)' 
                  : weekend 
                    ? 'var(--text-tertiary)' 
                    : 'var(--text-secondary)' 
              }}
              aria-hidden="true"
            >
              {dayData.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}
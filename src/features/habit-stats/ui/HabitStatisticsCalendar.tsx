/**
 * Календарь статистики привычки
 * 
 * Отображает месячный календарь с визуализацией выполнения привычки:
 * - Выполненные дни (голубой фон)
 * - Стрики (последовательности выполненных дней соединены)
 * - Пропуски (красноватый оттенок)
 * - Автопропуски (приглушенный стиль)
 * - Каникулы (янтарный оттенок)
 * - Будущие дни (серый цвет)
 * 
 * @module features/habit-stats/ui/HabitStatisticsCalendar
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from '@/shared/assets/icons/system';
import type { Habit } from '@/entities/habit';
import { isHabitCompletedForDate, isDateAutoSkipped } from '@/entities/habit';
import type { VacationPeriod } from '@/entities/vacation';
import { isDateInVacation } from '@/entities/vacation';

interface HabitStatisticsCalendarProps {
  habit: Habit;
  monthYearKey: string;
  vacationPeriods: VacationPeriod[];
  onMonthChange: (newMonthYearKey: string) => void;
}

type DayStatus = 'completed' | 'skipped' | 'auto-skipped' | 'vacation' | 'future' | 'missed' | 'not-started';

interface DayInfo {
  date: string;
  dayOfMonth: number;
  status: DayStatus;
  isInStreak: boolean;
  streakPosition?: 'start' | 'middle' | 'end' | 'single';
}

/**
 * Определяет состояние дня
 */
function getDayStatus(
  habit: Habit,
  dateStr: string,
  today: string,
  vacationPeriods: VacationPeriod[]
): DayStatus {
  const habitStartDate = habit.startDate || habit.createdAt;
  
  // Если день до начала привычки
  if (dateStr < habitStartDate) {
    return 'not-started';
  }
  
  // Если день в будущем
  if (dateStr > today) {
    return 'future';
  }
  
  // Если день в отпуске
  if (isDateInVacation(dateStr, habit.id, vacationPeriods)) {
    return 'vacation';
  }
  
  // Если день выполнен
  if (isHabitCompletedForDate(habit, dateStr)) {
    return 'completed';
  }
  
  // Если день пропущен вручную
  if (habit.skipped?.[dateStr]) {
    return 'skipped';
  }
  
  // Если день автопропущен (по расписанию не нужно было выполнять)
  if (isDateAutoSkipped(habit, dateStr, vacationPeriods)) {
    return 'auto-skipped';
  }
  
  // День пропущен (не выполнен, хотя должен был быть)
  return 'missed';
}

/**
 * Определяет позицию дня в стрике
 */
function getStreakPosition(
  days: DayInfo[],
  currentIndex: number
): 'start' | 'middle' | 'end' | 'single' | undefined {
  const currentDay = days[currentIndex];
  if (!currentDay || currentDay.status !== 'completed') {
    return undefined;
  }
  
  const prevDay = days[currentIndex - 1];
  const nextDay = days[currentIndex + 1];
  
  const isPrevCompleted = prevDay?.status === 'completed';
  const isNextCompleted = nextDay?.status === 'completed';
  
  if (isPrevCompleted && isNextCompleted) {
    return 'middle';
  } else if (isPrevCompleted) {
    return 'end';
  } else if (isNextCompleted) {
    return 'start';
  } else {
    return 'single';
  }
}

/**
 * Генерирует данные для календаря
 */
function generateCalendarData(
  habit: Habit,
  monthYearKey: string,
  vacationPeriods: VacationPeriod[]
): DayInfo[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0] ?? today.toISOString();
  
  // Парсим monthYearKey
  const [year, month] = monthYearKey.split('-').map(Number);
  
  // Первый и последний день месяца
  const firstDay = new Date(year ?? new Date().getFullYear(), (month ?? 1) - 1, 1);
  const lastDay = new Date(year ?? new Date().getFullYear(), month ?? 1, 0);
  
  // Генерируем все дни месяца
  const allDays: DayInfo[] = [];
  const currentDate = new Date(firstDay);
  
  while (currentDate <= lastDay) {
    const dateStr = currentDate.toISOString().split('T')[0] ?? currentDate.toISOString();
    const status = getDayStatus(habit, dateStr, todayStr, vacationPeriods);
    
    allDays.push({
      date: dateStr,
      dayOfMonth: currentDate.getDate(),
      status,
      isInStreak: status === 'completed',
      streakPosition: undefined,
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Определяем позиции в стриках
  allDays.forEach((day, index) => {
    if (day.status === 'completed') {
      day.streakPosition = getStreakPosition(allDays, index);
    }
  });
  
  // Группируем по неделям
  const weeks: DayInfo[][] = [];
  let currentWeek: DayInfo[] = [];
  
  // Добавляем пустые дни в начало первой недели
  const firstDayOfWeek = firstDay.getDay();
  const emptyDaysCount = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Понедельник = 0
  
  for (let i = 0; i < emptyDaysCount; i++) {
    currentWeek.push({
      date: '',
      dayOfMonth: 0,
      status: 'not-started',
      isInStreak: false,
    });
  }
  
  // Добавляем дни месяца
  allDays.forEach((day, index) => {
    currentWeek.push(day);
    
    // Если неделя заполнена (7 дней) или это последний день
    if (currentWeek.length === 7 || index === allDays.length - 1) {
      // Дополняем неделю пустыми днями до 7
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          dayOfMonth: 0,
          status: 'not-started',
          isInStreak: false,
        });
      }
      
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  return weeks;
}

/**
 * Получает CSS классы для дня
 */
function getDayClassName(day: DayInfo): string {
  if (day.dayOfMonth === 0) {
    return 'invisible';
  }
  
  const baseClasses = 'relative flex items-center justify-center h-10 min-w-[40px] transition-colors text-sm font-medium';
  
  // Стили для стриков
  if (day.status === 'completed' && day.streakPosition) {
    const streakClasses = {
      single: 'rounded-full bg-[var(--accent-primary-indigo)] text-[var(--accent-text-indigo)]',
      start: 'rounded-l-full bg-[var(--accent-primary-indigo)] text-[var(--accent-text-indigo)]',
      middle: 'bg-[var(--accent-primary-indigo)] text-[var(--accent-text-indigo)]',
      end: 'rounded-r-full bg-[var(--accent-primary-indigo)] text-[var(--accent-text-indigo)]',
    };
    
    return `${baseClasses} ${streakClasses[day.streakPosition]}`;
  }
  
  // Стили для других состояний
  const statusClasses = {
    completed: 'rounded-full bg-[var(--accent-primary-indigo)] text-[var(--accent-text-indigo)]',
    skipped: 'text-[var(--palette-red-text)] opacity-60',
    'auto-skipped': 'text-[var(--text-disabled)]',
    vacation: 'rounded-full bg-[var(--palette-amber-bg)] text-[var(--palette-amber-text)] border border-[var(--palette-amber-border)]',
    future: 'text-[var(--text-tertiary)]',
    missed: 'text-[var(--text-primary)]',
    'not-started': 'invisible',
  };
  
  return `${baseClasses} ${statusClasses[day.status]}`;
}

export const HabitStatisticsCalendar: React.FC<HabitStatisticsCalendarProps> = ({
  habit,
  monthYearKey,
  vacationPeriods,
  onMonthChange,
}) => {
  const { t, i18n } = useTranslation('stats');
  
  // Генерируем данные календаря
  const weeks = generateCalendarData(habit, monthYearKey, vacationPeriods);
  
  // Парсим monthYearKey для отображения
  const [year, month] = monthYearKey.split('-').map(Number);
  const monthDate = new Date(year ?? new Date().getFullYear(), (month ?? 1) - 1, 1);
  
  // Форматируем название месяца
  const monthName = monthDate.toLocaleDateString(i18n.language, { 
    month: 'short',
    year: 'numeric'
  });
  
  // Обработчики навигации
  const handlePrevMonth = () => {
    const currentYear = year ?? new Date().getFullYear();
    const currentMonth = month ?? 1;
    
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    onMonthChange(`${prevYear}-${String(prevMonth).padStart(2, '0')}`);
  };
  
  const handleNextMonth = () => {
    const currentYear = year ?? new Date().getFullYear();
    const currentMonth = month ?? 1;
    
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    
    onMonthChange(`${nextYear}-${String(nextMonth).padStart(2, '0')}`);
  };
  
  // Дни недели (понедельник - воскресенье)
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="space-y-4">
      {/* Заголовок с навигацией */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
        
        <span className="text-[var(--text-primary)]">
          {monthName}
        </span>
        
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />
        </button>
      </div>
      
      {/* Календарная сетка */}
      <div className="bg-[var(--bg-secondary)] rounded-md p-4">
        {/* Дни недели */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-xs text-[var(--text-tertiary)] h-8 min-w-[40px]"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Недели */}
        <div className="space-y-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={getDayClassName(day)}
                >
                  {day.dayOfMonth > 0 && (
                    <span className="relative z-10">
                      {day.dayOfMonth}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
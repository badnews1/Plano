import type { Habit } from '../model/types';
import type { VacationPeriod } from '@/entities/vacation';
import { countVacationDaysInPeriod } from '@/entities/vacation';

/**
 * Проверяет, является ли дата автопропуском (для расчёта силы привычки)
 * 
 * @param habit - Привычка
 * @param dateStr - Дата в формате YYYY-MM-DD
 * @param vacationPeriods - Массив периодов отдыха
 * @returns true, если этот день является автопропуском
 */
export function isDateAutoSkipped(
  habit: Habit,
  dateStr: string,
  vacationPeriods: VacationPeriod[] = []
): boolean {
  // ✅ Если дата до начала привычки - это НЕ автопропуск
  const startDate = habit.startDate || habit.createdAt;
  if (dateStr < startDate) {
    return false;
  }
  
  // Если день выполнен - это НЕ автопропуск
  const completion = habit.completions?.[dateStr];
  const isCompleted = completion === true || typeof completion === 'number';
  if (isCompleted) {
    return false;
  }

  // Если частота не задана - нет автопропусков
  if (!habit.frequency) {
    return false;
  }

  const { type, daysOfWeek, count, period } = habit.frequency;
  const date = new Date(dateStr);

  // 1. По определённым дням недели (by_days_of_week)
  if (type === 'by_days_of_week' && daysOfWeek && daysOfWeek.length > 0) {
    const dayOfWeek = date.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
    return !daysOfWeek.includes(dayOfWeek);
  }

  // 2. Каждые N дней (every_n_days)
  if (type === 'every_n_days' && period !== undefined) {
    // Если каждый день - нет автопропусков
    if (period === 1) {
      return false;
    }
    
    // ✅ Используем startDate вместо createdAt как стартовую дату
    const startDate = new Date(habit.startDate || habit.createdAt);
    startDate.setHours(0, 0, 0, 0);
    
    const checkDate = new Date(dateStr);
    checkDate.setHours(0, 0, 0, 0);
    
    // Считаем количество дней от стартовой даты
    const daysDiff = Math.floor((checkDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Если daysDiff НЕ кратен периоду - это автопропуск
    return daysDiff >= 0 && daysDiff % period !== 0;
  }

  // 3. N раз в неделю (n_times_week)
  if (type === 'n_times_week' && count !== undefined) {
    const weekStart = getWeekStart(date);
    const weekEnd = getWeekEnd(date);
    
    // ✅ Фильтруем даты недели - учитываем только после startDate
    const habitStartDate = habit.startDate || habit.createdAt;
    const allWeekDates = getDatesInRange(weekStart, weekEnd);
    const weekDates = allWeekDates.filter(d => d >= habitStartDate);
    
    // Корректируем цель с учётом дней отдыха
    const vacationDaysInWeek = countVacationDaysInPeriod(weekDates, habit.id, vacationPeriods);
    const availableDays = weekDates.length - vacationDaysInWeek;
    const adjustedTargetCount = Math.min(count, Math.max(0, availableDays));
    
    // Считаем выполнения за всю неделю (включая будущее)
    const completionsInWeek = countCompletionsInPeriod(habit, weekStart, weekEnd);
    
    // Если цель уже выполнена - это автопропуск
    return completionsInWeek >= adjustedTargetCount;
  }

  // 4. N раз в месяц (n_times_month)
  if (type === 'n_times_month' && count !== undefined) {
    const monthStart = getMonthStart(date);
    const monthEnd = getMonthEnd(date);
    
    // ✅ Фильтруем даты месяца - учитываем только после startDate
    const habitStartDate = habit.startDate || habit.createdAt;
    const allMonthDates = getDatesInRange(monthStart, monthEnd);
    const monthDates = allMonthDates.filter(d => d >= habitStartDate);
    
    // Корректируем цель с учётом дней отдыха
    const vacationDaysInMonth = countVacationDaysInPeriod(monthDates, habit.id, vacationPeriods);
    const availableDays = monthDates.length - vacationDaysInMonth;
    const adjustedTargetCount = Math.min(count, Math.max(0, availableDays));
    
    // Считаем выполнения за весь месяц (включая будущее)
    const completionsInMonth = countCompletionsInPeriod(habit, monthStart, monthEnd);
    
    // Если цель уже выполнена - это автопропуск
    return completionsInMonth >= adjustedTargetCount;
  }

  return false;
}

/**
 * Определяет, нужно ли показывать автострелочку для указанной даты
 * 
 * НОВАЯ ЛОГИКА: стрелочки появляются СРАЗУ (включая будущие дни)
 * 
 * @param habit - Привычка
 * @param dateStr - Дата в формате YYYY-MM-DD
 * @param todayStr - Сегодняшняя дата (не используется в новой логике, оставлен для совместимости)
 * @param vacationPeriods - Массив периодов отдыха
 * @returns true, если нужно показать автострелочку
 */
export function shouldShowAutoSkip(
  habit: Habit,
  dateStr: string,
  todayStr: string, // Оставлен для совместимости API, но не используется
  vacationPeriods: VacationPeriod[] = []
): boolean {
  // Если день уже выполнен - не показываем стрелочку
  const completion = habit.completions?.[dateStr];
  const isCompleted = completion === true || typeof completion === 'number';
  if (isCompleted) {
    return false;
  }

  // Если частота не задана - не показываем стрелочку
  if (!habit.frequency) {
    return false;
  }

  // Используем ту же логику что и isDateAutoSkipped
  // (в новой версии они идентичны)
  return isDateAutoSkipped(habit, dateStr, vacationPeriods);
}

/**
 * Получает все даты в диапазоне от startDate до endDate включительно
 */
function getDatesInRange(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0] ?? '');
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Получает начало недели (понедельник) для указанной даты
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
  const diff = day === 0 ? -6 : 1 - day; // Если воскресенье, то -6, иначе 1 - day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Получает конец недели (воскресенье) для указанной даты
 */
function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * Получает начало месяца для указанной даты
 */
function getMonthStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Получает конец месяца для указанной даты
 */
function getMonthEnd(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0); // Последний день предыдущего месяца
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Считает количество выполнений в периоде
 * 
 * ВАЖНО: В новой логике считаем ВСЕ выполнения в периоде (включая будущее)
 * ✅ Учитываем только выполнения после startDate привычки
 */
function countCompletionsInPeriod(
  habit: Habit,
  startDate: Date,
  endDate: Date
): number {
  const startStr = startDate.toISOString().split('T')[0] ?? '';
  const endStr = endDate.toISOString().split('T')[0] ?? '';
  
  // ✅ Учитываем только даты после начала привычки
  const habitStartDate = habit.startDate || habit.createdAt;

  let count = 0;

  for (const [date, value] of Object.entries(habit.completions || {})) {
    // ✅ Проверяем: дата в периоде И после начала привычки
    if (date >= startStr && date <= endStr && date >= habitStartDate) {
      const isCompleted = value === true || typeof value === 'number';
      if (isCompleted) {
        count++;
      }
    }
  }

  return count;
}
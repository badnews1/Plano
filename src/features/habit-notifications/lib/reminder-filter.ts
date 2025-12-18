/**
 * Фильтрация напоминаний для привычек
 * 
 * Проверяет, нужно ли показывать напоминание с учетом частоты и автопропусков.
 * 
 * @module features/habit-notifications/lib/reminder-filter
 * @created 10 декабря 2025
 */

import { useHabitsStore } from '@/app/store';
import { isDateAutoSkipped } from '@/entities/habit/lib/auto-skip-logic';

/**
 * Проверяет, нужно ли показывать напоминание для привычки сегодня
 * 
 * Учитывает:
 * - Частоту привычки (by_days_of_week, every_n_days, n_times_week, n_times_month)
 * - Автопропуски (когда цель уже выполнена)
 * - Периоды отдыха (vacation periods)
 * 
 * @param habitId - ID привычки
 * @returns true если напоминание нужно показать, false если нужно пропустить
 * 
 * @example
 * ```typescript
 * // При регистрации напоминания
 * NotificationScheduler.register({
 *   id: 'habit-123-09:00',
 *   type: 'habit',
 *   time: '09:00',
 *   title: 'Зарядка',
 *   shouldShow: () => shouldShowHabitReminderToday('123')
 * });
 * ```
 */
export function shouldShowHabitReminderToday(habitId: string): boolean {
  try {
    const state = useHabitsStore.getState();
    const habit = state.habits.find(h => h.id === habitId);
    
    // Если привычка не найдена - не показываем уведомление
    if (!habit) {
      console.log(`[ReminderFilter] Привычка ${habitId} не найдена`);
      return false;
    }
    
    // Если привычка архивирована - не показываем уведомление
    if (habit.archived) {
      console.log(`[ReminderFilter] Привычка "${habit.name}" архивирована`);
      return false;
    }
    
    // Получаем сегодняшнюю дату
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (!todayStr) {
      console.error('[ReminderFilter] Ошибка получения сегодняшней даты');
      return false;
    }
    
    // Проверяем не раньше ли это даты начала привычки
    const startDate = habit.startDate || habit.createdAt;
    if (todayStr < startDate) {
      console.log(`[ReminderFilter] Привычка "${habit.name}" ещё не началась (start: ${startDate})`);
      return false;
    }
    
    // Проверяем автопропуск с учётом частоты и vacation periods
    const vacationPeriods = state.vacationPeriods || [];
    const isAutoSkipped = isDateAutoSkipped(habit, todayStr, vacationPeriods);
    
    if (isAutoSkipped) {
      console.log(`[ReminderFilter] Привычка "${habit.name}" - автопропуск на ${todayStr}`);
      return false;
    }
    
    // Если день уже выполнен - можно не показывать напоминание
    const completion = habit.completions?.[todayStr];
    const isCompleted = completion === true || typeof completion === 'number';
    if (isCompleted) {
      console.log(`[ReminderFilter] Привычка "${habit.name}" уже выполнена сегодня`);
      return false;
    }
    
    console.log(`[ReminderFilter] ✅ Показываем напоминание для "${habit.name}"`);
    return true;
  } catch (error) {
    console.error('[ReminderFilter] Ошибка при проверке напоминания:', error);
    // В случае ошибки показываем уведомление (fail-safe)
    return true;
  }
}

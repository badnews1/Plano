/**
 * Habit Notifications Feature - Public API
 * 
 * Фича уведомлений для привычек
 * 
 * @module features/habit-notifications
 * @created 29 ноября 2025
 * @updated 30 ноября 2025 - переименование из notifications в habit-notifications
 * @updated 10 декабря 2025 - добавлен экспорт shouldShowHabitReminderToday
 * @updated 18 декабря 2025 - добавлен экспорт TranslateFunction для тестируемости
 */

// Компоненты
export { HabitsNotificationManager } from './ui/HabitsNotificationManager';

// Типы
export type { TranslateFunction } from './lib';

// Сервисы
export {
  scheduleHabitReminders,
  scheduleHabitReminder,
  unscheduleHabitReminders,
  unscheduleHabitReminder,
  rescheduleHabitReminder,
  hasScheduledReminders,
  getScheduledRemindersCount,
  shouldShowHabitReminderToday
} from './lib';
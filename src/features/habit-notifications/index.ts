/**
 * Habit Notifications Feature - Public API
 * 
 * Фича уведомлений для привычек
 * 
 * @module features/habit-notifications
 * @created 29 ноября 2025
 * @updated 30 ноября 2025 - переименование из notifications в habit-notifications
 * @updated 10 декабря 2025 - добавлен экспорт shouldShowHabitReminderToday
 */

// Компоненты
export { HabitsNotificationManager } from './ui/HabitsNotificationManager';

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
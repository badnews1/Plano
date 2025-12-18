/**
 * Public API для модуля уведомлений
 * 
 * @description
 * Инфраструктура уведомлений для всего приложения:
 * - Низкоуровневая обёртка над Web Notifications API
 * - Централизованный планировщик с группировкой и анти-спамом
 */

// Notification API (низкоуровневая обёртка)
export { NotificationService } from './notification-api';
export type { NotificationConfig } from './notification-api';

// Notification Scheduler (централизованный планировщик)
export { NotificationScheduler } from './scheduler';

// Типы
export type {
  ScheduledReminder,
  ReminderType,
  NotificationGroupingConfig,
  SchedulerStats
} from './types';

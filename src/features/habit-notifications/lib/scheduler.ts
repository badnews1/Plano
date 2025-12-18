/**
 * Планировщик уведомлений для модуля Habit Tracker
 * 
 * Обёртка над централизованным NotificationScheduler для работы с привычками.
 * 
 * @module features/habit-notifications/lib
 * @created 22 ноября 2025
 * @updated 30 ноября 2025 - переименование из notifications в habit-notifications
 * @updated 30 ноября 2025 - переименование файла в scheduler.ts
 * @updated 2 декабря 2025 - миграция на i18n для локализованных уведомлений
 * @updated 10 декабря 2025 - добавлена проверка shouldShow для учёта частоты и автопропусков
 * @updated 18 декабря 2025 - улучшена тестируемость: функция перевода передается как параметр
 */

import { NotificationScheduler } from '@/shared/lib/notifications';
import type { Habit, Reminder } from '@/entities/habit';
import { shouldShowHabitReminderToday } from './reminder-filter';

/**
 * Тип функции перевода
 */
export type TranslateFunction = (key: string, options?: { habitName: string; defaultValue?: string }) => string;

/**
 * Планирование всех напоминаний для привычки
 * 
 * Автоматически удаляет старые напоминания перед добавлением новых.
 * 
 * @param habit - Привычка с напоминаниями
 * @param translate - Функция перевода
 * 
 * @example
 * ```typescript
 * const habit = {
 *   id: '123',
 *   name: 'Зарядка',
 *   icon: '💪',
 *   reminders: [
 *     { id: 'r1', time: '09:00', enabled: true },
 *     { id: 'r2', time: '18:00', enabled: true }
 *   ]
 * };
 * 
 * scheduleHabitReminders(habit, i18n.t);
 * ```
 */
export function scheduleHabitReminders(habit: Habit, translate: TranslateFunction): void {
  // Сначала удаляем все старые напоминания этой привычки
  unscheduleHabitReminders(habit.id);
  
  // Если напоминаний нет, просто выходим
  if (!habit.reminders || habit.reminders.length === 0) {
    return;
  }
  
  // Регистрируем каждое включенное напоминание
  habit.reminders
    .filter(reminder => reminder.enabled)
    .forEach(reminder => {
      scheduleHabitReminder(habit, reminder, translate);
    });
}

/**
 * Планирование одного напоминания для привычки
 * 
 * @param habit - Привычка
 * @param reminder - Конкретное напоминание
 * @param translate - Функция перевода
 */
export function scheduleHabitReminder(habit: Habit, reminder: Reminder, translate: TranslateFunction): void {
  const reminderId = generateReminderId(habit.id, reminder.time);
  
  // Локализованный текст уведомления
  const body = translate('common:notifications.scheduler.habitReminder', { 
    habitName: habit.name,
    defaultValue: `Time to complete habit: ${habit.name}`
  });
  
  NotificationScheduler.register({
    id: reminderId,
    type: 'habit',
    time: reminder.time,
    title: habit.name,
    body,
    icon: habit.icon,
    priority: 'normal',
    // Фильтр для проверки нужно ли показывать уведомление сегодня
    shouldShow: () => shouldShowHabitReminderToday(habit.id),
    data: {
      habitId: habit.id,
      reminderId: reminder.id,
      habitName: habit.name,
      habitIcon: habit.icon,
      habitColor: habit.color
    }
  });
  
  console.log(`[HabitScheduler] Запланировано напоминание для "${habit.name}" на ${reminder.time}`);
}

/**
 * Отмена всех напоминаний для привычки
 * 
 * @param habitId - ID привычки
 * 
 * @example
 * ```typescript
 * // При удалении привычки
 * unscheduleHabitReminders('123');
 * ```
 */
export function unscheduleHabitReminders(habitId: string): void {
  // Получаем все напоминания
  const allReminders = NotificationScheduler.getAll();
  
  // Ищем и удаляем все напоминания этой привычки
  let removedCount = 0;
  allReminders.forEach(reminders => {
    reminders.forEach(reminder => {
      if (reminder.type === 'habit' && reminder.data?.habitId === habitId) {
        NotificationScheduler.unregister(reminder.id);
        removedCount++;
      }
    });
  });
  
  if (removedCount > 0) {
    console.log(`[HabitScheduler] Удалено ${removedCount} напоминаний для привычки ${habitId}`);
  }
}

/**
 * Отмена конкретного напоминания привычки
 * 
 * @param habitId - ID привычки
 * @param time - Время напоминания
 */
export function unscheduleHabitReminder(habitId: string, time: string): void {
  const reminderId = generateReminderId(habitId, time);
  NotificationScheduler.unregister(reminderId);
}

/**
 * Обновление времени напоминания
 * 
 * @param habitId - ID привычки
 * @param oldTime - Старое время
 * @param newTime - Новое время
 */
export function rescheduleHabitReminder(
  habitId: string,
  oldTime: string,
  newTime: string
): void {
  const oldId = generateReminderId(habitId, oldTime);
  
  NotificationScheduler.update(oldId, {
    id: generateReminderId(habitId, newTime),
    time: newTime
  });
}

/**
 * Генерация уникального ID для напоминания привычки
 * 
 * Формат: `habit-{habitId}-{time}`
 * 
 * @param habitId - ID привычки
 * @param time - Время в формате HH:mm
 * @returns Уникальный ID
 */
function generateReminderId(habitId: string, time: string): string {
  return `habit-${habitId}-${time}`;
}

/**
 * Проверка есть ли запланированные напоминания для привычки
 * 
 * @param habitId - ID привычки
 * @returns true если есть хотя бы одно напоминание
 */
export function hasScheduledReminders(habitId: string): boolean {
  const allReminders = NotificationScheduler.getAll();
  
  for (const reminders of allReminders.values()) {
    const hasReminder = reminders.some(
      r => r.type === 'habit' && r.data?.habitId === habitId
    );
    if (hasReminder) {
      return true;
    }
  }
  
  return false;
}

/**
 * Получение количества запланированных напоминаний для привычки
 * 
 * @param habitId - ID привычки
 * @returns Количество напоминаний
 */
export function getScheduledRemindersCount(habitId: string): number {
  const allReminders = NotificationScheduler.getAll();
  let count = 0;
  
  allReminders.forEach(reminders => {
    reminders.forEach(reminder => {
      if (reminder.type === 'habit' && reminder.data?.habitId === habitId) {
        count++;
      }
    });
  });
  
  return count;
}

/**
 * Объект планировщика уведомлений для привычек
 * 
 * Предоставляет упрощённый API для использования в компонентах.
 */
export const habitNotificationScheduler = {
  /**
   * Запланировать напоминания для привычки
   * @param habit - Привычка с напоминаниями
   * @param translate - Функция перевода
   */
  schedule: scheduleHabitReminders,
  
  /**
   * Отменить все напоминания для привычки
   * @param habitId - ID привычки
   */
  unschedule: unscheduleHabitReminders,
  
  /**
   * Проверить есть ли напоминания
   * @param habitId - ID привычки
   */
  hasReminders: hasScheduledReminders,
  
  /**
   * Получить количество напоминаний
   * @param habitId - ID привычки
   */
  getCount: getScheduledRemindersCount,
};
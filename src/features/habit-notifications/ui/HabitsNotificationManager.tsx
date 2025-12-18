/**
 * Менеджер уведомлений для модуля привычек
 * 
 * Специфичный для habits адаптер над централизованным NotificationScheduler.
 * Отвечает за планирование уведомлений на основе привычек.
 * 
 * ВАЖНО: Не занимается запросом разрешений - это задача features/notifications-permission
 * 
 * @module features/habit-notifications/ui
 * @created 22 ноября 2025 (мигрировано из /components/notifications/)
 * @updated 30 ноября 2025 - переименование из notifications в habit-notifications
 * @updated 30 ноября 2025 - удалена логика запроса разрешений (конфликт с баннером)
 */

import React, { useEffect } from 'react';
import type { Habit } from '@/entities/habit';
import { habitNotificationScheduler } from '../lib';

interface HabitsNotificationManagerProps {
  /** Список привычек для планирования уведомлений */
  habits: Habit[];
}

/**
 * Менеджер уведомлений для привычек
 * 
 * Использует NotificationScheduler через habitNotificationScheduler для:
 * - Планирования уведомлений для всех привычек
 * - Автоматической очистки при изменении списка привычек
 * 
 * Разделение ответственности:
 * - Запрос разрешений: features/notifications-permission (NotificationPermissionBanner)
 * - Планирование: features/habit-notifications (этот компонент)
 * 
 * @example
 * ```tsx
 * <HabitsNotificationManager habits={habits} />
 * ```
 */
export const HabitsNotificationManager: React.FC<HabitsNotificationManagerProps> = ({
  habits,
}) => {
  // Планирование уведомлений при изменении списка привычек
  useEffect(() => {
    // Отменяем все существующие уведомления для привычек
    habits.forEach(habit => {
      habitNotificationScheduler.unschedule(habit.id);
    });

    // Планируем уведомления для всех привычек
    habits.forEach(habit => {
      habitNotificationScheduler.schedule(habit);
    });

    // Cleanup при размонтировании
    return () => {
      habits.forEach(habit => {
        habitNotificationScheduler.unschedule(habit.id);
      });
    };
  }, [habits]);

  // Компонент не рендерит UI
  return null;
};

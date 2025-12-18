/**
 * Секция управления напоминаниями для ManageHabitsModal
 * 
 * Обёртка над ReminderList с адаптацией интерфейса для редактирования привычки.
 * Преобразует API "habitId + onUpdateReminders" в колбэки для отдельных действий.
 * 
 * @module features/habit-manage/ui/HabitRemindersSection
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React from 'react';
import { ReminderList } from '@/shared/ui/reminder-list';
import type { Reminder } from '@/entities/habit';

interface HabitRemindersSectionProps {
  habitId: string;
  reminders: Reminder[] | undefined;
  onUpdateReminders: (id: string, reminders: Reminder[]) => void;
}

export const HabitRemindersSection: React.FC<HabitRemindersSectionProps> = ({
  habitId,
  reminders,
  onUpdateReminders,
}) => {
  // Адаптируем интерфейс для ReminderList
  const handleToggleReminder = (reminderId: string) => {
    const newReminders = (reminders || []).map(r =>
      r.id === reminderId ? { ...r, enabled: !r.enabled } : r
    );
    onUpdateReminders(habitId, newReminders);
  };

  const handleUpdateReminderTime = (reminderId: string, newTime: string) => {
    const newReminders = (reminders || []).map(r =>
      r.id === reminderId ? { ...r, time: newTime } : r
    );
    onUpdateReminders(habitId, newReminders);
  };

  const handleDeleteReminder = (reminderId: string) => {
    const newReminders = (reminders || []).filter(r => r.id !== reminderId);
    onUpdateReminders(habitId, newReminders);
  };

  const handleAddReminder = () => {
    const newReminder: Reminder = {
      id: `reminder-${Date.now()}`,
      time: '09:00',
      enabled: true,
    };
    const currentReminders = reminders || [];
    onUpdateReminders(habitId, [...currentReminders, newReminder]);
  };

  return (
    <ReminderList
      reminders={reminders || []}
      onToggleReminder={handleToggleReminder}
      onUpdateReminderTime={handleUpdateReminderTime}
      onDeleteReminder={handleDeleteReminder}
      onAddReminder={handleAddReminder}
      className="mt-3 pb-3 border-b border-gray-100"
    />
  );
};

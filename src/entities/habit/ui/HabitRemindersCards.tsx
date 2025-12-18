/**
 * Напоминания в виде карточек (новый дизайн)
 * 
 * @description
 * Список напоминаний в виде карточек + inline добавление
 * 
 * @module entities/habit/ui/HabitRemindersCards
 * @created 8 декабря 2025
 */

import React from 'react';
import { useTranslation, TFunction } from 'react-i18next';
import { Bell, Trash2, Plus } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/shared/ui/modal';
import type { Reminder, FrequencyConfig } from '@/entities/habit';

interface HabitRemindersCardsProps {
  reminders: Reminder[];
  frequency?: FrequencyConfig;
  onAddReminder: () => void;
  onDeleteReminder: (id: string) => void;
  onUpdateReminderTime: (id: string, time: string) => void;
}

/**
 * Генерирует текст частоты напоминаний на основе конфигурации
 */
const getFrequencyText = (frequency: FrequencyConfig | undefined, t: TFunction, tCommon: TFunction): string => {
  if (!frequency) {
    return t('reminders.everyday') || 'Every day';
  }

  const { type, period, count, daysOfWeek } = frequency;

  switch (type) {
    case 'every_n_days':
      if (period === 1) {
        return t('reminders.everyday') || 'Every day';
      }
      return t('reminders.everyNDays', { n: period }) || `Every ${period} days`;

    case 'by_days_of_week':
      if (!daysOfWeek || daysOfWeek.length === 0) {
        return t('reminders.everyday') || 'Every day';
      }
      if (daysOfWeek.length === 7) {
        return t('reminders.everyday') || 'Every day';
      }
      // Названия дней недели (короткие) из common переводов
      const dayNames = [
        tCommon('weekdays.short.sunday') || 'Sun',
        tCommon('weekdays.short.monday') || 'Mon',
        tCommon('weekdays.short.tuesday') || 'Tue',
        tCommon('weekdays.short.wednesday') || 'Wed',
        tCommon('weekdays.short.thursday') || 'Thu',
        tCommon('weekdays.short.friday') || 'Fri',
        tCommon('weekdays.short.saturday') || 'Sat',
      ];
      return daysOfWeek.map(day => dayNames[day]).join(', ');

    case 'n_times_week':
      return t('reminders.nTimesWeek', { n: count }) || `${count} times a week`;

    case 'n_times_month':
      return t('reminders.nTimesMonth', { n: count }) || `${count} times a month`;

    default:
      return t('reminders.everyday') || 'Every day';
  }
};

export const HabitRemindersCards: React.FC<HabitRemindersCardsProps> = ({
  reminders,
  frequency,
  onAddReminder,
  onDeleteReminder,
  onUpdateReminderTime,
}) => {
  const { t } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  
  const frequencyText = getFrequencyText(frequency, t, tCommon);
  
  return (
    <div>
      <Modal.FieldTitle>
        {t('reminders.title') || 'Reminders'}
      </Modal.FieldTitle>
      
      {reminders.length > 0 && (
        <div className="mt-2 space-y-2">
          {reminders.map((r, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 p-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)] group h-[48px]"
            >
              <Bell className="w-3.5 h-3.5 text-[var(--accent-secondary-indigo)]" />
              <div className="w-[45px]">
                <Input 
                  type="time"
                  variant="borderless"
                  value={r.time}
                  onChange={(e) => onUpdateReminderTime(r.id, e.target.value)}
                  className="text-[var(--text-primary)] text-sm font-medium p-0 h-auto cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                />
              </div>
              <span className="text-[var(--text-tertiary)] text-xs">
                {frequencyText}
              </span>
              <button 
                onClick={() => onDeleteReminder(r.id)} 
                className="ml-auto text-[var(--text-tertiary)] hover:text-[var(--status-error)] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        variant="outline" 
        className="mt-2 w-full border-dashed border-[var(--border-tertiary)] bg-transparent text-[var(--text-tertiary)] hover:text-[var(--accent-secondary-indigo)] rounded-md" 
        onClick={onAddReminder}
      >
        <Plus className="w-3.5 h-3.5 mr-2" /> {t('reminders.add') || 'Add Reminder'}
      </Button>
    </div>
  );
};
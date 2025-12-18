/**
 * Универсальный компонент списка напоминаний
 * 
 * Используется в различных модулях приложения (habits, tasks, finance и т.д.)
 * для единообразного управления напоминаниями.
 * 
 * Функциональность:
 * - Добавление/удаление напоминаний
 * - Включение/выключение каждого напоминания
 * - Настройка времени каждого напоминания
 * 
 * @module shared/ui/reminder-list
 * Дата создания: 19 ноября 2024
 * Последнее обновление: 18 декабря 2025 - удалены неиспользуемые переменные enabledReminders и enabledCount
 */

import { useTranslation } from 'react-i18next';
import { Bell, BellOff, XIcon, Plus } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ReminderItem } from './types';

interface ReminderListProps {
  /** Список напоминаний */
  reminders: ReminderItem[];
  
  /** Колбэк переключения включения напоминания */
  onToggleReminder: (id: string) => void;
  
  /** Колбэк изменения времени напоминания */
  onUpdateReminderTime: (id: string, time: string) => void;
  
  /** Колбэк удаления напоминания */
  onDeleteReminder: (id: string) => void;
  
  /** Колбэк добавления нового напоминания */
  onAddReminder: () => void;
  
  /** Дополнительные CSS классы для контейнера */
  className?: string;
}

/**
 * Универсальный компонент списка напоминаний
 * 
 * Используется в AddHabitModal, ManageHabitsModal и других модулях
 * для единообразного управления напоминаниями.
 */
export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  onToggleReminder,
  onUpdateReminderTime,
  onDeleteReminder,
  onAddReminder,
  className = '',
}) => {
  const { t } = useTranslation(['habits', 'common', 'ui']);

  return (
    <div className={className}>
      <span className="text-xs text-text-secondary font-medium mb-[9px] block">{t('habits:reminders.title')}</span>
      <div className="space-y-2">
        {/* Существующие напоминания */}
        {reminders.map((reminder) => (
          <div key={reminder.id} className="flex items-center gap-2">
            {/* Кнопка переключения */}
            <Button
              onClick={() => onToggleReminder(reminder.id)}
              variant={reminder.enabled ? 'default' : 'outline'}
              size="icon"
              className={reminder.enabled ? '' : 'hover:border-border-focus'}
              title={reminder.enabled ? t('ui:disableReminder') : t('ui:enableReminder')}
              aria-label={reminder.enabled ? t('ui:disableReminder') : t('ui:enableReminder')}
            >
              {reminder.enabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </Button>

            {/* Поле ввода времени */}
            <Input
              id={`reminder-time-${reminder.id}`}
              type="time"
              value={reminder.time}
              onChange={(e) => onUpdateReminderTime(reminder.id, e.target.value)}
              className="flex-1"
              aria-label={t('ui:reminderTime')}
            />

            {/* Кнопка удаления */}
            <Button
              onClick={() => onDeleteReminder(reminder.id)}
              variant="ghost"
              size="icon"
              className="text-text-tertiary hover:text-destructive"
              title={t('ui:deleteReminder')}
              aria-label={t('ui:deleteReminder')}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {/* Кнопка добавления напоминания */}
        <Button
          onClick={onAddReminder}
          variant="outline"
          className="w-full border-dashed text-text-secondary hover:text-text-primary text-xs"
        >
          <Plus className="w-3 h-3" />
          <span>{t('habits:reminders.addReminder')}</span>
        </Button>
      </div>
    </div>
  );
};
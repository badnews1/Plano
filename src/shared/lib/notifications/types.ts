/**
 * Типы для централизованного планировщика уведомлений
 */

/**
 * Тип уведомления (модуль-источник)
 */
export type ReminderType = 'habit' | 'task' | 'finance' | 'event' | 'other';

/**
 * Базовый интерфейс напоминания для регистрации в планировщике
 */
export interface ScheduledReminder {
  /** Уникальный ID напоминания (формат: `{type}-{entityId}-{time}`) */
  id: string;
  
  /** Тип напоминания (модуль-источник) */
  type: ReminderType;
  
  /** Время напоминания в формате "HH:mm" (например, "09:00") */
  time: string;
  
  /** Заголовок уведомления */
  title: string;
  
  /** Текст уведомления */
  body: string;
  
  /** Тег для группировки уведомлений */
  tag?: string;
  
  /** Произвольные данные для обработки при клике на уведомление */
  data?: Record<string, unknown>;
  
  /** Требует ли уведомление взаимодействия пользователя */
  requiresInteraction?: boolean;
  
  /** Иконка для уведомления (опционально) */
  icon?: string;
  
  /** Приоритет уведомления (для будущей сортировки) */
  priority?: 'low' | 'normal' | 'high';
  
  /** Функция-фильтр для проверки нужно ли показывать уведомление (опционально) */
  shouldShow?: () => boolean;
}

/**
 * Конфигурация группировки уведомлений
 */
export interface NotificationGroupingConfig {
  /** Включена ли группировка */
  enabled: boolean;
  
  /** Минимальное количество уведомлений для группировки (по умолчанию: 2) */
  minCount?: number;
  
  /** Группировать по типу или показывать общий список */
  groupByType?: boolean;
}

/**
 * Статистика планировщика (для отладки)
 */
export interface SchedulerStats {
  /** Общее количество зарегистрированных напоминаний */
  totalReminders: number;
  
  /** Количество уникальных временных слотов */
  uniqueTimeSlots: number;
  
  /** Распределение по типам */
  byType: Record<ReminderType, number>;
  
  /** Максимальное количество напоминаний в одном слоте */
  maxRemindersInSlot: number;
}
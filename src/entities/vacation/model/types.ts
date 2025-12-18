/**
 * Типы для сущности "Период отдыха"
 */

import type { VacationIconKey } from '@/shared/constants';

/**
 * Период отдыха (каникулы)
 */
export interface VacationPeriod {
  /** Уникальный идентификатор */
  id: string;
  
  /** Причина отдыха (обязательное поле) */
  reason: string;
  
  /** Иконка периода отдыха */
  icon: VacationIconKey;
  
  /** Дата начала в формате YYYY-MM-DD */
  startDate: string;
  
  /** Дата окончания в формате YYYY-MM-DD */
  endDate: string;
  
  /** Применить ко всем привычкам */
  applyToAll: boolean;
  
  /** ID привычек (если applyToAll = false) */
  habitIds: string[];
  
  /** Дата создания */
  createdAt: string;
}

/**
 * Статус периода отдыха
 */
export type VacationPeriodStatus = 'active' | 'upcoming' | 'past';
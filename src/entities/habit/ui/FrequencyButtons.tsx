/**
 * Выбор типа частоты через кнопки (новый дизайн)
 * 
 * @description
 * 4 кнопки в grid для выбора типа частоты:
 * - Days (конкретные дни недели)
 * - Weekly (N раз в неделю)
 * - Monthly (N раз в месяц)
 * - Interval (каждые N дней)
 * 
 * @module entities/habit/ui/FrequencyButtons
 * @created 8 декабря 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { FrequencyType } from '@/entities/habit';

interface FrequencyButtonsProps {
  selectedFrequency: FrequencyType;
  onSelectFrequency: (type: FrequencyType) => void;
}

export const FrequencyButtons: React.FC<FrequencyButtonsProps> = ({
  selectedFrequency,
  onSelectFrequency,
}) => {
  const { t } = useTranslation('habits');
  
  const frequencies = [
    { id: 'by_days_of_week' as FrequencyType, label: t('frequency.days') || 'Days' },
    { id: 'n_times_week' as FrequencyType, label: t('frequency.weekly') || 'Weekly' },
    { id: 'n_times_month' as FrequencyType, label: t('frequency.monthly') || 'Monthly' },
    { id: 'every_n_days' as FrequencyType, label: t('frequency.interval') || 'Interval' },
  ];
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {frequencies.map(f => (
        <button
          key={f.id}
          type="button"
          onClick={() => onSelectFrequency(f.id)}
          className={`flex-1 min-w-[100px] h-[48px] flex flex-col items-center justify-center gap-1 rounded-md border transition-colors text-sm cursor-pointer ${
            selectedFrequency === f.id 
              ? 'bg-[var(--accent-muted-indigo)] border-[var(--ring)] text-[var(--text-primary)]' 
              : 'bg-[var(--bg-tertiary)] border-[var(--border-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};
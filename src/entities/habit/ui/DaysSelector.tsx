/**
 * Селектор дней недели (новый дизайн)
 * 
 * @description
 * Кнопки для выбора дней недели + presets (Weekdays, Weekend, Every day)
 * 
 * @module entities/habit/ui/DaysSelector
 * @created 8 декабря 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Toggle } from '@/components/ui/toggle';

interface DaysSelectorProps {
  selectedDays: string[];
  onSelectDays: (days: string[]) => void;
  disabled?: boolean;
}

export const DaysSelector: React.FC<DaysSelectorProps> = ({
  selectedDays,
  onSelectDays,
  disabled = false,
}) => {
  const { t } = useTranslation(['habits', 'common']);
  
  // Ключи для бизнес-логики (неизменны)
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  
  // Маппинг для получения локализованных названий
  const getDayLabel = (day: string): string => {
    const dayMap: Record<string, string> = {
      MO: t('common:weekdays.shortest.monday'),
      TU: t('common:weekdays.shortest.tuesday'),
      WE: t('common:weekdays.shortest.wednesday'),
      TH: t('common:weekdays.shortest.thursday'),
      FR: t('common:weekdays.shortest.friday'),
      SA: t('common:weekdays.shortest.saturday'),
      SU: t('common:weekdays.shortest.sunday'),
    };
    return dayMap[day] || day;
  };
  
  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onSelectDays(selectedDays.filter(d => d !== day));
    } else {
      onSelectDays([...selectedDays, day]);
    }
  };
  
  return (
    <div>
      <div className="flex gap-1.5">
        {days.map(day => (
          <Toggle
            key={day}
            pressed={selectedDays.includes(day)}
            onPressedChange={() => handleToggleDay(day)}
            disabled={disabled}
            className={`flex-1 py-2.5 text-xs transition-all cursor-pointer ${
              selectedDays.includes(day) 
                ? 'bg-[var(--accent-primary-indigo)] text-[var(--primary-foreground)]' 
                : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            {getDayLabel(day)}
          </Toggle>
        ))}
      </div>
      
      <div className="mt-2 flex gap-3">
        <button 
          onClick={() => onSelectDays(['MO', 'TU', 'WE', 'TH', 'FR'])} 
          className="text-xs text-[var(--accent-secondary-indigo)] hover:text-[var(--accent-secondary-indigo)] transition-colors cursor-pointer"
        >
          {t('frequency.weekdays') || 'Weekdays'}
        </button>
        <button 
          onClick={() => onSelectDays(['SA', 'SU'])} 
          className="text-xs text-[var(--accent-secondary-indigo)] hover:text-[var(--accent-secondary-indigo)] transition-colors cursor-pointer"
        >
          {t('frequency.weekend') || 'Weekend'}
        </button>
        <button 
          onClick={() => onSelectDays(days)} 
          className="text-xs text-[var(--accent-secondary-indigo)] hover:text-[var(--accent-secondary-indigo)] transition-colors cursor-pointer"
        >
          {t('frequency.everyday') || 'Every day'}
        </button>
      </div>
    </div>
  );
};
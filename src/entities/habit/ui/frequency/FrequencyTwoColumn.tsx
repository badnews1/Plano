/**
 * Компонент выбора частоты с двухколоночной структурой
 * 
 * Слева: выбор типа частоты через Select
 * Справа: параметры в зависимости от выбранного типа
 * 
 * @module entities/habit/ui/frequency
 * @created 30 ноября 2025
 * @migrated 30 ноября 2025 - перенос из features/frequency в entities/habit
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Input } from '@/components/ui/input';
import type { FrequencyType, FrequencyConfig } from '../../model/types';
import { declineTimesPerWeek, declineTimesPerMonth, declineDays } from '@/shared/lib/text';

interface FrequencyTwoColumnProps {
  /** Текущая конфигурация частоты */
  frequency: FrequencyConfig;
  /** Колбэк изменения конфигурации */
  onFrequencyChange: (config: FrequencyConfig) => void;
}

export const FrequencyTwoColumn: React.FC<FrequencyTwoColumnProps> = ({
  frequency,
  onFrequencyChange,
}) => {
  const { t, i18n } = useTranslation('habits');
  const currentLanguage = i18n.language;
  
  // Локальные значения для input полей
  const [localCount, setLocalCount] = useState<string>(frequency.count.toString());
  const [localPeriod, setLocalPeriod] = useState<string>(frequency.period.toString());

  // Синхронизируем локальные значения с пропсами
  useEffect(() => {
    setLocalCount(frequency.count.toString());
  }, [frequency.count]);

  useEffect(() => {
    setLocalPeriod(frequency.period.toString());
  }, [frequency.period]);

  // ==================== HANDLERS ====================
  
  const handleTypeChange = (value: string) => {
    const newType = value as FrequencyType;
    
    // При смене типа устанавливаем дефолтные значения
    let newConfig: FrequencyConfig;
    
    if (newType === 'n_times_week') {
      newConfig = {
        type: newType,
        count: 5,
        period: 1,
        daysOfWeek: [],
      };
      setLocalCount('5');
    } else if (newType === 'n_times_month') {
      newConfig = {
        type: newType,
        count: 12,
        period: 1,
        daysOfWeek: [],
      };
      setLocalCount('12');
    } else if (newType === 'every_n_days') {
      newConfig = {
        type: newType,
        count: 1,
        period: 2,
        daysOfWeek: [],
      };
      setLocalPeriod('2');
    } else { // by_days_of_week
      newConfig = {
        type: newType,
        count: 1,
        period: 1,
        daysOfWeek: [1, 3, 5], // Пн=1, Ср=3, Пт=5 (JS Date индексы)
      };
    }
    
    onFrequencyChange(newConfig);
  };

  const handleCountChange = (value: string) => {
    setLocalCount(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 31) {
      onFrequencyChange({
        ...frequency,
        count: num,
      });
    }
  };

  const handleCountBlur = () => {
    const num = parseInt(localCount);
    if (isNaN(num) || num < 1) {
      const defaultValue = frequency.type === 'n_times_week' ? 5 : 12;
      setLocalCount(defaultValue.toString());
      onFrequencyChange({
        ...frequency,
        count: defaultValue,
      });
    }
  };

  const handlePeriodChange = (value: string) => {
    setLocalPeriod(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 1 && num <= 365) {
      onFrequencyChange({
        ...frequency,
        period: num,
      });
    }
  };

  const handlePeriodBlur = () => {
    const num = parseInt(localPeriod);
    if (isNaN(num) || num < 1) {
      setLocalPeriod('2');
      onFrequencyChange({
        ...frequency,
        period: 2,
      });
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    const newDays = frequency.daysOfWeek.includes(dayIndex)
      ? frequency.daysOfWeek.filter(d => d !== dayIndex)
      : [...frequency.daysOfWeek, dayIndex].sort((a, b) => a - b);
    
    onFrequencyChange({
      ...frequency,
      daysOfWeek: newDays,
    });
  };

  // ==================== RENDER HELPERS ====================

  const renderParameters = () => {
    switch (frequency.type) {
      case 'by_days_of_week':
        const weekdaysArray = [
          t('common:weekdays.shortest.monday'),
          t('common:weekdays.shortest.tuesday'),
          t('common:weekdays.shortest.wednesday'),
          t('common:weekdays.shortest.thursday'),
          t('common:weekdays.shortest.friday'),
          t('common:weekdays.shortest.saturday'),
          t('common:weekdays.shortest.sunday'),
        ];
        
        return (
          <div className="grid grid-cols-7 gap-2 [&_button]:uppercase">
            {weekdaysArray.map((day, uiIndex) => {
              // Конвертируем UI индекс (0=Пн) в JS Date индекс (0=Вс, 1=Пн, ...)
              // uiIndex: 0=Пн, 1=Вт, 2=Ср, 3=Чт, 4=Пт, 5=Сб, 6=Вс
              // jsIndex: 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб, 0=Вс
              const jsIndex = uiIndex === 6 ? 0 : uiIndex + 1;
              const isSelected = frequency.daysOfWeek.includes(jsIndex);
              return (
                <Toggle
                  key={uiIndex}
                  pressed={isSelected}
                  onPressedChange={() => handleDayToggle(jsIndex)}
                  variant="day"
                  size="day"
                  aria-label={`${day}`}
                >
                  {day}
                </Toggle>
              );
            })}
          </div>
        );

      case 'n_times_week':
        return (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={7}
              value={localCount}
              onChange={(e) => handleCountChange(e.target.value)}
              onBlur={handleCountBlur}
              className="w-20"
            />
            <span className="text-sm text-text-primary">
              {declineTimesPerWeek(parseInt(localCount) || 0, t, currentLanguage)}
            </span>
          </div>
        );

      case 'n_times_month':
        return (
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={1}
              max={31}
              value={localCount}
              onChange={(e) => handleCountChange(e.target.value)}
              onBlur={handleCountBlur}
              className="w-20"
            />
            <span className="text-sm text-text-primary">
              {declineTimesPerMonth(parseInt(localCount) || 0, t, currentLanguage)}
            </span>
          </div>
        );

      case 'every_n_days':
        return (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-primary">{t('frequencyConfig.every')}</span>
            <Input
              type="number"
              min={1}
              max={365}
              value={localPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              onBlur={handlePeriodBlur}
              className="w-20"
            />
            <span className="text-sm text-text-primary">
              {declineDays(parseInt(localPeriod) || 0, t, currentLanguage)}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-5">
      {/* Левая колонка: выбор типа */}
      <div className="space-y-2">
        <span className="text-xs text-text-secondary font-medium mb-[9px] block">
          {t('frequencyConfig.title')}
        </span>
        <Select value={frequency.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="by_days_of_week">{t('frequencyConfig.byDays')}</SelectItem>
            <SelectItem value="n_times_week">{t('frequencyConfig.perWeek')}</SelectItem>
            <SelectItem value="n_times_month">{t('frequencyConfig.perMonth')}</SelectItem>
            <SelectItem value="every_n_days">{t('frequencyConfig.interval')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Правая колонка: параметры */}
      <div className="flex items-start min-h-[80px] pt-[25px] pr-[0px] pb-[0px] pl-[0px]">
        {renderParameters()}
      </div>
    </div>
  );
};
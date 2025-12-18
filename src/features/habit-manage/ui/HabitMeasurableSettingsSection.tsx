/**
 * Секция настроек измеримой привычки
 * 
 * Включает выбор единицы измерения, типа цели и значения цели.
 * Используется в HabitItem для редактирования измеримых привычек.
 * 
 * @module features/habit-manage/ui/HabitMeasurableSettingsSection
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UnitPicker } from '@/shared/ui/unit-picker';
import { useHabitUnitGroups, useLocalizedUnit, TargetTypePicker } from '@/entities/habit';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HabitMeasurableSettingsSectionProps {
  habitId: string;
  unit: string;
  targetValue: number | undefined;
  targetType: 'min' | 'max';
  onUpdateMeasurableSettings: (
    id: string,
    settings: { unit?: string; targetValue?: number; targetType?: 'min' | 'max' }
  ) => void;
}

export const HabitMeasurableSettingsSection: React.FC<HabitMeasurableSettingsSectionProps> = ({
  habitId,
  unit,
  targetValue,
  targetType,
  onUpdateMeasurableSettings,
}) => {
  const { t } = useTranslation('habits');
  const unitGroups = useHabitUnitGroups();
  const localizedUnit = useLocalizedUnit(unit);
  
  const [editedUnit, setEditedUnit] = useState(unit);
  const [editedTargetValue, setEditedTargetValue] = useState(targetValue?.toString() || '');
  const [editedTargetType, setEditedTargetType] = useState<'min' | 'max'>(targetType);

  const handleUnitChange = (newUnit: string) => {
    setEditedUnit(newUnit);
    onUpdateMeasurableSettings(habitId, {
      unit: newUnit,
      targetValue: editedTargetValue ? parseFloat(editedTargetValue) : undefined,
      targetType: editedTargetType,
    });
  };

  const handleTargetTypeChange = (newTargetType: 'min' | 'max') => {
    setEditedTargetType(newTargetType);
    onUpdateMeasurableSettings(habitId, {
      unit: editedUnit,
      targetValue: editedTargetValue ? parseFloat(editedTargetValue) : undefined,
      targetType: newTargetType,
    });
  };

  const handleTargetValueBlur = () => {
    onUpdateMeasurableSettings(habitId, {
      unit: editedUnit,
      targetValue: editedTargetValue ? parseFloat(editedTargetValue) : undefined,
      targetType: editedTargetType,
    });
  };

  return (
    <div className="mt-3 pb-3 border-b border-gray-100 space-y-3">
      {/* Unit Picker */}
      <div>
        <Label>{t('measurableSettings.unit')}</Label>
        <UnitPicker value={localizedUnit} onChange={handleUnitChange} groups={unitGroups} />
      </div>

      {/* Target Type and Target Value */}
      <div className="grid grid-cols-2 gap-3">
        {/* Target Type Picker */}
        <div>
          <Label>{t('measurableSettings.targetType')}</Label>
          <TargetTypePicker
            selectedTargetType={editedTargetType}
            onSelectTargetType={handleTargetTypeChange}
          />
        </div>

        {/* Target Value Input */}
        <div>
          <Label htmlFor={`target-value-${habitId}`}>{t('measurableSettings.target')}</Label>
          <Input
            id={`target-value-${habitId}`}
            type="text"
            inputMode="decimal"
            value={editedTargetValue}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only numbers and decimal point
              if (value === '' || /^\d*\.?\d*$/.test(value)) {
                setEditedTargetValue(value);
              }
            }}
            onBlur={handleTargetValueBlur}
            placeholder={t('measurableSettings.placeholder')}
          />
        </div>
      </div>
    </div>
  );
};
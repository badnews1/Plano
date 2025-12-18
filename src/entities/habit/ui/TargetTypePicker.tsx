/**
 * Select picker для выбора типа цели
 * 
 * Используется в измеримых привычках для определения, является ли цель
 * минимальным или максимальным значением (не меньше / не больше).
 * 
 * Использует shadcn/ui Select компонент.
 * 
 * @module entities/habit/ui/TargetTypePicker
 * @created 30 ноября 2025 - миграция на FSD
 * @migrated 30 ноября 2025 - перенос из features/habits (FSD fix)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TargetTypePickerProps {
  selectedTargetType: 'min' | 'max';
  onSelectTargetType: (type: 'min' | 'max') => void;
  /** Опциональное внешнее управление состоянием */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Отключить выбор (для режима просмотра) */
  disabled?: boolean;
}

export const TargetTypePicker: React.FC<TargetTypePickerProps> = ({
  selectedTargetType,
  onSelectTargetType,
  isOpen,
  onOpenChange,
  disabled = false,
}) => {
  const { t } = useTranslation('habits');
  
  return (
    <Select
      value={selectedTargetType}
      onValueChange={onSelectTargetType}
      open={isOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="min">{t('targetType.min')}</SelectItem>
        <SelectItem value="max">{t('targetType.max')}</SelectItem>
      </SelectContent>
    </Select>
  );
};
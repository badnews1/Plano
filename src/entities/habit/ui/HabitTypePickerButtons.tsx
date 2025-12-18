/**
 * Выбор типа привычки через кнопки (новый дизайн)
 * 
 * @description
 * Две большие кнопки-карточки для выбора между:
 * - Binary (checkbox) - простая отметка
 * - Measurable (number) - ввод числа
 * 
 * В режиме readOnly показывается только одна кнопка - выбранный тип.
 * Используется в модалке редактирования для отображения неизменяемого типа.
 * 
 * Дизайн: кнопки в grid 2 колонки (или 1 в режиме readOnly), с иконкой слева и текстом справа
 * 
 * @module entities/habit/ui/HabitTypePickerButtons
 * @created 8 декабря 2025
 * @updated 10 декабря 2025 - добавлен режим readOnly для отображения только выбранного типа
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Hash } from '@/shared/assets/icons/system';
import { HabitType } from '@/entities/habit';

interface HabitTypePickerButtonsProps {
  selectedType: HabitType;
  onSelectType: (type: HabitType) => void;
  /** Отключить изменение типа (для режима редактирования) */
  disabled?: boolean;
  /** Показывать только выбранный тип (для режима редактирования) */
  readOnly?: boolean;
}

export const HabitTypePickerButtons: React.FC<HabitTypePickerButtonsProps> = ({
  selectedType,
  onSelectType,
  disabled = false,
  readOnly = false,
}) => {
  const { t } = useTranslation('habits');
  
  const types = [
    { 
      id: 'binary' as HabitType, 
      label: 'Checkbox',
      desc: 'Done / Not done',
      icon: <Check className="w-4 h-4" /> 
    },
    { 
      id: 'measurable' as HabitType, 
      label: 'Number',
      desc: 'Track quantity',
      icon: <Hash className="w-4 h-4" /> 
    },
  ];
  
  // В режиме readOnly показываем только выбранный тип
  const displayTypes = readOnly ? types.filter(type => type.id === selectedType) : types;
  
  return (
    <div className={`grid ${readOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
      {displayTypes.map(type => (
        <button
          key={type.id}
          type="button"
          onClick={() => !disabled && !readOnly && onSelectType(type.id)}
          className={`flex-1 flex flex-row items-center gap-3 p-4 rounded-md transition-all ${
            selectedType === type.id 
              ? 'bg-accent-muted border-ring' 
              : 'bg-bg-tertiary border-border-tertiary hover:bg-bg-tertiary'
          } border ${(disabled && !readOnly) ? 'opacity-50 cursor-not-allowed' : readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
            selectedType === type.id 
              ? 'bg-accent-primary-indigo text-primary-foreground' 
              : 'bg-switch-background text-text-tertiary'
          }`}>
            {type.icon}
          </div>
          <div className="flex flex-col items-start">
            <div className={`${selectedType === type.id ? 'text-text-primary' : 'text-text-secondary'}`}>
              {type.label}
            </div>
            <div className="text-xs text-text-tertiary">{type.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
};
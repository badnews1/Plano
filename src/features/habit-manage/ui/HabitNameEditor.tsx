/**
 * Inline редактор названия привычки
 * 
 * Controlled компонент для редактирования названия привычки.
 * State управляется родительским компонентом (HabitItem).
 * 
 * @module features/habit-manage/ui/HabitNameEditor
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { Input } from '@/components/ui/input';

interface HabitNameEditorProps {
  name: string;
  isEditing: boolean;
  editedName: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onStartEditing: () => void;
  onStopEditing: () => void;
  onNameChange: (name: string) => void;
  onSave: (name: string) => void;
}

export const HabitNameEditor: React.FC<HabitNameEditorProps> = ({
  name,
  isEditing,
  editedName,
  inputRef,
  onStartEditing,
  onStopEditing,
  onNameChange,
  onSave,
}) => {
  const { t } = useTranslation('habits');
  
  const handleSave = () => {
    if (editedName.trim()) {
      onSave(editedName.trim());
    } else {
      onNameChange(name);
      onStopEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onNameChange(name);
      onStopEditing();
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="text"
        value={editedName}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        maxLength={TEXT_LENGTH_LIMITS.habitName.max}
        showCharCount
      />
    );
  }

  return (
    <div
      onClick={onStartEditing}
      className="text-gray-900 cursor-pointer hover:text-gray-600 transition-colors truncate"
      title={t('habitItem.clickToEdit')}
    >
      {name || t('habitItem.untitled')}
    </div>
  );
};
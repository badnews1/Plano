/**
 * Модальное окно создания привычки с табами (обёртка)
 * 
 * @description
 * Тонкая обёртка над базовым компонентом HabitFormModalTabs из entities слоя.
 * Предоставляет интерфейс для создания новой привычки.
 * 
 * @module features/habit-create/ui/AddHabitModalTabs
 * @created 8 декабря 2025
 * @updated 10 декабря 2025 - рефакторинг на базовый компонент из entities
 */

import React from 'react';
import { HabitFormModalTabs } from '@/entities/habit';
import { AddHabitModalProps } from '@/features/habit-create/model/types';

export const AddHabitModalTabs: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  daysInMonth,
  isEditing = false,
  initialData,
}) => {
  return (
    <HabitFormModalTabs
      mode="create"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onAdd}
      daysInMonth={daysInMonth}
      initialData={initialData}
      disableTypeChange={false}
      showArchiveDelete={false}
    />
  );
};

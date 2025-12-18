/**
 * Кнопка фильтра привычек для хеддера
 * 
 * @description
 * Компонент кнопки с иконкой фильтра, которая открывает dropdown фильтров.
 * Используется в хеддере главной страницы трекера.
 * 
 * @module features/habit-filters/ui/HabitsFilterButton
 * @created 5 декабря 2025
 * @updated 5 декабря 2025 - упрощена структура для предотвращения проблем с layout
 */

import React, { useState } from 'react';
import { useHabitsStore, useShallow } from '@/app/store';
import { HabitsFilterDropdown } from './HabitsFilterDropdown';

export function HabitsFilterButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Получаем привычки и теги из store
  const { habits, tags } = useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
      tags: state.tags,
    }))
  );

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <HabitsFilterDropdown
      habits={habits}
      tags={tags}
      isOpen={isOpen}
      onToggleOpen={handleToggle}
    />
  );
}
/**
 * Секция настройки частоты привычки
 * 
 * Отображает двухколоночный интерфейс редактирования частоты.
 * Используется в HabitItem для управления частотой выполнения.
 * 
 * @module features/habit-manage/ui/HabitFrequencySection
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 30 ноября 2025 - переход на двухколоночный интерфейс частоты
 */

import React from 'react';
import type { Habit } from '@/entities/habit';
import { FrequencyTwoColumn } from '@/entities/habit';

interface HabitFrequencySectionProps {
  habitId: string;
  frequency: Habit['frequency'];
  onUpdateFrequency: (id: string, frequency: Habit['frequency']) => void;
}

export const HabitFrequencySection: React.FC<HabitFrequencySectionProps> = ({
  habitId,
  frequency,
  onUpdateFrequency,
}) => {
  const handleFrequencyChange = (newFrequency: Habit['frequency']) => {
    onUpdateFrequency(habitId, newFrequency);
  };

  return (
    <div className="mt-3 pb-3 border-b border-gray-100">
      <FrequencyTwoColumn
        frequency={frequency}
        onFrequencyChange={handleFrequencyChange}
      />
    </div>
  );
};

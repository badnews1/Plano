import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit } from '../model/types';
import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';
import { useHabitsStore } from '@/app/store';

/**
 * Props для компонента HabitNameCell
 */
interface HabitNameCellProps {
  /** Данные привычки */
  habit: Habit;
}

/**
 * Ячейка с названием привычки для календаря
 * 
 * Отображает:
 * - Иконку (квадратная 32x32)
 * - Название с truncate
 * - Фиксированная высота 32px (h-8)
 * 
 * ⚠️ FSD: Ширина управляется родителем, компонент занимает 100% доступной ширины
 * ⚡ ОПТИМИЗАЦИЯ: мемоизирован с React.memo
 * 
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (role, tabIndex, keyboard navigation)
 */
export const HabitNameCell = React.memo(function HabitNameCell({ habit }: HabitNameCellProps) {
  const { t } = useTranslation('habits');
  const openEditHabitModal = useHabitsStore(state => state.openEditHabitModal);
  
  // ✅ Fix: noUncheckedIndexedAccess - проверяем что иконка существует в карте
  const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;

  // Обработчик клавиатурных событий для accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEditHabitModal(habit.id);
    }
  };

  // Обработчик клика
  const handleClick = () => {
    openEditHabitModal(habit.id);
  };

  const habitName = habit.name || t('habit.noName');

  return (
    <div 
      className="h-8 pl-2 flex-shrink-0 cursor-pointer transition-colors rounded flex items-center gap-2"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      title={t('habitItem.edit')}
      aria-label={`${habitName}, ${t('habitItem.edit')}`}
    >
      <IconComponent className="w-4 h-4 text-text-primary flex-shrink-0" aria-hidden="true" />
      <span className="text-xs truncate text-text-primary flex-1 min-w-0">
        {habitName}
      </span>
    </div>
  );
});
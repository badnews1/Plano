/**
 * Хук для операций с привычками (CRUD)
 * 
 * Предоставляет API для работы с привычками: создание, обновление,
 * удаление, переключение выполнения, перемещение.
 * 
 * @module entities/habit/model/hooks/useHabitActions
 * @migrated 30 ноября 2025 - перенесено из features/habits в entities
 */

import { useCallback } from 'react';
import { useHabitsStore, useShallow } from '@/app/store';
import type { Habit, HabitData } from '../types';

/**
 * Возвращаемый объект хука с операциями над привычками
 */
interface HabitActions {
  /** Добавить новую привычку */
  addHabit: (habitData: HabitData) => void;
  /** Удалить привычку */
  deleteHabit: (habitId: string) => void;
  /** Обновить данные привычки */
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  /** Переключить выполнение привычки (бинарная) или открыть модалку ввода (измеримая) */
  toggleCompletion: (habitId: string, date: string) => void;
  /** Переместить привычку в списке (drag-n-drop) */
  moveHabit: (dragIndex: number, hoverIndex: number) => void;
}

/**
 * Хук для управления операциями с привычками
 * 
 * @returns Объект с функциями операций над привычками
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { addHabit, deleteHabit, toggleCompletion } = useHabitActions();
 *   
 *   const handleAdd = () => {
 *     addHabit({
 *       name: 'Медитация',
 *       type: 'binary',
 *       frequency: { type: 'by_days_of_week', daysOfWeek: [0,1,2,3,4,5,6] },
 *       // ...
 *     });
 *   };
 *   
 *   return <button onClick={handleAdd}>Добавить</button>;
 * }
 * ```
 */
export function useHabitActions(): HabitActions {
  // Получаем actions из store с оптимизацией через useShallow
  const actions = useHabitsStore(
    useShallow((state) => ({
      addHabit: state.addHabit,
      deleteHabit: state.deleteHabit,
      updateHabit: state.updateHabit,
      toggleCompletion: state.toggleCompletion,
      moveHabit: state.moveHabit,
    }))
  );

  // Оборачиваем в useCallback для стабильности ссылок
  const addHabit = useCallback(
    (habitData: HabitData) => actions.addHabit(habitData),
    [actions.addHabit]
  );

  const deleteHabit = useCallback(
    (habitId: string) => actions.deleteHabit(habitId),
    [actions.deleteHabit]
  );

  const updateHabit = useCallback(
    (habitId: string, updates: Partial<Habit>) => actions.updateHabit(habitId, updates),
    [actions.updateHabit]
  );

  const toggleCompletion = useCallback(
    (habitId: string, date: string) => actions.toggleCompletion(habitId, date),
    [actions.toggleCompletion]
  );

  const moveHabit = useCallback(
    (dragIndex: number, hoverIndex: number) => actions.moveHabit(dragIndex, hoverIndex),
    [actions.moveHabit]
  );

  return {
    addHabit,
    deleteHabit,
    updateHabit,
    toggleCompletion,
    moveHabit,
  };
}
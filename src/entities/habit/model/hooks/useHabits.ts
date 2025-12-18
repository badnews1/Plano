/**
 * Хук для доступа к состоянию привычек
 * 
 * Предоставляет оптимизированный доступ к глобальному состоянию привычек
 * из store с использованием useShallow для предотвращения лишних ререндеров.
 * 
 * @module entities/habit/model/hooks/useHabits
 * @migrated 30 ноября 2025 - перенесено из features/habits в entities
 */

import { useHabitsStore, useShallow } from '@/app/store';
import type { Habit } from '../types';

/**
 * Состояние привычек из store
 */
interface HabitsState {
  /** Список всех привычек */
  habits: Habit[];
}

/**
 * Хук для получения состояния привычек из store
 * 
 * Использует useShallow для оптимизации и предотвращения
 * лишних ререндеров при изменении других частей store.
 * 
 * @returns Объект с состоянием привычек
 * 
 * @example
 * ```tsx
 * function HabitsList() {
 *   const { habits } = useHabits();
 *   
 *   return (
 *     <div>
 *       {habits.map(habit => (
 *         <HabitItem 
 *           key={habit.id} 
 *           habit={habit}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useHabits(): HabitsState {
  return useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
    }))
  );
}
/**
 * Типы для feature habit-create
 * 
 * @description
 * Типы props и интерфейсов для модального окна добавления привычки
 * 
 * @module features/habit-create/model/types
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker/features/habits/types/modal.ts
 * @updated 30 ноября 2025 - переименование add-habit → habit-create
 */

import { Habit, HabitData } from '@/entities/habit';

/**
 * Props для компонента AddHabitModal
 * Используется для добавления новых привычек или редактирования существующих
 * 
 * @updated 22 ноября 2025 - убраны category props (управляются через store)
 * @updated 29 ноября 2025 - миграция на FSD
 */
export interface AddHabitModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;
  
  /** Callback для закрытия модального окна */
  onClose: () => void;
  
  /** Callback для добавления/обновления привычки */
  onAdd: (habitData: HabitData) => void;
  
  /** Количество дней в текущем месяце */
  daysInMonth: number;
  
  /** Режим редактирования */
  isEditing?: boolean;
  
  /** Начальные данные для режима редактирования */
  initialData?: Partial<Habit>;
}

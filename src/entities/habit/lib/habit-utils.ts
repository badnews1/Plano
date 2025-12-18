import type { Habit } from '../model/types';

/**
 * Проверяет, выполнена ли привычка на заданную дату
 * 
 * Для бинарных привычек: проверяет значение true
 * Для измеримых привычек: проверяет соответствие значения целевым критериям
 * 
 * @param habit - Привычка для проверки
 * @param dateStr - Дата в формате строки (YYYY-MM-DD)
 * @returns true если привычка выполнена, иначе false
 */
export function isHabitCompletedForDate(habit: Habit, dateStr: string): boolean {
  // ✅ Проверяем, что дата не раньше даты начала привычки
  const startDate = habit.startDate || habit.createdAt;
  if (dateStr < startDate) {
    return false;
  }
  
  const value = habit.completions?.[dateStr];
  
  // Если нет значения, привычка не выполнена
  if (value === undefined || value === null || value === false) {
    return false;
  }
  
  // Для binary типа - просто проверяем boolean
  if (habit.type === 'binary') {
    return value === true;
  }
  
  // Для measurable типа - проверяем числовое значение
  if (habit.type === 'measurable') {
    // Если значение true (старый формат) - считаем выполненным
    if (value === true) return true;
    
    // Если значение число - проверяем относительно цели
    if (typeof value === 'number') {
      const targetValue = habit.targetValue;
      const targetType = habit.targetType || 'min';
      
      // Если нет цели, считаем любое число выполнением
      if (targetValue === undefined || targetValue === null) {
        return value > 0;
      }
      
      // Проверяем соответствие цели
      if (targetType === 'min') {
        return value >= targetValue;
      } else { // max
        return value <= targetValue;
      }
    }
    
    return false;
  }
  
  return false;
}
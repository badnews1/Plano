/**
 * Barrel export для утилит работы с текстом
 */
export {
  // Склонение общих слов
  declineDays,
  declineTimes,
  declineHabits,
  declineReminders,
  
  // Форматирование с числом
  formatDays,
  formatTimes,
  formatHabits,
  
  // Специализированные функции для частоты
  declineTimesPerWeek,
  declineTimesPerMonth,
  
  // Единицы измерения
  declineUnit,
  
  // Форматирование чисел
  formatNumber,
} from './textUtils';
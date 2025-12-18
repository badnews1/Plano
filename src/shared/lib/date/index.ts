/**
 * Public API для модуля date utilities
 */

// Утилиты для работы с датами
export {
  getDaysInMonth,
  formatDate,
  isWeekend,
} from './dateUtils';

// Локализованные функции для отображения
export {
  getLocalizedDayName,
  getLocalizedMonthNameShort,
  getLocalizedMonthNameGenitive,
} from './i18n';
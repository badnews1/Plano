/**
 * I18n хелперы для работы с датами
 * 
 * Функции для получения локализованных названий дней недели и месяцев.
 * Все функции принимают параметр `t` (TFunction) для соблюдения FSD.
 */

import type { TFunction } from 'i18next';

/** Возвращает короткое название дня недели */
export const getLocalizedDayName = (date: Date, t: TFunction): string => {
  const dayIndex = date.getDay();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daysFallback = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const dayKey = days[dayIndex] ?? 'monday';
  const fallback = daysFallback[dayIndex] ?? 'Mon';
  
  return t(`common:weekdays.short.${dayKey}`, { defaultValue: fallback });
};

/** Возвращает короткое название месяца */
export const getLocalizedMonthNameShort = (month: number, t: TFunction): string => {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const monthsFallback = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const monthKey = months[month] ?? 'january';
  const fallback = monthsFallback[month] ?? 'Jan';
  
  return t(`common:months.short.${monthKey}`, { defaultValue: fallback });
};

/** Возвращает название месяца в родительном падеже (RU: "января", EN: "January") */
export const getLocalizedMonthNameGenitive = (month: number, t: TFunction): string => {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const monthsFallback = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const monthKey = months[month] ?? 'january';
  const fallback = monthsFallback[month] ?? 'January';
  
  return t(`common:months.genitive.${monthKey}`, { defaultValue: fallback });
};
/**
 * Утилиты для работы с датами
 * 
 * Для отображения дат пользователю используйте локализованные функции из './i18n.ts'
 */

/**
 * Возвращает массив дней для указанного месяца и года
 */
export const getDaysInMonth = (month: number, year: number) => {
  const days = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({ 
      date, 
      day 
    });
  }
  return days;
};

/**
 * Форматирует дату в строку формата YYYY-MM-DD
 * @param date - объект Date
 * @returns строка формата YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const datePart = date.toISOString().split('T')[0];
  return datePart ?? date.toISOString();
};


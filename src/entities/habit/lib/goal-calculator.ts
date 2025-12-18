/**
 * Расчёт целей привычек с учётом частоты и периодов отдыха
 * 
 * ПРАВИЛЬНАЯ ЛОГИКА (обновлено 6 декабря 2025):
 * 
 * ЧАСТОТА ≠ ЦЕЛЬ НА МЕСЯЦ!
 * Частота - это ПАТТЕРН выполнения, а не количество раз!
 * 
 * 1. every_day: каждый день минус отпуск
 * 2. every_n_days: генерируем даты выполнения, исключаем отпуск
 * 3. by_days_of_week: считаем конкретные дни недели минус отпуск
 * 4. n_times_week: min(частота, доступных_дней) ДЛЯ КАЖДОЙ НЕДЕЛИ
 * 5. n_times_month: min(частота, доступных_дней) для месяца
 * 
 * @module entities/habit/lib/goal-calculator
 * @created 6 декабря 2025
 * @updated 6 декабря 2025 - ПОЛНАЯ переработка логики
 * @updated 7 декабря 2025 - добавлена поддержка startDate
 */

import type { Habit } from '../model/types';
import type { VacationPeriod } from '@/entities/vacation';
import { isDateInVacation } from '@/entities/vacation';

/**
 * Рассчитывает скорректированную месячную цель с учётом периодов отдыха
 * 
 * @param habit - Привычка
 * @param monthDates - Массив дат месяца в формате YYYY-MM-DD
 * @param vacationPeriods - Периоды отдыха
 * @returns Скорректированная цель (количество дней для выполнения)
 */
export function getAdjustedMonthlyGoal(
  habit: Habit,
  monthDates: string[],
  vacationPeriods: VacationPeriod[]
): number {
  // ✅ Фильтруем даты по startDate - учитываем только дни ПОСЛЕ начала привычки
  const startDate = habit.startDate || habit.createdAt;
  const validMonthDates = monthDates.filter(date => date >= startDate);
  
  // Если нет валидных дат - цель = 0
  if (validMonthDates.length === 0) {
    return 0;
  }
  
  const frequency = habit.frequency;
  const daysInMonth = validMonthDates.length;

  // Если частота не задана - каждый день минус отпуск
  if (!frequency) {
    const vacationDays = validMonthDates.filter(date => 
      isDateInVacation(date, habit.id, vacationPeriods)
    ).length;
    return Math.max(0, daysInMonth - vacationDays);
  }

  switch (frequency.type) {
    case 'every_day': {
      // Каждый день - просто вычитаем дни отпуска
      const vacationDays = validMonthDates.filter(date => 
        isDateInVacation(date, habit.id, vacationPeriods)
      ).length;
      return Math.max(0, daysInMonth - vacationDays);
    }

    case 'every_n_days': {
      // Каждые N дней - генерируем даты выполнения, исключаем отпуск
      const period = frequency.period || 1;
      let targetDates = 0;
      
      // Генерируем даты: 1-й день, потом каждые N дней
      for (let i = 0; i < validMonthDates.length; i += period) {
        const dateStr = validMonthDates[i];
        // Если дата НЕ в отпуске - засчитываем
        if (!isDateInVacation(dateStr, habit.id, vacationPeriods)) {
          targetDates++;
        }
      }
      
      return targetDates;
    }

    case 'by_days_of_week': {
      // По дням недели - считаем только выбранные дни минус отпуск
      const selectedDays = frequency.daysOfWeek || [];
      if (selectedDays.length === 0) return 0;

      let totalDays = 0;
      validMonthDates.forEach(dateStr => {
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay(); // 0 = Вс, 1 = Пн, ..., 6 = Сб (JS Date формат)
        
        // selectedDays уже в JS Date формате (0=Вс, 1=Пн, ...), не нужна конвертация!
        // Если день недели выбран И не в отпуске
        if (selectedDays.includes(dayOfWeek) && 
            !isDateInVacation(dateStr, habit.id, vacationPeriods)) {
          totalDays++;
        }
      });
      
      return totalDays;
    }

    case 'n_times_week': {
      // N раз в неделю - считаем ПО НЕДЕЛЯМ!
      // Цель недели = min(частота, доступных_дней_в_неделе)
      const targetPerWeek = frequency.count || 7;
      
      // Группируем даты по неделям (понедельник-воскресенье)
      const weeks = groupDatesByWeek(validMonthDates);
      
      let totalGoal = 0;
      
      weeks.forEach(weekDates => {
        // Считаем сколько дней в отпуске в этой неделе
        const vacationDaysInWeek = weekDates.filter(date => 
          isDateInVacation(date, habit.id, vacationPeriods)
        ).length;
        
        // Доступных дней = всего дней недели в месяце - дни отпуска
        const daysInWeek = weekDates.length;
        const availableDays = daysInWeek - vacationDaysInWeek;
        
        // Цель недели = min(частота, доступных_дней)
        // Пример: 3 раза в неделю, неполная неделя СБ-ВС (2 дня), отпуск СБ
        // → availableDays = 2 - 1 = 1
        // → weekGoal = min(3, 1) = 1
        const weekGoal = Math.min(targetPerWeek, Math.max(0, availableDays));
        
        totalGoal += weekGoal;
      });
      
      return totalGoal;
    }

    case 'n_times_month': {
      // N раз в месяц - это АБСОЛЮТНОЕ число, НЕ масштабируется!
      // Цель = min(частота, доступных_дней)
      // 
      // Пример 1: 10 раз в месяц, 31 день, 16 дней отпуска
      // → availableDays = 15 → goal = min(10, 15) = 10 ✅
      // 
      // Пример 2: 10 раз в месяц, 31 день, 26 дней отпуска
      // → availableDays = 5 → goal = min(10, 5) = 5 ✅
      const baseGoal = frequency.count || daysInMonth;
      const vacationDays = validMonthDates.filter(date => 
        isDateInVacation(date, habit.id, vacationPeriods)
      ).length;
      
      const availableDays = daysInMonth - vacationDays;
      
      // Цель = min(заявленная_частота, физически_доступных_дней)
      return Math.min(baseGoal, Math.max(0, availableDays));
    }

    default:
      // Fallback: каждый день минус отпуск
      const vacationDays = validMonthDates.filter(date => 
        isDateInVacation(date, habit.id, vacationPeriods)
      ).length;
      return Math.max(0, daysInMonth - vacationDays);
  }
}

/**
 * Группирует даты по неделям (понедельник-воскресенье)
 * 
 * @param dates - Массив дат в формате YYYY-MM-DD
 * @returns Массив недель, каждая неделя - массив дат
 */
function groupDatesByWeek(dates: string[]): string[][] {
  if (dates.length === 0) return [];

  const weeks: string[][] = [];
  let currentWeek: string[] = [];

  dates.forEach((dateStr, index) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay(); // 0 = Вс, 1 = Пн, ..., 6 = Сб

    // Добавляем дату в текущую неделю
    currentWeek.push(dateStr);

    // Если воскресенье (конец недели) или последний день месяца
    if (dayOfWeek === 0 || index === dates.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Если остались дни (не должно быть, но на всякий случай)
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

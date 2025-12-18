/**
 * Пересчитывает силу привычки и возвращает обновлённую привычку
 * При изменении галочек ВСЕГДА пересчитывает от базовой силы (strengthBaseline)
 * 
 * ✅ Учитывает периоды отдыха (vacation periods) - сила "замораживается" на время отдыха
 * ✅ Учитывает автопропуски (auto-skip) - сила "замораживается" в дни выходных по частоте
 * 
 * @param habit - привычка для пересчёта
 * @param changedDate - дата, которая была изменена (опционально, для оптимизации)
 * @param vacationPeriods - периоды отдыха для заморозки силы
 */

import { format } from 'date-fns';
import type { Habit } from '@/entities/habit/model/types';
import type { VacationPeriod } from '@/entities/vacation';
import { EMA_PERIOD } from '@/entities/habit/model/constants';
import { getCompletionValueForDate } from '../completion-utils';
import { isDateAutoSkipped } from '../auto-skip-logic';
import { applyEMAStep } from './strengthHistory';
import { strengthLogger } from '@/shared/lib/logger';
import { isDateInVacation } from '@/entities/vacation';

export const recalculateStrength = (
  habit: Habit, 
  changedDate?: string,
  vacationPeriods: VacationPeriod[] = []
): Habit => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = format(today, 'yyyy-MM-dd');
  
  strengthLogger.group(`Recalculate: ${habit.name}`, () => {
    strengthLogger.debug('Changed date', changedDate);
    strengthLogger.debug('Current strength', habit.strength);
    strengthLogger.debug('Completions', Object.entries(habit.completions || {}).filter(([_, v]) => v === true || typeof v === 'number').map(([d, v]) => `${d}:${v}`).sort());
  });
  
  // Если изменён день в будущем, не пересчитываем силу
  if (changedDate && changedDate > todayStr) {
    strengthLogger.debug('Changed date is in the future - skipping recalculation', { changedDate, today: todayStr });
    return habit;
  }
  
  // Определяем точку отсчёта для пересчёта
  // ✅ Используем startDate вместо createdAt
  const lastUpdate = new Date(habit.lastStrengthUpdate || habit.startDate || habit.createdAt);
  lastUpdate.setHours(0, 0, 0, 0);
  const lastUpdateStr = format(lastUpdate, 'yyyy-MM-dd');
  
  // Проверяем, был ли изменён день до lastUpdate
  const isChangedBeforeLastUpdate = changedDate && changedDate < lastUpdateStr;
  
  // Если lastUpdate === сегодня И изменён день >= lastUpdate, 
  // пересчитываем от базовой силы (оптимизация для изменений в текущем окне)
  if (lastUpdateStr === todayStr && habit.lastStrengthUpdate && !isChangedBeforeLastUpdate) {
    // Используем базовую силу на момент последнего полного пересчёта
    const baseStrength = habit.strengthBaseline ?? habit.strength ?? 0;
    let strength = baseStrength;
    
    // Пересчитываем все дни с момента lastUpdate включительно
    let currentDate = new Date(lastUpdate);
    
    strengthLogger.group(`Recalculating from baseline: ${habit.name}`, () => {
      strengthLogger.debug('Baseline strength', baseStrength);
      strengthLogger.debug('From', lastUpdateStr, 'To', todayStr);
    });
    
    while (currentDate <= today) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      
      // Игнорируем галочки за будущие дни (на всякий случай)
      if (dateStr > todayStr) {
        strengthLogger.debug(`Day ${dateStr}: skipped (future)`);
        break;
      }
      
      // ✅ Проверяем период отдыха - замораживаем силу
      const isInVacation = isDateInVacation(dateStr, habit.id, vacationPeriods);
      if (isInVacation) {
        strengthLogger.debug(`  ${dateStr}: 🏖️ VACATION - strength frozen at ${strength.toFixed(2)}%`);
        currentDate.setDate(currentDate.getDate() + 1);
        continue; // Пропускаем этот день, сила не меняется
      }
      
      // ✅ Проверяем автопропуски - замораживаем силу
      const isAutoSkipped = isDateAutoSkipped(habit, dateStr, vacationPeriods);
      if (isAutoSkipped) {
        strengthLogger.debug(`  ${dateStr}: 🏖️ AUTO-SKIP - strength frozen at ${strength.toFixed(2)}%`);
        currentDate.setDate(currentDate.getDate() + 1);
        continue; // Пропускаем этот день, сила не меняется
      }
      
      // Получаем пропорциональное значение выполнения (0-100)
      const completionValue = getCompletionValueForDate(habit, dateStr);
      const oldStrength = strength;
      strength = applyEMAStep(strength, completionValue, EMA_PERIOD);
      
      if (completionValue === 100) {
        strengthLogger.debug(`  ${dateStr}: ✓ COMPLETED (100%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
      } else if (completionValue > 0) {
        strengthLogger.debug(`  ${dateStr}: ◐ PARTIAL (${completionValue.toFixed(1)}%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
      } else {
        strengthLogger.debug(`  ${dateStr}: ○ MISSED (0%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    strengthLogger.debug('Final strength', Math.floor(strength));
    
    return {
      ...habit,
      strength: Math.floor(strength),
      lastStrengthUpdate: habit.lastStrengthUpdate, // Не меняем дату обновления
      strengthBaseline: baseStrength, // Сохраняем базовую силу
    };
  }
  
  // Новый день ИЛИ изменение дня до lastUpdate - делаем полный пересчёт и фиксируем новый baseline
  let strength = 0; // Начинаем с нуля при полном пересчёте
  let strengthBeforeToday = 0; // По умолчанию
  
  // ✅ FIX: Начинаем с startDate (или createdAt как fallback)
  // Используем ту же логику, что и в быстром пересчёте
  const effectiveStartDate = new Date(habit.startDate || habit.createdAt);
  effectiveStartDate.setHours(0, 0, 0, 0);
  
  // Находим самую раннюю дату с галочкой (или числовым значением для measurable)
  const allDates = [
    ...Object.entries(habit.completions || {})
      .filter(([_, value]) => value === true || typeof value === 'number')
      .map(([date, _]) => date),
  ];
  
  let startDate = new Date(effectiveStartDate);
  if (allDates.length > 0) {
    // ✅ Fix: доступ по индексу может вернуть undefined
    const earliestDateStr = allDates.sort()[0];
    if (earliestDateStr) {
      const earliestDate = new Date(earliestDateStr);
      earliestDate.setHours(0, 0, 0, 0);
      
      // Начинаем с самой ранней даты (но не раньше startDate!)
      if (earliestDate < startDate) {
        strengthLogger.debug('Found earlier date with completions:', earliestDateStr, '(before startDate:', format(effectiveStartDate, 'yyyy-MM-dd'), ')');
        startDate = earliestDate;
      }
    }
  }
  
  let currentDate = new Date(startDate);
  
  const reason = isChangedBeforeLastUpdate 
    ? `changed date ${changedDate} before lastUpdate ${lastUpdateStr}`
    : 'new day';
  strengthLogger.group(`Full recalculation (${reason}): ${habit.name}`, () => {
    strengthLogger.debug('Starting from scratch at:', format(currentDate, 'yyyy-MM-dd'));
    strengthLogger.debug('To:', todayStr);
  });
  
  while (currentDate <= today) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Игнорируем галочки за будущие дни (на всякий случай)
    if (dateStr > todayStr) {
      strengthLogger.debug(`Day ${dateStr}: skipped (future)`);
      break;
    }
    
    const isToday = dateStr === todayStr;
    
    // Сохраняем силу ПЕРЕД пересчётом сегодняшнего дня
    if (isToday) {
      strengthBeforeToday = strength;
      strengthLogger.debug('Baseline for today:', strengthBeforeToday);
    }
    
    // ✅ Проверяем период отдыха - замораживаем силу
    const isInVacation = isDateInVacation(dateStr, habit.id, vacationPeriods);
    if (isInVacation) {
      strengthLogger.debug(`  ${dateStr}: 🏖️ VACATION - strength frozen at ${strength.toFixed(2)}%`);
      currentDate.setDate(currentDate.getDate() + 1);
      continue; // Пропускаем этот день, сила не меняется
    }
    
    // ✅ Проверяем автопропуски - замораживаем силу
    const isAutoSkipped = isDateAutoSkipped(habit, dateStr, vacationPeriods);
    if (isAutoSkipped) {
      strengthLogger.debug(`  ${dateStr}: 🏖️ AUTO-SKIP - strength frozen at ${strength.toFixed(2)}%`);
      currentDate.setDate(currentDate.getDate() + 1);
      continue; // Пропускаем этот день, сила не меняется
    }
    
    // Получаем пропорциональное значение выполнения (0-100)
    const completionValue = getCompletionValueForDate(habit, dateStr);
    const oldStrength = strength;
    strength = applyEMAStep(strength, completionValue, EMA_PERIOD);
    
    if (completionValue === 100) {
      strengthLogger.debug(`  ${dateStr}: ✓ COMPLETED (100%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
    } else if (completionValue > 0) {
      strengthLogger.debug(`  ${dateStr}: ◐ PARTIAL (${completionValue.toFixed(1)}%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
    } else {
      strengthLogger.debug(`  ${dateStr}: ○ MISSED (0%) - strength ${oldStrength.toFixed(2)}% → ${strength.toFixed(2)}%`);
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  strengthLogger.debug('Final strength', Math.floor(strength));
  
  return {
    ...habit,
    strength: Math.floor(strength),
    lastStrengthUpdate: today.toISOString(), // Обновляем дату
    strengthBaseline: strengthBeforeToday, // Фиксируем силу на начало сегодняшнего дня
  };
};
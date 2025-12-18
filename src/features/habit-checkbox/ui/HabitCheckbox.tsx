/**
 * Компонент чекбокса привычки
 * 
 * Отображает состояние выполнения привычки за день:
 * - Для бинарных: галочка/иконка отдыха (каникулы)/автострелочка/пусто
 * - Для измеримых: галочка (цель достигнута) / круговая диаграмма (частично) / иконка отдыха (каникулы) / автострелочка / пусто
 * - Автострелочка (→) показывается для плановых выходных дней на основе частоты привычки
 * - Иконка отдыха показывается для дней в каникулах (если нет выполнения, показывает иконку периода отдыха; если есть - галочку)
 * - Все цвета управляются через CSS переменные для консистентности дизайна
 * 
 * @module features/habit-checkbox/ui/HabitCheckbox
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 6 декабря 2025 - добавлена визуализация автоматических пропусков (стрелочки)
 * @updated 6 декабря 2025 - добавлена поддержка режима отдыха (каникул)
 * @updated 6 декабря 2025 - замена паузы на динамическую иконку периода отдыха
 * @updated 8 декабря 2025 - унификация цветов через CSS переменные
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label для screen readers)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit } from '@/entities/habit';
import { isHabitCompletedForDate, shouldShowAutoSkip } from '@/entities/habit';
import { isDateInVacation, getVacationPeriodForDate, getVacationPeriodStatus } from '@/entities/vacation';
import { useHabitsStore } from '@/app/store';
import { declineUnit } from '@/shared/lib/text';
import { CircularProgress } from '@/shared/ui/circular-progress';
import { Check, ArrowRight, Palmtree } from '@/shared/assets/icons/system';
import { CompletionButton } from '@/shared/ui/completion-button';
import { VACATION_ICON_MAP } from '@/shared/constants/vacation-icons';

interface HabitCheckboxProps {
  habit: Habit;
  dayData: { date: Date; day: number };
  dayIndex: number;
  dateStr: string;
  onToggleCompletion: (habitId: string, date: string, value?: number) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onOpenNumericInput: (habitId: string, date: string) => void;
  /** Адаптивный размер чекбокса (будет ограничен min: 16px, max: 24px) */
  checkboxSize?: number;
}

// Кастомная функция сравнения для React.memo - проверяем только релевантные данные
function arePropsEqual(
  prevProps: HabitCheckboxProps,
  nextProps: HabitCheckboxProps
): boolean {
  // ✅ FIX: Если изменилась дата - обязательно ре-рендерим 
  // (нужно для пересчёта isBeforeStartDate для заштрихованных кругов)
  if (prevProps.dateStr !== nextProps.dateStr) {
    return false;
  }
  
  // Если изменился ID привычки - обязательно ре-рендерим
  if (prevProps.habit.id !== nextProps.habit.id) {
    return false;
  }

  // Проверяем изменения startDate (важно для отображения заштрихованных кругов)
  if (prevProps.habit.startDate !== nextProps.habit.startDate) {
    return false;
  }

  // Проверяем только данные для конкретной даты
  // ✅ Fix: доступ по индексу может вернуть undefined
  const prevValue = prevProps.habit.completions[prevProps.dateStr] ?? undefined;
  const nextValue = nextProps.habit.completions[nextProps.dateStr] ?? undefined;
  
  // Проверяем изменения частоты (для пересчёта автострелочек)
  const prevFrequency = JSON.stringify(prevProps.habit.frequency);
  const nextFrequency = JSON.stringify(nextProps.habit.frequency);
  if (prevFrequency !== nextFrequency) {
    return false;
  }
  
  // ⚠️ ВАЖНО: Проверяем изменения в completions всей недели/месяца
  // Это нужно для автострелочек, которые зависят от выполнений других дней
  const prevCompletions = JSON.stringify(prevProps.habit.completions);
  const nextCompletions = JSON.stringify(nextProps.habit.completions);
  if (prevCompletions !== nextCompletions) {
    return false; // Если изменились любые completions - ре-рендерим
  }
  
  // Для измеримых привычек также проверяем targetValue и unit
  if (prevProps.habit.type === 'measurable' || nextProps.habit.type === 'measurable') {
    if (
      prevProps.habit.targetValue !== nextProps.habit.targetValue ||
      prevProps.habit.unit !== nextProps.habit.unit ||
      prevProps.habit.targetType !== nextProps.habit.targetType
    ) {
      return false;
    }
  }
  
  // Проверяем изменение размера чекбокса
  if (prevProps.checkboxSize !== nextProps.checkboxSize) {
    return false;
  }
  
  // Если значения для этой даты не изменились - пропускаем ре-рендер
  return prevValue === nextValue;
}

export const HabitCheckbox = React.memo(function HabitCheckbox({
  habit,
  dayData,
  dayIndex,
  dateStr,
  onToggleCompletion,
  onUpdateHabit,
  onOpenNumericInput,
  checkboxSize = 20,
}: HabitCheckboxProps) {
  const { t, i18n } = useTranslation('habits');
  const currentLanguage = i18n.language;
  
  // Получаем периоды каникул из store
  const vacationPeriods = useHabitsStore((state) => state.vacationPeriods);
  
  // ✅ Fix: доступ по индексу может вернуть undefined
  const isCompleted = habit.completions[dateStr] ?? undefined;

  // Проверяем, находится ли дата в каникулах
  const isInVacation = isDateInVacation(dateStr, habit.id, vacationPeriods);
  
  // Получаем период отдыха для данной даты (если есть)
  const vacationPeriod = isInVacation 
    ? getVacationPeriodForDate(dateStr, habit.id, vacationPeriods)
    : undefined;
  
  // Получаем иконку периода отдыха (с fallback на пальму)
  const VacationIcon = vacationPeriod?.icon 
    ? (VACATION_ICON_MAP[vacationPeriod.icon] ?? Palmtree)
    : Palmtree;

  // Получаем сегодняшнюю дату для проверки автострелочек
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0] ?? '';

  // ✅ Проверяем, является ли дата раньше даты начала привычки (с fallback на createdAt)
  const startDate = habit.startDate || habit.createdAt;
  const isBeforeStartDate = dateStr < startDate;

  // Проверяем, нужно ли показывать автострелочку (плановый выходной)
  // Приоритет: до начала > каникулы > автострелочки
  const showAutoSkip = !isBeforeStartDate && !isInVacation && shouldShowAutoSkip(habit, dateStr, todayStr, vacationPeriods);

  // Ограничиваем размер чекбокса (мин: 16px, макс: 24px)
  const clampedSize = Math.max(16, Math.min(24, checkboxSize));
  
  // Размер иконки - 60% от размера кнопки (для всех иконок)
  const iconSize = Math.round(clampedSize * 0.6);
  
  // Размер иконки отдыха - 50% от размера кнопки
  const vacationIconSize = Math.round(clampedSize * 0.5);

  // 🆕 Генерация aria-label для accessibility
  const getAriaLabel = (type: 'binary' | 'measurable', status: string, value?: number, target?: number): string => {
    const day = dayData.day;
    const habitName = habit.name;
    
    if (isBeforeStartDate) {
      return `${habitName}, день ${day}: до даты начала`;
    }
    
    if (isInVacation && (type === 'binary' ? !isCompleted : value === 0)) {
      return `${habitName}, день ${day}: режим отдыха`;
    }
    
    if (showAutoSkip) {
      return `${habitName}, день ${day}: плановый выходной, нажмите чтобы отметить выполнение`;
    }
    
    if (type === 'measurable') {
      const currentValue = value ?? 0;
      const targetValue = target ?? 0;
      const unit = habit.unit ? declineUnit(currentValue, habit.unit, t, currentLanguage) : '';
      
      if (currentValue === 0) {
        return `${habitName}, день ${day}: не выполнено, нажмите чтобы ввести значение`;
      } else if (status === 'completed') {
        return `${habitName}, день ${day}: цель достигнута, ${currentValue} ${unit} из ${targetValue}${isInVacation ? ', выполнено во время отдыха' : ''}`;
      } else {
        const percentage = targetValue > 0 ? Math.round((currentValue / targetValue) * 100) : 0;
        return `${habitName}, день ${day}: частично выполнено, ${currentValue} ${unit} из ${targetValue}, прогресс ${percentage}%${isInVacation ? ', выполнено во время отдыха' : ''}`;
      }
    } else {
      // binary
      if (isCompleted) {
        return `${habitName}, день ${day}: выполнено${isInVacation ? ', выполнено во время отдыха' : ''}`;
      } else {
        return `${habitName}, день ${day}: не выполнено, нажмите чтобы отметить`;
      }
    }
  };

  // Для измеримых привычек - показываем чекбокс с прогрессом
  if (habit.type === 'measurable') {
    const value = habit.completions[dateStr] ?? undefined;
    const numValue = typeof value === 'number' ? value : 0;
    
    // Проверяем, достигнута ли цель
    const isMet = isHabitCompletedForDate(habit, dateStr);
    
    // Вычисляем процент прогресса
    const target = habit.targetValue || 0;
    const progress = target > 0 ? (numValue / target) * 100 : 0;
    
    // Форматирование для tooltip
    const tooltipValue = numValue > 0 
      ? `${numValue} ${habit.unit ? declineUnit(numValue, habit.unit, t, currentLanguage) : ''}`
      : '0';
    
    return (
      <div key={`calendar-input-${habit.id}-${dayIndex}`} className="flex items-center justify-center">
        {isBeforeStartDate ? (
          // День до даты начала привычки - показываем заштрихованный круг
          <div 
            className="flex items-center justify-center rounded-full border"
            title={`${dayData.day}: До даты начала`}
            aria-label={getAriaLabel('measurable', 'before-start')}
            role="status"
            style={{ 
              width: clampedSize, 
              height: clampedSize,
              background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--bg-tertiary) 2px, var(--bg-tertiary) 3px)',
              borderColor: 'var(--border-secondary)'
            }}
          />
        ) : isInVacation && numValue === 0 ? (
          // Показываем цветную точку периода отдыха если в каникулах и нет выполнения
          <div 
            className="rounded-full border flex items-center justify-center"
            title={`${dayData.day}: Режим отдыха`}
            aria-label={getAriaLabel('measurable', 'vacation', numValue, target)}
            role="status"
            style={{ 
              width: clampedSize, 
              height: clampedSize,
              borderColor: vacationPeriod
                ? getVacationPeriodStatus(vacationPeriod, todayStr) === 'active'
                  ? 'var(--palette-amber-border)'
                  : getVacationPeriodStatus(vacationPeriod, todayStr) === 'upcoming'
                  ? 'var(--palette-indigo-border)'
                  : 'var(--palette-zinc-border)'
                : 'var(--border-secondary)',
              background: vacationPeriod
                ? getVacationPeriodStatus(vacationPeriod, todayStr) === 'active'
                  ? 'linear-gradient(135deg, var(--palette-amber-bg) 0%, color-mix(in srgb, var(--palette-amber-bg) 30%, transparent) 100%)'
                  : getVacationPeriodStatus(vacationPeriod, todayStr) === 'upcoming'
                  ? 'linear-gradient(135deg, var(--palette-indigo-bg) 0%, color-mix(in srgb, var(--palette-indigo-bg) 25%, transparent) 100%)'
                  : 'linear-gradient(135deg, var(--palette-zinc-bg) 0%, color-mix(in srgb, var(--palette-zinc-bg) 20%, transparent) 100%)'
                : 'var(--border-secondary)',
              color: vacationPeriod
                ? getVacationPeriodStatus(vacationPeriod, todayStr) === 'active'
                  ? 'var(--palette-amber-text)'
                  : getVacationPeriodStatus(vacationPeriod, todayStr) === 'upcoming'
                  ? 'var(--palette-indigo-text)'
                  : 'var(--palette-zinc-text)'
                : 'currentColor'
            }}
          >
            <VacationIcon 
              className="shrink-0" 
              strokeWidth={1.5}
              style={{ 
                width: vacationIconSize, 
                height: vacationIconSize
              }} 
            />
          </div>
        ) : showAutoSkip ? (
          // Показываем автострелочку (плановый выходной) - КЛИКАБЕЛЬНАЯ!
          <CompletionButton
            variant="empty"
            size={clampedSize}
            onClick={() => onOpenNumericInput(habit.id, dateStr)}
            title={`${dayData.day}: Плановый выходной (клик для выполнения)`}
            aria-label={getAriaLabel('measurable', 'auto-skip', numValue, target)}
          >
            <ArrowRight 
              style={{ 
                width: iconSize, 
                height: iconSize
              }} 
            />
          </CompletionButton>
        ) : (
          <CompletionButton
            variant={numValue === 0 ? 'empty' : isMet ? 'completed' : 'partial'}
            size={clampedSize}
            onClick={() => onOpenNumericInput(habit.id, dateStr)}
            title={`${dayData.day}: ${tooltipValue}${isInVacation && numValue > 0 ? ' (выполнено во время отдыха)' : ''}`}
            aria-label={getAriaLabel('measurable', isMet ? 'completed' : numValue > 0 ? 'partial' : 'empty', numValue, target)}
          >
            {numValue === 0 ? (
              // Пустое состояние - ничего не показываем
              null
            ) : isMet ? (
              // Цель достигнута - показываем галочку (цвет управляется CompletionButton)
              <Check style={{ width: iconSize, height: iconSize }} />
            ) : (
              // Частично выполнено - показываем круговую диаграмму
              <CircularProgress progress={progress} size={clampedSize} />
            )}
          </CompletionButton>
        )}
      </div>
    );
  }
  
  // Для бинарных привычек - показываем кнопку чекбокса
  return (
    <div key={`calendar-checkbox-${habit.id}-${dayIndex}`} className="flex items-center justify-center">
      {isBeforeStartDate ? (
        // День до даты начала привычки - показываем заштрихованный круг
        <div 
          className="flex items-center justify-center rounded-full border"
          title={`${dayData.day}: До даты начала`}
          aria-label={getAriaLabel('binary', 'before-start')}
          role="status"
          style={{ 
            width: clampedSize, 
            height: clampedSize,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, var(--bg-tertiary) 2px, var(--bg-tertiary) 3px)',
            borderColor: 'var(--border-secondary)'
          }}
        />
      ) : isInVacation && !isCompleted ? (
        // Показываем цветную точку периода отдыха если в каникулах и нет выполнения
        <div 
          className="rounded-full border flex items-center justify-center"
          title={`${dayData.day}: Режим отдыха`}
          aria-label={getAriaLabel('binary', 'vacation')}
          role="status"
          style={{ 
            width: clampedSize, 
            height: clampedSize,
            borderColor: vacationPeriod
              ? getVacationPeriodStatus(vacationPeriod, todayStr) === 'active'
                ? 'var(--palette-amber-border)'
                : getVacationPeriodStatus(vacationPeriod, todayStr) === 'upcoming'
                ? 'var(--palette-indigo-border)'
                : 'var(--palette-zinc-border)'
              : 'var(--border-secondary)',
            background: vacationPeriod
              ? getVacationPeriodStatus(vacationPeriod, todayStr) === 'active'
                ? 'linear-gradient(135deg, var(--palette-amber-bg) 0%, color-mix(in srgb, var(--palette-amber-bg) 30%, transparent) 100%)'
                : getVacationPeriodStatus(vacationPeriod, todayStr) === 'upcoming'
                ? 'linear-gradient(135deg, var(--palette-indigo-bg) 0%, color-mix(in srgb, var(--palette-indigo-bg) 25%, transparent) 100%)'
                : 'linear-gradient(135deg, var(--palette-zinc-bg) 0%, color-mix(in srgb, var(--palette-zinc-bg) 20%, transparent) 100%)'
              : 'var(--border-secondary)',
            color: vacationPeriod
              ? getVacationPeriodStatus(vacationPeriod, todayStr) === 'active'
                ? 'var(--palette-amber-text)'
                : getVacationPeriodStatus(vacationPeriod, todayStr) === 'upcoming'
                ? 'var(--palette-indigo-text)'
                : 'var(--palette-zinc-text)'
              : 'currentColor'
          }}
        >
          <VacationIcon 
            className="shrink-0" 
            strokeWidth={1.5}
            style={{ 
              width: vacationIconSize, 
              height: vacationIconSize
            }} 
          />
        </div>
      ) : showAutoSkip ? (
        // Показываем автострелочку (плановый выходной) - КЛИКАБЕЛЬНАЯ!
        <CompletionButton
          variant="empty"
          size={clampedSize}
          onClick={() => onToggleCompletion(habit.id, dateStr)}
          title={`${dayData.day}: Плановый выходной (клик для выполнения)`}
          aria-label={getAriaLabel('binary', 'auto-skip')}
        >
          <ArrowRight 
            style={{ 
              width: iconSize, 
              height: iconSize
            }} 
          />
        </CompletionButton>
      ) : (
        <CompletionButton
          variant={isCompleted ? 'completed' : 'empty'}
          size={clampedSize}
          onClick={() => onToggleCompletion(habit.id, dateStr)}
          title={`${dayData.day} ${isCompleted ? '✓' : ''}${isCompleted && isInVacation ? ' (выполнено во время отдыха)' : ''}`}
          aria-label={getAriaLabel('binary', isCompleted ? 'completed' : 'empty')}
        >
          {isCompleted ? (
            <Check style={{ width: iconSize, height: iconSize }} />
          ) : null}
        </CompletionButton>
      )}
    </div>
  );
}, arePropsEqual);
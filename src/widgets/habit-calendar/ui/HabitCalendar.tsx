/**
 * Виджет календаря привычек
 * 
 * Композитный виджет, объединяющий:
 * - Список привычек (entity: HabitNameCell)
 * - Календарную сетку (feature: HabitCheckbox)
 * - Прогресс-бары (entity: HabitProgressCell)
 * 
 * С группировкой по разделам через горизонтальные заголовки с цветными точками.
 * 
 * ЭТАЛОННЫЕ РАЗМЕРЫ:
 * - Высота строки привычки: 32px (h-8 в HabitNameCell, HabitProgressCell)
 * - Отступ между привычками: 0px (убран)
 * - Высота секции: sectionHabits.length * 32px
 * 
 * АДАПТИВНАЯ СТРУКТУРА GRID (через CSS переменные):
 * - Desktop (1024px-1440px): 200px (левая) | flex-1 | 200px (правая)
 * - Large Desktop (1440px-1920px): 260px (левая) | flex-1 | 240px (правая)
 * - Ultra-wide (2560px+): 300px (левая) | flex-1 | 280px (правая)
 * 
 * Переменные --grid-side-column (левая) и --grid-side-column-right (правая) 
 * автоматически меняются через @media в theme.css
 * 
 * - Заголовок секции: точка + название + линия + счетчик
 * 
 * @module widgets/habit-calendar/ui/HabitCalendar
 * @created 2 декабря 2025 - рефакторинг из трёх отдельных компонентов
 * @updated 8 декабря 2025 - переход на горизонтальные заголовки секций
 * @updated 17 декабря 2025 - адаптивная сетка для больших экранов
 */

import React from 'react';
import { Plus } from '@/shared/assets/icons/system';
import { 
  HabitNameCell,
  HabitProgressCell,
  groupHabitsBySection,
  getSectionOrder,
  getSectionColor,
  isHabitCompletedForDate,
  getAdjustedMonthlyGoal,
  type Habit,
  type DateConfig,
  type Section,
} from '@/entities/habit';
import { useTranslatedSectionName } from '@/entities/section';
import { HabitCheckbox } from '@/features/habit-checkbox';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty';
import type { ColorVariant } from '@/shared/constants/colors';
import { useTranslation } from 'react-i18next';

interface HabitCalendarProps {
  /** Список привычек для отображения */
  habits: Habit[];
  /** Конфигурация даты с информацией о месяце */
  dateConfig: DateConfig;
  /** Callback при клике на иконку статистики */
  onStatsClick?: (habitId: string) => void;
}

/**
 * Виджет календаря привычек с группировкой по разделам
 * 
 * Структура:
 * 1. Заголовок с днями недели
 * 2. Группы привычек по разделам (вертикальная полоса слева)
 * 3. Каждая привычка: название + календарь + прогресс
 * 
 * Empty state: когда нет привычек - кнопка добавления
 */
export function HabitCalendar({
  habits,
  dateConfig,
  onStatsClick,
}: HabitCalendarProps) {
  const { monthDays, formatDate, getDayName, selectedMonth, selectedYear } = dateConfig;
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем все вызовы store в один с useShallow
  const {
    toggleCompletion,
    updateHabit,
    openNumericInputModal,
    openAddHabitModal,
    sections,
    vacationPeriods,
  } = useHabitsStore(
    useShallow((state) => ({
      toggleCompletion: state.toggleCompletion,
      updateHabit: state.updateHabit,
      openNumericInputModal: state.openNumericInputModal,
      openAddHabitModal: state.openAddHabitModal,
      sections: state.sections,
      vacationPeriods: state.vacationPeriods,
    }))
  );
  
  // Группировка привычек по разделам
  const groupedHabits = React.useMemo(
    () => groupHabitsBySection(habits),
    [habits]
  );
  
  // Упорядоченные разделы (стандартные первыми, затем кастомные)
  const orderedSections = React.useMemo(
    () => getSectionOrder(Array.from(groupedHabits.keys()), sections),
    [groupedHabits, sections]
  );
  
  // Количество дней месяца
  const daysCount = monthDays.length;

  const { t } = useTranslation();
  
  // Функция для получения переведённого названия раздела
  const getTranslatedSectionName = useTranslatedSectionName();

  // Ref для колонки с чекбоксами для измерения её ширины
  const checkboxColumnRef = React.useRef<HTMLDivElement>(null);
  const [checkboxSize, setCheckboxSize] = React.useState(20);

  // Рассчитываем адаптивный размер чекбоксов
  React.useEffect(() => {
    const updateCheckboxSize = () => {
      if (checkboxColumnRef.current && monthDays.length > 0) {
        // Получаем ширину колонки
        const columnWidth = checkboxColumnRef.current.offsetWidth;
        
        // Проверяем, что ширина валидна (DOM полностью отрисован)
        if (columnWidth === 0) {
          // Если ширина 0, откладываем пересчет
          requestAnimationFrame(updateCheckboxSize);
          return;
        }
        
        // Вычитаем padding (px-8 = 64px total)
        const availableWidth = columnWidth - 64;
        // Делим на количество дней
        const cellWidth = availableWidth / monthDays.length;
        // Чекбокс занимает ~80% от ширины ячейки
        const calculatedSize = cellWidth * 0.8;
        // Ограничиваем от 16px до 22px
        const clampedSize = Math.max(16, Math.min(22, calculatedSize));
        setCheckboxSize(clampedSize);
      }
    };

    // Откладываем первый вызов, чтобы DOM успел отрисоваться
    requestAnimationFrame(updateCheckboxSize);
    
    // Используем ResizeObserver для отслеживания изменений размера
    const resizeObserver = new ResizeObserver(updateCheckboxSize);
    if (checkboxColumnRef.current) {
      resizeObserver.observe(checkboxColumnRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [monthDays.length]);

  return (
    <Card className="min-h-[490px] h-full flex flex-col">
      <div className="py-[25px] flex-1 flex flex-col">
        {habits.length === 0 ? (
          // Empty state
          <Empty className="px-[40px]">
            <EmptyHeader>
              <EmptyTitle>{t('habits:habit.noHabits')}</EmptyTitle>
              <EmptyDescription>
                {t('habits:habit.createFirstHabit')}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={openAddHabitModal}>
                <Plus className="w-3.5 h-3.5" />
                {t('habits:habit.addHabit')}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div>
            {/* Контент: секции с горизонтальными заголовками */}
            <div className="flex flex-col gap-4">
              {orderedSections.map((section, sectionIndex) => {
                const sectionHabits = groupedHabits.get(section) || [];
                const sectionColor = getSectionColor(section, sections);
                const habitsCount = sectionHabits.length;
                
                return (
                  <div key={section}>
                    {/* Горизонтальный заголовок секции */}
                    <div className="flex gap-0 mb-2 items-center">
                      {/* Колонка названия секции - точка + название (адаптивная ширина через CSS переменную) */}
                      <div className="w-auto flex-shrink-0 flex items-center gap-2 pl-[40px]">
                        {/* Цветная точка */}
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ 
                            backgroundColor: `var(--palette-${sectionColor}-text)`,
                          }}
                        />
                        
                        {/* Назване секции цветное */}
                        <span 
                          className="flex-shrink-0"
                          style={{ 
                            color: `var(--palette-${sectionColor}-text)`,
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {getTranslatedSectionName(section)}
                        </span>
                      </div>
                      
                      {/* Сепаратор от названия до счетчика - занимает чекбоксы + прогресс */}
                      <div className="flex-1 flex items-center">
                        <div 
                          className="w-full h-px ml-4"
                          style={{ backgroundColor: 'var(--border-secondary)' }}
                        />
                      </div>
                      
                      {/* Счетчик привычек справа */}
                      <div className="w-auto flex-shrink-0 flex items-center justify-end ml-4 pr-[40px]">
                        <span 
                          style={{ 
                            color: 'var(--text-disabled)',
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {habitsCount}
                        </span>
                      </div>
                    </div>
                    
                    {/* Привычки секции */}
                    <div>
                      {sectionHabits.map((habit, habitIndex) => {
                        // Считаем прогресс
                        const completedCount = monthDays.filter(dayData => 
                          isHabitCompletedForDate(habit, formatDate(dayData.date))
                        ).length;
                        
                        // Получаем все даты месяца для расчёта цели
                        const allMonthDates = monthDays.map(day => formatDate(day.date));
                        
                        // Вычисляем скорректированную цель с учётом отпуска
                        const goalValue = getAdjustedMonthlyGoal(
                          habit,
                          allMonthDates,
                          vacationPeriods
                        );
                        
                        return (
                          <div 
                            key={habit.id} 
                            className="flex"
                            style={{ gap: 'var(--grid-main-gap)' }}
                          >
                            {/* Колонка названия привычки (адаптивная через CSS переменную --grid-side-column) */}
                            <div 
                              className="flex-shrink-0 pl-[40px]"
                              style={{ width: 'var(--grid-side-column)' }}
                            >
                              <HabitNameCell habit={habit} />
                            </div>
                            
                            {/* Колонка: Чекбоксы (flex-1) */}
                            <div 
                              className="flex-1"
                              style={{ 
                                display: 'grid',
                                gridTemplateColumns: `repeat(${monthDays.length}, 1fr)`,
                                width: '100%'
                              }}
                              ref={sectionIndex === 0 && habitIndex === 0 ? checkboxColumnRef : null}
                            >
                              {monthDays.map((dayData, dayIndex) => {
                                const dateStr = formatDate(dayData.date);
                                return (
                                  <div key={`${habit.id}-${dayIndex}`} className="flex justify-center items-center">
                                    <HabitCheckbox
                                      habit={habit}
                                      dayData={dayData}
                                      dayIndex={dayIndex}
                                      dateStr={dateStr}
                                      onToggleCompletion={toggleCompletion}
                                      onUpdateHabit={updateHabit}
                                      onOpenNumericInput={openNumericInputModal}
                                      checkboxSize={checkboxSize}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Колонка: Прогресс-бар (адаптивная через CSS переменную --grid-side-column-right) */}
                            <div 
                              className="flex-shrink-0 pr-[40px]"
                              style={{ width: 'var(--grid-side-column-right)' }}
                            >
                              <HabitProgressCell
                                habitId={habit.id}
                                completedCount={completedCount}
                                goalValue={goalValue}
                                habitStrength={habit.strength}
                                onStatsClick={onStatsClick}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
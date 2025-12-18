/**
 * Модальное окно статистики привычки
 * 
 * Отображает детальную статистику привычки: силу привычки (EMA) с новым виджетом,
 * текущий и лучший стрик, месячный прогресс выполнения,
 * общее количество выполнений и возраст привычки.
 * 
 * @module features/habit-stats/ui/HabitStatisticsModal
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 9 декабря 2025 - заменён прогресс-бар и график на новый виджет HabitStrengthHero
 * @updated 9 декабря 2025 - добавлены виджеты StreakCompact и CompletedCard для отображения стриков и прогресса
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import type { Habit, Mood } from '@/entities/habit';
import { isHabitCompletedForDate, isDateAutoSkipped, getAdjustedMonthlyGoal } from '@/entities/habit';
import { useHabitsStore } from '@/app/store';
import type { VacationPeriod } from '@/entities/vacation';
import { Modal } from '@/shared/ui/modal';
import { HabitStrengthHero } from './HabitStrengthHero';
import { StreakCompact } from './StreakCompact';
import { CompletedCard } from './CompletedCard';
import { HabitAgeCard } from './HabitAgeCard';
import { HabitStatisticsCalendar } from './HabitStatisticsCalendar';
import { calculateAchievements } from '../model/achievements';
import { AchievementsTab } from './AchievementsTab';

interface HabitStatisticsModalProps {
  habit: Habit;
  onClose: () => void;
  monthYearKey: string;
  /** Дополнительный контент для правой колонки (например, список заметок) */
  rightColumnContent?: React.ReactNode;
  /** Дополнительные модалки (например, EditNoteModal) */
  additionalModals?: React.ReactNode;
  /** Коллбэк при изменении месяца в календаре (для синхронизации с rightColumnContent) */
  onMonthChange?: (monthYearKey: string) => void;
}

/**
 * Рассчитывает статистику привычки
 */
function calculateStats(habit: Habit, monthYearKey: string, vacationPeriods: VacationPeriod[] = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // ✅ Fix: split может вернуть undefined
  const todayStr = today.toISOString().split('T')[0] ?? today.toISOString();
  
  // Парсим monthYearKey (например, "2024-11" -> год=2024, месяц=11)
  const parts = monthYearKey.split('-').map(Number);
  const year = parts[0] ?? new Date().getFullYear();
  const month = parts[1] ?? 1;
  
  // Определяем границы месяца
  const monthStart = new Date(year, month - 1, 1); // месяц в Date начинается с 0
  const monthEnd = new Date(year, month, 0); // последний день месяца
  
  // Генерируем ВСЕ даты месяца (для расчёта цели)
  const allMonthDates: string[] = [];
  const currentDate = new Date(monthStart);
  
  while (currentDate <= monthEnd) {
    const dateStr = currentDate.toISOString().split('T')[0] ?? currentDate.toISOString();
    allMonthDates.push(dateStr);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Считаем выполненные дни (только за прошедшие дни месяца до сегодня включительно)
  const completedDays = allMonthDates
    .filter(date => date <= todayStr) // только прошедшие дни
    .filter(date => isHabitCompletedForDate(habit, date))
    .length;
  
  // Получаем правильную цель через getAdjustedMonthlyGoal (передаём ВСЕ даты месяца)
  const targetDays = getAdjustedMonthlyGoal(habit, allMonthDates, vacationPeriods);
  
  // Процент выполнения
  const percentage = targetDays > 0 ? Math.round((completedDays / targetDays) * 100) : 0;

  // Рассчитываем текущий стрик
  let streak = 0;
  
  // ✅ Учитываем startDate - не считаем дни до начала привычки
  const habitStartDate = new Date(habit.startDate || habit.createdAt);
  habitStartDate.setHours(0, 0, 0, 0);
  
  let currentDateForStreak = new Date(today);
  let iterations = 0;
  const MAX_ITERATIONS = 365;
  
  while (iterations < MAX_ITERATIONS) {
    // ✅ Fix: split может вернуть undefined
    const dateStr = currentDateForStreak.toISOString().split('T')[0] ?? currentDateForStreak.toISOString();
    
    // ✅ Останавливаемся если дошли до даты ДО начала привычки
    if (currentDateForStreak < habitStartDate) {
      break;
    }
    
    const isCompleted = isHabitCompletedForDate(habit, dateStr);
    const isSkipped = habit.skipped?.[dateStr];
    const isAutoSkipped = isDateAutoSkipped(habit, dateStr, vacationPeriods);
    
    if (isCompleted || isSkipped || isAutoSkipped) {
      streak++;
      currentDateForStreak.setDate(currentDateForStreak.getDate() - 1);
      iterations++;
    } else {
      break;
    }
  }

  // Рассчитываем лучший стрик (максимальная непрерывная серия)
  let bestStreak = 0;
  let currentBestStreak = 0;
  
  // Получаем все даты и сортируем их
  const allDatesForBestStreak = [
    ...Object.entries(habit.completions || {})
      .filter(([_, value]) => value === true || typeof value === 'number')
      .map(([date, _]) => date),
    ...Object.entries(habit.skipped || {})
      .filter(([_, value]) => value === true)
      .map(([date, _]) => date)
  ].sort();
  
  if (allDatesForBestStreak.length > 0) {
    // ✅ Fix: доступ по индексу может вернуть undefined
    const firstDate = allDatesForBestStreak[0];
    if (firstDate) {
      const startDate = new Date(firstDate);
      const endDate = new Date(today);
      
      let checkDate = new Date(startDate);
      currentBestStreak = 0;
      
      while (checkDate <= endDate) {
        // ✅ Fix: split может вернуть undefined
        const dateStr = checkDate.toISOString().split('T')[0] ?? checkDate.toISOString();
        const isCompleted = isHabitCompletedForDate(habit, dateStr);
        const isSkipped = habit.skipped?.[dateStr];
        const isAutoSkipped = isDateAutoSkipped(habit, dateStr, vacationPeriods);
      
        if (isCompleted || isSkipped || isAutoSkipped) {
          currentBestStreak++;
          bestStreak = Math.max(bestStreak, currentBestStreak);
        } else {
          currentBestStreak = 0;
        }
        
        checkDate.setDate(checkDate.getDate() + 1);
      }
    }
  }

  // Используем сохранённую силу привычки (она всегда актуальна, т.к. обновляется в App.tsx)
  // Fallback на 0 если по какой-то причине она не определена (не должно происходить)
  const strength = habit.strength ?? 0;

  // Считаем всего выполнено за всё время (до сегодняшнего дня включительно)
  const totalCompletedAllTime = Object.entries(habit.completions || {})
    .filter(([date, _]) => isHabitCompletedForDate(habit, date) && date <= todayStr).length;

  return { streak, bestStreak, percentage, completedDays, targetDays, strength, totalCompletedAllTime };
}

export const HabitStatisticsModal: React.FC<HabitStatisticsModalProps> = ({ 
  habit, 
  onClose, 
  monthYearKey,
  rightColumnContent,
  additionalModals,
  onMonthChange
}) => {
  const { t } = useTranslation('stats');
  const vacationPeriods = useHabitsStore(state => state.vacationPeriods);
  
  // State для управления табами
  const [activeTab, setActiveTab] = React.useState<'statistics' | 'achievements'>('statistics');
  
  // State для управления месяцем календаря
  const [calendarMonth, setCalendarMonth] = React.useState(monthYearKey);
  
  const stats = calculateStats(habit, monthYearKey, vacationPeriods);
  const achievements = React.useMemo(() => calculateAchievements(habit, vacationPeriods), [habit, vacationPeriods]);

  // Обработчик изменения месяца календаря
  const handleMonthChange = (newMonthYearKey: string) => {
    setCalendarMonth(newMonthYearKey);
    onMonthChange?.(newMonthYearKey);
  };

  return (
    <>
      <Modal.Root level="dialog" onClose={onClose}>
        <Modal.Backdrop onClick={onClose} />
        <Modal.Container size="2xl" minHeight="610px" maxHeight="610px">
          <Modal.GradientLine />
          
          {/* Header */}
          <Modal.Header 
            title={habit.name}
            onClose={onClose}
          />

          <Modal.Content>
            {/* Content */}
            <div className="px-6 py-4">
              {/* Табы */}
              <div className="mb-6">
                <div
                  className="flex gap-1 p-1 rounded-md"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <button
                    onClick={() => setActiveTab('statistics')}
                    className="flex-1 py-2.5 px-4 rounded-md transition-all"
                    style={{
                      background: activeTab === 'statistics' ? 'var(--accent-primary-indigo)' : 'transparent',
                      color: activeTab === 'statistics' ? 'white' : 'var(--text-tertiary)',
                      fontWeight: 500,
                    }}
                  >
                    {t('stats:tabs.statistics')}
                  </button>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className="flex-1 py-2.5 px-4 rounded-md transition-all"
                    style={{
                      background: activeTab === 'achievements' ? 'var(--accent-primary-indigo)' : 'transparent',
                      color: activeTab === 'achievements' ? 'white' : 'var(--text-tertiary)',
                      fontWeight: 500,
                    }}
                  >
                    {t('stats:tabs.achievements')}
                  </button>
                </div>
              </div>

              {/* Контент табов */}
              {activeTab === 'statistics' ? (
                <div className="space-y-6">
                  {/* Сила привычки - новый виджет */}
                  <HabitStrengthHero value={stats.strength} />

                  {/* Стрики и выполнение - компактные виджеты в три столбца */}
                  <div className="grid grid-cols-3 gap-3">
                    <StreakCompact 
                      currentStreak={stats.streak} 
                      bestStreak={stats.bestStreak} 
                    />
                    <CompletedCard 
                      completed={stats.completedDays} 
                      total={stats.targetDays} 
                    />
                    <HabitAgeCard 
                      startDate={habit.startDate || habit.createdAt} 
                    />
                  </div>

                  {/* Календарь */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <HabitStatisticsCalendar
                        habit={habit}
                        monthYearKey={calendarMonth}
                        vacationPeriods={vacationPeriods}
                        onMonthChange={handleMonthChange}
                      />
                    </div>
                    {rightColumnContent && (
                      <div>
                        <div className="mb-3">
                          <Modal.FieldTitle>
                            {t('habits:habit.notes')}
                          </Modal.FieldTitle>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto pr-2">
                          {rightColumnContent}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <AchievementsTab achievements={achievements} />
              )}
            </div>
          </Modal.Content>

          {/* Footer */}
          <Modal.Footer>
            <Button
              variant="default"
              onClick={onClose}
            >
              {t('common:common.close')}
            </Button>
          </Modal.Footer>
        </Modal.Container>
      </Modal.Root>
      
      {/* Дополнительные модалки (например, EditNoteModal) */}
      {additionalModals}
    </>
  );
};
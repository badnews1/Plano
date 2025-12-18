/**
 * Страница трекера привычек
 * 
 * Главная страница приложения с полным интерфейсом трекера:
 * - Календарная сетка с отметками выполнения
 * - Список привычек с управлением
 * - Фильтрация привычек по тегам, разделам и типам
 * - Прогресс-бары и статистика
 * - Графики и топ-10
 * 
 * АДАПТИВНАЯ СЕТКА (через CSS переменную --grid-side-column):
 * - Desktop (1024px-1440px): 200px | 1fr | 200px
 * - Large Desktop (1440px-1920px): 260px | 1fr | 240px
 * - Ultra-wide (2560px+): 300px | 1fr | 280px
 * 
 * @module pages/habit-tracker/ui/HabitTrackerPage
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 2 декабря 2025 - интеграция единого виджета HabitCalendar
 * @updated 5 декабря 2025 - добавлена фильтрация привычек
 * @updated 17 декабря 2025 - адаптивная сетка для больших экранов
 */

import React from 'react';
import { useHabitsStore, useShallow } from '@/app/store';
import { HabitCalendar } from '@/widgets/habit-calendar';
// import { HabitDailyChart } from '@/widgets/habit-daily-chart';;
// import { HabitTop10 } from '@/widgets/habit-top10';
import { HabitMonthNavigation } from '@/widgets/habit-month-navigation';
import { HabitDailyProgressBars } from '@/widgets/habit-daily-progress-bars';
import { HabitMonthlyCircle } from '@/widgets/habit-monthly-circle';
import { getDaysInMonth, formatDate, getLocalizedDayName } from '@/shared/lib/date';
import { Card } from '@/components/ui/card';
import { PageContainer } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { filterHabits, getActiveHabits } from '@/entities/habit';
import { AppHeader } from '@/widgets/app-header';
import { Button } from '@/components/ui/button';
import { CheckSquare, Plus } from '@/shared/assets/icons/system';
import { VacationManagerButton } from '@/features/vacation-manager-button';
import { HabitsFilterButton } from '@/features/habit-filters';
import { ArchiveHeaderButton } from '@/widgets/archive-manager';

export function HabitTrackerPage() {
  // ==================== I18N ====================
  const { t } = useTranslation('common');
  const { t: tHabits } = useTranslation('habits');
  const { t: tApp } = useTranslation('app');

  // Получаем данные и actions из store
  const {
    habits,
    selectedMonth,
    selectedYear,
    openStatsModal,
    openAddHabitModal,
    selectedFilterCategories,
    selectedFilterSections,
    selectedFilterTypes,
    showFilterUncategorized,
  } = useHabitsStore(
    useShallow((state) => ({
      habits: state.habits,
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
      openStatsModal: state.openStatsModal,
      openAddHabitModal: state.openAddHabitModal,
      selectedFilterCategories: state.selectedFilterCategories,
      selectedFilterSections: state.selectedFilterSections,
      selectedFilterTypes: state.selectedFilterTypes,
      showFilterUncategorized: state.showFilterUncategorized,
    }))
  );

  // Фильтруем привычки используя state из store
  // 1. Сначала исключаем архивные привычки
  const activeHabits = getActiveHabits(habits);
  
  // 2. Затем применяем фильтры тегов/разделов/типов
  const filteredHabits = filterHabits(activeHabits, {
    selectedCategories: selectedFilterCategories,
    selectedSections: selectedFilterSections,
    selectedTypes: selectedFilterTypes,
    showUncategorized: showFilterUncategorized,
  });

  // Вычисляем дни месяца
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // Формируем конфигурационные объекты для дочерних компонентов
  const dateConfig = {
    selectedMonth,
    selectedYear,
    monthDays,
    formatDate,
    getDayName: (date: Date) => getLocalizedDayName(date, t), // Wrapper с передачей t
  };

  // Обработчик клика по иконке статистики
  const handleStatsClick = (habitId: string) => {
    const monthYearKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    openStatsModal(habitId, monthYearKey);
  };

  return (
    <>
      {/* Header */}
      <AppHeader
        leftElement={<CheckSquare className="w-5 h-5 text-text-primary" />}
        title={tApp('app.habitTracker')}
        rightElement={
          <div className="flex items-center gap-2">
            <Button
              onClick={openAddHabitModal}
              variant="default"
              size="sm"
              title={tHabits('habit.addHabit')}
              aria-label={tHabits('habit.addHabit')}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                {tHabits('habit.addHabit')}
              </span>
            </Button>
            <VacationManagerButton />
            <HabitsFilterButton />
            <ArchiveHeaderButton />
          </div>
        }
      />

      {/* Main Content */}
      <PageContainer>
        {/* Grid-контейнер для всех рядов */}
        {/* 
          Адаптивная сетка с CSS переменными:
          - Desktop (1024px-1440px): 200px | 1fr | 200px
          - Large Desktop (1440px-1920px): 260px | 1fr | 240px
          - Ultra-wide (2560px+): 300px | 1fr | 280px
          
          Использует --grid-side-column (левая) и --grid-side-column-right (правая) 
          из theme.css, которые автоматически меняются через media queries
          
          min-height: занимает всю высоту экрана минус хедер и padding
          grid-template-rows: auto 1fr - верхняя секция по контенту, календарь растягивается
        */}
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: 'var(--grid-side-column) 1fr var(--grid-side-column-right)',
            gridTemplateRows: 'var(--tracker-header-height) 1fr',
            minHeight: 'var(--page-content-min-height)',
            gap: 'var(--grid-main-gap)'
          }}
        >
          {/* ========== РЯД 1: Верхняя секция ========== */}
          {/* Навигация по месяцам */}
          <HabitMonthNavigation />
          
          {/* Дневные прогресс-бары */}
          <HabitDailyProgressBars 
            habits={filteredHabits}
          />

          {/* Круговой индикатор прогресса месяца */}
          <HabitMonthlyCircle 
            habits={filteredHabits}
          />

          {/* ========== РЯД 2: Основная секция ========== */}
          {/* Единый виджет календаря (внутри имеет свою структуру 220px | 1fr | 220px) */}
          {/* Растягивается на всю доступную высоту (flex) */}
          <div className="col-span-3 flex flex-col">
            <HabitCalendar
              habits={filteredHabits}
              dateConfig={dateConfig}
              onStatsClick={handleStatsClick}
            />
          </div>

          {/* ========== РЯД 3: Секция аналитики ========== */}
          {/* Дневной график выполнения */}
          {/* <HabitDailyChart
            habits={filteredHabits}
            dateConfig={dateConfig}
          /> */}

          {/* Топ-10 привычек */}
          {/* <div className="col-span-2">
            <HabitTop10
              habits={filteredHabits}
              dateConfig={dateConfig}
            />
          </div> */}
        </div>
      </PageContainer>
    </>
  );
}
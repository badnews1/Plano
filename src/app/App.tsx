/**
 * Главный компонент приложения Habit Tracker
 * 
 * Мигрирован на Zustand для централизованного управления состоянием.
 * Все данные (привычки, категории, цели) и UI состояние теперь хранятся в store.
 * 
 * @module App
 * @see /app/store/index.ts
 * @optimized 16 декабря 2025 - оптимизация производительности с useShallow
 * @updated 17 декабря 2025 - добавлена система авторизации и public/private routes
 */

import React, { useEffect, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '@/app/i18n'; // Инициализация i18n
import { AuthProvider, ErrorBoundary } from '@/app/contexts';
import { AppRouter } from '@/app/router';
import { HabitsNotificationManager } from '@/features/habit-notifications';
import { NotificationPermissionBanner } from '@/features/notifications-permission';
import { AppModals } from '@/app/providers';
import { Toaster } from '@/components/ui/sonner';
import type { Habit, Mood } from '@/entities/habit';
import { getDaysInMonth } from '@/shared/lib/date';
import { useHabitsStore, useShallow } from '@/app/store';
import { recalculateStrength } from '@/entities/habit/lib/strength/strengthCalculator';
import { useTheme } from '@/features/theme-switcher';
import { useLanguage } from '@/features/language-switcher';
import { OfflineIndicator } from '@/features/offline-indicator';
import { registerServiceWorker } from '@/shared/lib/offline';

interface NumericInputModalState {
  isOpen: boolean;
  habit: Habit | null;
  date: string;
}

interface StatsModalState {
  isOpen: boolean;
  habit: Habit | null;
}

interface NoteModalState {
  isOpen: boolean;
  habit: Habit | null;
  date: string;
}

interface AppContentProps {
  habits: Habit[];
  numericInputModal: NumericInputModalState;
  statsModal: StatsModalState;
  noteModal: NoteModalState;
  isMonthYearPickerOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  isAddHabitModalOpen: boolean;
  monthDays: { date: Date; dayOfWeek: number }[];
  onNumericInputClose: () => void;
  onNumericInputSave: (value: number) => void;
  onStatsClose: () => void;
  onMonthYearSelect: (month: number, year: number) => void;
  onMonthYearClose: () => void;
  onAddHabitClose: () => void;
  onAddHabit: (habit: Habit) => void;
  onNoteClose: () => void;
  onNoteSave: (note: string, mood?: Mood) => void;
  onDisableNotes: () => void;
  closeNumericInputModal: () => void;
  closeStatsModal: () => void;
  closeNoteModal: () => void;
  toggleCompletion: (habitId: string, date: string) => void;
}

export default function App() {
  // ==================== I18N ====================
  const { t } = useTranslation('common');

  // ==================== THEME ====================
  // Инициализация темы из localStorage
  useTheme();

  // ==================== LANGUAGE ====================
  // Инициализация языка из store
  useLanguage();

  // ==================== ZUSTAND STORE ====================
  // ⚡ ОПТИМИЗАЦИЯ: используем useShallow для подписки только на нужные поля
  const {
    // Данные
    habits,
    
    // UI состояние
    selectedMonth,
    selectedYear,
    
    // Модальные окна
    numericInputModal,
    statsModal,
    noteModal,
    isMonthYearPickerOpen,
    isAddHabitModalOpen,
    
    // Actions: UI
    setSelectedDate,
    
    // Actions: Модальные окна
    closeAddHabitModal,
    closeNumericInputModal,
    closeStatsModal,
    closeMonthYearPicker,
    closeNoteModal,
    
    // Actions: Привычки
    addHabit,
    updateHabit,
    toggleCompletion,
    
    // Actions: Внутренние
    updateHabitsStrength,
  } = useHabitsStore(
    useShallow((state) => ({
      // Данные
      habits: state.habits,
      
      // UI состояние
      selectedMonth: state.selectedMonth,
      selectedYear: state.selectedYear,
      
      // Модальные окна
      numericInputModal: state.numericInputModal,
      statsModal: state.statsModal,
      noteModal: state.noteModal,
      isMonthYearPickerOpen: state.isMonthYearPickerOpen,
      isAddHabitModalOpen: state.isAddHabitModalOpen,
      
      // Actions: UI
      setSelectedDate: state.setSelectedDate,
      
      // Actions: Модальные окна
      closeAddHabitModal: state.closeAddHabitModal,
      closeNumericInputModal: state.closeNumericInputModal,
      closeStatsModal: state.closeStatsModal,
      closeMonthYearPicker: state.closeMonthYearPicker,
      closeNoteModal: state.closeNoteModal,
      
      // Actions: Привычки
      addHabit: state.addHabit,
      updateHabit: state.updateHabit,
      toggleCompletion: state.toggleCompletion,
      
      // Actions: Внутренние
      updateHabitsStrength: state.updateHabitsStrength,
    }))
  );

  // ==================== EFFECTS ====================
  
  // Регистрация Service Worker для offline-режима
  useEffect(() => {
    registerServiceWorker();
  }, []);
  
  // Обновляем силу привычек при загрузке приложения (новый день)
  useEffect(() => {
    updateHabitsStrength();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Только при монтировании

  // ==================== COMPUTED VALUES ====================
  
  const monthDays = getDaysInMonth(selectedMonth, selectedYear);

  // ==================== MODAL HANDLERS ====================
  
  // ⚡ ОПТИМИЗАЦИЯ: используем useCallback для стабильности ссылок
  const handleNumericInputSave = useCallback((habitId: string, date: string, value: number) => {
    const habit = habits.find((h) => h.id === habitId);
    
    if (habit) {
      const newCompletions = { ...habit.completions };
      const newSkipped = { ...habit.skipped };
      
      newCompletions[date] = value;
      
      // Если привычка была заморожена на этот день, снимаем заморозку
      if (newSkipped[date]) {
        delete newSkipped[date];
      }
      
      const updatedHabit = {
        ...habit,
        completions: newCompletions,
        skipped: newSkipped,
      };
      
      // Пересчитываем силу привычки с передачей даты изменения
      const habitWithStrength = recalculateStrength(updatedHabit, date);
      updateHabit(habit.id, habitWithStrength);
    }
  }, [habits, updateHabit]);

  // ⚡ ОПТИМИЗАЦИЯ: используем useCallback для стабильности ссылок
  const handleMonthYearSelect = useCallback((month: number, year: number) => {
    setSelectedDate(month, year);
    closeMonthYearPicker();
  }, [setSelectedDate, closeMonthYearPicker]);

  // ⚡ ОПТИМИЗАЦИЯ: используем useCallback для стабильности ссылок
  const handleNoteSave = useCallback((note: string, mood?: Mood) => {
    const { habit, date } = noteModal;
    
    if (habit) {
      const newNotes = { ...habit.notes };
      const newMoods = { ...habit.moods };
      
      if (note.trim() === '') {
        // Если заметка пустая, удаляем ее
        delete newNotes[date];
      } else {
        // Иначе сохраняем
        newNotes[date] = note;
      }
      
      // Сохраняем настроение если оно передано
      if (mood) {
        newMoods[date] = mood;
      }
      
      updateHabit(habit.id, { notes: newNotes, moods: newMoods });
    }
  }, [noteModal, updateHabit]);

  // ⚡ ОПТИМИЗАЦИЯ: используем useCallback для стабильности ссылок
  const handleDisableNotes = useCallback(() => {
    const { habit } = noteModal;
    if (habit) {
      updateHabit(habit.id, { notesEnabled: false });
    }
  }, [noteModal, updateHabit]);

  // ==================== RENDER ====================
  
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          {/* Notification Manager */}
          <HabitsNotificationManager habits={habits} />
          
          {/* Router */}
          <AppRouter />

          {/* All Modals */}
          <AppModals
            numericInputModal={numericInputModal}
            statsModal={statsModal}
            noteModal={noteModal}
            habits={habits}
            onNumericInputClose={closeNumericInputModal}
            onNumericInputSave={handleNumericInputSave}
            onStatsClose={closeStatsModal}
            isMonthYearPickerOpen={isMonthYearPickerOpen}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthYearSelect={handleMonthYearSelect}
            onMonthYearClose={closeMonthYearPicker}
            isAddHabitModalOpen={isAddHabitModalOpen}
            onAddHabitClose={closeAddHabitModal}
            onAddHabit={addHabit}
            onNoteClose={closeNoteModal}
            onNoteSave={handleNoteSave}
            onDisableNotes={handleDisableNotes}
            onCompleteHabit={toggleCompletion}
            daysInMonth={monthDays.length}
          />
          
          <NotificationPermissionBanner />
          <Toaster />
          <OfflineIndicator />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
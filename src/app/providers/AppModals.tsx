/**
 * Централизованный менеджер модальных окон приложения
 * 
 * Управляет отображением всех модальных окон:
 * - MonthYearPicker - выбор месяца/года
 * - AddHabitModalTabs - добавление новой привычки (новый дизайн с табами)
 * - EditHabitModal - редактирование привычки (использует store)
 * - NumericInputModal - ввод числового значения для измеримой привычки
 * - HabitStatisticsModal - статистика привычки
 * - HabitNoteModal - добавление/редактирование заметки к привычке
 * - ArchiveButton - архивация привычки
 * - TimerModal - таймер для привычки (управляется через useTimerStore)
 * 
 * @module app/providers/AppModals
 * @updated 1 декабря 2025 - удалена ManageHabitsModal (заменена на страницу /manage)
 * @updated 2 декабря 2025 - миграция из /core/modals/ в /app/providers/ (FSD архитектура)
 * @updated 5 декабря 2025 - добавлена EditHabitModal (FSD разделение create/edit)
 * @updated 8 декабря 2025 - заменена AddHabitModal на AddHabitModalTabs (новый дизайн)
 * @updated 18 декабря 2025 - TimerModal теперь управляется через useTimerStore (не через props)
 * @see /app/store/slices/modals.ts
 */

import { MonthYearPicker } from '@/features/date-navigation';
import { NumericInputModal } from '@/features/habit-checkbox';
import { AddHabitModalTabs } from '@/features/habit-create';
import { EditHabitModal } from '@/features/habit-edit';
import { HabitStatisticsModal } from '@/features/habit-stats';
import { HabitNoteModal, HabitNotesList, EditNoteModal } from '@/features/habit-notes';
import { ArchiveButton } from '@/features/habit-archive';
import { TimerModal } from '@/features/timer';
import type { Habit, Mood, HabitData } from '@/entities/habit';
import { declineUnit } from '@/shared/lib/text';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import React from 'react';

interface AppModalsProps {
  // Month/Year Picker
  isMonthYearPickerOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearSelect: (month: number, year: number) => void;
  onMonthYearClose: () => void;

  // Add Habit Modal
  isAddHabitModalOpen: boolean;
  onAddHabitClose: () => void;
  onAddHabit: (habitData: HabitData) => void;
  daysInMonth: number;

  // Numeric Input Modal
  numericInputModal: { habitId: string; date: string } | null;
  habits: Habit[];
  onNumericInputClose: () => void;
  onNumericInputSave: (habitId: string, date: string, value: number) => void;

  // Note Modal
  noteModal: { habitId: string; date: string } | null;
  onNoteClose: () => void;
  onNoteSave: (habitId: string, date: string, note: string, mood?: Mood) => void;
  onDisableNotes: (habitId: string) => void;

  // Stats Modal
  statsModal: { habitId: string; monthYearKey: string } | null;
  onStatsClose: () => void;

  // Completion Handler
  onCompleteHabit: (habitId: string, date: string) => void;
}

export function AppModals({
  isMonthYearPickerOpen,
  selectedMonth,
  selectedYear,
  onMonthYearSelect,
  onMonthYearClose,
  isAddHabitModalOpen,
  onAddHabitClose,
  onAddHabit,
  daysInMonth,
  numericInputModal,
  habits,
  onNumericInputClose,
  onNumericInputSave,
  statsModal,
  onStatsClose,
  noteModal,
  onNoteClose,
  onNoteSave,
  onDisableNotes,
  onCompleteHabit,
}: AppModalsProps) {
  // ⚡ ОПТИМИЗАЦИЯ: объединяем все вызовы store в один с useShallow
  const { habitToEdit, closeEditHabitModal, updateHabit } = useHabitsStore(
    useShallow((state) => ({
      habitToEdit: state.habitToEdit,
      closeEditHabitModal: state.closeEditHabitModal,
      updateHabit: state.updateHabit,
    }))
  );

  // Находим привычку для NumericInputModal
  const numericHabit = numericInputModal
    ? habits.find((h) => h.id === numericInputModal.habitId)
    : null;

  // Находим привычку для StatsModal
  const statsHabit = statsModal
    ? habits.find((h) => h.id === statsModal.habitId)
    : null;

  // State для модалки редактирования заметки в HabitStatisticsModal
  const [editNoteOpen, setEditNoteOpen] = React.useState(false);
  const [editNoteDate, setEditNoteDate] = React.useState<string>('');
  const [editNoteText, setEditNoteText] = React.useState<string>('');
  const [editNoteMood, setEditNoteMood] = React.useState<Mood | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = React.useState(statsModal?.monthYearKey || '');

  // Синхронизируем calendarMonth при изменении statsModal
  React.useEffect(() => {
    if (statsModal?.monthYearKey) {
      setCalendarMonth(statsModal.monthYearKey);
    }
  }, [statsModal?.monthYearKey]);

  // Обработчик редактирования заметки
  const handleEditNote = (date: string, currentNote: string) => {
    if (statsHabit) {
      setEditNoteDate(date);
      setEditNoteText(currentNote);
      setEditNoteMood(statsHabit.moods?.[date]);
      setEditNoteOpen(true);
    }
  };

  // Обработчик сохранения отредактированной заметки
  const handleSaveEditedNote = (note: string, mood?: Mood) => {
    if (statsHabit) {
      const newNotes = { ...statsHabit.notes };
      const newMoods = { ...statsHabit.moods };
      
      if (note.trim() === '') {
        delete newNotes[editNoteDate];
      } else {
        newNotes[editNoteDate] = note;
      }
      
      if (mood) {
        newMoods[editNoteDate] = mood;
      }
      
      updateHabit(statsHabit.id, { notes: newNotes, moods: newMoods });
    }
  };

  // Обработчик удаления заметки
  const handleDeleteNote = (date: string) => {
    if (statsHabit) {
      const newNotes = { ...statsHabit.notes };
      delete newNotes[date];
      updateHabit(statsHabit.id, { notes: newNotes });
    }
  };

  return (
    <>
      {/* Month/Year Picker Dialog */}
      <MonthYearPicker
        isOpen={isMonthYearPickerOpen}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onSelect={onMonthYearSelect}
        onClose={onMonthYearClose}
      />

      {/* Add Habit Modal */}
      <AddHabitModalTabs
        isOpen={isAddHabitModalOpen}
        onClose={onAddHabitClose}
        onAdd={onAddHabit}
        daysInMonth={daysInMonth}
      />

      {/* Edit Habit Modal */}
      <EditHabitModal
        footerLeftActions={
          habitToEdit ? (
            <ArchiveButton
              habitId={habitToEdit.id}
              habitName={habitToEdit.name}
              onArchived={closeEditHabitModal}
            />
          ) : null
        }
      />

      {/* Numeric Input Modal */}
      {numericInputModal && numericHabit && (
        <NumericInputModal
          isOpen={true}
          onClose={onNumericInputClose}
          habitName={numericHabit.name}
          date={numericInputModal.date}
          currentValue={
            typeof numericHabit.completions[numericInputModal.date] === 'number'
              ? (numericHabit.completions[numericInputModal.date] as number)
              : ''
          }
          unit={numericHabit.unit}
          targetValue={numericHabit.targetValue}
          targetType={numericHabit.targetType}
          onSave={(value) => onNumericInputSave(numericInputModal.habitId, numericInputModal.date, value)}
          declineUnit={declineUnit}
          notesEnabled={numericHabit.notesEnabled}
          currentNote={numericHabit.notes?.[numericInputModal.date] || ''}
          currentMood={numericHabit.moods?.[numericInputModal.date] || 'laugh'}
          onNoteSave={(note) => onNoteSave(numericInputModal.habitId, numericInputModal.date, note)}
          onMoodSave={(mood) => onNoteSave(numericInputModal.habitId, numericInputModal.date, '', mood)}
          onDisableNotes={() => onDisableNotes(numericInputModal.habitId)}
        />
      )}

      {/* Stats Modal */}
      {statsModal && statsHabit && (
        <HabitStatisticsModal
          habit={statsHabit}
          onClose={onStatsClose}
          monthYearKey={statsModal.monthYearKey}
          onMonthChange={setCalendarMonth}
          rightColumnContent={
            <HabitNotesList
              habit={statsHabit}
              monthYearKey={calendarMonth}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          }
          additionalModals={
            editNoteOpen && (
              <EditNoteModal
                isOpen={editNoteOpen}
                onClose={() => setEditNoteOpen(false)}
                habitName={statsHabit.name}
                date={editNoteDate}
                currentNote={editNoteText}
                currentMood={editNoteMood}
                onSave={handleSaveEditedNote}
              />
            )
          }
        />
      )}

      {/* Note Modal */}
      {noteModal && (() => {
        const noteHabit = habits.find((h) => h.id === noteModal.habitId);
        return noteHabit ? (
          <HabitNoteModal
            onClose={onNoteClose}
            habit={noteHabit}
            date={noteModal.date}
            onSave={(note, mood) => onNoteSave(noteModal.habitId, noteModal.date, note, mood)}
            onDisableNotes={() => onDisableNotes(noteModal.habitId)}
          />
        ) : null;
      })()}

      {/* Timer Modal */}
      <TimerModal
        habits={habits}
        onCompleteHabit={onCompleteHabit}
      />
    </>
  );
}
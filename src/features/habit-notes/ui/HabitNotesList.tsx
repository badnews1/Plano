/**
 * Список заметок привычки за выбранный месяц
 * 
 * Отображает все заметки привычки в хронологическом порядке (новые сверху).
 * Каждая заметка может быть отредактирована или удалена.
 * 
 * @module features/habit-notes/ui/HabitNotesList
 * @created 12 декабря 2025
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Habit, Mood } from '@/entities/habit';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Angry, Frown, Meh, Smile, Laugh } from '@/shared/assets/icons/system';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MOOD_ICONS: Record<Mood, { Icon: typeof Angry; color: string }> = {
  angry: { Icon: Angry, color: 'var(--palette-red-text)' },
  frown: { Icon: Frown, color: 'var(--palette-orange-text)' },
  meh: { Icon: Meh, color: 'var(--palette-sky-text)' },
  smile: { Icon: Smile, color: 'var(--palette-purple-text)' },
  laugh: { Icon: Laugh, color: 'var(--palette-green-text)' },
};

interface HabitNotesListProps {
  habit: Habit;
  monthYearKey: string;
  onEdit: (date: string, currentNote: string) => void;
  onDelete: (date: string) => void;
}

export function HabitNotesList({
  habit,
  monthYearKey,
  onEdit,
  onDelete,
}: HabitNotesListProps) {
  const { t } = useTranslation(['habits', 'common']);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dateToDelete, setDateToDelete] = useState<string | null>(null);

  // Парсим monthYearKey (например, "2024-11" -> год=2024, месяц=11)
  const parts = monthYearKey.split('-').map(Number);
  const year = parts[0] ?? new Date().getFullYear();
  const month = parts[1] ?? 1;

  // Фильтруем заметки за выбранный месяц
  const monthNotes = Object.entries(habit.notes || {})
    .filter(([date]) => {
      const noteDate = new Date(date);
      return noteDate.getFullYear() === year && noteDate.getMonth() === month - 1;
    })
    .sort((a, b) => {
      // Сортируем по дате (новые сверху)
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });

  const handleDeleteClick = (date: string) => {
    setDateToDelete(date);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (dateToDelete) {
      onDelete(dateToDelete);
      setDeleteDialogOpen(false);
      setDateToDelete(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (monthNotes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="text-[var(--text-tertiary)] text-sm">
          {t('habits:habit.noNotes', 'Нет заметок за этот месяц')}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {monthNotes.map(([date, note]) => {
          const mood = habit.moods?.[date];
          const moodData = mood ? MOOD_ICONS[mood] : null;
          const MoodIcon = moodData?.Icon;

          return (
            <div
              key={date}
              className="p-3 rounded-md bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-[var(--text-secondary)]">
                    {formatDate(date)}
                  </div>
                  {/* Иконка настроения рядом с датой */}
                  {MoodIcon && moodData && (
                    <MoodIcon
                      className="w-4 h-4"
                      style={{ color: moodData.color }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(date, note)}
                    className="h-6 w-6 p-0 hover:bg-[var(--surface-hover)]"
                    title={t('common:common.edit', 'Редактировать')}
                  >
                    <Pencil className="h-3 w-3 text-[var(--text-tertiary)]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(date)}
                    className="h-6 w-6 p-0 hover:bg-[var(--surface-hover)]"
                    title={t('common:common.delete', 'Удалить')}
                  >
                    <Trash2 className="h-3 w-3 text-[var(--palette-red-text)]" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap break-words">
                {note}
              </p>
            </div>
          );
        })}
      </div>

      {/* AlertDialog для подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('common:common.confirmDelete', 'Подтвердите удаление')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('habits:habit.deleteNoteConfirm', 'Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('common:common.cancel', 'Отмена')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {t('common:common.delete', 'Удалить')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
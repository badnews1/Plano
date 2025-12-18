/**
 * Модальное окно для добавления заметки к привычке
 * 
 * Открывается после того как пользователь отмечает выполнение бинарной привычки,
 * если для этой привычки включены заметки.
 * 
 * @module features/habit-notes/ui/HabitNoteModal
 * @created 12 декабря 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import type { Habit, Mood } from '@/entities/habit';
import { Angry, Frown, Meh, Smile, Laugh, Check, Power } from '@/shared/assets/icons/system';
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

interface HabitNoteModalProps {
  isOpen?: boolean;
  onClose: () => void;
  habit: Habit;
  date: string;
  onSave: (note: string, mood?: Mood) => void;
  onDisableNotes?: () => void;
}

const MAX_NOTE_LENGTH = 500;

const MOODS: { type: Mood; Icon: typeof Angry; color: string }[] = [
  { type: 'angry', Icon: Angry, color: 'var(--palette-red-text)' },
  { type: 'frown', Icon: Frown, color: 'var(--palette-orange-text)' },
  { type: 'meh', Icon: Meh, color: 'var(--palette-sky-text)' },
  { type: 'smile', Icon: Smile, color: 'var(--palette-purple-text)' },
  { type: 'laugh', Icon: Laugh, color: 'var(--palette-green-text)' },
];

export function HabitNoteModal({
  isOpen = true,
  onClose,
  habit,
  date,
  onSave,
  onDisableNotes,
}: HabitNoteModalProps) {
  const { t } = useTranslation(['habits', 'common']);
  const currentNote = habit.notes?.[date] || '';
  const currentMood = habit.moods?.[date] || 'laugh';
  const [note, setNote] = useState(currentNote);
  const [selectedMood, setSelectedMood] = useState<Mood>(currentMood);
  const [showDisableAlert, setShowDisableAlert] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      const currentNote = habit.notes?.[date] || '';
      const currentMood = habit.moods?.[date] || 'laugh';
      setNote(currentNote);
      setSelectedMood(currentMood);
      // Фокусируем textarea с небольшой задержкой
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, habit, date]);

  // Форматируем дату в формат "December 3, 2025"
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSave = () => {
    onSave(note.trim(), selectedMood);
    onClose();
  };

  const handleSkip = () => {
    onSave('', selectedMood); // Сохраняем пустую строку с настроением
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_NOTE_LENGTH) {
      setNote(newValue);
    }
  };

  const handleDisableNotes = () => {
    if (onDisableNotes) {
      onDisableNotes();
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Modal.Root level="modal" onClose={onClose}>
          <Modal.Backdrop onClick={onClose} />
          <Modal.Container size="md">
            <Modal.GradientLine />
            <Modal.Header 
              title={habit.name}
              subtitle={formattedDate}
              icon={
                <div className="w-10 h-10 rounded-md bg-[var(--accent-primary-indigo)] flex items-center justify-center">
                  <Check className="w-4 h-4" style={{ color: 'var(--accent-text-indigo)' }} />
                </div>
              }
              onClose={onClose}
            />

            <Modal.Content>
              <div className="px-6 pt-[16px] pb-[24px] space-y-4 pr-[24px] pl-[24px]">
                {/* Выбор настроения */}
                <div>
                  <div className="flex gap-3 justify-center" role="group" aria-label="Select mood">
                    {MOODS.map(({ type, Icon, color }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedMood(type)}
                        className="p-2 transition-transform hover:scale-110 active:scale-95"
                        aria-label={`Mood: ${type}`}
                        aria-pressed={selectedMood === type}
                      >
                        <Icon
                          className="w-7 h-7"
                          style={{
                            color: selectedMood === type ? color : 'var(--text-tertiary)',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Textarea
                    id="habit-note"
                    ref={textareaRef}
                    value={note}
                    onChange={handleChange}
                    placeholder={t('habits:habit.notePlaceholder', 'Добавьте заметку к этому дню...')}
                    rows={4}
                    maxLength={MAX_NOTE_LENGTH}
                    className="resize-none"
                    aria-label={t('habits:habit.notePlaceholder', 'Добавьте заметку к этому дню...')}
                  />
                </div>
              </div>
            </Modal.Content>

            <Modal.Footer>
              {onDisableNotes && (
                <Button
                  variant="ghostDestructive"
                  size="icon"
                  onClick={() => setShowDisableAlert(true)}
                  className="mr-auto"
                  title={t('habits:habit.disableNotes', 'Отключить заметки')}
                >
                  <Power className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSkip}
              >
                {t('common:common.skip')}
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
              >
                {t('common:common.save')}
              </Button>
            </Modal.Footer>
          </Modal.Container>
        </Modal.Root>
      )}

      {/* AlertDialog для подтверждения отключения заметок */}
      <AlertDialog open={showDisableAlert} onOpenChange={setShowDisableAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('habits:habit.disableNotesTitle', 'Отключить заметки?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('habits:habit.disableNotesDescription', 'Заметки больше не будут появляться после отметки выполнения привычки. Ранее созданные заметки останутся доступны в статистике привычки.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('common:common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDisableNotes}>
              {t('common:common.disable', 'Отключить')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
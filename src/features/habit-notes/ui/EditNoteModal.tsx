/**
 * Модальное окно для редактирования заметки
 * 
 * Используется для редактирования существующей заметки из списка в статистике.
 * 
 * @module features/habit-notes/ui/EditNoteModal
 * @created 12 декабря 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import type { Mood } from '@/entities/habit';
import { Angry, Frown, Meh, Smile, Laugh } from '@/shared/assets/icons/system';

interface EditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  date: string;
  currentNote: string;
  currentMood?: Mood;
  onSave: (note: string, mood?: Mood) => void;
}

const MAX_NOTE_LENGTH = 500;

const MOODS: { type: Mood; Icon: typeof Angry; color: string }[] = [
  { type: 'angry', Icon: Angry, color: 'var(--palette-red-text)' },
  { type: 'frown', Icon: Frown, color: 'var(--palette-orange-text)' },
  { type: 'meh', Icon: Meh, color: 'var(--palette-sky-text)' },
  { type: 'smile', Icon: Smile, color: 'var(--palette-purple-text)' },
  { type: 'laugh', Icon: Laugh, color: 'var(--palette-green-text)' },
];

export function EditNoteModal({
  isOpen,
  onClose,
  habitName,
  date,
  currentNote,
  currentMood,
  onSave,
}: EditNoteModalProps) {
  const { t } = useTranslation(['habits', 'common']);
  const [note, setNote] = useState(currentNote);
  const [mood, setMood] = useState<Mood | undefined>(currentMood);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNote(currentNote);
      setMood(currentMood);
      // Фокусируем textarea с небольшой задержкой
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, currentNote, currentMood]);

  // Форматируем дату в формат "ДД.ММ.ГГГГ"
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  });

  const handleSave = () => {
    onSave(note.trim(), mood);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_NOTE_LENGTH) {
      setNote(newValue);
    }
  };

  const handleMoodChange = (newMood: Mood) => {
    setMood(newMood);
  };

  return (
    <>
      {isOpen && (
        <Modal.Root level="overlay" onClose={onClose}>
          <Modal.Backdrop onClick={onClose} />
          <Modal.Container size="md">
            <Modal.Header 
              title={`${formattedDate} — ${habitName}`}
              onClose={onClose}
            />

            <Modal.Content>
              <div className="px-6 pt-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    {t('habits:habit.noteLabel', 'Заметка')}
                  </label>
                  <Textarea
                    ref={textareaRef}
                    value={note}
                    onChange={handleChange}
                    placeholder={t('habits:habit.notePlaceholder', 'Добавьте заметку к этому дню...')}
                    rows={5}
                    maxLength={MAX_NOTE_LENGTH}
                    className="resize-none"
                  />
                </div>

                {/* Выбор настроения */}
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    {t('habits:habit.moodLabel', 'Настроение')}
                  </label>
                  <div className="flex gap-3 justify-center">
                    {MOODS.map(({ type, Icon, color }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleMoodChange(type)}
                        className="p-2 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Icon
                          className="w-7 h-7"
                          style={{
                            color: mood === type ? color : 'var(--text-tertiary)',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Modal.Content>

            <Modal.Footer>
              <Button
                variant="outline"
                onClick={onClose}
              >
                {t('common:common.cancel', 'Отмена')}
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
              >
                {t('common:common.save', 'Сохранить')}
              </Button>
            </Modal.Footer>
          </Modal.Container>
        </Modal.Root>
      )}
    </>
  );
}
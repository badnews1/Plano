/**
 * 🔢 NumericInputModal
 * 
 * Модальное окно для ввода числового значения измеримой привычки.
 * 
 * Возможности:
 * - Ввод числа с автофокусом
 * - Отображение цели и прогресса
 * - Сохранение значения
 * - Enter для быстрого сохранения
 * 
 * @module features/habit-checkbox/ui/NumericInputModal
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 6 декабря 2025 - удалена кнопка заморозки (заменена на систему периодов отдыха)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Angry, Frown, Meh, Smile, Laugh, Hash, Power } from '@/shared/assets/icons/system';
import { useTranslation } from 'react-i18next';
import { declineUnit as declineUnitFn } from '@/shared/lib/text';
import type { Mood } from '@/entities/habit';
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

const MAX_NOTE_LENGTH = 500;

const MOODS: { type: Mood; Icon: typeof Angry; color: string }[] = [
  { type: 'angry', Icon: Angry, color: 'var(--palette-red-text)' },
  { type: 'frown', Icon: Frown, color: 'var(--palette-orange-text)' },
  { type: 'meh', Icon: Meh, color: 'var(--palette-sky-text)' },
  { type: 'smile', Icon: Smile, color: 'var(--palette-purple-text)' },
  { type: 'laugh', Icon: Laugh, color: 'var(--palette-green-text)' },
];

interface NumericInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  date: string;
  currentValue: number | '';
  unit?: string;
  targetValue?: number;
  targetType?: 'min' | 'max';
  onSave: (value: number) => void;
  declineUnit?: (value: number, unit: string) => string;
  notesEnabled?: boolean;
  currentNote?: string;
  currentMood?: Mood;
  onNoteSave?: (note: string) => void;
  onMoodSave?: (mood: Mood) => void;
  onDisableNotes?: () => void;
}

export function NumericInputModal({
  isOpen,
  onClose,
  habitName,
  date,
  currentValue,
  unit = '',
  targetValue,
  targetType,
  onSave,
  declineUnit,
  notesEnabled,
  currentNote = '',
  onNoteSave,
  currentMood,
  onMoodSave,
  onDisableNotes,
}: NumericInputModalProps) {
  const { t, i18n } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  const currentLanguage = i18n.language;
  const [value, setValue] = useState<string>(currentValue === '' ? '' : currentValue.toString());
  const [note, setNote] = useState(currentNote);
  const [showDisableAlert, setShowDisableAlert] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(currentValue === '' ? '' : currentValue.toString());
      setNote(currentNote || '');
      // Фокусируем input с небольшой задержкой, чтобы модалка успела открыться
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentValue, currentNote]);

  const numValue = value === '' ? 0 : parseFloat(value);
  const isMet = targetValue !== undefined && (
    targetType === 'min' ? numValue >= targetValue : numValue <= targetValue
  );

  // Форматируем дату в формат "December 13, 2025"
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const handleSave = () => {
    const finalValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(finalValue)) {
      onSave(finalValue);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Разрешаем только цифры и . или , для дробных чисел
    // Запрещаем отрицательные значения (знак минус)
    const validPattern = /^[0-9]*[.,]?[0-9]*$/;
    
    if (!validPattern.test(newValue)) {
      return; // Не обновляем значение, если оно не соответствует паттерну
    }
    
    // Ограничение на 7 символов
    if (newValue.length <= 7) {
      // Заменяем запятую на точку для корректного parseFloat
      const normalizedValue = newValue.replace(',', '.');
      setValue(normalizedValue);
    }
  };

  const handleSetTarget = () => {
    if (targetValue !== undefined) {
      onSave(targetValue);
      onClose();
    }
  };

  const handleIncrement = () => {
    const currentNum = value === '' ? 0 : parseFloat(value);
    const newValue = currentNum + 1;
    setValue(newValue.toString());
  };

  const handleDecrement = () => {
    const currentNum = value === '' ? 0 : parseFloat(value);
    const newValue = Math.max(0, currentNum - 1); // Не даём уйти в отрицательные
    setValue(newValue.toString());
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNote = e.target.value;
    if (newNote.length <= MAX_NOTE_LENGTH) {
      setNote(newNote);
    }
  };

  const handleNoteSave = () => {
    if (onNoteSave) {
      onNoteSave(note);
    }
  };

  const handleMoodSave = (mood: Mood) => {
    if (onMoodSave) {
      onMoodSave(mood);
    }
  };

  const handleDisableNotes = () => {
    if (onDisableNotes) {
      onDisableNotes();
    }
  };

  // Форматирование числа для кнопок быстрого выбора
  const formatQuickValue = (value: number): string => {
    if (value >= 1000) {
      const thousands = value / 1000;
      // Если делится нацело, показываем как "1k", иначе "2.5k"
      return thousands % 1 === 0 ? `${thousands}k` : `${thousands.toFixed(1)}k`;
    }
    return value.toString();
  };

  // Вычисляем значения для кнопок быстрого выбора (0, 25%, 50%, 75%, 100%)
  const quickValues = targetValue !== undefined ? [
    0,
    Math.round(targetValue * 0.25),
    Math.round(targetValue * 0.5),
    Math.round(targetValue * 0.75),
    targetValue
  ] : [];

  const handleQuickSelect = (quickValue: number) => {
    setValue(quickValue.toString());
  };

  return (
    <>
      {isOpen && (
        <Modal.Root level="modal" onClose={onClose}>
          <Modal.Backdrop onClick={onClose} />
          <Modal.Container size="md">
            <Modal.GradientLine />
            <Modal.Header 
              title={habitName}
              subtitle={formattedDate}
              icon={
                <div className="w-10 h-10 rounded-md bg-[var(--accent-primary-indigo)] flex items-center justify-center">
                  <Hash className="w-4 h-4" style={{ color: 'var(--accent-text-indigo)' }} />
                </div>
              }
              onClose={onClose}
            />

            <Modal.Content>
              {/* Блок ввода числа */}
              <div className="px-6 pt-6 pb-6 space-y-3">
                {/* Верхний ряд: TODAY'S PROGRESS и Goal */}
                <div className="flex items-baseline justify-between">
                  <Modal.FieldTitle className="!mb-0">
                    {t('habit.todayProgress', "TODAY'S PROGRESS")}
                  </Modal.FieldTitle>
                </div>

                {/* Основной блок с числом и кнопками */}
                <div className="relative rounded-md py-6 px-4 border" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-tertiary)' }}>
                  <div className="flex items-center justify-between gap-4">
                    {/* Кнопка уменьшения */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleDecrement}
                      className="w-12 h-12 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: 'var(--bg-quaternary)' }}
                      title={t('habit.decrease')}
                      aria-label={t('habit.decrease')}
                    >
                      <span className="text-xl" style={{ color: 'var(--text-secondary)' }}>−</span>
                    </Button>

                    {/* Число в центре */}
                    <div className="flex-1 flex flex-col items-center">
                      <Input
                        ref={inputRef}
                        type="text"
                        inputMode="decimal"
                        variant="borderless"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="text-center p-0 h-auto bg-transparent border-none"
                        style={{ 
                          color: 'var(--text-primary)',
                          fontSize: 'var(--text-2xl)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                        placeholder="0"
                        aria-label={t('habit.todayProgress', "TODAY'S PROGRESS")}
                      />
                      {unit && (
                        <span className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                          {unit}
                        </span>
                      )}
                    </div>

                    {/* Кнопка увеличения */}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleIncrement}
                      className="w-12 h-12 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: 'var(--bg-quaternary)' }}
                      title={t('habit.increase')}
                      aria-label={t('habit.increase')}
                    >
                      <span className="text-xl" style={{ color: 'var(--text-secondary)' }}>+</span>
                    </Button>
                  </div>

                  {/* Прогресс-бар */}
                  {targetValue !== undefined && targetValue > 0 && (
                    <div className="mt-4 space-y-2">
                      {/* Прогресс-бар */}
                      <div 
                        className="w-full h-2 rounded-full overflow-hidden" 
                        style={{ backgroundColor: 'var(--bg-quaternary)' }}
                        role="progressbar"
                        aria-valuenow={Math.min(100, Math.round((numValue / targetValue) * 100))}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${Math.round((numValue / targetValue) * 100)}% ${t('habit.complete', 'complete')}`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (numValue / targetValue) * 100)}%`,
                            backgroundColor: numValue >= targetValue ? 'var(--palette-green-text)' : 'var(--accent-primary-indigo)',
                          }}
                        />
                      </div>

                      {/* Информация о прогрессе */}
                      <div className="flex items-center justify-between text-xs">
                        <span style={{ color: numValue >= targetValue ? 'var(--palette-green-text)' : 'var(--accent-primary-indigo)' }}>
                          {Math.round((numValue / targetValue) * 100)}% {t('habit.complete', 'complete')}
                        </span>
                        <span style={{ color: 'var(--text-tertiary)' }}>
                          {numValue >= targetValue 
                            ? t('habit.goalReached', 'Goal reached!')
                            : `${targetValue - numValue} ${t('habit.toGo', 'to go')}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Кнопки быстрого выбора */}
                {quickValues.length > 0 && (
                  <div className="flex gap-2">
                    {quickValues.map((quickValue, index) => {
                      const isActive = numValue === quickValue;
                      const percentage = index * 25; // 0%, 25%, 50%, 75%, 100%
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleQuickSelect(quickValue)}
                          className="flex-1 h-[31px] rounded-sm transition-all"
                          style={{
                            backgroundColor: isActive ? 'var(--accent-muted-indigo)' : 'var(--bg-tertiary)',
                            color: isActive ? 'var(--accent-text-indigo)' : 'var(--text-tertiary)',
                            border: isActive ? '1px solid var(--ring)' : '1px solid var(--border-secondary)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-weight-normal)',
                            cursor: 'pointer',
                          }}
                          aria-label={`Set value to ${quickValue} (${percentage}%)`}
                        >
                          {formatQuickValue(quickValue)}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Поле заметки (если включено) */}
                {notesEnabled && (
                  <>
                    {/* Выбор настроения */}
                    <div>
                      <div className="flex gap-3 justify-center" role="group" aria-label="Select mood">
                        {MOODS.map(({ type, Icon, color }) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleMoodSave(type)}
                            className="p-2 transition-transform hover:scale-110 active:scale-95"
                            aria-label={`Mood: ${type}`}
                            aria-pressed={currentMood === type}
                          >
                            <Icon
                              className="w-7 h-7"
                              style={{
                                color: currentMood === type ? color : 'var(--text-tertiary)',
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Textarea
                        id="habit-note"
                        value={note}
                        onChange={handleNoteChange}
                        onBlur={handleNoteSave}
                        placeholder={t('habit.notePlaceholder', 'Добавьте заметку к этому дню...')}
                        rows={3}
                        maxLength={MAX_NOTE_LENGTH}
                        className="resize-none"
                        aria-label={t('habit.notePlaceholder', 'Добавьте заметку к этому дню...')}
                      />
                    </div>
                  </>
                )}
              </div>
            </Modal.Content>

            {/* Кнопки действий */}
            <Modal.Footer>
              {notesEnabled && onDisableNotes && (
                <Button
                  variant="ghostDestructive"
                  size="icon"
                  onClick={() => setShowDisableAlert(true)}
                  className="mr-auto"
                  title={t('habit.disableNotes', 'Отключить заметки')}
                >
                  <Power className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
              >
                {tCommon('common.cancel')}
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
              {t('habit.disableNotesTitle', 'Отключить заметки?')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('habit.disableNotesDescription', 'Заметки больше не будут появляться после отметки выполнения привычки. Ранее созданные заметки останутся доступны в статистике привычки.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {tCommon('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDisableNotes}>
              {tCommon('common.disable', 'Отключить')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
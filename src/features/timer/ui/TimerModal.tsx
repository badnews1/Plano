/**
 * 🕒 TimerModal - Глобальный таймер приложения
 * 
 * Управляется через useTimerStore (не через props).
 * Открытие: useTimerStore.setState({ isOpen: true })
 * Закрытие: автоматически через handleClose() внутри компонента
 * 
 * Режимы:
 * - Pomodoro: помодоро с настройкой работы/отдыха, привязкой к элементам (привычки и др.)
 * - Timer: обычный таймер обратного отсчета с возможностью привязки к элементам
 * 
 * Функционал:
 * - Сворачивание (время показывается в Sidebar)
 * - Помодоро: до 4 кастомных пресетов, привязка элементов, автоотметка
 * - Timer: настройка времени, привязка к элементам с включенным таймером
 * - Браузерные уведомления, title индикация, звук
 * 
 * @module features/timer/ui/TimerModal
 * @updated 16 декабря 2025
 * @updated 18 декабря 2025 - убрана зависимость от основного store, управление только через useTimerStore
 */

import React, { useState, useRef } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Timer as TimerIcon, 
  RotateCcw,
  Minimize2,
  X,
  Plus,
  Trash2,
  CirclePlay,
  CirclePause,
  StopCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Coffee,
  Sparkles,
  Link,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
} from '@/shared/assets/icons/system';
import { useTranslation } from 'react-i18next';
import type { Habit, Mood, HabitUpdateData } from '@/entities/habit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTimerStore } from '../model/store';
import { useTimerEngine } from '../lib/useTimerEngine';
import type { TimerMode, PomodoroPreset } from '../model/types';
import { useHabitsStore } from '@/app/store';
import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';

interface TimerModalProps {
  habits: Habit[];
  onCompleteHabit: (habitId: string, date: string) => void;
}

export function TimerModal({ habits, onCompleteHabit }: TimerModalProps) {
  const { t } = useTranslation(['common', 'habits', 'timer']);
  
  const {
    mode,
    state,
    isMinimized,
    isOpen,
    showConfirmation,
    pomodoroPhase,
    pomodoroPresets,
    selectedPresetId,
    workMinutes,
    breakMinutes,
    linkedHabitId,
    timeLeft,
    timerHours,
    timerMinutes,
    timerSeconds,
    currentSession,
    totalSessions,
    setMode,
    setMinimized,
    setOpen,
    setShowConfirmation,
    setPomodoroPhase,
    setWorkMinutes,
    setBreakMinutes,
    selectPreset,
    addPreset,
    removePreset,
    setTimerHours,
    setTimerMinutes,
    setTimerSeconds,
    setLinkedHabit,
    setTotalSessions,
    play,
    pause,
    reset,
    initialize,
    nextSession,
  } = useTimerStore();
  
  const [showAddPresetForm, setShowAddPresetForm] = useState(false);
  const [customWorkMinutes, setCustomWorkMinutes] = useState('25');
  const [customBreakMinutes, setCustomBreakMinutes] = useState('5');
  const [newPresetName, setNewPresetName] = useState('');
  const [sessionCount, setSessionCount] = useState(4);
  
  // Состояние для формы подтверждения
  const [completionValue, setCompletionValue] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [completionMood, setCompletionMood] = useState<Mood>('laugh');
  
  // Ref для автофокуса на поле названия пресета
  const presetNameInputRef = useRef<HTMLInputElement>(null);

  // Иконки настроений (те же, что в HabitNoteModal)
  const MOOD_OPTIONS: Array<{ type: Mood; Icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = [
    { type: 'angry', Icon: Angry, color: 'var(--palette-red-text)' },
    { type: 'frown', Icon: Frown, color: 'var(--palette-orange-text)' },
    { type: 'meh', Icon: Meh, color: 'var(--palette-sky-text)' },
    { type: 'smile', Icon: Smile, color: 'var(--palette-purple-text)' },
    { type: 'laugh', Icon: Laugh, color: 'var(--palette-green-text)' },
  ];

  // Инициализация store при первом рендере
  React.useEffect(() => {
    initialize();
  }, []);

  // Обработка ESC для закрытия формы добавления пресета (без закрытия модалки)
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddPresetForm) {
        e.preventDefault();
        e.stopPropagation();
        setShowAddPresetForm(false);
      }
    };

    if (showAddPresetForm) {
      document.addEventListener('keydown', handleEscape, true);
      return () => {
        document.removeEventListener('keydown', handleEscape, true);
      };
    }
  }, [showAddPresetForm]);

  // Автофокус на поле названия пресета при открытии формы
  React.useEffect(() => {
    if (showAddPresetForm && presetNameInputRef.current) {
      presetNameInputRef.current.focus();
    }
  }, [showAddPresetForm]);

  // Engine для управления таймером
  useTimerEngine({
    onComplete: () => {
      if (mode === 'pomodoro') {
        // Если элемент привязан и это режим без break → отмечаем элемент
        if (linkedHabitId && breakMinutes === 0) {
          const today = new Date().toISOString().split('T')[0];
          onCompleteHabit(linkedHabitId, today);
        }
        // Если есть break - экран Session Complete покажется автоматически (state = 'completed')
      }
      // Для Timer - логика завершения обрабатывается в useTimerEngine через showConfirmation
    },
  });

  // Закрытие модалки (X кнопка и Done кнопка)
  const handleClose = () => {
    // Закрываем форму добавления пресета при закрытии модалки
    setShowAddPresetForm(false);
    
    // Если таймер запущен - сворачиваем вместо закрытия
    if (state === 'running') {
      setMinimized(true);
    } else {
      // Иначе полностью закрываем и сбрасываем
      setOpen(false);
      setMinimized(false);
      reset();
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (state === 'idle') {
      setMode(newMode);
    }
  };

  // Функция для кругового переключения режимов
  const handlePrevMode = () => {
    if (state === 'idle') {
      setMode(mode === 'pomodoro' ? 'timer' : 'pomodoro');
    }
  };

  const handleNextMode = () => {
    if (state === 'idle') {
      setMode(mode === 'pomodoro' ? 'timer' : 'pomodoro');
    }
  };

  const handleStartBreak = () => {
    // nextSession() уже переключит на break и установит правильное время
    nextSession();
    // Запускаем таймер
    play();
  };

  const handleSkipBreak = () => {
    // Переходим сразу к следующей work-сессии, пропуская break
    nextSession(true); // ← Передаем флаг skipBreak
    // Запускаем таймер
    play();
  };

  // Обработчик изменения времени фокуса с валидацией
  const handleWorkMinutesChange = (value: string) => {
    // Разрешаем только цифры
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    // Если пустая строка - разрешаем (пользователь удаляет)
    if (value === '') {
      setCustomWorkMinutes('');
      return;
    }
    
    // Преобразуем в число и корректируем диапазон
    let numValue = parseInt(value);
    if (numValue < 1) {
      numValue = 1;
    } else if (numValue > 240) {
      numValue = 240;
    }
    
    setCustomWorkMinutes(numValue.toString());
  };

  // Обработчик изменения времени отдыха с валидацией
  const handleBreakMinutesChange = (value: string) => {
    // Разрешаем только цифры
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    // Если пустая строка - разрешаем (пользователь удаляет)
    if (value === '') {
      setCustomBreakMinutes('');
      return;
    }
    
    // Преобразуем в число и корректируем диапазон
    let numValue = parseInt(value);
    if (numValue < 1) {
      numValue = 1;
    } else if (numValue > 60) {
      numValue = 60;
    }
    
    setCustomBreakMinutes(numValue.toString());
  };

  const handleAddPreset = () => {
    const work = parseInt(customWorkMinutes) || 25;
    const breakTime = parseInt(customBreakMinutes) || 5;
    
    // Валидация
    if (work < 1 || work > 240) return;
    if (breakTime < 1 || breakTime > 60) return;
    
    const name = newPresetName.trim() || 'Custom';
    
    if (pomodoroPresets.length >= 4) { // Максимум 4 пресета
      return;
    }
    
    addPreset({ name, workMinutes: work, breakMinutes: breakTime });
    
    // Сброс формы
    setNewPresetName('');
    setCustomWorkMinutes('25');
    setCustomBreakMinutes('5');
    setShowAddPresetForm(false);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    if (mode === 'pomodoro') {
      const total = pomodoroPhase === 'work' ? workMinutes * 60 : breakMinutes * 60;
      return ((total - timeLeft) / total) * 100;
    } else if (mode === 'timer') {
      const total = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
      return total > 0 ? ((total - timeLeft) / total) * 100 : 0;
    }
    return 0;
  };

  const getTimeDisplay = (): string => {
    return formatTime(timeLeft);
  };

  const getStateColor = (): string => {
    if (state === 'running') return 'var(--text-primary)';
    if (state === 'paused') return 'var(--palette-yellow-text)';
    if (state === 'completed') return 'var(--palette-green-text)';
    return 'var(--text-tertiary)';
  };

  // Функция для получения подзаголовка в зависимости от фазы
  const getSubtitle = (): string => {
    if (state === 'paused') {
      return t('timer:subtitles.paused');
    }
    if (pomodoroPhase === 'work') {
      return t('timer:subtitles.workSession');
    }
    if (pomodoroPhase === 'longBreak') {
      return t('timer:subtitles.longBreak');
    }
    // pomodoroPhase === 'break'
    return t('timer:subtitles.shortBreak');
  };

  // Фильтруем элементы с включенным таймером (пока только привычки)
  const habitsWithTimer = habits.filter(h => h.timerEnabled && !h.isArchived);

  // Разделяем привычки на выполненные и невыполненные сегодня
  const today = new Date().toISOString().split('T')[0] ?? '';
  const completedHabits = habitsWithTimer.filter(h => {
    const completion = h.completions?.[today];
    return completion === true || typeof completion === 'number';
  });
  const notCompletedHabits = habitsWithTimer.filter(h => {
    const completion = h.completions?.[today];
    return !(completion === true || typeof completion === 'number');
  });

  // Текущий выбранный элемент для установки времени
  const handleHabitSelect = (habitId: string | null) => {
    setLinkedHabit(habitId);
    if (habitId) {
      const habit = habits.find(h => h.id === habitId);
      if (habit && habit.timerDefaultMinutes !== undefined && habit.timerDefaultSeconds !== undefined) {
        // Для режима Timer устанавливаем время таймера
        if (mode === 'timer') {
          setTimerMinutes(habit.timerDefaultMinutes);
          setTimerSeconds(habit.timerDefaultSeconds);
        } else if (mode === 'pomodoro') {
          // Для помодоро устанавливаем workMinutes
          setWorkMinutes(habit.timerDefaultMinutes);
        }
      }
    }
  };

  if (isMinimized) {
    return null; // Модалка скрыта, время показывается в Sidebar
  }
  
  // Не показываем модалку если она не была открыта пользователем
  if (!isOpen) {
    return null;
  }

  return (
    <Modal.Root level="modal" onClose={handleClose}>
      <Modal.Backdrop onClick={handleClose} />
      <Modal.Container size="md" maxHeight="610px" minHeight="610px">
        <Modal.GradientLine />
        
        {/* Хедер */}
        <Modal.Header 
          onClose={handleClose}
        />

        <Modal.Content className="px-6 py-4">
          {/* Панель настроек Pomodoro */}
          {state === 'idle' && mode === 'pomodoro' && (
            <div className="space-y-3">
              {/* Заголовок и описание */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevMode}
                    className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 
                    className="leading-none"
                    style={{ 
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      fontSize: '24px',
                    }}
                  >
                    Pomodoro
                  </h2>
                  <button
                    onClick={handleNextMode}
                    className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <p 
                  className="text-base"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {t('timer:description')}
                </p>
              </div>

              {/* Блок с временем */}
              <div className="rounded-md flex flex-col items-center gap-1 pt-[24px] pr-[24px] pb-[24px] pl-[24px] mb-6 p-[24px]">
                {/* Большое время */}
                <h1 
                  className="leading-none"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '300',
                    fontSize: '96px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {getTimeDisplay()}
                </h1>
              </div>

              {/* PRESETS */}
              <div className="rounded-md">
                <div 
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(pomodoroPresets.length + (pomodoroPresets.length < 4 ? 1 : 0), 4)}, 1fr)`
                  }}
                >
                  {pomodoroPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset.id)}
                      className="group relative w-full h-[48px] px-3 rounded-md transition-colors text-sm border cursor-pointer flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: selectedPresetId === preset.id ? 'var(--accent-muted-indigo)' : 'var(--bg-tertiary)',
                        color: selectedPresetId === preset.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        border: selectedPresetId === preset.id ? '1px solid var(--ring)' : '1px solid var(--border-tertiary)',
                      }}
                      aria-label={`${preset.name}: ${preset.workMinutes} minutes focus, ${preset.breakMinutes} minutes break`}
                      aria-pressed={selectedPresetId === preset.id}
                    >
                      <div className="text-sm">{preset.name}</div>
                      <div style={{ fontSize: '10px', opacity: 0.7 }}>{preset.workMinutes}{t('timer:session.minutes')} / {preset.breakMinutes}{t('timer:session.minutes')}</div>
                      
                      {/* Кнопка удаления внутри карточки */}
                      {pomodoroPresets.length > 1 && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            removePreset(preset.id);
                          }}
                          className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-destructive/70 hover:text-destructive cursor-pointer"
                          role="button"
                          aria-label={`Delete preset ${preset.name}`}
                        >
                          <X className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                  
                  {/* Кнопка добавления пресета */}
                  {pomodoroPresets.length < 4 && (
                    <button
                      onClick={() => setShowAddPresetForm(true)}
                      className="w-full h-[48px] px-3 rounded-md transition-colors text-sm border cursor-pointer flex items-center justify-center border-dashed gap-2"
                      style={{
                        backgroundColor: 'transparent',
                        color: 'var(--text-tertiary)',
                        border: '1px dashed var(--border-tertiary)',
                      }}
                    >
                      <Plus size={14} />
                      <span>Custom</span>
                    </button>
                  )}
                </div>
                
                {/* Форма добавления пресета */}
                {showAddPresetForm && (
                  <div className="mt-3 p-4 rounded-md space-y-3" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-secondary)' }}>
                    {/* Первая строка: Поле названия */}
                    <Input
                      id="preset-name"
                      placeholder={t('timer:preset.nameOptional')}
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      variant="secondary"
                      className="w-full"
                      maxLength={10}
                      showCharCount={true}
                      ref={presetNameInputRef}
                      aria-label={t('timer:preset.nameOptional')}
                    />
                    
                    {/* Вторая строка: Поля времени и кнопки */}
                    <div className="flex items-center gap-3">
                      {/* Группа инпутов и текстов */}
                      <div className="flex items-center gap-2">
                        {/* Work time */}
                        <Input
                          id="preset-work-time"
                          type="number"
                          min="1"
                          max="240"
                          value={customWorkMinutes}
                          onChange={(e) => handleWorkMinutesChange(e.target.value)}
                          className="w-[60px] text-center"
                          variant="secondary"
                          aria-label={`${t('timer:session.focus')} minutes`}
                        />
                        
                        {/* work */}
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{t('timer:session.focus')}</span>
                        
                        {/* / */}
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>/</span>
                        
                        {/* Break time */}
                        <Input
                          id="preset-break-time"
                          type="number"
                          min="1"
                          max="60"
                          value={customBreakMinutes}
                          onChange={(e) => handleBreakMinutesChange(e.target.value)}
                          className="w-[60px] text-center"
                          variant="secondary"
                          aria-label={`${t('timer:session.break')} minutes`}
                        />
                        
                        {/* break */}
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{t('timer:session.break')}</span>
                      </div>
                      
                      {/* Кнопки Отмена и Add */}
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowAddPresetForm(false)}
                        >
                          <X size={16} />
                        </Button>
                        <Button
                          variant="default"
                          size="icon"
                          onClick={handleAddPreset}
                        >
                          <Check size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Блок визуализации сессий */}
              <div 
                className="p-4 rounded-md"
                style={{ 
                  backgroundColor: 'var(--bg-tertiary)', 
                  border: '1px solid var(--border-tertiary)' 
                }}
              >
                {/* Заголовок и общее время */}
                <div className="flex items-center justify-between mb-3">
                  <Modal.FieldTitle className="!mb-0">
                    {t('timer:session.plan')}
                  </Modal.FieldTitle>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {breakMinutes === 0 ? (
                      (() => {
                        // Форматируем время в часы и минуты
                        const hours = Math.floor(workMinutes / 60);
                        const mins = workMinutes % 60;
                        const timeStr = hours > 0 
                          ? (mins > 0 ? `${hours}${t('timer:session.hours')} ${mins}${t('timer:session.minutes')}` : `${hours}${t('timer:session.hours')}`)
                          : `${workMinutes}${t('timer:session.minutes')}`;
                        return `${timeStr} ${t('timer:session.total')}`;
                      })()
                    ) : (() => {
                        // Учитываем длинный перерыв если сессий > 4
                        const hasLongBreak = sessionCount > 4;
                        const regularBreaks = hasLongBreak ? sessionCount - 2 : sessionCount - 1;
                        const longBreaks = hasLongBreak ? 1 : 0;
                        const totalMinutes = sessionCount * workMinutes + regularBreaks * breakMinutes + longBreaks * breakMinutes * 3;
                        
                        // Форматируем общее время в часы и минуты
                        const hours = Math.floor(totalMinutes / 60);
                        const mins = totalMinutes % 60;
                        const timeStr = hours > 0 
                          ? (mins > 0 ? `${hours}${t('timer:session.hours')} ${mins}${t('timer:session.minutes')}` : `${hours}${t('timer:session.hours')}`)
                          : `${totalMinutes}${t('timer:session.minutes')}`;
                        
                        const sessionsText = sessionCount === 1 ? t('timer:session.session') : t('timer:session.sessions');
                        return `${sessionCount} ${sessionsText} • ${timeStr} ${t('timer:session.total')}`;
                      })()
                    }
                  </span>
                </div>

                {/* Визуализация сессий */}
                <div className="flex items-center mb-3" style={{ gap: '6px', minHeight: '12px' }}>
                  {breakMinutes === 0 ? (
                    /* Сплошная полоса когда нет break */
                    <div 
                      className="h-2 rounded flex-1"
                      style={{ backgroundColor: 'var(--accent-primary-indigo)' }}
                    />
                  ) : (
                    /* Блоки + кружки когда есть break */
                    Array.from({ length: sessionCount }, (_, i) => {
                      const isLongBreak = i === 3 && sessionCount > 4;
                      return (
                        <div key={i} className="contents">
                          <div 
                            className="h-2 rounded flex-1"
                            style={{ backgroundColor: 'var(--accent-primary-indigo)' }}
                          />
                          {i < sessionCount - 1 && (
                            <div 
                              className="rounded-full flex-shrink-0"
                              style={{ 
                                backgroundColor: 'var(--palette-green-text)',
                                width: isLongBreak ? '12px' : '8px',
                                height: isLongBreak ? '12px' : '8px',
                              }}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Селектор количества сессий и легенда */}
                <div className="flex items-center justify-between">
                  {/* Легенда */}
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: 'var(--accent-primary-indigo)' }}
                      />
                      <span>{workMinutes}{t('timer:session.minutes')} {t('timer:session.focus')}</span>
                    </div>
                    {breakMinutes > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--palette-green-text)' }}
                        />
                        <span>
                          {breakMinutes}{t('timer:session.minutes')} {t('timer:session.break')}
                          {sessionCount > 4 && ` / ${breakMinutes * 3}${t('timer:session.minutes')} ${t('timer:session.longBreak')}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Кнопки +/- для выбора сессий */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSessionCount(Math.max(1, sessionCount - 1))}
                      disabled={breakMinutes === 0 || sessionCount <= 1}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: breakMinutes === 0 || sessionCount <= 1 ? 'var(--bg-quaternary)' : 'var(--bg-quaternary)',
                        color: breakMinutes === 0 || sessionCount <= 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        cursor: breakMinutes === 0 || sessionCount <= 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      −
                    </button>
                    <span 
                      className="text-sm min-w-[32px] text-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {sessionCount}x
                    </span>
                    <button
                      onClick={() => setSessionCount(Math.min(8, sessionCount + 1))}
                      disabled={breakMinutes === 0 || sessionCount >= 8}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: breakMinutes === 0 || sessionCount >= 8 ? 'var(--bg-quaternary)' : 'var(--bg-quaternary)',
                        color: breakMinutes === 0 || sessionCount >= 8 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                        cursor: breakMinutes === 0 || sessionCount >= 8 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Кнопка Start Focus */}
              <Button
                variant="default"
                size="lg"
                className="rounded-md flex items-center justify-center gap-3 w-full h-12"
                onClick={() => {
                  setTotalSessions(sessionCount);
                  play();
                }}
              >
                <CirclePlay className="size-3" />
                <span>{t('timer:actions.startFocus')}</span>
              </Button>
            </div>
          )}
          
          {/* Экран запущенного Pomodoro таймера */}
          {mode === 'pomodoro' && state !== 'idle' && state !== 'completed' && (
            <div className="space-y-3">
              {/* Текст текущей сессии */}
              <div className="flex flex-col items-center gap-2 mt-[0px] mr-[0px] mb-[16px] ml-[0px]">
                <h2 
                  className="leading-none"
                  style={{ 
                    color: state === 'paused' 
                      ? 'var(--palette-yellow-text)' 
                      : 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '24px',
                  }}
                >
                  {state === 'paused' ? (
                    t('timer:session.paused')
                  ) : pomodoroPhase === 'work' ? (
                    `${t('timer:session.session')} ${currentSession} ${t('timer:session.of')} ${totalSessions}`
                  ) : pomodoroPhase === 'longBreak' ? (
                    `${t('timer:session.longBreakAfter')} ${currentSession}`
                  ) : (
                    `${t('timer:session.breakAfter')} ${currentSession}`
                  )}
                </h2>
                <p 
                  className="text-base"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {getSubtitle()}
                </p>
              </div>

              {/* Большой таймер */}
              <div className="rounded-md flex flex-col items-center gap-1 pt-[24px] pr-[24px] pb-[24px] pl-[24px] mt-[0px] mr-[0px] mb-[24px] ml-[0px]">
                <h1 
                  className="leading-none transition-colors"
                  style={{ 
                    color: state === 'paused' 
                      ? 'var(--palette-yellow-text)' 
                      : pomodoroPhase === 'break' 
                        ? 'var(--palette-green-text)' 
                        : 'var(--text-primary)',
                    fontWeight: '300',
                    fontSize: '96px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {getTimeDisplay()}
                </h1>
              </div>

              {/* Виз��ализ�����ц��я сессий с ��рогрессом */}
              <div className="w-full">
                <Modal.FieldTitle>
                  {t('session.sessionsProgress', { ns: 'timer' }).toUpperCase()}
                </Modal.FieldTitle>
                <div className="flex items-center mt-2 mb-4" style={{ gap: '6px' }}>
                  {breakMinutes === 0 ? (
                    /* Режим ��е�� break: показываем все focus сессии */
                    Array.from({ length: totalSessions }, (_, i) => {
                      const sessionNum = i + 1;
                      let bgColor = 'var(--bg-tertiary)'; // будущая
                      let progress = 0;
                      
                      if (sessionNum < currentSession) {
                        // Пройденная - полностью заполнена
                        bgColor = 'var(--accent-primary-indigo)';
                        progress = 100;
                      } else if (sessionNum === currentSession) {
                        // Текущая - показываем прогресс
                        const totalTime = workMinutes * 60;
                        progress = ((totalTime - timeLeft) / totalTime) * 100;
                      }
                      
                      return (
                        <div 
                          key={i}
                          className="h-2 rounded flex-1 relative overflow-hidden"
                          style={{ backgroundColor: 'var(--bg-tertiary)' }}
                        >
                          <div 
                            className="absolute inset-0 rounded transition-all duration-1000 ease-linear"
                            style={{ 
                              backgroundColor: 'var(--accent-primary-indigo)',
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      );
                    })
                  ) : (
                    /* Режим  break: показываем чередование focus/break */
                    Array.from({ length: totalSessions }, (_, i) => {
                      const sessionNum = i + 1;
                      const isLongBreak = i === 3 && totalSessions > 4;
                      let focusProgress = 0;
                      let breakProgress = 0;
                      
                      // Определяем прогрес focus сессии
                      if (sessionNum < currentSession) {
                        focusProgress = 100; // пройденная
                      } else if (sessionNum === currentSession && pomodoroPhase === 'work') {
                        const totalTime = workMinutes * 60;
                        focusProgress = ((totalTime - timeLeft) / totalTime) * 100;
                      } else if (sessionNum === currentSession && (pomodoroPhase === 'break' || pomodoroPhase === 'longBreak')) {
                        focusProgress = 100; // work уже прошла
                      }
                      
                      // Определяем цвет break (сразу зеленый если текущй или прошел)
                      const isBreakActive = sessionNum < currentSession || 
                                           (sessionNum === currentSession && (pomodoroPhase === 'break' || pomodoroPhase === 'longBreak'));
                      
                      return (
                        <div key={i} className="contents">
                          <div 
                            className="h-2 rounded flex-1 relative overflow-hidden"
                            style={{ backgroundColor: 'var(--bg-tertiary)' }}
                          >
                            <div 
                              className="absolute inset-0 rounded transition-all duration-1000 ease-linear"
                              style={{ 
                                backgroundColor: 'var(--accent-primary-indigo)',
                                width: `${focusProgress}%`,
                              }}
                            />
                          </div>
                          {i < totalSessions - 1 && (
                            <div 
                              className={`rounded-full flex-shrink-0 transition-all duration-1000 ease-linear ${
                                sessionNum === currentSession && (pomodoroPhase === 'break' || pomodoroPhase === 'longBreak') ? 'animate-pulse' : ''
                              }`}
                              style={{ 
                                backgroundColor: isBreakActive 
                                  ? 'var(--palette-green-text)' 
                                  : 'var(--bg-tertiary)',
                                boxShadow: isBreakActive && sessionNum === currentSession && (pomodoroPhase === 'break' || pomodoroPhase === 'longBreak')
                                  ? '0 0 8px var(--palette-green-text)'
                                  : 'none',
                                width: isLongBreak ? '12px' : '8px',
                                height: isLongBreak ? '12px' : '8px',
                              }}
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Кнопки управления */}
              <div className="flex flex-col gap-3 w-full">
                {state === 'running' && (
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-md flex items-center justify-center"
                      onClick={pause}
                      style={{ 
                        height: '48px',
                        backgroundColor: 'var(--palette-yellow-bg)', 
                        color: 'var(--palette-yellow-text)' 
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <CirclePause className="size-3" />
                        <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.pause')}</span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-md flex items-center justify-center"
                      onClick={reset}
                      style={{ 
                        height: '48px',
                        backgroundColor: 'var(--palette-gray-bg)',
                        color: 'var(--palette-gray-text)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <StopCircle className="size-3" />
                        <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.finish')}</span>
                      </div>
                    </Button>
                  </div>
                )}
                
                {state === 'paused' && (
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button
                      variant="default"
                      size="lg"
                      className="rounded-md flex items-center justify-center"
                      onClick={play}
                      style={{ height: '48px' }}
                    >
                      <div className="flex items-center gap-3">
                        <CirclePlay className="size-3" style={{ marginLeft: '-2px' }} />
                        <span style={{ fontSize: '14px', fontWeight: '400', paddingRight: '2px' }}>{t('timer:actions.continue')}</span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-md flex items-center justify-center"
                      onClick={reset}
                      style={{ 
                        height: '48px',
                        backgroundColor: 'var(--palette-gray-bg)',
                        color: 'var(--palette-gray-text)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <StopCircle className="size-3" />
                        <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.finish')}</span>
                      </div>
                    </Button>
                  </div>
                )}
                
                {state === 'completed' && (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-full flex items-center justify-center"
                    onClick={reset}
                    style={{ 
                      height: '48px', 
                      minWidth: '150px',
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-secondary)' 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw className="size-4" />
                      <span style={{ fontSize: '14px', fontWeight: '400' }}>Reset</span>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Экран "Session Complete" */}
          {mode === 'pomodoro' && state === 'completed' && pomodoroPhase === 'work' && breakMinutes > 0 && currentSession < totalSessions && (
            <div className="space-y-3">
              {/* Заголовок */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <h2 
                  className="leading-none"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '24px',
                  }}
                >
                  {t('timer:pomodoro.sessionComplete', { session: currentSession })}
                </h2>
                <p 
                  className="text-base"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {currentSession === 4 && totalSessions > 4 
                    ? t('timer:pomodoro.greatFocusLong')
                    : t('timer:pomodoro.greatFocus')
                  }
                </p>
              </div>

              {/* Прогресс-бар */}
              <div className="w-full max-w-md">
                <div className="flex items-center mb-3" style={{ gap: '6px' }}>
                  {Array.from({ length: totalSessions }, (_, i) => {
                    const sessionNum = i + 1;
                    const isLongBreak = i === 3 && totalSessions > 4;
                    
                    return (
                      <div key={i} className="contents">
                        {/* Полоса focus */}
                        <div 
                          className="h-2 rounded flex-1"
                          style={{ 
                            backgroundColor: sessionNum <= currentSession 
                              ? 'var(--accent-primary-indigo)' 
                              : 'var(--bg-tertiary)' 
                          }}
                        />
                        {/* Кружок break */}
                        {i < totalSessions - 1 && (
                          <div 
                            className="rounded-full flex-shrink-0"
                            style={{ 
                              backgroundColor: sessionNum < currentSession 
                                ? 'var(--palette-green-text)' 
                                : 'var(--bg-tertiary)',
                              width: isLongBreak ? '12px' : '8px',
                              height: isLongBreak ? '12px' : '8px',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Текст "X sessions remaining" */}
                <div 
                  className="text-center text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('timer:pomodoro.sessionsRemaining', { count: totalSessions - currentSession })}
                </div>
              </div>

              {/* Кнопки Start Break и Skip Break */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-md flex items-center justify-center"
                  onClick={handleStartBreak}
                  style={{ 
                    height: '48px',
                    backgroundColor: 'var(--palette-green-text)', 
                    color: 'white' 
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="size-4" />
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                      {currentSession === 4 && totalSessions > 4
                        ? t('timer:pomodoro.startLongBreak', { minutes: breakMinutes * 3 })
                        : t('timer:pomodoro.startBreak', { minutes: breakMinutes })
                      }
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSkipBreak}
                  style={{ 
                    height: '48px',
                  }}
                >
                  {t('timer:pomodoro.skipBreak')}
                </Button>
              </div>
            </div>
          )}

          {/* Экран "Ready for Session X?\" (после завершения break) */}
          {mode === 'pomodoro' && state === 'completed' && (pomodoroPhase === 'break' || pomodoroPhase === 'longBreak') && currentSession < totalSessions && (
            <div className="space-y-3">
              {/* Заголовок */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <h2 
                  className="leading-none"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '24px',
                  }}
                >
                  {t('timer:pomodoro.readyForSession', { session: currentSession + 1 })}
                </h2>
                <p 
                  className="text-base"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {pomodoroPhase === 'longBreak' 
                    ? t('timer:pomodoro.longBreakComplete')
                    : t('timer:pomodoro.breakComplete')
                  }
                </p>
              </div>

              {/* Прогресс-бар */}
              <div className="w-full max-w-md">
                <div className="flex items-center mb-3" style={{ gap: '6px' }}>
                  {Array.from({ length: totalSessions }, (_, i) => {
                    const sessionNum = i + 1;
                    const isLongBreak = i === 3 && totalSessions > 4;
                    
                    return (
                      <div key={i} className="contents">
                        {/* Полоса focus */}
                        <div 
                          className="h-2 rounded flex-1"
                          style={{ 
                            backgroundColor: sessionNum <= currentSession 
                              ? 'var(--accent-primary-indigo)' 
                              : 'var(--bg-tertiary)' 
                          }}
                        />
                        {/* Кружок break */}
                        {i < totalSessions - 1 && (
                          <div 
                            className="rounded-full flex-shrink-0"
                            style={{ 
                              backgroundColor: sessionNum <= currentSession 
                                ? 'var(--palette-green-text)' 
                                : 'var(--bg-tertiary)',
                              width: isLongBreak ? '12px' : '8px',
                              height: isLongBreak ? '12px' : '8px',
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Текст "X sessions remaining" */}
                <div 
                  className="text-center text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {t('timer:pomodoro.sessionsRemaining', { count: totalSessions - currentSession })}
                </div>
              </div>

              {/* Кнопки Start Session и Stop */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-md flex items-center justify-center"
                  onClick={() => {
                    nextSession(); // переходим к следующей work-сессии
                    play(); // запускаем таймер
                  }}
                  style={{ 
                    height: '48px',
                    backgroundColor: 'var(--accent-primary-indigo)', 
                    color: 'white' 
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4" />
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                      {t('timer:pomodoro.startSession', { session: currentSession + 1 })}
                    </span>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  onClick={reset}
                  style={{ 
                    height: '48px',
                  }}
                >
                  {t('timer:pomodoro.stop')}
                </Button>
              </div>
            </div>
          )}
          
          {/* Страница Timer (обратный отсчет) */}
          {mode === 'timer' && !showConfirmation && state !== 'completed' && (
            <div className="space-y-3">
              {/* Заголовок и описание */}
              <div className="flex flex-col items-center gap-2 mb-[16px] mt-[0px] mr-[0px] ml-[0px]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevMode}
                    className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h2 
                    className="leading-none"
                    style={{ 
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      fontSize: '24px',
                    }}
                  >
                    Timer
                  </h2>
                  <button
                    onClick={handleNextMode}
                    className="p-1 rounded hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <p 
                  className="text-base text-center"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {t('timer:timerDescription')}
                </p>
              </div>

              {/* Большие цифры таймера */}
              <div className="rounded-md flex flex-col items-center gap-1 pt-[24px] pr-[24px] pb-[24px] pl-[24px] mb-[12px] mt-[0px] mr-[0px] ml-[0px]">
                <h1 
                  className="leading-none transition-colors"
                  style={{ 
                    color: state === 'paused' 
                      ? 'var(--palette-yellow-text)' 
                      : state === 'running'
                        ? 'var(--text-primary)'
                        : 'var(--text-primary)',
                    fontWeight: '300',
                    fontSize: '96px',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {state === 'idle' 
                    ? formatTime(timerHours * 3600 + timerMinutes * 60 + timerSeconds)
                    : getTimeDisplay()
                  }
                </h1>
              </div>



              {/* Настройка времени */}
              <div className="flex flex-col gap-3 mb-3">
                <div className="grid grid-cols-3 gap-3 mt-[0px] mr-[0px] mb-[1px] ml-[0px]">
                  {/* Часы */}
                  <div className="flex flex-col">
                    <label htmlFor="timer-hours" className="modal-field-title">
                      {t('timer:settings.hours')}
                    </label>
                    <Select
                      value={String(timerHours)}
                      onValueChange={(value) => setTimerHours(Number(value))}
                      disabled={state !== 'idle'}
                    >
                      <SelectTrigger id="timer-hours" size="lg" style={{ border: '1px solid var(--border-tertiary)', backgroundColor: 'var(--bg-tertiary)' }} aria-label={t('timer:settings.hours')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {String(i)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Минуты */}
                  <div className="flex flex-col">
                    <label htmlFor="timer-minutes" className="modal-field-title">
                      {t('timer:settings.minutes')}
                    </label>
                    <Select
                      value={String(timerMinutes)}
                      onValueChange={(value) => setTimerMinutes(Number(value))}
                      disabled={state !== 'idle'}
                    >
                      <SelectTrigger id="timer-minutes" size="lg" style={{ border: '1px solid var(--border-tertiary)', backgroundColor: 'var(--bg-tertiary)' }} aria-label={t('timer:settings.minutes')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {String(i)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Секунды */}
                  <div className="flex flex-col">
                    <label htmlFor="timer-seconds" className="modal-field-title">
                      {t('timer:settings.seconds')}
                    </label>
                    <Select
                      value={String(timerSeconds)}
                      onValueChange={(value) => setTimerSeconds(Number(value))}
                      disabled={state !== 'idle'}
                    >
                      <SelectTrigger id="timer-seconds" size="lg" style={{ border: '1px solid var(--border-tertiary)', backgroundColor: 'var(--bg-tertiary)' }} aria-label={t('timer:settings.seconds')}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={String(i)}>
                            {String(i)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Селектор связанных элементов */}
              <div className="flex flex-col mb-3">
                <div className="mb-3">
                  <div style={{ marginBottom: '2px' }}>
                    <Modal.FieldTitle className="!mb-0">
                      {t('timer:link.linkItem')}
                    </Modal.FieldTitle>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {t('timer:link.linkSubtitle')}
                  </p>
                </div>
                <Select
                  value={linkedHabitId || 'none'}
                  onValueChange={(value) => handleHabitSelect(value === 'none' ? null : value)}
                  disabled={state !== 'idle'}
                >
                  <SelectTrigger 
                    id="timer-linked-habit"
                    className="h-[48px]"
                    style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      border: '1px solid var(--border-tertiary)',
                      height: '48px',
                    }}
                    aria-label={t('timer:link.linkItem')}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('timer:link.dontLink')}</SelectItem>
                    {habitsWithTimer.length > 0 ? (
                      <>
                        {/* Невыполненные привычки */}
                        {notCompletedHabits.map((habit) => {
                          const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;
                          return (
                            <SelectItem key={habit.id} value={habit.id}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                                <span>{habit.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                        
                        {/* Разделитель если есть выполненные */}
                        {completedHabits.length > 0 && (
                          <SelectItem value="completed-separator" disabled>
                            {t('timer:link.completed')}
                          </SelectItem>
                        )}
                        
                        {/* Выполненные привычки */}
                        {completedHabits.map((habit) => {
                          const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;
                          return (
                            <SelectItem key={habit.id} value={habit.id}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                                <span>{habit.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </>
                    ) : (
                      <SelectItem value="empty" disabled>
                        {t('timer:link.noItemsAvailable')}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Кнопки управления */}
              {state === 'idle' && (
                <Button
                  variant="default"
                  size="lg"
                  className="rounded-md flex items-center justify-center gap-3 w-full h-12"
                  onClick={play}
                  disabled={timerHours === 0 && timerMinutes === 0 && timerSeconds === 0}
                >
                  <CirclePlay className="size-3" />
                  <span>{t('timer:actions.startTimer')}</span>
                </Button>
              )}
              
              {state === 'running' && (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-md flex items-center justify-center"
                    onClick={pause}
                    style={{ 
                      height: '48px',
                      backgroundColor: 'var(--palette-yellow-bg)', 
                      color: 'var(--palette-yellow-text)' 
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <CirclePause className="size-3" />
                      <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.pause')}</span>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-md flex items-center justify-center"
                    onClick={reset}
                    style={{ 
                      height: '48px',
                      backgroundColor: 'var(--palette-gray-bg)',
                      color: 'var(--palette-gray-text)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <StopCircle className="size-3" />
                      <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.stop')}</span>
                    </div>
                  </Button>
                </div>
              )}
              
              {state === 'paused' && (
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="default"
                    size="lg"
                    className="rounded-md flex items-center justify-center"
                    onClick={play}
                    style={{ height: '48px' }}
                  >
                    <div className="flex items-center gap-3">
                      <CirclePlay className="size-3" />
                      <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.continue')}</span>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="rounded-md flex items-center justify-center"
                    onClick={reset}
                    style={{ 
                      height: '48px',
                      backgroundColor: 'var(--palette-gray-bg)',
                      color: 'var(--palette-gray-text)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <StopCircle className="size-3" />
                      <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.stop')}</span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Страница подтверждения выполнения задачи */}
          {mode === 'timer' && showConfirmation && linkedHabitId && (() => {
            const habit = habits.find(h => h.id === linkedHabitId);
            if (!habit) return null;
            
            const isMeasurable = habit.type === 'measurable';
            const hasNotes = habit.notesEnabled;
            
            const handleConfirm = () => {
              const today = new Date().toISOString().split('T')[0];
              
              if (isMeasurable) {
                const value = parseFloat(completionValue) || habit.targetValue || 0;
                const updatedCompletions = { ...habit.completions, [today]: value };
                const updates: HabitUpdateData = { completions: updatedCompletions };
                
                if (hasNotes) {
                  if (completionNote.trim()) {
                    const updatedNotes = { ...habit.notes, [today]: completionNote.trim() };
                    updates.notes = updatedNotes;
                  }
                  // Всегда сохраняем mood, если заметки включены
                  const updatedMoods = { ...habit.moods, [today]: completionMood };
                  updates.moods = updatedMoods;
                }
                
                useHabitsStore.getState().updateHabit(habit.id, updates);
              } else {
                const updatedCompletions = { ...habit.completions, [today]: true };
                const updates: HabitUpdateData = { completions: updatedCompletions };
                
                if (hasNotes) {
                  if (completionNote.trim()) {
                    const updatedNotes = { ...habit.notes, [today]: completionNote.trim() };
                    updates.notes = updatedNotes;
                  }
                  // Всегда сохраняем mood, если заметки включены
                  const updatedMoods = { ...habit.moods, [today]: completionMood };
                  updates.moods = updatedMoods;
                }
                
                useHabitsStore.getState().updateHabit(habit.id, updates);
              }
              
              setShowConfirmation(false);
              setCompletionValue('');
              setCompletionNote('');
              setCompletionMood('laugh');
              reset();
              handleClose();
            };
            
            const handleCancel = () => {
              setShowConfirmation(false);
              setCompletionValue('');
              setCompletionNote('');
              setCompletionMood('laugh');
              reset();
            };
            
            return (
              <div className="space-y-3">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                    style={{ backgroundColor: 'var(--accent-primary-green-bg)' }}
                  >
                    <Check className="w-8 h-8" style={{ color: 'var(--accent-primary-green)' }} />
                  </div>
                  <h2 
                    className="leading-none"
                    style={{ 
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                      fontSize: '24px',
                    }}
                  >
                    {t('timer:completion.timerComplete')}
                  </h2>
                  <p 
                    className="text-base text-center"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {habit.name}
                  </p>
                </div>

                <div className="space-y-3 mb-4">
                  {isMeasurable && (
                    <div className="flex flex-col">
                      <label htmlFor="completion-value" className="modal-field-title">
                        {t('timer:completion.value')} {habit.unit && `(${habit.unit})`}
                      </label>
                      <Input
                        id="completion-value"
                        type="number"
                        value={completionValue || String(habit.targetValue || 0)}
                        onChange={(e) => setCompletionValue(e.target.value)}
                        placeholder={String(habit.targetValue || 0)}
                        variant="secondary"
                        className="w-full"
                        aria-label={`${t('timer:completion.value')} ${habit.unit ? `(${habit.unit})` : ''}`}
                      />
                    </div>
                  )}

                  {hasNotes && (
                    <>
                      <div className="flex flex-col">
                        <div className="flex gap-2 justify-center mb-3" role="group" aria-label="Select mood">
                          {MOOD_OPTIONS.map(({ type, Icon, color }) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setCompletionMood(type)}
                              className="p-2 transition-all cursor-pointer"
                              aria-label={`Mood: ${type}`}
                              aria-pressed={completionMood === type}
                            >
                              <Icon 
                                className="w-6 h-6" 
                                style={{ color: completionMood === type ? color : 'var(--text-tertiary)' }} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label htmlFor="completion-note" className="modal-field-title">
                          {t('timer:completion.notes')}
                        </label>
                        <Textarea
                          id="completion-note"
                          value={completionNote}
                          onChange={(e) => setCompletionNote(e.target.value)}
                          placeholder={t('timer:completion.notesPlaceholder')}
                          variant="secondary"
                          className="w-full min-h-[80px]"
                          maxLength={500}
                          aria-label={t('timer:completion.notes')}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    style={{ height: '48px' }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                      {t('timer:completion.notCompleted')}
                    </span>
                  </Button>
                  <Button
                    variant="default"
                    onClick={handleConfirm}
                    style={{ height: '48px' }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                      {t('timer:completion.markComplete')}
                    </span>
                  </Button>
                </div>
              </div>
            );
          })()}

          {/* Экран завершения Timer (без связи с задачей) */}
          {mode === 'timer' && state === 'completed' && !linkedHabitId && (
            <div className="space-y-3">
              {/* Заголовок */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: 'var(--accent-primary-green-bg)' }}
                >
                  <Check className="w-8 h-8" style={{ color: 'var(--accent-primary-green)' }} />
                </div>
                <h2 
                  className="leading-none"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '24px',
                  }}
                >
                  {t('timer:completion.timerComplete')}
                </h2>
              </div>

              {/* Кнопки */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={reset}
                  style={{ 
                    height: '48px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-secondary)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.restart')}</span>
                  </div>
                </Button>
                <Button
                  variant="default"
                  onClick={handleClose}
                  style={{ height: '48px' }}
                >
                  <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.done')}</span>
                </Button>
              </div>
            </div>
          )}
          
          {/* Экран "All Sessions Complete!\" (после завершения всех сессий) */}
          {mode === 'pomodoro' && state === 'completed' && currentSession === totalSessions && (
            <div className="space-y-3">
              {/* Заголовок */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <h2 
                  className="leading-none"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    fontSize: '24px',
                  }}
                >
                  {t('timer:pomodoro.allComplete')}
                </h2>
                <p 
                  className="text-base"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {t('timer:pomodoro.amazingWork', { count: totalSessions })}
                </p>
              </div>

              {/* Карточки статистики */}
              <div className="flex items-center gap-4 mb-4">
                {/* SESSIONS */}
                <div 
                  className="flex flex-col items-center justify-center rounded-md p-4 flex-1"
                  style={{ 
                    backgroundColor: 'var(--bg-tertiary)', 
                    border: '1px solid var(--border-tertiary)' 
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '32px', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      lineHeight: '1',
                    }}
                  >
                    {totalSessions}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '11px', 
                      color: 'var(--text-tertiary)', 
                      marginTop: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('timer:pomodoro.sessionsLabel')}
                  </div>
                </div>

                {/* MIN FOCUS */}
                <div 
                  className="flex flex-col items-center justify-center rounded-md p-4 flex-1"
                  style={{ 
                    backgroundColor: 'var(--bg-tertiary)', 
                    border: '1px solid var(--border-tertiary)' 
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '32px', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      lineHeight: '1',
                    }}
                  >
                    {totalSessions * workMinutes}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '11px', 
                      color: 'var(--text-tertiary)', 
                      marginTop: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('timer:pomodoro.focusLabel')}
                  </div>
                </div>

                {/* COMPLETE */}
                <div 
                  className="flex flex-col items-center justify-center rounded-md p-4 flex-1"
                  style={{ 
                    backgroundColor: 'var(--bg-tertiary)', 
                    border: '1px solid var(--border-tertiary)' 
                  }}
                >
                  <div 
                    style={{ 
                      fontSize: '32px', 
                      fontWeight: '600', 
                      color: 'var(--palette-green-text)',
                      lineHeight: '1',
                    }}
                  >
                    100%
                  </div>
                  <div 
                    style={{ 
                      fontSize: '11px', 
                      color: 'var(--text-tertiary)', 
                      marginTop: '6px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {t('timer:pomodoro.completeLabel')}
                  </div>
                </div>
              </div>

              {/* Кнопки Повторить и Завершить */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-md flex items-center justify-center"
                  onClick={() => {
                    reset(); // сбрасываем таймер
                    play(); // сразу запускаем новую серию
                  }}
                  style={{ 
                    height: '48px',
                    backgroundColor: 'var(--accent-primary-indigo)', 
                    color: 'white' 
                  }}
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw className="size-3" />
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>
                      {t('timer:pomodoro.repeat')}
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-md flex items-center justify-center"
                  onClick={reset}
                  style={{ 
                    height: '48px',
                    backgroundColor: 'var(--palette-gray-bg)',
                    color: 'var(--palette-gray-text)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <StopCircle className="size-3" />
                    <span style={{ fontSize: '14px', fontWeight: '400' }}>{t('timer:actions.finish')}</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </Modal.Content>
      </Modal.Container>
    </Modal.Root>
  );
}
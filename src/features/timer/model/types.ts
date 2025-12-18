/**
 * 📝 Типы для фичи Timer
 * 
 * @module features/timer/model/types
 * @created 13 декабря 2025
 */

/** Режим таймера */
export type TimerMode = 'pomodoro' | 'timer';

/** Состояние таймера */
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

/** Фаза помодоро */
export type PomodoroPhase = 'work' | 'break' | 'longBreak';

/** Пресет помодоро */
export interface PomodoroPreset {
  id: string;
  name: string;
  workMinutes: number;
  breakMinutes: number;
  isDefault?: boolean;
}

/** Store состояния таймера */
export interface TimerStore {
  // Основное состояние
  mode: TimerMode;
  state: TimerState;
  isMinimized: boolean;
  isOpen: boolean; // Флаг открытия модалки
  showConfirmation: boolean; // Показывать страницу подтверждения выполнения задачи
  
  // Помодоро
  pomodoroPhase: PomodoroPhase;
  pomodoroPresets: PomodoroPreset[];
  selectedPresetId: string;
  workMinutes: number;
  breakMinutes: number;
  linkedHabitId: string | null; // Связанный элемент (привычка и др.) для автоотметки при завершении
  currentSession: number; // Текущая сессия (1, 2, 3...)
  totalSessions: number; // Общее количество сессий
  
  // Время
  timeLeft: number; // секунды для pomodoro и timer
  
  // Timer (обычный таймер обратного отсчета)
  timerHours: number; // часы для timer
  timerMinutes: number; // минуты для timer
  timerSeconds: number; // секунды для timer
  
  // Действия
  setMode: (mode: TimerMode) => void;
  setState: (state: TimerState) => void;
  setMinimized: (minimized: boolean) => void;
  setOpen: (open: boolean) => void;
  setShowConfirmation: (show: boolean) => void;
  
  // Помодоро
  setPomodoroPhase: (phase: PomodoroPhase) => void;
  setWorkMinutes: (minutes: number) => void;
  setBreakMinutes: (minutes: number) => void;
  selectPreset: (presetId: string) => void;
  addPreset: (preset: Omit<PomodoroPreset, 'id'>) => void;
  removePreset: (presetId: string) => void;
  setLinkedHabit: (habitId: string | null) => void;
  setTotalSessions: (count: number) => void;
  nextSession: (skipBreak?: boolean) => void; // Переход к следующей сессии
  
  // Управление временем
  setTimeLeft: (seconds: number) => void;
  decrementTime: () => void;
  
  // Timer
  setTimerHours: (hours: number) => void;
  setTimerMinutes: (minutes: number) => void;
  setTimerSeconds: (seconds: number) => void;
  
  // Управление
  play: () => void;
  pause: () => void;
  stop: () => void;
  reset: () => void;
  
  // Инициализация
  initialize: () => void;
}
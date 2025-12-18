/**
 * Timer Feature - Public API
 * 
 * Экспортирует компоненты для работы с таймером (Pomodoro/Timer)
 * 
 * @module features/timer
 */

export { TimerModal } from './ui/TimerModal';
export { useTimerStore } from './model/store';
export { useTimerEngine } from './lib/useTimerEngine';
export type { TimerMode, TimerState, PomodoroPreset } from './model/types';
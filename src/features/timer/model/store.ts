/**
 * 🗄️ Zustand Store для глобального таймера
 * 
 * @module features/timer/model/store
 * @created 13 декабря 2025
 */

import { create } from 'zustand';
import type { TimerStore, PomodoroPreset } from './types';
import { loadPresets, savePresets, loadDefaultPreset, saveDefaultPreset } from '../lib/storage';

// Дефолтные пресеты помодоро
const DEFAULT_PRESETS: PomodoroPreset[] = [
  { id: 'default-25-5', name: 'Classic', workMinutes: 25, breakMinutes: 5, isDefault: true },
  { id: 'default-50-10', name: 'Long Focus', workMinutes: 50, breakMinutes: 10 },
  { id: 'default-15-3', name: 'Quick', workMinutes: 15, breakMinutes: 3 },
];

export const useTimerStore = create<TimerStore>((set, get) => ({
  // Начальное состояние
  mode: 'pomodoro',
  state: 'idle',
  isMinimized: false,
  isOpen: false,
  showConfirmation: false,
  
  pomodoroPhase: 'work',
  pomodoroPresets: DEFAULT_PRESETS,
  selectedPresetId: 'default-25-5',
  workMinutes: 25,
  breakMinutes: 5,
  linkedHabitId: null,
  currentSession: 1,
  totalSessions: 1,
  
  timeLeft: 25 * 60,
  
  // Timer (обычный таймер)
  timerHours: 0,
  timerMinutes: 5,
  timerSeconds: 0,
  
  // Действия
  setMode: (mode) => {
    const state = get();
    set({ mode });
    
    // Сбрасываем состояние при смене режима
    if (state.state !== 'idle') {
      get().reset();
    }
    
    // Устанавливаем начальное время в зависимости от режима
    if (mode === 'pomodoro') {
      set({ timeLeft: state.workMinutes * 60 });
    } else if (mode === 'timer') {
      set({ timeLeft: state.timerHours * 3600 + state.timerMinutes * 60 + state.timerSeconds });
    }
  },
  
  setState: (state) => set({ state }),
  
  setMinimized: (minimized) => set({ isMinimized: minimized }),
  
  setOpen: (open) => set({ isOpen: open }),
  
  setShowConfirmation: (show) => set({ showConfirmation: show }),
  
  // Помодоро
  setPomodoroPhase: (phase) => {
    const state = get();
    set({ pomodoroPhase: phase });
    
    // Обновляем время в зависимости от фазы
    if (phase === 'work') {
      set({ timeLeft: state.workMinutes * 60 });
    } else if (phase === 'longBreak') {
      // Длинный перерыв = короткий * 3
      set({ timeLeft: state.breakMinutes * 3 * 60 });
    } else {
      set({ timeLeft: state.breakMinutes * 60 });
    }
  },
  
  setWorkMinutes: (minutes) => {
    set({ workMinutes: minutes });
    // Если мы в фазе работы и в idle, обновляем timeLeft
    const state = get();
    if (state.pomodoroPhase === 'work' && state.state === 'idle') {
      set({ timeLeft: minutes * 60 });
    }
  },
  
  setBreakMinutes: (minutes) => {
    set({ breakMinutes: minutes });
    // Если мы в фазе отдыха и в idle, обновляем timeLeft
    const state = get();
    if (state.pomodoroPhase === 'break' && state.state === 'idle') {
      set({ timeLeft: minutes * 60 });
    }
  },
  
  selectPreset: (presetId) => {
    const state = get();
    const preset = state.pomodoroPresets.find(p => p.id === presetId);
    if (preset) {
      set({
        selectedPresetId: presetId,
        workMinutes: preset.workMinutes,
        breakMinutes: preset.breakMinutes,
        timeLeft: state.pomodoroPhase === 'work' ? preset.workMinutes * 60 : preset.breakMinutes * 60,
      });
      
      // Сохраняем выбранный пресет как дефолтный
      saveDefaultPreset(presetId);
    }
  },
  
  addPreset: (preset) => {
    const state = get();
    const newPreset: PomodoroPreset = {
      ...preset,
      id: `custom-${Date.now()}`,
    };
    
    const updatedPresets = [...state.pomodoroPresets, newPreset];
    set({ pomodoroPresets: updatedPresets });
    savePresets(updatedPresets);
  },
  
  removePreset: (presetId) => {
    const state = get();
    
    // Нельзя удалить последний пресет
    if (state.pomodoroPresets.length <= 1) return;
    
    const updatedPresets = state.pomodoroPresets.filter(p => p.id !== presetId);
    set({ pomodoroPresets: updatedPresets });
    savePresets(updatedPresets);
    
    // Если удаляем выбранный пресет, выбираем первый доступный
    if (state.selectedPresetId === presetId) {
      const firstPreset = updatedPresets[0];
      if (firstPreset) {
        get().selectPreset(firstPreset.id);
      }
    }
  },
  
  setLinkedHabit: (habitId) => set({ linkedHabitId: habitId }),
  
  setTotalSessions: (count) => set({ totalSessions: count }),
  
  nextSession: (skipBreak = false) => {
    const state = get();
    
    // Если skipBreak === true, пропускаем break и сразу переходим к следующей work сессии
    if (skipBreak) {
      const nextSessionNum = state.currentSession + 1;
      
      if (nextSessionNum <= state.totalSessions) {
        set({ 
          currentSession: nextSessionNum,
          pomodoroPhase: 'work',
          timeLeft: state.workMinutes * 60,
          state: 'idle',
        });
      } else {
        // Все сессии завершены
        set({ state: 'completed' });
      }
      return;
    }
    
    // Если мы в фазе работы и есть break
    if (state.pomodoroPhase === 'work' && state.breakMinutes > 0) {
      // Проверяем, нужен ли длинный перерыв (после 4-й сессии, если всего > 4)
      const isLongBreak = state.currentSession === 4 && state.totalSessions > 4;
      
      // Переходим к break или longBreak
      set({ 
        pomodoroPhase: isLongBreak ? 'longBreak' : 'break',
        timeLeft: isLongBreak ? state.breakMinutes * 3 * 60 : state.breakMinutes * 60,
        state: 'idle',
      });
    } 
    // Если мы в фазе break или longBreak
    else if (state.pomodoroPhase === 'break' || state.pomodoroPhase === 'longBreak') {
      // Переходим к следующей work сессии
      const nextSessionNum = state.currentSession + 1;
      
      if (nextSessionNum <= state.totalSessions) {
        set({ 
          currentSession: nextSessionNum,
          pomodoroPhase: 'work',
          timeLeft: state.workMinutes * 60,
          state: 'idle',
        });
      } else {
        // Все сессии завершены
        set({ state: 'completed' });
      }
    }
    // Если нет break, переходим сразу к следующей work сессии
    else if (state.breakMinutes === 0) {
      const nextSessionNum = state.currentSession + 1;
      
      if (nextSessionNum <= state.totalSessions) {
        set({ 
          currentSession: nextSessionNum,
          timeLeft: state.workMinutes * 60,
          state: 'idle',
        });
      } else {
        // Все сессии завершены
        set({ state: 'completed' });
      }
    }
  },
  
  // Управление временем
  setTimeLeft: (seconds) => set({ timeLeft: seconds }),
  
  decrementTime: () => {
    const timeLeft = get().timeLeft;
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    }
  },
  
  // Timer
  setTimerHours: (hours) => {
    set({ timerHours: hours });
    // Обновляем timeLeft если таймер в режиме idle
    if (get().state === 'idle' && get().mode === 'timer') {
      set({ timeLeft: hours * 3600 + get().timerMinutes * 60 + get().timerSeconds });
    }
  },
  
  setTimerMinutes: (minutes) => {
    set({ timerMinutes: minutes });
    // Обновляем timeLeft если таймер в режиме idle
    if (get().state === 'idle' && get().mode === 'timer') {
      set({ timeLeft: get().timerHours * 3600 + minutes * 60 + get().timerSeconds });
    }
  },
  
  setTimerSeconds: (seconds) => {
    set({ timerSeconds: seconds });
    // Обновляем timeLeft если таймер в режиме idle
    if (get().state === 'idle' && get().mode === 'timer') {
      set({ timeLeft: get().timerHours * 3600 + get().timerMinutes * 60 + seconds });
    }
  },
  
  // Управление
  play: () => {
    set({ state: 'running' });
  },
  pause: () => set({ state: 'paused' }),
  stop: () => set({ state: 'completed' }),
  
  reset: () => {
    const state = get();
    set({
      state: 'idle',
      timeLeft: state.mode === 'pomodoro' 
        ? (state.pomodoroPhase === 'work' ? state.workMinutes * 60 : state.breakMinutes * 60)
        : (state.timerHours * 3600 + state.timerMinutes * 60 + state.timerSeconds),
      currentSession: 1,
      pomodoroPhase: 'work',
    });
  },
  
  // Инициализация из localStorage
  initialize: () => {
    const savedPresets = loadPresets();
    const defaultPresetId = loadDefaultPreset();
    
    if (savedPresets.length > 0) {
      set({ pomodoroPresets: [...DEFAULT_PRESETS, ...savedPresets] });
    }
    
    if (defaultPresetId) {
      get().selectPreset(defaultPresetId);
    }
  },
}));
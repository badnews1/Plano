/**
 * ⚙️ Hook для управления таймером (интервалы, уведомления)
 * 
 * @module features/timer/lib/useTimerEngine
 * @created 13 декабря 2025
 */

import { useRef, useEffect } from 'react';
import { useTimerStore } from '../model/store';
import { updateTitleWithTimer, resetTitle, startTitleBlink, stopTitleBlink } from './browserTitle';
import { toast } from 'sonner';

interface UseTimerEngineProps {
  onComplete?: () => void;
  onBreakComplete?: () => void;
}

export function useTimerEngine({ onComplete, onBreakComplete }: UseTimerEngineProps = {}) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const mode = useTimerStore(state => state.mode);
  const state = useTimerStore(state => state.state);
  const isMinimized = useTimerStore(state => state.isMinimized);
  const pomodoroPhase = useTimerStore(state => state.pomodoroPhase);
  const timeLeft = useTimerStore(state => state.timeLeft);
  const stop = useTimerStore(state => state.stop);
  
  // Инициализация аудио (простой beep звук через Web Audio API)
  useEffect(() => {
    // Создаем аудио элемент для звукового сигнала
    const audio = new Audio();
    // Используем data URL для простого beep звука
    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltzy0H0pBSp+zPLaizsIGGS57OihUBELTKXh8bllHAU2kNXzzn8qBSh6ye/glEYOElyx6O6qWBUIQ5zd8s5/KQUqfszz2os7CBhkuezooVARC0yl4fG5ZRwFNpDV885/KgUoesnv4JRGDhJcseju';
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Основной таймер
  useEffect(() => {
    // ЗАЩИТА: не создавать второй интервал если уже есть
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        useTimerStore.getState().decrementTime();
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state]);
  
  // Обновление title браузера
  useEffect(() => {
    if (state === 'running' && isMinimized) {
      updateTitleWithTimer(timeLeft);
    } else if (state === 'completed') {
      startTitleBlink();
    } else {
      resetTitle();
    }
    
    return () => {
      if (state !== 'running' && state !== 'completed') {
        resetTitle();
      }
    };
  }, [state, isMinimized, timeLeft]);
  
  // Проверка завершения таймера
  useEffect(() => {
    if (timeLeft === 0 && state === 'running') {
      handleTimerComplete();
    }
  }, [timeLeft, state]);
  
  const handleTimerComplete = () => {
    const { nextSession, breakMinutes, pomodoroPhase, linkedHabitId, mode, setShowConfirmation } = useTimerStore.getState();
    stop();
    
    // Звуковой сигнал
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error('Audio play failed:', err));
    }
    
    // Уведомление в зависимости от режима
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') {
        toast.success('Work session completed!', {
          description: 'Time for a break 🎉',
          duration: 5000,
        });
        onComplete?.();
        
        // Автоматически переходим к следующей сессии ТОЛЬКО если нет break
        // Если есть break - показываем экран Session Complete, пользователь сам решит
        if (breakMinutes === 0) {
          setTimeout(() => {
            nextSession();
          }, 100);
        }
      } else {
        toast.success('Break completed!', {
          description: 'Ready for another session? 💪',
          duration: 5000,
        });
        onBreakComplete?.();
        
        // После break НЕ переходим автоматически - показываем экран "Ready for Session X?"
        // Пользователь сам решит: Start Session или Stop
      }
    } else if (mode === 'timer') {
      // Для таймера - если есть связь с задачей, показываем страницу подтверждения
      if (linkedHabitId) {
        setShowConfirmation(true);
      } else {
        // Если нет связи - просто звуковой сигнал и сброс
        toast.success('Timer completed!', {
          description: 'Great work! 🎉',
          duration: 5000,
        });
      }
    }
  };
  
  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      resetTitle();
      stopTitleBlink();
    };
  }, []);
}
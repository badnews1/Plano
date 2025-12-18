/**
 * Хук для отслеживания статуса сетевого подключения
 * 
 * Функционал:
 * - Определение текущего статуса (online/offline)
 * - Подписка на изменения статуса
 * - Debounce для предотвращения частых переключений при нестабильном соединении
 * - Уведомления при потере/восстановлении соединения
 * 
 * Debounce стратегия:
 * - offline: 300ms (фильтрует микро-разрывы при переключении Wi-Fi)
 * - online: 1000ms (убеждается что соединение стабильно)
 * 
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus();
 * 
 * return (
 *   <div>
 *     {isOnline ? '🌐 Online' : '📵 Offline'}
 *   </div>
 * );
 * ```
 * 
 * @module shared/lib/hooks/useOnlineStatus
 * @created 17 декабря 2025
 */

import { useState, useEffect, useRef } from 'react';

// Время задержки для debounce (в миллисекундах)
const ONLINE_DEBOUNCE_MS = 1000;  // Убеждаемся что соединение стабильно
const OFFLINE_DEBOUNCE_MS = 300;   // Фильтруем микро-разрывы

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Обработчик перехода в online (с debounce)
    const handleOnline = () => {
      console.log('🌐 Обнаружен сигнал online, проверяем стабильность...');
      
      // Очищаем предыдущий таймер
      clearTimeout(timeoutRef.current);
      
      // Устанавливаем новый таймер - убеждаемся что соединение стабильно
      timeoutRef.current = setTimeout(() => {
        console.log('✅ Соединение восстановлено (стабильно)');
        setIsOnline(true);
      }, ONLINE_DEBOUNCE_MS);
    };

    // Обработчик перехода в offline (с debounce)
    const handleOffline = () => {
      console.log('📵 Обнаружен сигнал offline, проверяем...');
      
      // Очищаем предыдущий таймер
      clearTimeout(timeoutRef.current);
      
      // Устанавливаем новый таймер - фильтруем микро-разрывы
      timeoutRef.current = setTimeout(() => {
        console.log('❌ Соединение потеряно (подтверждено)');
        setIsOnline(false);
      }, OFFLINE_DEBOUNCE_MS);
    };

    // Подписываемся на события
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Отписываемся при размонтировании и очищаем таймер
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // Очищаем таймер чтобы избежать memory leak и warning "Can't perform a React state update on an unmounted component"
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return isOnline;
}
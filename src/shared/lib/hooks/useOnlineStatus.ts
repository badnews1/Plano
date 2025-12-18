/**
 * Хук для отслеживания статуса сетевого подключения
 * 
 * Функционал:
 * - Определение текущего статуса (online/offline)
 * - Подписка на изменения статуса
 * - Уведомления при потере/восстановлении соединения
 * 
 * @module shared/lib/hooks/useOnlineStatus
 * @created 17 декабря 2025
 */

import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Обработчик перехода в online
    const handleOnline = () => {
      console.log('🌐 Соединение восстановлено');
      setIsOnline(true);
    };

    // Обработчик перехода в offline
    const handleOffline = () => {
      console.log('📵 Соединение потеряно');
      setIsOnline(false);
    };

    // Подписываемся на события
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Отписываемся при размонтировании
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

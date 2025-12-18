/**
 * Offline Indicator - индикатор статуса подключения
 * 
 * Функционал:
 * - Показывает статус подключения (online/offline)
 * - Отображает количество операций в очереди
 * - Автоматическая синхронизация при восстановлении соединения
 * - Toast уведомления о смене статуса
 * 
 * @module features/offline-indicator/ui/OfflineIndicator
 * @created 17 декабря 2025
 */

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { WifiOff, Wifi, CloudOff, Cloud } from '@/shared/assets/icons/system';
import { useOnlineStatus } from '@/shared/lib/hooks';
import { getQueueSize, hasQueuedOperations } from '@/shared/lib/offline';
import { processOfflineQueue } from '@/entities/habit/api/habitSync';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [queueSize, setQueueSize] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Обновляем размер очереди при монтировании и при изменении online статуса
  useEffect(() => {
    updateQueueSize();
  }, [isOnline]);

  // Обновляем размер очереди каждые 3 секунды (для отслеживания изменений)
  useEffect(() => {
    const interval = setInterval(() => {
      updateQueueSize();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Функция обновления размера очереди
  const updateQueueSize = () => {
    setQueueSize(getQueueSize());
  };

  // При восстановлении соединения - синхронизируем очередь
  useEffect(() => {
    if (isOnline && hasQueuedOperations() && !isSyncing) {
      handleSync();
    }
  }, [isOnline]);

  // Обработчик синхронизации
  const handleSync = async () => {
    setIsSyncing(true);
    
    try {
      await processOfflineQueue();
      updateQueueSize();
      
      if (getQueueSize() === 0) {
        toast.success('Все изменения синхронизированы');
      } else {
        toast.error('Не удалось синхронизировать некоторые изменения');
      }
    } catch (error) {
      console.error('Ошибка синхронизации:', error);
      toast.error('Ошибка синхронизации');
    } finally {
      setIsSyncing(false);
    }
  };

  // Если online и нет операций в очереди - не показываем индикатор
  if (isOnline && queueSize === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-[var(--z-toast)] flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all ${
        isOnline
          ? 'bg-accent-primary-indigo text-white'
          : 'bg-bg-secondary border border-border-secondary text-text-primary'
      }`}
    >
      {/* Иконка статуса */}
      {isOnline ? (
        isSyncing ? (
          <Cloud className="w-4 h-4 animate-pulse" />
        ) : (
          <Wifi className="w-4 h-4" />
        )
      ) : (
        <WifiOff className="w-4 h-4 text-text-tertiary" />
      )}

      {/* Текст статуса */}
      <span className="text-sm font-medium">
        {isSyncing ? (
          'Синхронизация...'
        ) : isOnline ? (
          queueSize > 0 ? `Синхронизируется ${queueSize}` : 'Подключено'
        ) : (
          queueSize > 0 ? `Офлайн (${queueSize})` : 'Офлайн'
        )}
      </span>
    </div>
  );
}

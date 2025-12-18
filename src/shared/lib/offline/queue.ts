/**
 * Offline Queue - очередь операций для выполнения при восстановлении соединения
 * 
 * Функционал:
 * - Сохранение операций в localStorage при отсутствии сети
 * - Выполнение операций при восстановлении соединения
 * - Автоматическая очистка выполненных операций
 * 
 * @module shared/lib/offline/queue
 * @created 17 декабря 2025
 */

import type { Habit } from '@/entities/habit';

// Типы операций в очереди
export type QueueOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface QueueOperation {
  id: string; // Уникальный ID операции
  type: QueueOperationType;
  habitId: string;
  habit?: Habit; // Для CREATE и UPDATE
  updates?: Partial<Habit>; // Для UPDATE
  timestamp: number; // Время создания операции
}

const QUEUE_KEY = 'plano_offline_queue';

/**
 * Получить все операции из очереди
 */
export function getQueue(): QueueOperation[] {
  try {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('[OfflineQueue] Ошибка чтения очереди:', error);
    return [];
  }
}

/**
 * Сохранить очередь в localStorage
 */
function saveQueue(queue: QueueOperation[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('[OfflineQueue] Ошибка сохранения очереди:', error);
  }
}

/**
 * Добавить операцию в очередь
 */
export function addToQueue(operation: Omit<QueueOperation, 'id' | 'timestamp'>): void {
  const queue = getQueue();
  
  const newOperation: QueueOperation = {
    ...operation,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };
  
  // Оптимизация: если есть операции с тем же habitId, объединяем
  const optimizedQueue = optimizeQueue([...queue, newOperation]);
  
  saveQueue(optimizedQueue);
  
  console.log('[OfflineQueue] Операция добавлена в очередь:', newOperation);
}

/**
 * Удалить операцию из очереди
 */
export function removeFromQueue(operationId: string): void {
  const queue = getQueue();
  const updatedQueue = queue.filter((op) => op.id !== operationId);
  saveQueue(updatedQueue);
  
  console.log('[OfflineQueue] Операция удалена из очереди:', operationId);
}

/**
 * Очистить всю очередь
 */
export function clearQueue(): void {
  localStorage.removeItem(QUEUE_KEY);
  console.log('[OfflineQueue] Очередь очищена');
}

/**
 * Получить количество операций в очереди
 */
export function getQueueSize(): number {
  return getQueue().length;
}

/**
 * Оптимизация очереди
 * Удаляем дублирующиеся операции над одной привычкой
 */
function optimizeQueue(queue: QueueOperation[]): QueueOperation[] {
  const habitMap = new Map<string, QueueOperation>();
  
  // Проходим по очереди и оставляем только последнюю операцию для каждой привычки
  for (const operation of queue) {
    const existing = habitMap.get(operation.habitId);
    
    // Если привычка удаляется - оставляем только DELETE
    if (operation.type === 'DELETE') {
      habitMap.set(operation.habitId, operation);
    }
    // Если создается, потом обновляется - объединяем в CREATE
    else if (operation.type === 'UPDATE' && existing?.type === 'CREATE') {
      habitMap.set(operation.habitId, {
        ...existing,
        habit: { ...existing.habit!, ...operation.updates },
        timestamp: operation.timestamp,
      });
    }
    // Если обновляется несколько раз - объединяем UPDATE
    else if (operation.type === 'UPDATE' && existing?.type === 'UPDATE') {
      habitMap.set(operation.habitId, {
        ...existing,
        updates: { ...existing.updates, ...operation.updates },
        timestamp: operation.timestamp,
      });
    }
    // В остальных случаях - заменяем на последнюю операцию
    else {
      habitMap.set(operation.habitId, operation);
    }
  }
  
  // Возвращаем оптимизированную очередь, отсортированную по времени
  return Array.from(habitMap.values()).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Проверить, есть ли операции в очереди
 */
export function hasQueuedOperations(): boolean {
  return getQueueSize() > 0;
}

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
 * @updated 18 декабря 2025 - исправлена циклическая зависимость (generic тип вместо Habit)
 */

// Типы операций в очереди
export type QueueOperationType = 'CREATE' | 'UPDATE' | 'DELETE';

/**
 * Операция в очереди (generic для соблюдения FSD)
 * @template T - Тип сущности (например, Habit)
 */
export interface QueueOperation<T = unknown> {
  /** Уникальный ID операции */
  id: string;
  /** Тип операции */
  type: QueueOperationType;
  /** ID сущности (habitId, tagId и т.д.) */
  entityId: string;
  /** Полная сущность для CREATE и UPDATE */
  entity?: T;
  /** Частичные обновления для UPDATE */
  updates?: Partial<T>;
  /** Время создания операции */
  timestamp: number;
}

const QUEUE_KEY = 'plano_offline_queue';

/**
 * Получить все операции из очереди
 */
export function getQueue<T = unknown>(): QueueOperation<T>[] {
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
function saveQueue<T = unknown>(queue: QueueOperation<T>[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('[OfflineQueue] Ошибка сохранения очереди:', error);
  }
}

/**
 * Добавить операцию в очередь
 */
export function addToQueue<T = unknown>(operation: Omit<QueueOperation<T>, 'id' | 'timestamp'>): void {
  const queue = getQueue<T>();
  
  const newOperation: QueueOperation<T> = {
    ...operation,
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    timestamp: Date.now(),
  };
  
  // Оптимизация: если есть операции с тем же entityId, объединяем
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
 * Удаляем дублирующиеся операции над одной сущностью
 */
function optimizeQueue<T = unknown>(queue: QueueOperation<T>[]): QueueOperation<T>[] {
  const entityMap = new Map<string, QueueOperation<T>>();
  
  // Проходим по очереди и оставляем только последнюю операцию для каждой сущности
  for (const operation of queue) {
    const existing = entityMap.get(operation.entityId);
    
    // Если сущность удаляется - оставляем только DELETE
    if (operation.type === 'DELETE') {
      entityMap.set(operation.entityId, operation);
    }
    // Если создается, потом обновляется - объединяем в CREATE
    else if (operation.type === 'UPDATE' && existing?.type === 'CREATE') {
      entityMap.set(operation.entityId, {
        ...existing,
        entity: { ...existing.entity!, ...operation.updates } as T,
        timestamp: operation.timestamp,
      });
    }
    // Если обновляется несколько раз - объединяем UPDATE
    else if (operation.type === 'UPDATE' && existing?.type === 'UPDATE') {
      entityMap.set(operation.entityId, {
        ...existing,
        updates: { ...existing.updates, ...operation.updates },
        timestamp: operation.timestamp,
      });
    }
    // В остальных случаях - заменяем на последнюю операцию
    else {
      entityMap.set(operation.entityId, operation);
    }
  }
  
  // Возвращаем оптимизированную очередь, отсортированную по времени
  return Array.from(entityMap.values()).sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Проверить, есть ли операции в очереди
 */
export function hasQueuedOperations(): boolean {
  return getQueueSize() > 0;
}
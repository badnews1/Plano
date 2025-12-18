/**
 * Сервис синхронизации привычек с сервером
 * 
 * Функционал:
 * - Загрузка привычек с сервера при логине
 * - Создание, обновление, удаление привычек на сервере
 * - Полная синхронизация всех привычек
 * - Offline-режим: добавление операций в очередь при отсутствии сети
 * - Выполнение очереди при восстановлении соединения
 * - Разрешение конфликтов при синхронизации (Last Write Wins + Merge)
 * 
 * @module entities/habit/api/habitSync
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - добавлен offline-режим и очередь операций
 * @updated 17 декабря 2025 - добавлено разрешение конфликтов
 * @updated 18 декабря 2025 - использование generic QueueOperation для соблюдения FSD
 */

import { serverFetch } from '@/shared/lib/supabase/client';
import { addToQueue, getQueue, removeFromQueue, clearQueue } from '@/shared/lib/offline';
import { syncHabits, resolveHabitConflict } from '../lib/conflict-resolution';
import type { Habit } from '../model/types';
import type { QueueOperation } from '@/shared/lib/offline';

/**
 * Загрузить все привычки текущего пользователя с сервера
 */
export async function fetchHabitsFromServer(): Promise<Habit[]> {
  try {
    const response = await serverFetch('/habits');
    
    if (!response.ok) {
      // Если 401/403 - logout уже произошел автоматически в serverFetch
      if (response.status === 401 || response.status === 403) {
        console.warn('⚠️ Сессия истекла или невалидна, требуется повторный вход');
        return [];
      }
      
      const errorText = await response.text();
      console.error('Failed to fetch habits from server:', errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('✅ Загружено привычек с сервера:', data.habits.length);
    return data.habits || [];
  } catch (error) {
    console.error('Error fetching habits from server:', error);
    return [];
  }
}

/**
 * Создать новую привычку на сервере
 * При отсутствии сети - добавляет в очередь
 */
export async function createHabitOnServer(habit: Habit): Promise<boolean> {
  try {
    const response = await serverFetch('/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habit }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create habit on server:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Привычка создана на сервере:', habit.name);
    return data.success;
  } catch (error) {
    console.error('Error creating habit on server:', error);
    
    // Добавляем в offline очередь
    console.log('📵 Нет соединения, добавляем операцию в очередь');
    addToQueue<Habit>({
      type: 'CREATE',
      entityId: habit.id,
      entity: habit,
    });
    
    return false;
  }
}

/**
 * Обновить привычку на сервере
 * При отсутствии сети - добавляет в очередь
 */
export async function updateHabitOnServer(habitId: string, updates: Partial<Habit>): Promise<boolean> {
  try {
    const response = await serverFetch(`/habits/${habitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to update habit on server:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Привычка обновлена на сервере:', habitId);
    return data.success;
  } catch (error) {
    console.error('Error updating habit on server:', error);
    
    // Добавляем в offline очередь
    console.log('📵 Нет соединения, добавляем операцию в очередь');
    addToQueue<Habit>({
      type: 'UPDATE',
      entityId: habitId,
      updates,
    });
    
    return false;
  }
}

/**
 * Удалить привычку на сервере
 * При отсутствии сети - добавляет в очередь
 */
export async function deleteHabitOnServer(habitId: string): Promise<boolean> {
  try {
    const response = await serverFetch(`/habits/${habitId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to delete habit on server:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Привычка удалена на сервере:', habitId);
    return data.success;
  } catch (error) {
    console.error('Error deleting habit on server:', error);
    
    // Добавляем в offline очередь
    console.log('📵 Нет соединения, добавляем операцию в очередь');
    addToQueue<Habit>({
      type: 'DELETE',
      entityId: habitId,
    });
    
    return false;
  }
}

/**
 * Синхронизировать все привычки с сервером (полная замена)
 * Используется при первом логине для загрузки локальных привычек на сервер
 */
export async function syncAllHabitsToServer(habits: Habit[]): Promise<boolean> {
  try {
    const response = await serverFetch('/habits/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habits }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to sync habits to server:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ Синхронизировано привычек на сервер:', data.count);
    return data.success;
  } catch (error) {
    console.error('Error syncing habits to server:', error);
    return false;
  }
}

/**
 * Выполнить все операции из offline очереди
 * Вызывается при восстановлении соединения
 */
export async function processOfflineQueue(): Promise<void> {
  const queue = getQueue<Habit>();
  
  if (queue.length === 0) {
    console.log('[Sync] Очередь пуста, синхронизация не требуется');
    return;
  }
  
  console.log(`[Sync] Начинаем синхронизацию ${queue.length} операций из очереди...`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const operation of queue) {
    let success = false;
    
    try {
      switch (operation.type) {
        case 'CREATE':
          if (operation.entity) {
            success = await createHabitOnServer(operation.entity);
          }
          break;
        
        case 'UPDATE':
          if (operation.updates) {
            success = await updateHabitOnServer(operation.entityId, operation.updates);
          }
          break;
        
        case 'DELETE':
          success = await deleteHabitOnServer(operation.entityId);
          break;
      }
      
      if (success) {
        successCount++;
        removeFromQueue(operation.id);
      } else {
        failCount++;
      }
    } catch (error) {
      console.error('[Sync] Ошибка выполнения операции:', operation, error);
      failCount++;
    }
  }
  
  console.log(`[Sync] Синхронизация завершена: ${successCount} успешно, ${failCount} ошибок`);
  
  // Если все операции выполнены успешно - очищаем очередь
  if (failCount === 0) {
    clearQueue();
  }
}

/**
 * Синхронизировать привычки с разрешением конфликтов
 * 
 * Стратегии:
 * - Last Write Wins для настроек привычки (по updatedAt)
 * - Merge для completions, notes, moods
 * 
 * @param localHabits - Локальные привычки
 * @returns Объединенные привычки (готовые к сохранению в store)
 */
export async function syncHabitsWithConflictResolution(localHabits: Habit[]): Promise<Habit[]> {
  try {
    // Загружаем привычки с сервера
    const serverHabits = await fetchHabitsFromServer();
    
    if (serverHabits.length === 0 && localHabits.length === 0) {
      console.log('[Sync] Нет привычек для синхронизации');
      return [];
    }
    
    // Если на сервере нет привычек, а локально есть - загружаем на сервер
    if (serverHabits.length === 0 && localHabits.length > 0) {
      console.log('[Sync] Первая синхронизация - загружаем локальные привычки на сервер');
      await syncAllHabitsToServer(localHabits);
      return localHabits;
    }
    
    // Если локально нет привычек, а на сервере есть - берем с сервера
    if (localHabits.length === 0 && serverHabits.length > 0) {
      console.log('[Sync] Загружаем привычки с сервера (локально пусто)');
      return serverHabits;
    }
    
    // Разрешаем конфликты с помощью утилиты syncHabits
    console.log('[Sync] Разрешаем конфликты между локальными и серверными привычками...');
    const mergedHabits = syncHabits(localHabits, serverHabits);
    
    // Отправляем объединенные привычки на сервер (полная синхронизация)
    console.log('[Sync] Отправляем объединенные привычки на сервер...');
    await syncAllHabitsToServer(mergedHabits);
    
    console.log(`✅ Синхронизация завершена: ${mergedHabits.length} привычек`);
    return mergedHabits;
  } catch (error) {
    console.error('[Sync] Ошибка синхронизации с разрешением конфликтов:', error);
    // В случае ошибки возвращаем локальные привычки
    return localHabits;
  }
}
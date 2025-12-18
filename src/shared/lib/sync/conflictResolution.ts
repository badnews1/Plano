/**
 * Утилиты для разрешения конфликтов при синхронизации
 * 
 * Стратегии:
 * - Last Write Wins (LWW) - для настроек привычки (название, цвет, иконка и т.д.)
 * - Merge - для completions, notes, moods (объединение данных с разных устройств)
 * 
 * @module shared/lib/sync/conflictResolution
 * @created 17 декабря 2025
 */

import type { Habit } from '@/entities/habit';

/**
 * Разрешить конфликт между локальной и серверной привычкой
 * 
 * Стратегия:
 * 1. Last Write Wins для настроек (по полю updatedAt)
 * 2. Merge для completions, notes, moods (объединение всех записей)
 * 
 * @param local - Локальная версия привычки
 * @param server - Серверная версия привычки
 * @returns Объединенная привычка
 */
export function resolveHabitConflict(local: Habit, server: Habit): Habit {
  // Определяем, какая версия новее (Last Write Wins)
  const localUpdatedAt = new Date(local.updatedAt || local.createdAt).getTime();
  const serverUpdatedAt = new Date(server.updatedAt || server.createdAt).getTime();
  
  // Выбираем более свежую версию для настроек
  const newerSettings = localUpdatedAt >= serverUpdatedAt ? local : server;
  
  // Merge completions (объединяем все выполнения)
  const mergedCompletions = mergeCompletions(
    local.completions || {},
    server.completions || {}
  );
  
  // Merge notes (объединяем все заметки)
  const mergedNotes = mergeRecords(
    local.notes || {},
    server.notes || {}
  );
  
  // Merge moods (объединяем все настроения)
  const mergedMoods = mergeRecords(
    local.moods || {},
    server.moods || {}
  );
  
  // Возвращаем объединенную привычку
  return {
    ...newerSettings, // Берем настройки из более свежей версии
    completions: mergedCompletions, // Объединенные выполнения
    notes: mergedNotes, // Объединенные заметки
    moods: mergedMoods, // Объединенные настроения
    updatedAt: new Date().toISOString(), // Обновляем timestamp
  };
}

/**
 * Объединить completions с двух устройств
 * 
 * Правила:
 * - Берем все уникальные даты
 * - Для числовых значений берем максимум
 * - Для boolean берем true если хотя бы в одной версии true
 * 
 * @param local - Локальные completions
 * @param server - Серверные completions
 * @returns Объединенные completions
 */
function mergeCompletions(
  local: { [date: string]: boolean | number },
  server: { [date: string]: boolean | number }
): { [date: string]: boolean | number } {
  const merged: { [date: string]: boolean | number } = { ...server };
  
  for (const [date, value] of Object.entries(local)) {
    if (!(date in merged)) {
      // Если даты нет на сервере - добавляем
      merged[date] = value;
    } else {
      // Если дата есть в обеих версиях - объединяем
      const serverValue = merged[date];
      
      // Для числовых значений берем максимум (больший прогресс)
      if (typeof value === 'number' && typeof serverValue === 'number') {
        merged[date] = Math.max(value, serverValue);
      }
      // Для boolean берем true если хотя бы в одной версии true
      else if (typeof value === 'boolean' && typeof serverValue === 'boolean') {
        merged[date] = value || serverValue;
      }
      // Если типы разные - берем локальное значение (приоритет локальным изменениям)
      else {
        merged[date] = value;
      }
    }
  }
  
  return merged;
}

/**
 * Объединить записи (notes или moods) с двух устройств
 * 
 * Правила:
 * - Берем все уникальные даты
 * - Если есть в обеих версиях - берем непустое значение
 * - Приоритет локальным изменениям
 * 
 * @param local - Локальные записи
 * @param server - Серверные записи
 * @returns Объединенные записи
 */
function mergeRecords<T>(
  local: { [date: string]: T },
  server: { [date: string]: T }
): { [date: string]: T } {
  const merged: { [date: string]: T } = { ...server };
  
  for (const [date, value] of Object.entries(local)) {
    if (!(date in merged)) {
      // Если даты нет на сервере - добавляем
      merged[date] = value;
    } else {
      // Если дата есть в обеих версиях - приоритет локальному значению
      // (т.к. пользователь может редактировать заметки/настроения)
      if (value !== null && value !== undefined && value !== '') {
        merged[date] = value;
      }
    }
  }
  
  return merged;
}

/**
 * Синхронизировать массив привычек с сервером
 * 
 * @param localHabits - Локальные привычки
 * @param serverHabits - Серверные привычки
 * @returns Объединенный массив привычек
 */
export function syncHabits(localHabits: Habit[], serverHabits: Habit[]): Habit[] {
  // Создаем Map для быстрого поиска по ID
  const localMap = new Map(localHabits.map((h) => [h.id, h]));
  const serverMap = new Map(serverHabits.map((h) => [h.id, h]));
  
  const synced: Habit[] = [];
  
  // Обрабатываем все уникальные ID
  const allIds = new Set([...localMap.keys(), ...serverMap.keys()]);
  
  for (const id of allIds) {
    const local = localMap.get(id);
    const server = serverMap.get(id);
    
    if (local && server) {
      // Есть в обеих версиях - разрешаем конфликт
      synced.push(resolveHabitConflict(local, server));
    } else if (local) {
      // Только локально - добавляем (будет синхронизирована на сервер)
      synced.push({ ...local, updatedAt: local.updatedAt || new Date().toISOString() });
    } else if (server) {
      // Только на сервере - добавляем (новая привычка с другого устройства)
      synced.push(server);
    }
  }
  
  return synced;
}

/**
 * Проверить, требуется ли синхронизация
 * Сравнивает локальную и серверную версию привычки
 * 
 * @param local - Локальная версия
 * @param server - Серверная версия
 * @returns true если есть различия
 */
export function needsSync(local: Habit, server: Habit): boolean {
  // Сравниваем timestamps
  const localUpdatedAt = new Date(local.updatedAt || local.createdAt).getTime();
  const serverUpdatedAt = new Date(server.updatedAt || server.createdAt).getTime();
  
  if (localUpdatedAt !== serverUpdatedAt) {
    return true;
  }
  
  // Сравниваем количество completions
  const localCompletionsCount = Object.keys(local.completions || {}).length;
  const serverCompletionsCount = Object.keys(server.completions || {}).length;
  
  if (localCompletionsCount !== serverCompletionsCount) {
    return true;
  }
  
  return false;
}

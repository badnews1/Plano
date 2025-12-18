/**
 * API для синхронизации настроек пользователя
 * 
 * Функционал:
 * - Загрузка настроек с сервера
 * - Сохранение настроек на сервер
 * - Разрешение конфликтов (Last Write Wins)
 * 
 * @module entities/user/api/settingsSync
 * @created 17 декабря 2025
 */

import { serverFetch } from '@/shared/lib/supabase/client';
import type { UserSettings } from '../model/types';

/**
 * Загрузить настройки пользователя с сервера
 */
export async function fetchSettingsFromServer(): Promise<UserSettings | null> {
  try {
    const response = await serverFetch('/settings');
    
    if (!response.ok) {
      // Если 401/403 - logout уже произошел автоматически в serverFetch
      if (response.status === 401 || response.status === 403) {
        console.warn('⚠️ Сессия истекла или невалидна, требуется повторный вход');
        return null;
      }
      
      // Если 404 - настройки еще не созданы (первый вход)
      if (response.status === 404) {
        console.log('[Settings] Настройки не найдены на сервере (первый вход)');
        return null;
      }
      
      const errorText = await response.text();
      console.error('Failed to fetch settings from server:', errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ Настройки загружены с сервера');
    return data.settings || null;
  } catch (error) {
    console.error('Error fetching settings from server:', error);
    return null;
  }
}

/**
 * Сохранить настройки на сервер
 */
export async function saveSettingsToServer(settings: UserSettings): Promise<boolean> {
  try {
    const response = await serverFetch('/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ settings }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to save settings to server:', errorText);
      return false;
    }
    
    console.log('✅ Настройки сохранены на сервер');
    return true;
  } catch (error) {
    console.error('Error saving settings to server:', error);
    return false;
  }
}

/**
 * Синхронизировать настройки с сервером
 * 
 * Стратегия Last Write Wins:
 * - Сравниваем updatedAt локальных и серверных настроек
 * - Выбираем более свежие настройки
 * - Сохраняем выбранные настройки на сервер (если нужно)
 * 
 * @param localSettings - Локальные настройки
 * @returns Объединенные настройки (актуальные)
 */
export async function syncSettings(localSettings: UserSettings): Promise<UserSettings> {
  try {
    // Загружаем настройки с сервера
    const serverSettings = await fetchSettingsFromServer();
    
    // Если на сервере нет настроек - загружаем локальные
    if (!serverSettings) {
      console.log('[Settings] Первая синхронизация - загружаем локальные настройки на сервер');
      await saveSettingsToServer(localSettings);
      return localSettings;
    }
    
    // Сравниваем timestamps (Last Write Wins)
    const localUpdatedAt = new Date(localSettings.updatedAt).getTime();
    const serverUpdatedAt = new Date(serverSettings.updatedAt).getTime();
    
    // Если локальные настройки новее - загружаем на сервер
    if (localUpdatedAt > serverUpdatedAt) {
      console.log('[Settings] Локальные настройки новее - загружаем на сервер');
      await saveSettingsToServer(localSettings);
      return localSettings;
    }
    
    // Если серверные настройки новее - берем их
    if (serverUpdatedAt > localUpdatedAt) {
      console.log('[Settings] Серверные настройки новее - применяем их');
      return serverSettings;
    }
    
    // Если timestamps одинаковые - ничего не делаем
    console.log('[Settings] Настройки синхронизированы (timestamps одинаковые)');
    return localSettings;
  } catch (error) {
    console.error('[Settings] Ошибка синхронизации настроек:', error);
    // В случае ошибки возвращаем локальные настройки
    return localSettings;
  }
}

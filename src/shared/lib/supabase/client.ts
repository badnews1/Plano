/**
 * Supabase клиент для фронтенда
 * 
 * @module shared/lib/supabase/client
 * @created 17 декабря 2025
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../../utils/supabase/info';

// URL Supabase проекта
const supabaseUrl = `https://${projectId}.supabase.co`;

// Создаём singleton instance Supabase клиента
export const supabaseClient = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionUrl: true,
  },
});

// URL для API сервера
export const serverUrl = `${supabaseUrl}/functions/v1/make-server-05bdbe69`;

/**
 * Хелпер для выполнения запросов к серверу
 * Автоматически добавляет токен авторизации и обрабатывает ошибки
 */
export const serverFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const accessToken = session?.access_token || publicAnonKey;

  const response = await fetch(`${serverUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });

  // Если получили 401 или 403 - токен невалидный, делаем logout
  if (response.status === 401 || response.status === 403) {
    console.warn('⚠️ Получена ошибка авторизации, выполняем logout...');
    
    // Пытаемся получить детали ошибки
    try {
      const errorData = await response.clone().json();
      if (errorData.code === 'user_not_found') {
        console.warn('❌ Пользователь не найден в системе (возможно был удален)');
      }
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
    
    // Очищаем сессию
    await supabaseClient.auth.signOut();
  }

  return response;
};
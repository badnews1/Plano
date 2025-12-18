/**
 * Регистрация Service Worker для offline-режима
 * 
 * Функционал:
 * - Регистрация SW при загрузке приложения
 * - Обработка обновлений SW
 * - Логирование событий
 * 
 * @module shared/lib/offline/registerServiceWorker
 * @created 17 декабря 2025
 */

/**
 * Регистрация Service Worker
 */
export async function registerServiceWorker(): Promise<void> {
  // Проверяем поддержку Service Worker
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service Worker не поддерживается в этом браузере');
    return;
  }

  // Проверяем, что мы не в dev окружении Figma Make
  const isFigmaMake = window.location.hostname.includes('figma.site') || 
                      window.location.hostname.includes('makeproxy');
  
  if (isFigmaMake) {
    console.log('[SW] Service Worker отключен в Figma Make окружении');
    return;
  }

  try {
    // Регистрируем Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('[SW] Service Worker зарегистрирован:', registration.scope);

    // Обработка обновлений
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        console.log('[SW] Найдено обновление Service Worker');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] Новая версия Service Worker установлена. Перезагрузите страницу для применения изменений.');
            
            // Можно показать пользователю уведомление о доступном обновлении
            // toast.info('Доступно обновление приложения. Перезагрузите страницу.');
          }
        });
      }
    });

    // Обработка сообщений от Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('[SW] Получено сообщение:', event.data);
      
      // Обработка команды синхронизации
      if (event.data.type === 'SYNC_HABITS') {
        // Синхронизация будет выполнена автоматически через OfflineIndicator
        console.log('[SW] Запрос на синхронизацию привычек');
      }
    });

  } catch (error) {
    // В Figma Make окружении Service Worker может не работать - это нормально
    console.warn('[SW] Service Worker недоступен (возможно, вы в dev окружении):', error);
  }
}

/**
 * Отменить регистрацию Service Worker (для тестирования)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[SW] Service Worker отменен');
    }
  }
}
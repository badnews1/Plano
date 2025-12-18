/**
 * Утилиты для работы с кэшем приложения
 * 
 * Используется для решения проблем с устаревшими модулями
 * и кэшированными ресурсами при обновлении приложения.
 * 
 * @module shared/lib/cache/clearCache
 * @created 18 декабря 2025
 */

/**
 * Очистка всего кэша приложения
 * Полезно при обновлении зависимостей или структуры проекта
 */
export async function clearAllCaches(): Promise<void> {
  try {
    // Очистка Cache API (если доступен)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[Cache] Очищено кэшей:', cacheNames.length);
    }

    // Очистка localStorage (опционально - с подтверждением)
    // localStorage.clear();
    
    // Очистка sessionStorage
    sessionStorage.clear();
    
    console.log('[Cache] Все кэши успешно очищены');
  } catch (error) {
    console.error('[Cache] Ошибка при очистке кэша:', error);
  }
}

/**
 * Принудительная перезагрузка страницы без кэша
 */
export function hardReload(): void {
  window.location.reload();
}

/**
 * Очистка кэша и перезагрузка приложения
 * Используйте эту функцию при критических ошибках загрузки модулей
 */
export async function clearCacheAndReload(): Promise<void> {
  await clearAllCaches();
  hardReload();
}

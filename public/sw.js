/**
 * Service Worker для offline-режима
 * 
 * Функционал:
 * - Кэширование статических ресурсов (HTML, CSS, JS, шрифты, изображения)
 * - Стратегия Cache First для статики
 * - Network First для API запросов
 * - Offline fallback
 * 
 * @created 17 декабря 2025
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `plano-static-${CACHE_VERSION}`;
const API_CACHE = `plano-api-${CACHE_VERSION}`;

// Ресурсы для кэширования при установке
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ==================== INSTALL ====================
// Устанавливаем Service Worker и кэшируем статические ресурсы
self.addEventListener('install', (event) => {
  console.log('[SW] Установка Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Кэширование статических ресурсов');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Активируем новый SW сразу
      return self.skipWaiting();
    })
  );
});

// ==================== ACTIVATE ====================
// Активируем Service Worker и удаляем старые кэши
self.addEventListener('activate', (event) => {
  console.log('[SW] Активация Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Удаляем старые версии кэша
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Берем контроль над всеми клиентами
      return self.clients.claim();
    })
  );
});

// ==================== FETCH ====================
// Перехватываем запросы и отдаем из кэша или сети
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Игнорируем запросы к chrome-extension и другим протоколам
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API запросы - Network First
  if (url.pathname.includes('/functions/v1/make-server-05bdbe69')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Статические ресурсы - Cache First
  event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
});

// ==================== STRATEGIES ====================

/**
 * Cache First стратегия
 * Сначала проверяем кэш, если нет - идем в сеть
 * Используется для статических ресурсов (JS, CSS, изображения)
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Проверяем кэш
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Если нет в кэше - идем в сеть
    const networkResponse = await fetch(request);
    
    // Кэшируем успешный ответ
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache First ошибка:', error);
    
    // Fallback для навигационных запросов
    if (request.mode === 'navigate') {
      const cache = await caches.open(cacheName);
      return cache.match('/index.html');
    }
    
    throw error;
  }
}

/**
 * Network First стратегия
 * Сначала пытаемся получить из сети, если недоступна - из кэша
 * Используется для API запросов
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    // Пытаемся получить из сети
    const networkResponse = await fetch(request);
    
    // Кэшируем успешный GET запрос
    if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Network недоступна, пробуем кэш:', request.url);
    
    // Если сеть недоступна - пытаемся получить из кэша
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Если в кэше тоже нет - возвращаем ошибку
    throw error;
  }
}

// ==================== SYNC EVENT ====================
// Фоновая синхронизация (Background Sync API)
self.addEventListener('sync', (event) => {
  console.log('[SW] Событие синхронизации:', event.tag);
  
  if (event.tag === 'sync-habits') {
    event.waitUntil(syncHabits());
  }
});

/**
 * Синхронизация привычек в фоне
 */
async function syncHabits() {
  console.log('[SW] Запуск фоновой синхронизации привычек...');
  
  // Отправляем сообщение всем клиентам для запуска синхронизации
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      type: 'SYNC_HABITS',
    });
  });
}

console.log('[SW] Service Worker загружен');

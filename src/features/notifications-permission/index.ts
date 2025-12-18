/**
 * 🔔 Feature: Запрос разрешения на уведомления
 * 
 * @description
 * Публичный API фичи запроса разрешения на Web Notifications.
 * 
 * Что экспортируется:
 * - NotificationPermissionBanner - UI компонент для запроса разрешения
 * 
 * Использование:
 * ```tsx
 * import { NotificationPermissionBanner } from '@/features/notifications-permission';
 * 
 * function App() {
 *   return (
 *     <>
 *       <NotificationPermissionBanner />
 *       // остальной контент
 *     </>
 *   );
 * }
 * ```
 * 
 * @module features/notifications-permission
 */

export { NotificationPermissionBanner } from './ui/NotificationPermissionBanner';

/**
 * Низкоуровневая обёртка над Web Notifications API
 * 
 * Чистая обёртка над браузерным API без бизнес-логики.
 * Используется scheduler для показа уведомлений.
 */

/**
 * Конфигурация для показа уведомления
 */
export interface NotificationConfig {
  /** Заголовок уведомления */
  title: string;
  
  /** Текст уведомления */
  body?: string;
  
  /** Иконка (URL или emoji) */
  icon?: string;
  
  /** Тег для группировки/замены уведомлений */
  tag?: string;
  
  /** Произвольные данные (из NotificationOptions) */
  data?: Record<string, unknown>;
  
  /** Требует ли уведомление взаимодействия пользователя */
  requireInteraction?: boolean;
  
  /** Беззвучное уведомление */
  silent?: boolean;
}

/**
 * Статическая обёртка для работы с Web Notifications API
 * 
 * Предоставляет методы для:
 * - Проверки поддержки API
 * - Запроса разрешений
 * - Показа уведомлений
 */
export class NotificationService {
  /**
   * Проверка поддержки Web Notifications API
   */
  static isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Получение текущего статуса разрешения
   */
  static getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Запрос разрешения на отправку уведомлений
   * 
   * @returns Promise с результатом (granted | denied | default)
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn('[NotificationService] Web Notifications API не поддерживается');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      console.log(`[NotificationService] Разрешение: ${permission}`);
      return permission;
    } catch (error) {
      console.error('[NotificationService] Ошибка запроса разрешения:', error);
      return 'denied';
    }
  }

  /**
   * Показ уведомления
   * 
   * @returns Cleanup функция для очистки таймера и закрытия уведомления
   */
  static async show(config: NotificationConfig): Promise<() => void> {
    if (!this.isSupported()) {
      // API не поддерживается - возвращаем пустую cleanup функцию
      return () => {};
    }

    if (Notification.permission !== 'granted') {
      // Разрешение не предоставлено - возвращаем пустую cleanup функцию
      return () => {};
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/favicon.ico',
        tag: config.tag,
        data: config.data,
        requireInteraction: config.requireInteraction ?? false,
        silent: config.silent ?? false,
      });

      // Фокус на окне при клике
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Автоматическое закрытие через 10 секунд
      const timeoutId = setTimeout(() => notification.close(), 10000);

      console.log(`[NotificationService] Показано уведомление: ${config.title}`);
      
      // Возвращаем cleanup функцию для очистки таймера
      return () => {
        clearTimeout(timeoutId);
        notification.close();
      };
    } catch (error) {
      console.error('[NotificationService] Ошибка показа уведомления:', error);
      throw error;
    }
  }
}
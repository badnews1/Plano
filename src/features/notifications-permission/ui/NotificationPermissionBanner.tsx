/**
 * 🔔 Feature: Запрос разрешения на уведомления
 * 
 * @description
 * Баннер для запроса разрешения на Web Notifications API.
 * Это полноценная фича со своей бизнес-логикой, сайд-эффектами и состоянием.
 * 
 * Почему это Feature, а не shared/ui:
 * ✅ Имеет бизнес-логику (проверяет localStorage через NotificationService)
 * ✅ Производит сайд-эффекты (вызывает методы NotificationService, запись в localStorage)
 * ✅ Автономный сценарий ("Запросить права на уведомления")
 * ✅ Управляет собственным состоянием показа/скрытия
 * 
 * Функциональность:
 * - Автоматически показывается при первом посещении
 * - Запрашивает разрешение через NotificationService (shared/lib)
 * - Показывает тестовое уведомление при успешном разрешении
 * - Запоминает отклонение в localStorage
 * - Скрывается после действия пользователя
 * 
 * Интеграция с Shared:
 * - Использует NotificationService вместо прямых вызовов Web Notifications API
 * - Это обеспечивает DRY принцип, консистентность и лучшую тестируемость
 * 
 * Стиль:
 * - На базе shadcn/ui Alert
 * - Минималистичный дизайн в духе Jony Ive
 * - Фиксированное позиционирование в правом нижнем углу
 * 
 * @module features/notifications-permission
 * @since 30 ноября 2025 - миграция из /shared/ui/ в /features/ согласно FSD
 * @updated 30 ноября 2025 - рефакторинг для использования NotificationService
 * @updated 17 декабря 2025 - добавлена проверка авторизации (показывается только авторизованным пользователям)
 */

import React, { useState, useEffect } from 'react';
import { Bell, X } from '@/shared/assets/icons/system';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { NotificationService } from '@/shared/lib/notifications';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/contexts/AuthContext';

export const NotificationPermissionBanner: React.FC = () => {
  const { t } = useTranslation('common');
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  // Защита от ошибок HMR - оборачиваем useAuth в try-catch
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // Если AuthProvider еще не инициализирован (HMR), просто не показываем баннер
    return null;
  }

  useEffect(() => {
    // Показываем баннер только авторизованным пользователям
    if (!user) {
      setShow(false);
      return;
    }

    // Проверяем нужно ли показывать баннер
    const checkPermission = () => {
      // Используем общий сервис вместо прямого обращения к API
      if (NotificationService.isSupported()) {
        const permission = NotificationService.getPermissionStatus();
        const wasDismissed = localStorage.getItem('notificationBannerDismissed');
        
        // Показываем баннер если разрешение не запрошено (default) и не было отклонено
        if (permission === 'default' && !wasDismissed) {
          setShow(true);
        }
      }
    };

    checkPermission();
  }, [user]);

  const handleRequestPermission = async () => {
    // Используем общий сервис вместо прямого вызова Notification.requestPermission()
    const permission = await NotificationService.requestPermission();
    
    if (permission === 'granted') {
      setShow(false);
      // Показываем тестовое уведомление через общий сервис
      const cleanup = await NotificationService.show({
        title: t('notifications.granted'),
        body: t('notifications.permission.description'),
        icon: '/favicon.ico',
      });
      // Cleanup автоматически вызовется когда уведомление закроется
      // В данном случае не нужно вызывать cleanup вручную, т.к. это одноразовое тестовое уведомление
    } else if (permission === 'denied') {
      setShow(false);
      localStorage.setItem('notificationBannerDismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 max-w-md" style={{ zIndex: 'var(--z-toast)' }}>
      <Alert className="relative shadow-lg">
        <Bell className="h-4 w-4" />
        <AlertTitle>{t('notifications.permission.title')}</AlertTitle>
        <AlertDescription>
          <p className="mb-3">
            {t('notifications.permission.description')}
          </p>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={handleRequestPermission}
              size="sm"
            >
              {t('notifications.permission.enable')}
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              size="sm"
            >
              {t('notifications.permission.dismiss')}
            </Button>
          </div>
        </AlertDescription>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
};
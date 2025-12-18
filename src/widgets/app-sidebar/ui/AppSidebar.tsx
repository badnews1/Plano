import { CheckSquare, User, Gauge, BarChart2, Square, Timer, LogOut, Shield } from '@/shared/assets/icons/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import { useTimerStore } from '@/features/timer';
import { useAuth } from '@/app/contexts/AuthContext';
import { useUserStore } from '@/entities/user';
import { useState } from 'react';

/**
 * Боковое меню приложения
 * Статичная панель с навигацией и профилем
 */
export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('app');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  
  // Защита от ошибок HMR - если AuthProvider не готов, возвращаем null
  let logout = () => {};
  let isAdmin = false;
  
  try {
    const auth = useAuth();
    logout = auth.logout;
    isAdmin = auth.isAdmin;
  } catch (error) {
    // Если AuthProvider еще не инициализирован (HMR/hot reload), скрываем компонент
    return null;
  }
  
  const { state, isMinimized, timeLeft, mode, setMinimized } = useTimerStore();
  const isTimerRunning = state === 'running' && isMinimized;
  
  const handleTimerClick = () => {
    if (isMinimized) {
      setMinimized(false);
    } else {
      // Открываем модалку через глобальный store
      useTimerStore.setState({ isOpen: true, isMinimized: false });
    }
  };

  // Проверка активной страницы
  const isTrackerActive = location.pathname === '/app';
  const isProfileActive = location.pathname === '/app/profile';
  const isAdminActive = location.pathname === '/app/admin';
  const isColorsDemoActive = location.pathname === '/app/colors-demo';
  const isButtonsDemoActive = location.pathname === '/app/buttons-demo';
  
  // Форматирование времени для отображения в сайдбаре
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Аватарка пользователя из store
  const avatar = useUserStore((state) => state.avatar);

  return (
    <aside className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col items-center z-20" style={{ width: 'var(--sidebar-width)', paddingBottom: 'var(--page-padding-y)' }}>
      {/* Аватарка профиля пользователя */}
      <div className="pt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`cursor-pointer rounded-full transition-all ${
                isProfileActive ? 'ring-2 ring-accent-primary-indigo ring-offset-2 ring-offset-sidebar' : ''
              }`}
              onClick={() => navigate('/app/profile')}
            >
              <Avatar style={{ width: 'var(--sidebar-avatar-size)', height: 'var(--sidebar-avatar-size)' }}>
                <AvatarImage 
                  src={avatar || undefined} 
                  alt={t('app.profile')} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-sidebar-accent">
                  <User className="w-5 h-5 text-sidebar-foreground" />
                </AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {t('app.profile')}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Иконка трекера привычек */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isTrackerActive ? 'ghostActive' : 'ghost'}
            size="icon"
            onClick={() => navigate('/app')}
            className="mt-4"
            style={{ width: 'var(--sidebar-button-size)', height: 'var(--sidebar-button-size)' }}
            aria-label={t('app.habitTracker')}
          >
            <CheckSquare className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {t('app.habitTracker')}
        </TooltipContent>
      </Tooltip>

      {/* Иконка демо цветов */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isColorsDemoActive ? 'ghostActive' : 'ghost'}
            size="icon"
            onClick={() => navigate('/app/colors-demo')}
            className="mt-2"
            style={{ width: 'var(--sidebar-button-size)', height: 'var(--sidebar-button-size)' }}
            aria-label="Colors Demo"
          >
            <Gauge className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          Colors Demo
        </TooltipContent>
      </Tooltip>

      {/* Иконка демо кнопок */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isButtonsDemoActive ? 'ghostActive' : 'ghost'}
            size="icon"
            onClick={() => navigate('/app/buttons-demo')}
            className="mt-2"
            style={{ width: 'var(--sidebar-button-size)', height: 'var(--sidebar-button-size)' }}
            aria-label="Buttons Demo"
          >
            <Square className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          Buttons Demo
        </TooltipContent>
      </Tooltip>

      {/* Иконка таймера */}
      <Tooltip>
        <TooltipTrigger asChild>
          {isTimerRunning ? (
            <Button
              variant="ghostActive"
              size="icon"
              onClick={handleTimerClick}
              className="mt-2 px-2 w-auto min-w-[40px] h-10"
              aria-label="Timer Running"
            >
              <span className="text-xs whitespace-nowrap">{formatTime(timeLeft)}</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTimerClick}
              className="mt-2"
              style={{ width: 'var(--sidebar-button-size)', height: 'var(--sidebar-button-size)' }}
              aria-label="Timer"
            >
              <Timer className="w-5 h-5" />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {isTimerRunning ? 'Timer running' : 'Timer'}
        </TooltipContent>
      </Tooltip>

      {/* Spacer - отталкивает кнопки вниз */}
      <div className="flex-1" />

      {/* Иконка админки (только для админов) */}
      {isAdmin && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isAdminActive ? 'ghostActive' : 'ghost'}
              size="icon"
              onClick={() => navigate('/app/admin')}
              className="mb-2"
              style={{ width: 'var(--sidebar-button-size)', height: 'var(--sidebar-button-size)' }}
              aria-label={t('admin:admin.title')}
            >
              <Shield className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {t('admin:admin.title')}
          </TooltipContent>
        </Tooltip>
      )}

      {/* Кнопка выхода */}
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLogoutDialog(true)}
              style={{ width: 'var(--sidebar-button-size)', height: 'var(--sidebar-button-size)' }}
              aria-label={t('app.logout.button')}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {t('app.logout.button')}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Диалог подтверждения выхода */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('app.logout.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('app.logout.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('app.logout.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>{t('app.logout.confirm')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
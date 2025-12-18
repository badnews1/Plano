/**
 * Страница профиля пользователя
 * 
 * Содержит:
 * - Раздел "Аккаунт": фото, имя, email, смена пароля, язык, выход, удаление аккаунта
 * - Раздел "Настройки": тема
 * 
 * @module pages/profile/ui/ProfilePage
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - добавлено редактирование имени и выбор языка через Select
 * @updated 17 декабря 2025 - добавлено боковое меню настроек
 * @updated 17 декабря 2025 - реорганизация: "Аккаунт" первым, все основные настройки в нем
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AppHeader } from '@/widgets/app-header';
import { PageContainer } from '@/shared/ui/page-container';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
import { User, Mail, Pencil, Check, X, Settings, Trash2, ShieldCheck, Shield } from '@/shared/assets/icons/system';
import { ThemeToggle } from '@/features/theme-switcher';
import { LanguageSelect } from '@/features/language-switcher';
import { AvatarUploadButton } from '@/features/avatar-upload';
import { useAuth } from '@/app/contexts/AuthContext';
import { useUserStore } from '@/entities/user';

// Типы разделов настроек
type SettingsSection = 'account' | 'settings';

export function ProfilePage() {
  // ==================== I18N ====================
  const { t } = useTranslation('app');
  const { t: tCommon } = useTranslation('common');

  // ==================== AUTH ====================
  const { user, logout, updateProfile, changePassword, updateEmail, deleteAccount } = useAuth();

  // ==================== STORE ====================
  // Аватарка пользователя
  const avatar = useUserStore((state) => state.avatar);

  // ==================== STATE ====================
  const [activeSection, setActiveSection] = React.useState<SettingsSection>('account');
  
  // Редактирование имени
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editedName, setEditedName] = React.useState(user?.name || '');
  const [nameError, setNameError] = React.useState('');
  
  // Редактирование email
  const [isEditingEmail, setIsEditingEmail] = React.useState(false);
  const [editedEmail, setEditedEmail] = React.useState(user?.email || '');
  const [emailError, setEmailError] = React.useState('');
  
  // Смена пароля
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [showPasswordForm, setShowPasswordForm] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  
  // 2FA (двухфакторная аутентификация)
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);
  const [show2FASetupDialog, setShow2FASetupDialog] = React.useState(false);
  const [show2FADisableDialog, setShow2FADisableDialog] = React.useState(false);
  
  // Диалоги
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  // Загрузка
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Обновляем editedName и editedEmail при изменении user
  React.useEffect(() => {
    if (user?.name) {
      setEditedName(user.name);
    }
    if (user?.email) {
      setEditedEmail(user.email);
    }
  }, [user?.name, user?.email]);

  // ==================== HANDLERS ====================
  
  // Сохранение имени
  const handleSaveName = async () => {
    if (!editedName.trim()) {
      setNameError('Имя не может быть пустым');
      return;
    }

    setIsSaving(true);
    setNameError('');

    try {
      await updateProfile(editedName.trim());
      setIsEditingName(false);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelNameEdit = () => {
    setEditedName(user?.name || '');
    setIsEditingName(false);
    setNameError('');
  };

  // Сохранение email
  const handleSaveEmail = async () => {
    if (!editedEmail.trim()) {
      setEmailError('Email не может быть пустым');
      return;
    }

    // Проверка что email отличается от текущего
    if (editedEmail.trim() === user?.email) {
      setEmailError('Это ваш текущий email. Введите новый email.');
      return;
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      setEmailError('Введите корректный email');
      return;
    }

    setIsSaving(true);
    setEmailError('');

    try {
      await updateEmail(editedEmail.trim());
      setIsEditingEmail(false);
      toast.success('Email успешно изменен');
    } catch (err) {
      // Показываем понятное сообщение об ошибке
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при смене email';
      setEmailError(errorMessage);
      
      // Логируем для отладки
      console.error('Ошибка смены email:', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEmailEdit = () => {
    setEditedEmail(user?.email || '');
    setIsEditingEmail(false);
    setEmailError('');
  };

  // Смена пароля
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsChangingPassword(true);
    setPasswordError('');

    try {
      await changePassword(currentPassword, newPassword);
      // Успешно изменен пароль - сбрасываем поля и закрываем форму
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');
      setShowPasswordForm(false);
      toast.success(tCommon('success.passwordChanged'));
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Ошибка при смене пароля');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Удаление аккаунта
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      // После удаления произойдет автоматический logout и редирект
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при удалении аккаунта');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      {/* Header */}
      <AppHeader
        leftElement={<User className="w-5 h-5 text-text-primary" />}
        title={t('app.profile')}
      />

      {/* Main Content */}
      <PageContainer>
        {/* Grid: Меню слева + Контент справа */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Боковое меню настроек */}
          <Card className="p-4 sticky top-6 self-start min-h-[calc(100vh-theme(spacing.24))]">
            <h3 className="text-lg font-semibold text-text-primary mb-4 px-2">
              Настройки
            </h3>
            
            <nav className="space-y-1">
              {/* Аккаунт - ПЕРВЫЙ */}
              <button
                onClick={() => setActiveSection('account')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'account'
                    ? 'bg-accent-muted-indigo text-accent-primary-indigo'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
              >
                <User className="w-5 h-5" />
                <span>Аккаунт</span>
              </button>

              {/* Настройки */}
              <button
                onClick={() => setActiveSection('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'settings'
                    ? 'bg-accent-muted-indigo text-accent-primary-indigo'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Настройки</span>
              </button>
            </nav>
          </Card>

          {/* Основной контент - зависит от activeSection */}
          <div className="space-y-6">
            {/* РАЗДЕЛ: Аккаунт */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                {/* Фото и основная информация */}
                <Card className="py-4 px-6">
                  <div className="flex items-center gap-6">
                    {/* Аватарка с кнопкой загрузки */}
                    <div className="relative group">
                      <Avatar className="w-20 h-20">
                        <AvatarImage 
                          src={avatar || undefined} 
                          alt={user?.email || 'User'} 
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-accent-primary-indigo text-white text-xl">
                          {user?.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Overlay с иконкой камеры при наведении */}
                      <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <AvatarUploadButton className="w-full h-full flex items-center justify-center bg-black/50 rounded-full text-white hover:text-white/80 transition-colors cursor-pointer" />
                      </div>
                    </div>

                    {/* Информация о пользователе */}
                    <div className="flex-1">
                      {/* Редактирование имени */}
                      <div className="group/name">
                        {isEditingName ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                placeholder="Введите имя"
                                className="max-w-xs"
                                disabled={isSaving}
                              />
                              <Button
                                size="sm"
                                onClick={handleSaveName}
                                disabled={isSaving}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelNameEdit}
                                disabled={isSaving}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {nameError && (
                              <p className="text-sm text-status-error">{nameError}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-text-primary text-lg font-semibold">
                              {user?.name || user?.email?.split('@')[0] || 'Пользователь'}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsEditingName(true)}
                              className="opacity-0 group-hover/name:opacity-100 transition-opacity"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Смена пароля */}
                <Card className="py-4 px-6">
                  <div className="space-y-0">
                    {/* Email */}
                    <div className="flex items-center justify-between py-1">
                      <p className="text-sm font-medium text-text-primary">Email</p>
                      
                      {isEditingEmail ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            placeholder="Введите email"
                            className="w-64"
                            disabled={isSaving}
                          />
                          <Button
                            size="sm"
                            onClick={handleSaveEmail}
                            disabled={isSaving}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEmailEdit}
                            disabled={isSaving}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-secondary">
                            {user?.email || 'user@example.com'}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsEditingEmail(true)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {emailError && (
                      <p className="text-sm text-status-error">{emailError}</p>
                    )}

                    {/* Пароль */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-1">
                        <p className="text-sm font-medium text-text-primary">Пароль</p>
                        
                        {!showPasswordForm && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowPasswordForm(true)}
                            className="font-normal"
                          >
                            Изменить пароль
                          </Button>
                        )}
                      </div>

                      {/* Форма смены пароля */}
                      {showPasswordForm && (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-sm text-text-secondary mb-1.5 block">
                              Текущий пароль
                            </label>
                            <Input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Введите текущий пароль"
                              disabled={isChangingPassword}
                            />
                          </div>

                          <div>
                            <label className="text-sm text-text-secondary mb-1.5 block">
                              Новый пароль
                            </label>
                            <Input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Введите новый пароль"
                              disabled={isChangingPassword}
                            />
                          </div>

                          <div>
                            <label className="text-sm text-text-secondary mb-1.5 block">
                              Подтвердите новый пароль
                            </label>
                            <Input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Повторите новый пароль"
                              disabled={isChangingPassword}
                            />
                          </div>

                          {passwordError && (
                            <p className="text-sm text-status-error">{passwordError}</p>
                          )}

                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={handlePasswordChange}
                              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                            >
                              {isChangingPassword ? 'Сохранение...' : 'Сохранить'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowPasswordForm(false);
                                setCurrentPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                                setPasswordError('');
                              }}
                              disabled={isChangingPassword}
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Двухфакторная аутентификация (2FA) */}
                <Card className="py-4 px-6">
                  <div className="space-y-1">
                    {/* Заголовок с бейджиком и кнопкой */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {is2FAEnabled ? (
                          <ShieldCheck className="w-5 h-5 text-status-success" />
                        ) : (
                          <Shield className="w-5 h-5 text-text-tertiary" />
                        )}
                        <p className="font-medium text-text-primary">
                          Двухфакторная аутентификация
                        </p>
                        
                        {/* Статус рядом с заголовком */}
                        {is2FAEnabled ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-status-success/10 text-status-success">
                            Включена
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-bg-tertiary text-text-tertiary">
                            Выключена
                          </span>
                        )}
                      </div>
                      
                      {/* Кнопка управления справа */}
                      {is2FAEnabled ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShow2FADisableDialog(true)}
                        >
                          Отключить
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setShow2FASetupDialog(true)}
                        >
                          Включить
                        </Button>
                      )}
                    </div>
                    
                    {/* Описание */}
                    <p className="text-sm text-text-tertiary ml-8">
                      {is2FAEnabled 
                        ? 'Ваш аккаунт защищен дополнительным уровнем безопасности'
                        : 'Добавьте дополнительный уровень защиты для вашего аккаунта'
                      }
                    </p>
                  </div>
                </Card>

                {/* Язык */}
                <Card className="py-4 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{tCommon('common.language')}</p>
                      <p className="text-sm text-text-tertiary">{tCommon('common.languageDescription')}</p>
                    </div>
                    <LanguageSelect />
                  </div>
                </Card>

                {/* Опасная зона */}
                <Card className="py-4 px-6 border-status-error">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowLogoutDialog(true)}
                    >
                      {tCommon('common.logout')}
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить аккаунт
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* РАЗДЕЛ: Настройки */}
            {activeSection === 'settings' && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  {tCommon('common.settings')}
                </h3>

                <div className="space-y-4">
                  {/* Настройка темы */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-text-primary">{tCommon('common.theme')}</p>
                      <p className="text-sm text-text-tertiary">{tCommon('common.themeDescription')}</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </PageContainer>

      {/* Logout Dialog */}
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

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Все ваши данные будут безвозвратно удалены, включая привычки, прогресс и настройки.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-status-error hover:bg-status-error/90"
            >
              {isDeleting ? 'Удаление...' : 'Удалить аккаунт'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2FA Setup Dialog - TODO: будет реализовано с QR-кодом */}
      <AlertDialog open={show2FASetupDialog} onOpenChange={setShow2FASetupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Настройка двухфакторной аутентификации</AlertDialogTitle>
            <AlertDialogDescription>
              Для включения 2FA вам потребуется приложение-аутентификатор (Google Authenticator, Authy и т.д.)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-sm text-text-secondary text-center">
              QR-код и инструкции будут добавлены на следующем этапе
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              // TODO: Реализовать логику включения 2FA
              setIs2FAEnabled(true);
              setShow2FASetupDialog(false);
              toast.success('2FA включена (демо-режим)');
            }}>
              Включить (демо)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 2FA Disable Dialog */}
      <AlertDialog open={show2FADisableDialog} onOpenChange={setShow2FADisableDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отключить двухфакторную аутентификацию?</AlertDialogTitle>
            <AlertDialogDescription>
              Отключение 2FA снизит уровень защиты вашего аккаунта. Вы уверены, что хотите продолжить?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                // TODO: Реализовать логику отключения 2FA
                setIs2FAEnabled(false);
                setShow2FADisableDialog(false);
                toast.success('2FA отключена');
              }}
              className="bg-status-error hover:bg-status-error/90"
            >
              Отключить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
/**
 * Auth Context - управление аутентификацией через Supabase
 * 
 * Функционал:
 * - Проверка авторизации (Supabase Auth)
 * - Login/Signup через Email/Password
 * - Login через Google OAuth
 * - Logout
 * - Update Profile (обновление имени пользователя)
 * - Определение роли пользователя из user_metadata
 * - Изменение пароля
 * - Обновление предпочитаемого языка в user_metadata
 * - Изменение email
 * - Удаление аккаунта
 * 
 * @module app/contexts/AuthContext
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - интеграция с Supabase, добавлено управление языком
 * @updated 17 декабря 2025 - добавлены методы смены email и удаления аккаунта
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseClient, serverFetch } from '../../shared/lib/supabase/client';
import { useHabitsStore } from '../store';
import { getInitialLanguage } from '@/shared/lib/i18n';
import { useTheme } from '@/features/theme-switcher';
import type { Language } from '@/shared/types/language';

// ==================== TYPES ====================

interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin'; // Роль пользователя
  avatar_url?: string; // URL аватара
  preferredLanguage?: Language; // Предпочитаемый язык пользователя
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean; // Проверка админа
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>; // Новая функция
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>; // Изменение пароля
  updateLanguage: (language: Language) => Promise<void>; // Обновление языка
  updateEmail: (newEmail: string) => Promise<void>; // Изменение email
  deleteAccount: () => Promise<void>; // Удаление аккаунта
}

// ==================== CONTEXT ====================

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadHabitsFromServer = useHabitsStore((state) => state.loadHabitsFromServer);
  const syncLanguageFromServer = useHabitsStore((state) => state.syncLanguageFromServer);
  const { syncThemeFromServer } = useTheme();

  // Загрузка привычек и синхронизация настроек при изменении пользователя
  useEffect(() => {
    if (user) {
      console.log('🔄 Пользователь авторизован, загружаем привычки и синхронизируем настройки...');
      loadHabitsFromServer();
      
      // Синхронизируем настройки с сервером
      const themeStore = localStorage.getItem('habit-tracker-theme');
      const theme = themeStore ? JSON.parse(themeStore).state.theme : 'light';
      const languageStore = localStorage.getItem('habit-tracker-language');
      const language = languageStore ? JSON.parse(languageStore).state.language : 'en';
      
      // Синхронизируем тему и язык с сервером
      syncThemeFromServer(language).catch(err => 
        console.error('[Settings] Ошибка синхронизации темы:', err)
      );
      syncLanguageFromServer(theme).catch(err => 
        console.error('[Settings] Ошибка синхронизации языка:', err)
      );
    }
  }, [user, loadHabitsFromServer, syncLanguageFromServer, syncThemeFromServer]);

  // Проверяем текущую сессию и подписываемся на изменения
  useEffect(() => {
    // Получаем текущую сессию
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Преобразуем Supabase User в наш формат
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role || 'user',
          avatar_url: session.user.user_metadata.avatar_url,
          preferredLanguage: session.user.user_metadata.preferredLanguage || 'ru',
        });
      }
      setIsLoading(false);
    });

    // Подписываемся на изменения авторизации
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name,
          role: session.user.user_metadata.role || 'user',
          avatar_url: session.user.user_metadata.avatar_url,
          preferredLanguage: session.user.user_metadata.preferredLanguage || 'ru',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ==================== HANDLERS ====================

  // Login через Email/Password
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Пользователь будет установлен через onAuthStateChange
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Signup через Email/Password (используем серверный роут)
  const signup = async (email: string, password: string, name?: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Получаем текущий язык (приоритет: localStorage → браузер → en)
      const currentLanguage = getInitialLanguage();
      
      // Отправляем запрос на сервер для создания пользователя
      const response = await serverFetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          name,
          preferredLanguage: currentLanguage, // Передаем текущий язык
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      // После успешной регистрации выполняем вход
      await login(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Login через Google OAuth
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        throw error;
      }

      // OAuth редиректит пользователя, поэтому здесь ничего не делаем
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || 'Google login failed');
    }
  };

  // Logout
  const logout = async () => {
    await supabaseClient.auth.signOut();
    setUser(null);
    
    // Очищаем привычки из стора
    useHabitsStore.setState({ habits: [] });
    
    // Редирект на главную страницу после выхода
    window.location.href = '/';
  };

  // Update Profile
  const updateProfile = async (name: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Отправляем запрос на сервер для обновления профиля
      const response = await serverFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Profile update failed');
      }

      const result = await response.json();

      // Обновляе пользователя в контексте
      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          avatar_url: result.user.avatar_url,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Отправляем запрос на сервер для изменения пароля
      const response = await serverFetch('/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Password change failed');
      }

      // Пароль успешно изменен
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update Language
  const updateLanguage = async (language: Language): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Отправляем запрос на сервер для обновления языка
      const response = await serverFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ preferredLanguage: language }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Language update failed');
      }

      const result = await response.json();

      // Обновляем пользователя в контексте
      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          avatar_url: result.user.avatar_url,
          preferredLanguage: result.user.preferredLanguage,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Language update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Update Email
  const updateEmail = async (newEmail: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Отправляем запрос на сервер для изменения email
      const response = await serverFetch('/profile', {
        method: 'PUT',
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Email update failed');
      }

      const result = await response.json();

      // Обновляем пользователя в контексте
      if (result.user) {
        setUser({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
          avatar_url: result.user.avatar_url,
          preferredLanguage: result.user.preferredLanguage,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Email update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Account
  const deleteAccount = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Отправляем запрос на сервер для удаления аккаунта
      const response = await serverFetch('/delete-account', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Account deletion failed');
      }

      // Выходим из системы после удаления аккаунта
      await logout();
    } catch (error: any) {
      throw new Error(error.message || 'Account deletion failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== VALUE ====================

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    changePassword,
    updateLanguage,
    updateEmail,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== HOOK ====================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // В dev режиме при hot reload контекст может временно быть undefined
    if (import.meta.hot) {
      // Не выбрасываем исключение в dev режиме - просто логируем
      console.debug('[useAuth] Контекст не готов (hot reload). Это временная ситуация.');
      // Бросаем ошибку чтобы ErrorBoundary мог перехватить
      throw new Error('useAuth must be used within an AuthProvider');
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
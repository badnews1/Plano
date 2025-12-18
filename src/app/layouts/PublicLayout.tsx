/**
 * Public Layout - для неавторизованных пользователей
 * 
 * Используется для Landing, Login, SignUp страниц.
 * БЕЗ сайдбара, только контент.
 * 
 * @module app/layouts/PublicLayout
 * @created 17 декабря 2025
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { Loader2 } from '@/shared/assets/icons/system';

interface PublicLayoutProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: boolean; // Если true, редиректим авторизованных на /app
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  redirectIfAuthenticated = false 
}) => {
  // Защита от ошибок HMR - если AuthProvider не готов, показываем лоадер
  let isAuthenticated = false;
  let isLoading = true;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
  } catch (error) {
    // Если AuthProvider еще не инициализирован (HMR/hot reload), показываем лоадер
    console.warn('PublicLayout: AuthProvider not ready yet, showing loader...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent-primary-indigo mx-auto mb-4" />
          <p className="text-sm text-text-secondary">Инициализация...</p>
        </div>
      </div>
    );
  }

  // Показываем лоадер пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary-indigo" />
      </div>
    );
  }

  // Если пользователь авторизован и это страница login/signup - редиректим на /app
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {children}
    </div>
  );
};
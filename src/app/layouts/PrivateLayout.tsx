/**
 * Private Layout - для авторизованных пользователей
 * 
 * Используется для всех страниц приложения внутри /app/*.
 * С сайдбаром и хедером.
 * 
 * @module app/layouts/PrivateLayout
 * @created 17 декабря 2025
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { Loader2 } from '@/shared/assets/icons/system';
import { AppSidebar } from '@/widgets/app-sidebar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
  // Защита от ошибок HMR - если AuthProvider не готов, показываем лоадер
  let isAuthenticated = false;
  let isLoading = true;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    isLoading = auth.isLoading;
  } catch (error) {
    // Если AuthProvider еще не инициализирован (HMR/hot reload), показываем лоадер
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

  // Если пользователь НЕ авторизован - редиректим на login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Боковое меню */}
      <AppSidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-[var(--sidebar-width)] overflow-y-auto">
        <DndProvider backend={HTML5Backend}>
          {children}
        </DndProvider>
      </main>
    </div>
  );
};
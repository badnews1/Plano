/**
 * Конфигурация роутинга приложения
 * 
 * Структура маршрутов:
 * - Public Routes (без сайдбара): /, /login, /signup
 * - Private Routes (с сайдбаром): /app, /app/*
 * - Admin Routes (с защитой): /app/admin
 * 
 * @module app/router
 * @created 1 декабря 2025
 * @updated 17 декабря 2025 - добавлена админская панель с lazy loading и защитой
 */

import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/app/layouts/PublicLayout';
import { PrivateLayout } from '@/app/layouts/PrivateLayout';
import { LandingPage } from '@/pages/landing';
import { LoginPage, SignUpPage } from '@/pages/auth';
import { HabitTrackerPage } from '@/pages/habit-tracker';
import { ProfilePage } from '@/pages/profile';
import ColorsDemo from '@/pages/colors-demo/ColorsDemo';
import { ButtonsDemo } from '@/pages/buttons-demo';
import { lazy, Suspense } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Lazy loading для админской панели (не грузится для обычных пользователей)
const AdminPageLazy = lazy(() => import('@/pages/admin').then(m => ({ default: m.AdminPage })));

// Компонент-обёртка для защиты админских роутов
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  try {
    const { isAdmin, isLoading } = useAuth();
    
    if (isLoading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }
    
    if (!isAdmin) {
      return <Navigate to="/app" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    // В случае ошибки (hot reload) - редиректим на /app
    console.error('AdminRoute error:', error);
    return <Navigate to="/app" replace />;
  }
};

export const AppRouter = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      
      {/* Landing Page */}
      <Route 
        path="/" 
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        } 
      />
      
      {/* Login Page */}
      <Route 
        path="/login" 
        element={
          <PublicLayout redirectIfAuthenticated>
            <LoginPage />
          </PublicLayout>
        } 
      />
      
      {/* SignUp Page */}
      <Route 
        path="/signup" 
        element={
          <PublicLayout redirectIfAuthenticated>
            <SignUpPage />
          </PublicLayout>
        } 
      />

      {/* ==================== PRIVATE ROUTES ==================== */}
      
      {/* Habit Tracker (главная приложения) */}
      <Route 
        path="/app" 
        element={
          <PrivateLayout>
            <HabitTrackerPage />
          </PrivateLayout>
        } 
      />
      
      {/* Profile Page */}
      <Route 
        path="/app/profile" 
        element={
          <PrivateLayout>
            <ProfilePage />
          </PrivateLayout>
        } 
      />
      
      {/* Admin Page */}
      <Route 
        path="/app/admin" 
        element={
          <PrivateLayout>
            <AdminRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <AdminPageLazy />
              </Suspense>
            </AdminRoute>
          </PrivateLayout>
        } 
      />
      
      {/* Demo Pages */}
      <Route 
        path="/app/colors-demo" 
        element={
          <PrivateLayout>
            <ColorsDemo />
          </PrivateLayout>
        } 
      />
      
      <Route 
        path="/app/buttons-demo" 
        element={
          <PrivateLayout>
            <ButtonsDemo />
          </PrivateLayout>
        } 
      />
    </Routes>
  );
};
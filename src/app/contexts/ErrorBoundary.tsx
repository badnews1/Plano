/**
 * Error Boundary - обработка ошибок React
 * 
 * Функционал:
 * - Перехват ошибок в дочерних компонентах
 * - Предотвращение краха всего приложения
 * - Graceful fallback UI
 * - Поддержка hot reload в development
 * 
 * @module app/contexts/ErrorBoundary
 * @created 17 декабря 2025
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Loader2 } from '@/shared/assets/icons/system';
import { clearCacheAndReload } from '@/shared/lib/cache';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // В development режиме при hot reload ошибки контекста - это нормально
    if (import.meta.hot && error.message.includes('AuthProvider')) {
      console.warn('⚠️ Hot reload error (игнорируется):', error.message);
      return;
    }
    
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate() {
    // Автоматически сбрасываем ошибку при hot reload
    if (this.state.hasError && import.meta.hot) {
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // В development режиме при hot reload - показываем минимальный fallback
      if (import.meta.hot && this.state.error?.message.includes('AuthProvider')) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-bg-primary">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-accent-primary-indigo mx-auto mb-4" />
              <p className="text-sm text-text-secondary">Hot reload...</p>
            </div>
          </div>
        );
      }

      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-semibold text-text-primary mb-2">
              Что-то пошло не так
            </h1>
            <p className="text-text-secondary mb-4">
              Попробуйте обновить страницу
            </p>
            <button
              onClick={() => clearCacheAndReload()}
              className="px-4 py-2 bg-accent-primary-indigo text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
/**
 * SignUp Page - страница регистрации
 * 
 * Минималистичный дизайн с формой регистрации.
 * Поддержка Email/Password и Google OAuth (mock).
 * 
 * @module pages/auth
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - добавлена мультиязычность через i18next
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2, AlertCircle } from '@/shared/assets/icons/system';
import { supabaseClient } from '@/shared/lib/supabase/client';
import { PublicLanguageSelector } from '@/features/language-switcher';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const { t } = useTranslation('auth');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Автоматически очищаем старую сессию при загрузке страницы
  useEffect(() => {
    const clearOldSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        console.log(t('auth.common.clearingSession'));
        await supabaseClient.auth.signOut();
      }
    };
    clearOldSession();
  }, [t]);

  // ==================== HANDLERS ====================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Простая валидация пароля
    if (password.length < 6) {
      setError(t('auth.signup.passwordHint'));
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, password, name);
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.signup.errorGeneric'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      navigate('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('auth.signup.errorGoogle'));
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Лого */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent-primary-indigo flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-text-primary">Plano</span>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            {t('auth.signup.title')}
          </h1>
          <p className="text-text-secondary">
            {t('auth.signup.subtitle')}
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth.signup.nameLabel')}</Label>
            <Input
              id="name"
              type="text"
              placeholder={t('auth.signup.namePlaceholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              aria-label={t('auth.signup.nameAria')}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.signup.emailLabel')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.signup.emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              aria-label={t('auth.signup.emailAria')}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.signup.passwordLabel')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('auth.signup.passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              aria-label={t('auth.signup.passwordAria')}
            />
            <p className="text-xs text-text-tertiary">
              {t('auth.signup.passwordHint')}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-status-error-bg text-status-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('auth.signup.submitting')}
              </>
            ) : (
              t('auth.signup.submitButton')
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border-secondary" />
          <span className="text-sm text-text-tertiary">{t('auth.signup.divider')}</span>
          <div className="flex-1 h-px bg-border-secondary" />
        </div>

        {/* Google Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t('auth.signup.googleButton')}
        </Button>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            {t('auth.signup.hasAccount')}{' '}
            <Link
              to="/login"
              className="text-accent-primary-indigo hover:text-accent-secondary-indigo font-medium"
            >
              {t('auth.signup.loginLink')}
            </Link>
          </p>
        </div>

        {/* Back to Landing */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-text-tertiary hover:text-text-secondary"
          >
            {t('auth.signup.backToHome')}
          </Link>
        </div>

        {/* Language Selector */}
        <div className="mt-4 flex justify-center">
          <PublicLanguageSelector variant="full" size="sm" />
        </div>
      </div>
    </div>
  );
};
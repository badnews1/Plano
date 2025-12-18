/**
 * Landing Page - главная страница для неавторизованных пользователей
 * 
 * Секции:
 * 1. Hero - заголовок, слоган, CTA
 * 2. Features - ключевые возможности
 * 3. How It Works - 3 простых шага
 * 4. Preview - скриншот/превью приложения
 * 5. FAQ - частые вопросы
 * 6. Footer - подвал с контактами
 * 
 * @module pages/landing
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - добавлена мультиязычность через i18next
 * @updated 17 декабря 2025 - унифицированы отступы и max-width с остальными страницами
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Target, 
  BarChart3, 
  Bell, 
  Calendar,
  Zap,
  ArrowRight,
  ChevronDown,
} from '@/shared/assets/icons/system';
import { PublicLanguageSelector } from '@/features/language-switcher';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation('landing');

  return (
    <div className="min-h-screen">
      {/* ==================== НАВИГАЦИЯ ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-border-secondary">
        <div className="max-w-[var(--container-max-width)] mx-auto px-[25px] py-4 flex items-center justify-between">
          {/* Лого */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-primary-indigo flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-text-primary">Plano</span>
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-3">
            {/* Селектор языка */}
            <PublicLanguageSelector variant="minimal" size="sm" />
            
            {isAuthenticated ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/app')}
              >
                {t('landing.nav.openApp')}
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  {t('landing.nav.login')}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  {t('landing.nav.signup')}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="pt-32 pb-20 px-[25px]">
        <div className="max-w-[var(--container-max-width)] mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-muted-indigo text-accent-primary-indigo mb-6">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{t('landing.hero.badge')}</span>
          </div>

          {/* Заголовок */}
          <h1 className="text-5xl md:text-6xl font-semibold text-text-primary mb-6 leading-tight">
            {t('landing.hero.title')}
          </h1>
          
          {/* Слоган */}
          <p className="text-2xl text-text-secondary mb-8">
            {t('landing.hero.tagline')}
          </p>

          {/* Описание */}
          <p className="text-lg text-text-tertiary max-w-2xl mx-auto mb-10">
            {t('landing.hero.description')}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="gap-2"
            >
              {t('landing.hero.ctaStart')}
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="gap-2"
            >
              {t('landing.hero.ctaLearnMore')}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-20 px-[25px] bg-bg-secondary">
        <div className="max-w-[var(--container-max-width)] mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-lg text-text-secondary">
              {t('landing.features.subtitle')}
            </p>
          </div>

          {/* Карточки фичей */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Фича 1 */}
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-secondary hover:border-accent-primary-indigo transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent-muted-indigo flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent-primary-indigo" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('landing.features.tracking.title')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.features.tracking.description')}
              </p>
            </div>

            {/* Фича 2 */}
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-secondary hover:border-accent-primary-indigo transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent-muted-indigo flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent-primary-indigo" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('landing.features.analytics.title')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.features.analytics.description')}
              </p>
            </div>

            {/* Фича 3 */}
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-secondary hover:border-accent-primary-indigo transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent-muted-indigo flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-accent-primary-indigo" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('landing.features.reminders.title')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.features.reminders.description')}
              </p>
            </div>

            {/* Фича 4 */}
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-secondary hover:border-accent-primary-indigo transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent-muted-indigo flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent-primary-indigo" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('landing.features.schedule.title')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.features.schedule.description')}
              </p>
            </div>

            {/* Фича 5 */}
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-secondary hover:border-accent-primary-indigo transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent-muted-indigo flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent-primary-indigo" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('landing.features.strength.title')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.features.strength.description')}
              </p>
            </div>

            {/* Фича 6 */}
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-secondary hover:border-accent-primary-indigo transition-colors">
              <div className="w-12 h-12 rounded-xl bg-accent-muted-indigo flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-accent-primary-indigo" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2">
                {t('landing.features.categories.title')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.features.categories.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section className="py-20 px-[25px]">
        <div className="max-w-[var(--container-max-width)] mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <p className="text-lg text-text-secondary">
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>

          {/* Шаги */}
          <div className="space-y-12">
            {/* Шаг 1 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary-indigo text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  {t('landing.howItWorks.step1.title')}
                </h3>
                <p className="text-text-secondary">
                  {t('landing.howItWorks.step1.description')}
                </p>
              </div>
            </div>

            {/* Шаг 2 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary-indigo text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  {t('landing.howItWorks.step2.title')}
                </h3>
                <p className="text-text-secondary">
                  {t('landing.howItWorks.step2.description')}
                </p>
              </div>
            </div>

            {/* Шаг 3 */}
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-primary-indigo text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  {t('landing.howItWorks.step3.title')}
                </h3>
                <p className="text-text-secondary">
                  {t('landing.howItWorks.step3.description')}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="gap-2"
            >
              {t('landing.howItWorks.ctaTry')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== PREVIEW SECTION ==================== */}
      <section className="py-20 px-[25px] bg-bg-secondary">
        <div className="max-w-[var(--container-max-width)] mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              {t('landing.preview.title')}
            </h2>
            <p className="text-lg text-text-secondary">
              {t('landing.preview.subtitle')}
            </p>
          </div>

          {/* Превью (заглушка) */}
          <div className="rounded-3xl bg-bg-tertiary border border-border-secondary p-8 aspect-video flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-accent-primary-indigo mx-auto mb-4" />
              <p className="text-text-secondary">{t('landing.preview.placeholder')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section className="py-20 px-[25px]">
        <div className="max-w-[var(--container-max-width)] mx-auto">
          {/* Заголовок секции */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              {t('landing.faq.title')}
            </h2>
          </div>

          {/* Вопросы */}
          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="p-6 rounded-xl bg-bg-secondary border border-border-secondary">
              <h3 className="font-medium text-text-primary mb-2">
                {t('landing.faq.q1.question')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.faq.q1.answer')}
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-6 rounded-xl bg-bg-secondary border border-border-secondary">
              <h3 className="font-medium text-text-primary mb-2">
                {t('landing.faq.q2.question')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.faq.q2.answer')}
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-6 rounded-xl bg-bg-secondary border border-border-secondary">
              <h3 className="font-medium text-text-primary mb-2">
                {t('landing.faq.q3.question')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.faq.q3.answer')}
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-6 rounded-xl bg-bg-secondary border border-border-secondary">
              <h3 className="font-medium text-text-primary mb-2">
                {t('landing.faq.q4.question')}
              </h3>
              <p className="text-text-secondary">
                {t('landing.faq.q4.answer')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 px-[25px] bg-bg-secondary border-t border-border-secondary">
        <div className="max-w-[var(--container-max-width)] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Лого */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary-indigo flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-text-primary">Plano</span>
            </div>

            {/* Копирайт */}
            <p className="text-sm text-text-tertiary">
              © 2025 Plano. {t('landing.footer.tagline')}
            </p>

            {/* Ссылки */}
            <div className="flex items-center gap-6">
              <button className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                {t('landing.footer.privacy')}
              </button>
              <button className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                {t('landing.footer.terms')}
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
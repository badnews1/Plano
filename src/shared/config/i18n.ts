/**
 * Конфигурация i18next для мультиязычности приложения
 * 
 * @module shared/config/i18n
 * @created 16 декабря 2025 - перенесено из app/i18n для соблюдения FSD
 * @updated 17 декабря 2025 - добавлен namespace admin, автоопределение языка браузера
 * @updated 17 декабря 2025 - добавлены namespaces landing и auth для публичных страниц
 * 
 * Поддерживаемые языки:
 * - en (English) - по умолчанию
 * - ru (Русский)
 * 
 * Определение языка:
 * 1. Сохраненный язык в localStorage ('app-language')
 * 2. Язык браузера (navigator.language)
 * 3. Английский по умолчанию
 * 
 * Namespaces:
 * - common: Общие переводы (кнопки, действия, plurals для единиц)
 * - habits: Переводы связанные с привычками
 * - validation: Сообщения валидации форм
 * - stats: Статистика и аналитика
 * - app: Общие элементы приложения (навигация, заголовки)
 * - ui: UI компоненты
 * - tags: Теги и метки
 * - sections: Секции и разделы
 * - units: Единицы измерения и их категории
 * - icons: Названия иконок
 * - vacation: Режим отдыха (периоды каникул)
 * - timer: Таймеры и временные интервалы
 * - admin: Административная панель
 * - landing: Лендинг страница
 * - auth: Страницы авторизации (вход, регистрация)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getInitialLanguage } from '@/shared/lib/i18n';

// Импорт переводов через Public API (barrel export)
import {
  commonEn,
  habitsEn,
  validationEn,
  statsEn,
  appEn,
  uiEn,
  tagsEn,
  sectionsEn,
  unitsEn,
  iconsEn,
  vacationEn,
  timerEn,
  adminEn,
  landingEn,
  authEn,
  commonRu,
  habitsRu,
  validationRu,
  statsRu,
  appRu,
  uiRu,
  tagsRu,
  sectionsRu,
  unitsRu,
  iconsRu,
  vacationRu,
  timerRu,
  adminRu,
  landingRu,
  authRu,
} from '@/shared/locales';

i18n
  .use(initReactI18next) // Интеграция с React
  .init({
    resources: {
      en: {
        common: commonEn,
        habits: habitsEn,
        validation: validationEn,
        stats: statsEn,
        app: appEn,
        ui: uiEn,
        tags: tagsEn,
        sections: sectionsEn,
        units: unitsEn,
        icons: iconsEn,
        vacation: vacationEn,
        timer: timerEn,
        admin: adminEn,
        landing: landingEn,
        auth: authEn,
      },
      ru: {
        common: commonRu,
        habits: habitsRu,
        validation: validationRu,
        stats: statsRu,
        app: appRu,
        ui: uiRu,
        tags: tagsRu,
        sections: sectionsRu,
        units: unitsRu,
        icons: iconsRu,
        vacation: vacationRu,
        timer: timerRu,
        admin: adminRu,
        landing: landingRu,
        auth: authRu,
      },
    },
    lng: getInitialLanguage(), // Автоматически определяется из localStorage или браузера
    fallbackLng: 'en', // Fallback язык, если перевод не найден
    ns: ['common', 'habits', 'validation', 'stats', 'app', 'ui', 'tags', 'sections', 'units', 'icons', 'vacation', 'timer', 'admin', 'landing', 'auth'], // Namespaces
    defaultNS: 'common', // Namespace по умолчанию
    
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    
    react: {
      useSuspense: false, // Отключаем Suspense для простоты
    },
  });

export default i18n;
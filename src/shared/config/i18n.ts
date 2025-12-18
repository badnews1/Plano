/**
 * Конфигурация i18next для мультиязычности приложения
 * 
 * @module shared/config/i18n
 * @created 16 декабря 2025 - перенесено из app/i18n для соблюдения FSD
 * @updated 17 декабря 2025 - добавлен namespace admin, автоопределение языка браузера
 * @updated 17 декабря 2025 - добавлены namespaces landing и auth для публичных страниц
 * @updated 18 декабря 2025 - добавлена полная типизация переводов
 * @updated 18 декабря 2025 - восстановлена конфигурация после ошибок
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getInitialLanguage } from '@/shared/lib/i18n';
import {
  // Английские переводы
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
  // Русские переводы
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

// Определяем начальный язык
const initialLanguage = getInitialLanguage();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn.common,
        habits: habitsEn,
        validation: validationEn,
        stats: statsEn.stats,
        app: appEn.app,
        ui: uiEn.ui,
        tags: tagsEn.tags,
        sections: sectionsEn,
        units: unitsEn.units,
        icons: iconsEn.icons,
        vacation: vacationEn,
        timer: timerEn,
        admin: adminEn.admin,
        landing: landingEn.landing,
        auth: authEn.auth,
      },
      ru: {
        common: commonRu.common,
        habits: habitsRu,
        validation: validationRu,
        stats: statsRu.stats,
        app: appRu.app,
        ui: uiRu.ui,
        tags: tagsRu.tags,
        sections: sectionsRu,
        units: unitsRu.units,
        icons: iconsRu.icons,
        vacation: vacationRu,
        timer: timerRu,
        admin: adminRu.admin,
        landing: landingRu.landing,
        auth: authRu.auth,
      },
    },
    lng: initialLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
      'common',
      'habits',
      'validation',
      'stats',
      'app',
      'ui',
      'tags',
      'sections',
      'units',
      'icons',
      'vacation',
      'timer',
      'admin',
      'landing',
      'auth',
    ],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

/**
 * Расширение типов для react-i18next
 * Обеспечивает автодополнение и type-safety для всех ключей переводов
 */

import 'react-i18next';
import type { Resources, DefaultNS } from '@/shared/locales/types';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: DefaultNS;
    resources: Resources;
    returnNull: false;
    returnObjects: false;
  }
}

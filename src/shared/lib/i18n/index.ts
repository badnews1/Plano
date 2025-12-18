/**
 * PUBLIC API для i18n утилит
 * 
 * @module shared/lib/i18n
 */

export { detectBrowserLanguage, getInitialLanguage } from './detectBrowserLanguage';

// Типизированные утилиты для переводов
export {
  createTypedTranslate,
  isValidTranslationKey,
  isNamespace,
  NAMESPACES,
} from './typed-translation';

export type {
  TranslationKey,
} from './typed-translation';
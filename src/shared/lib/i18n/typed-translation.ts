/**
 * Типизированные хелперы для работы с переводами
 * 
 * @module shared/lib/i18n/typed-translation
 * @created 18 декабря 2025
 */

import type { TFunction } from 'react-i18next';
import type { Namespace, Resources } from '@/shared/locales/types';

/**
 * Создает строго типизированную функцию перевода для конкретного namespace
 */
export function createTypedTranslate<NS extends Namespace>(
  t: TFunction
): TFunction<NS> {
  return t as TFunction<NS>;
}

/**
 * Проверяет, является ли строка валидным namespace
 */
export function isNamespace(value: unknown): value is Namespace {
  return (
    typeof value === 'string' &&
    NAMESPACES.includes(value as Namespace)
  );
}

/**
 * Проверяет, является ли строка валидным ключом перевода
 */
export function isValidTranslationKey(
  namespace: Namespace,
  key: string
): boolean {
  return typeof key === 'string' && key.length > 0;
}

/**
 * Список всех доступных namespaces
 */
export const NAMESPACES: readonly Namespace[] = [
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
] as const;

/**
 * Тип для ключей перевода конкретного namespace
 */
export type TranslationKey<NS extends Namespace> = keyof Resources[NS] extends string
  ? keyof Resources[NS]
  : never;

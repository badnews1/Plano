/**
 * Breakpoints для адаптивного дизайна
 * 
 * Константы совпадают с CSS переменными из theme.css,
 * но доступны в TypeScript/JavaScript коде.
 * 
 * Использование:
 * ```typescript
 * import { BREAKPOINTS } from '@/shared/config/breakpoints';
 * 
 * if (window.innerWidth >= BREAKPOINTS.md) {
 *   // Планшеты и выше
 * }
 * ```
 * 
 * @module shared/config/breakpoints
 * @created 18 декабря 2025
 */

/**
 * Объект с breakpoints в пикселях
 * Соответствует CSS переменным --breakpoint-*
 */
export const BREAKPOINTS = {
  /** Мобильные (малые) - 375px */
  xs: 375,
  /** Мобильные (большие) - 640px */
  sm: 640,
  /** Планшеты (портрет) - 768px */
  md: 768,
  /** Планшеты (ландшафт) / малые десктопы - 1024px */
  lg: 1024,
  /** Десктопы - 1280px */
  xl: 1280,
  /** Большие десктопы - 1536px */
  '2xl': 1536,
} as const;

/**
 * Тип для ключей breakpoints
 */
export type BreakpointKey = keyof typeof BREAKPOINTS;

/**
 * Тип для значений breakpoints (числа)
 */
export type BreakpointValue = typeof BREAKPOINTS[BreakpointKey];

/**
 * Хелпер для создания media query строки
 * 
 * @example
 * ```typescript
 * const mediaQuery = getMediaQuery('md'); // '(min-width: 768px)'
 * const matches = window.matchMedia(mediaQuery).matches;
 * ```
 */
export function getMediaQuery(breakpoint: BreakpointKey): string {
  return `(min-width: ${BREAKPOINTS[breakpoint]}px)`;
}

/**
 * Утилита для проверки соответствия текущего breakpoint
 * 
 * ⚠️ Это НЕ React хук! Для использования в компонентах используйте useBreakpoint из @/shared/lib/hooks
 * Эта функция выполняет одноразовую проверку без подписки на изменения.
 * 
 * @param breakpoint - Ключ breakpoint для проверки
 * @returns true если текущая ширина окна >= указанного breakpoint
 * 
 * @example
 * ```typescript
 * // Одноразовая проверка (не реактивная)
 * const isTablet = matchesBreakpoint('md'); // >= 768px
 * 
 * // ✅ Для React компонентов используйте хук:
 * import { useBreakpoint } from '@/shared/lib/hooks';
 * const isTablet = useBreakpoint('md'); // Автоматически обновляется при resize
 * ```
 */
export function matchesBreakpoint(breakpoint: BreakpointKey): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(getMediaQuery(breakpoint)).matches;
}
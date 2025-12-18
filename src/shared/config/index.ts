/**
 * PUBLIC API для модуля конфигурации
 * 
 * @module shared/config
 */

export { default as i18n } from './i18n';
export { BREAKPOINTS, getMediaQuery, matchesBreakpoint } from './breakpoints';
export type { BreakpointKey, BreakpointValue } from './breakpoints';
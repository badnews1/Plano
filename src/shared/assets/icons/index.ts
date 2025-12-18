/**
 * Barrel export для иконок
 * 
 * Предоставляет единую точку входа для импорта всех иконок приложения.
 * Иконки разделены на две категории:
 * - ContentIcons: для пользовательского выбора (привычки, модули)
 * - SystemIcons: для элементов интерфейса (кнопки, навигация)
 */

// Контентные иконки (для пользовательского выбора)
export * as ContentIcons from './content';

// Системные иконки (для UI)
export * as SystemIcons from './system';

// Реэкспорт типов из lucide-react
export type { LucideIcon, LucideProps } from 'lucide-react';

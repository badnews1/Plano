/**
 * Цветовые константы приложения
 */
export const COLOR_VARIANTS = [
  'gray', 'zinc', 'stone',
  'red', 'rose', 'pink',
  'orange', 'amber', 'yellow',
  'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet',
  'purple', 'fuchsia'
] as const;

/**
 * TypeScript тип для цветовых вариантов
 * 
 * @example
 * ```typescript
 * const myColor: ColorVariant = 'blue'; // ✅ OK
 * const badColor: ColorVariant = 'brown'; // ❌ Ошибка компиляции
 * ```
 */
export type ColorVariant = typeof COLOR_VARIANTS[number];

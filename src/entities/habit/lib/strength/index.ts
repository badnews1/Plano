/**
 * 🔧 Strength Lib - Barrel Export
 * 
 * Бизнес-логика расчёта силы привычки (EMA алгоритм)
 * 
 * @module entities/habit/lib/strength
 * @created 22 ноября 2025
 * @migrated 30 ноября 2025 - перенос из /features/strength в /entities/habit
 */

export { recalculateStrength } from './strengthCalculator';
export {
  applyEMAStep,
  calculateStrengthHistory,
  type StrengthHistoryPoint,
  type StrengthHistoryOptions
} from './strengthHistory';
export { getStrengthColor } from './strength-colors';
/**
 * Public API для shared слоя
 * 
 * Shared слой содержит переиспользуемый код, который может использоваться
 * во всех остальных слоях приложения согласно FSD архитектуре.
 * 
 */

// ===== ЭКСПОРТИРУЕМЫЕ МОДУЛИ =====

// Config (i18n)
export * from './config';

// UI Components
export * from './ui';

// Types
export * from './types';

// Library (hooks, utils)
export * from './lib';

// ===== ПРЯМЫЕ ИМПОРТЫ =====

/**
 * ⚠️ Constants и Assets импортируются НАПРЯМУЮ из подпапок
 * 
 * Причины такого подхода:
 * 1. 🎯 Явность источника - сразу понятно откуда импорт
 * 2. 🔍 Лучший autocomplete в IDE - точные пути к модулям
 * 3. 🌲 Улучшенный tree-shaking - bundler видит точные зависимости
 * 4. 🚫 Нет конфликтов имён между модулями
 * 5. 📦 Меньший размер бандла - импортируется только необходимое
 * 
 * ============================================
 * ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ:
 * ============================================
 * 
 * 📌 CONSTANTS:
 * 
 *   // Цвета
 *   import { ColorVariant } from '@/shared/constants/colors';
 * 
 *   // Иконки контента
 *   import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';
 * 
 *   // Валидация
 *   import { TEXT_LENGTH_LIMITS } from '@/shared/constants/validation';
 * 
 *   // Единицы измерения
 *   import { getTranslatedUnit, UNIT_GROUPS } from '@/shared/constants/units';
 * 
 *   // Иконки режима отдыха
 *   import { VACATION_ICON_MAP } from '@/shared/constants/vacation-icons';
 * 
 * 
 * 📌 ASSETS (Icons):
 * 
 *   // Системные иконки UI
 *   import { Loader2, CheckCircle, LogOut } from '@/shared/assets/icons/system';
 * 
 *   // Иконки контента
 *   import { Heart, Star, Trophy } from '@/shared/assets/icons/content';
 * 
 *   // Общие иконки
 *   import { Calendar, Bell } from '@/shared/assets/icons/shared';
 * 
 *   // Кастомные иконки
 *   import { SmallFilledCircle } from '@/shared/assets/icons/custom';
 * 
 * ============================================
 */
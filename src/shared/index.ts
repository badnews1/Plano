/**
 * Public API для shared слоя
 * 
 * Shared слой содержит переиспользуемый код, который может использоваться
 * во всех остальных слоях приложения согласно FSD архитектуре.
 * 
 */

// Config (i18n)
export * from './config';

// UI Components
export * from './ui';

// Types
export * from './types';

// Library (hooks, utils)
export * from './lib';

// Примечание: константы, сервисы, утилиты экспортируются по требованию
// из соответствующих подпапок
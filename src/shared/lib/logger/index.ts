/**
 * Barrel export для централизованной системы логирования
 */
export {
  logger,
  createModuleLogger,
  
  // Предсозданные модульные логгеры
  habitLogger,
  strengthLogger,
  frequencyLogger,
  categoryLogger,
  storageLogger,
  statsLogger,
  uiLogger,
  reminderLogger,
  validationLogger,
  initLogger,
  
  // Управление конфигурацией
  updateLoggerConfig,
  getLoggerConfig,
  resetLoggerConfig,
  
  // Пресеты
  setErrorsOnlyMode,
  setVerboseMode,
  setSilentMode,
  
  // Фильтрация по модулям
  showOnlyModules,
  hideModules,
  showAllModules,
  setModuleFilter,
  clearModuleFilter,
  getAvailableModules,
  getModuleFilterStatus,
} from './logger';

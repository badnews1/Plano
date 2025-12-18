/**
 * 📝 Централизованная система логирования
 * 
 * @description
 * Предоставляет единый интерфейс для всех логов в приложении с возможностью
 * управления уровнями логирования, форматирования и группировки по модулям.
 */

// ========================================
// КОНФИГУРАЦИЯ
// ========================================

/**
 * Уровни логирования
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

/**
 * Модули приложения для группировки логов
 */
type LogModule = 
  | 'HABITS'      // Работа с привычками
  | 'STRENGTH'    // Расчёт силы привычки
  | 'FREQUENCY'   // Настройки частоты
  | 'CATEGORIES'  // Управление категориями
  | 'STORAGE'     // localStorage операции
  | 'STATS'       // Статистика и расчёты
  | 'UI'          // UI события и взаимодействия
  | 'REMINDERS'   // Система напоминаний
  | 'VALIDATION'  // Валидация данных
  | 'INIT';       // Инициализация приложения

/**
 * Режимы фильтрации модулей
 */
type FilterMode = 'all' | 'whitelist' | 'blacklist';

/**
 * Конфигурация логгера
 */
interface LoggerConfig {
  /** Включить/выключить все логи */
  enabled: boolean;
  /** Минимальный уровень логирования для отображения */
  minLevel: LogLevel;
  /** Показывать timestamp */
  showTimestamp: boolean;
  /** Показывать имя модуля */
  showModule: boolean;
  /** Включить групповые логи (console.group) */
  enableGrouping: boolean;
}

/**
 * Проверка, включен ли debug режим
 * В production можно активировать через:
 * 1. Query параметр: ?debug=true
 * 2. localStorage: localStorage.setItem('enableLogger', 'true')
 */
const isDebugEnabled = (): boolean => {
  // Всегда включено в development
  if (process.env.NODE_ENV === 'development') return true;
  
  // В production проверяем флаги
  if (typeof window !== 'undefined') {
    // Проверка query параметра ?debug=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') return true;
    
    // Проверка localStorage
    if (localStorage.getItem('enableLogger') === 'true') return true;
  }
  
  return false;
};

/**
 * Настройки по умолчанию
 * В продакшене автоматически отключаются debug и info логи
 */
const DEFAULT_CONFIG: LoggerConfig = {
  enabled: isDebugEnabled(),
  minLevel: isDebugEnabled() ? 'debug' : 'warn',
  showTimestamp: true,
  showModule: true,
  enableGrouping: true,
};

// Текущая конфигурация (можно изменить через updateConfig)
let currentConfig: LoggerConfig = { ...DEFAULT_CONFIG };

// Фильтрация по модулям
let filterMode: FilterMode = 'all';
let filteredModules = new Set<LogModule>();

// ========================================
// УТИЛИТЫ
// ========================================

/**
 * Получает текущую временную метку в формате HH:MM:SS
 * @returns Временная метка
 */
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().slice(11, 19); // HH:MM:SS
};

/**
 * Иконки для разных уровней логирования
 */
const LOG_ICONS: Record<LogLevel, string> = {
  debug: '🔍',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  success: '✅',
};

/**
 * Цвета для консоли (CSS)
 */
const LOG_COLORS: Record<LogLevel, string> = {
  debug: 'color: #6B7280; font-weight: normal',    // Серый
  info: 'color: #3B82F6; font-weight: normal',     // Синий
  warn: 'color: #F59E0B; font-weight: bold',       // Оранжевый
  error: 'color: #EF4444; font-weight: bold',      // Красный
  success: 'color: #10B981; font-weight: bold',    // Зелёный
};

/**
 * Приоритет уровней для фильтрации
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  success: 1, // Как info
};

/**
 * Проверка, нужно ли показывать лог данного уровня
 */
const shouldLog = (level: LogLevel): boolean => {
  if (!currentConfig.enabled) return false;
  // ✅ Fix: доступ по ключу может вернуть undefined
  const levelPriority = LOG_LEVEL_PRIORITY[level] ?? 0;
  const minLevelPriority = LOG_LEVEL_PRIORITY[currentConfig.minLevel] ?? 0;
  return levelPriority >= minLevelPriority;
};

/**
 * Проверка, разрешён ли модуль для вывода логов
 */
const shouldLogModule = (module?: LogModule): boolean => {
  // Если модуль не указан, всегда разрешаем (общие логи)
  if (!module) return true;

  // Режим "все модули"
  if (filterMode === 'all') return true;

  // Режим "белый список" - показываем только указанные
  if (filterMode === 'whitelist') {
    return filteredModules.size === 0 || filteredModules.has(module);
  }

  // Режим "чёрный список" - скрываем указанные
  if (filterMode === 'blacklist') {
    return !filteredModules.has(module);
  }

  return true;
};

/**
 * Форматирование префикса лога
 */
const formatPrefix = (level: LogLevel, module?: LogModule): string => {
  const parts: string[] = [];
  
  if (currentConfig.showTimestamp) {
    parts.push(`[${getTimestamp()}]`);
  }
  
  // ✅ Fix: доступ по ключу может вернуть undefined
  const icon = LOG_ICONS[level] ?? '•';
  parts.push(icon);
  parts.push(`[${level.toUpperCase()}]`);
  
  if (module && currentConfig.showModule) {
    parts.push(`[${module}]`);
  }
  
  return parts.join(' ');
};

// ========================================
// ОСНОВНОЕ API ЛОГГЕРА
// ========================================

/**
 * Базовая функция логирования
 */
const log = (
  level: LogLevel,
  message: string,
  module?: LogModule,
  ...data: unknown[]
): void => {
  if (!shouldLog(level) || !shouldLogModule(module)) return;

  const prefix = formatPrefix(level, module);
  // ✅ Fix: доступ по ключу может вернуть undefined
  const color = LOG_COLORS[level] ?? '#888888';

  // Используем styled console.log для красивого вывода
  if (data.length > 0) {
    console.log(`%c${prefix}%c ${message}`, color, 'color: inherit', ...data);
  } else {
    console.log(`%c${prefix}%c ${message}`, color, 'color: inherit');
  }
};

/**
 * Основной логгер с методами для разных уровней
 */
export const logger = {
  /**
   * Debug логи - для отладки, скрываются в продакшене
   * @example logger.debug('Calculating strength', { habit, date });
   */
  debug: (message: string, ...data: unknown[]): void => {
    log('debug', message, undefined, ...data);
  },

  /**
   * Info логи - общая информация о работе приложения
   * @example logger.info('Habit added successfully', habit);
   */
  info: (message: string, ...data: unknown[]): void => {
    log('info', message, undefined, ...data);
  },

  /**
   * Warning логи - предупреждения, но не критичные
   * @example logger.warn('Category already exists', categoryName);
   */
  warn: (message: string, ...data: unknown[]): void => {
    log('warn', message, undefined, ...data);
  },

  /**
   * Error логи - ошибки, требующие внимания
   * @example logger.error('Failed to save habit', error);
   */
  error: (message: string, error?: Error | unknown, ...data: unknown[]): void => {
    if (error instanceof Error) {
      log('error', message, undefined, error, ...data);
      // В продакшене можно добавить отправку в Sentry
      // if (process.env.NODE_ENV === 'production') {
      //   sendToSentry(message, error);
      // }
    } else {
      log('error', message, undefined, error, ...data);
    }
  },

  /**
   * Success логи - успешное выполнение операций
   * @example logger.success('Data saved to localStorage');
   */
  success: (message: string, ...data: unknown[]): void => {
    log('success', message, undefined, ...data);
  },

  /**
   * Группа логов для связанных операций
   * @example 
   * logger.group('Adding new habit', () => {
   *   logger.debug('Validating data...');
   *   logger.debug('Saving to storage...');
   *   logger.success('Habit added!');
   * });
   */
  group: (groupName: string, callback: () => void): void => {
    if (!currentConfig.enabled || !currentConfig.enableGrouping) {
      callback();
      return;
    }

    console.group(`📦 ${groupName}`);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Свёрнутая группа логов
   */
  groupCollapsed: (groupName: string, callback: () => void): void => {
    if (!currentConfig.enabled || !currentConfig.enableGrouping) {
      callback();
      return;
    }

    console.groupCollapsed(`📦 ${groupName}`);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Измерение времени выполнения
   * @example
   * logger.time('Calculate statistics');
   * // ... операции ...
   * logger.timeEnd('Calculate statistics');
   */
  time: (label: string): void => {
    if (currentConfig.enabled) {
      console.time(`⏱️ ${label}`);
    }
  },

  timeEnd: (label: string): void => {
    if (currentConfig.enabled) {
      console.timeEnd(`⏱️ ${label}`);
    }
  },

  /**
   * Таблица данных для удобного просмотра
   * @example logger.table(habits);
   */
  table: (data: unknown): void => {
    if (currentConfig.enabled) {
      console.table(data);
    }
  },
};

// ========================================
// СОЗДАНИЕ МОДУЛЬНЫХ ЛОГГЕРОВ
// ========================================

/**
 * Создание логгера для конкретного модуля
 * @example
 * const habitLogger = createModuleLogger('HABITS');
 * habitLogger.debug('Processing habit', habit);
 * // Вывод: 🔍 [DEBUG] [HABITS] Processing habit {...}
 */
export const createModuleLogger = (module: LogModule) => ({
  debug: (message: string, ...data: unknown[]): void => {
    log('debug', message, module, ...data);
  },

  info: (message: string, ...data: unknown[]): void => {
    log('info', message, module, ...data);
  },

  warn: (message: string, ...data: unknown[]): void => {
    log('warn', message, module, ...data);
  },

  error: (message: string, error?: Error | unknown, ...data: unknown[]): void => {
    log('error', message, module, error, ...data);
  },

  success: (message: string, ...data: unknown[]): void => {
    log('success', message, module, ...data);
  },

  group: (groupName: string, callback: () => void): void => {
    logger.group(`[${module}] ${groupName}`, callback);
  },

  groupCollapsed: (groupName: string, callback: () => void): void => {
    logger.groupCollapsed(`[${module}] ${groupName}`, callback);
  },
});

// ========================================
// ПРЕДСОЗДАННЫЕ МОДУЛЬНЫЕ ЛОГГЕРЫ
// ========================================

/** Логгер для операций с привычками */
export const habitLogger = createModuleLogger('HABITS');

/** Логгер для расчёта силы привычки */
export const strengthLogger = createModuleLogger('STRENGTH');

/** Логгер для работы с частотой */
export const frequencyLogger = createModuleLogger('FREQUENCY');

/** Логгер для категорий */
export const categoryLogger = createModuleLogger('CATEGORIES');

/** Логгер для localStorage */
export const storageLogger = createModuleLogger('STORAGE');

/** Логгер для статистики */
export const statsLogger = createModuleLogger('STATS');

/** Логгер для UI событий */
export const uiLogger = createModuleLogger('UI');

/** Логгер для напоминаний */
export const reminderLogger = createModuleLogger('REMINDERS');

/** Логгер для валидации */
export const validationLogger = createModuleLogger('VALIDATION');

/** Логгер для инициализации */
export const initLogger = createModuleLogger('INIT');

// ========================================
// УПРАВЛЕНИЕ КОНФИГУРАЦИЕЙ
// ========================================

/**
 * Обновление конфигурации логгера
 * @example
 * // Отключить все логи
 * updateLoggerConfig({ enabled: false });
 * 
 * // Показывать только ошибки и предупреждения
 * updateLoggerConfig({ minLevel: 'warn' });
 * 
 * // Отключить timestamp
 * updateLoggerConfig({ showTimestamp: false });
 */
export const updateLoggerConfig = (newConfig: Partial<LoggerConfig>): void => {
  currentConfig = { ...currentConfig, ...newConfig };
  logger.info('Logger configuration updated', currentConfig);
};

/**
 * Получить текущую конфигурацию
 */
export const getLoggerConfig = (): Readonly<LoggerConfig> => {
  return { ...currentConfig };
};

/**
 * Сброс конфигурации к значениям по умолчанию
 */
export const resetLoggerConfig = (): void => {
  currentConfig = { ...DEFAULT_CONFIG };
  logger.info('Logger configuration reset to defaults');
};

// ========================================
// БЫСТРЫЕ ПРЕСЕТЫ
// ========================================

/**
 * Пресет: только ошибки (для продакшена)
 */
export const setErrorsOnlyMode = (): void => {
  updateLoggerConfig({
    enabled: true,
    minLevel: 'error',
    showTimestamp: false,
    showModule: true,
  });
};

/**
 * Пресет: полное логирование (для глубокой отладки)
 */
export const setVerboseMode = (): void => {
  updateLoggerConfig({
    enabled: true,
    minLevel: 'debug',
    showTimestamp: true,
    showModule: true,
    enableGrouping: true,
  });
};

/**
 * Пресет: отключить все логи
 */
export const setSilentMode = (): void => {
  updateLoggerConfig({ enabled: false });
};

// ========================================
// ФИЛЬТРАЦИЯ ПО МОДУЛЯМ
// ========================================

/**
 * Показывать логи ТОЛЬКО от указанных модулей (белый список)
 * @example showOnlyModules('STRENGTH', 'FREQUENCY')
 */
export const showOnlyModules = (...modules: LogModule[]): void => {
  filterMode = 'whitelist';
  filteredModules = new Set(modules);
  
  console.log(
    `%c🎯 Показываем только модули: ${modules.join(', ')}`,
    'color: #10B981; font-weight: bold;'
  );
};

/**
 * Скрыть логи от указанных модулей (чёрный список)
 * @example hideModules('UI', 'STORAGE')
 */
export const hideModules = (...modules: LogModule[]): void => {
  filterMode = 'blacklist';
  filteredModules = new Set(modules);
  
  console.log(
    `%c🚫 Скрываем модули: ${modules.join(', ')}`,
    'color: #F59E0B; font-weight: bold;'
  );
};

/**
 * Показывать логи от всех модулей (сброс фильтра)
 */
export const showAllModules = (): void => {
  filterMode = 'all';
  filteredModules.clear();
  
  console.log(
    '%c✅ Показываем все модули',
    'color: #10B981; font-weight: bold;'
  );
};

/**
 * Алиас для showOnlyModules - для удобства
 */
export const setModuleFilter = (...modules: LogModule[]): void => {
  showOnlyModules(...modules);
};

/**
 * Алиас для showAllModules - для удобства
 */
export const clearModuleFilter = (): void => {
  showAllModules();
};

/**
 * Получить список всех доступных модулей
 */
export const getAvailableModules = (): LogModule[] => {
  return ['HABITS', 'STRENGTH', 'FREQUENCY', 'CATEGORIES', 'STORAGE', 
          'STATS', 'UI', 'REMINDERS', 'VALIDATION', 'INIT'];
};

/**
 * Получить текущий статус фильтрации
 */
export const getModuleFilterStatus = (): { mode: FilterMode; modules: LogModule[] } => {
  return {
    mode: filterMode,
    modules: Array.from(filteredModules),
  };
};

// ========================================
// ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ИСПОЛЬЗОВАНИЯ
// ========================================

// В режиме разработки добавляем логгер в window для быстрого доступа из консоли
// ВАЖНО: В production тоже добавляем, если debug режим активен через ?debug=true или localStorage
if (isDebugEnabled() && typeof window !== 'undefined') {
  (window as any).__logger = {
    ...logger,
    config: currentConfig,
    updateConfig: updateLoggerConfig,
    setErrorsOnly: setErrorsOnlyMode,
    setVerbose: setVerboseMode,
    setSilent: setSilentMode,
    
    // Фильтрация по модулям
    showOnly: showOnlyModules,
    hide: hideModules,
    showAll: showAllModules,
    setFilter: setModuleFilter,
    clearFilter: clearModuleFilter,
    modules: getAvailableModules(),
    filterStatus: getModuleFilterStatus,
  };

  const debugMethod = process.env.NODE_ENV === 'production' 
    ? '(?debug=true в URL или localStorage)' 
    : '(development mode)';
  
  // 🔇 Отключаем приветственные логи - они слишком шумные
  // console.log(
  //   `%c🔍 Logger активирован ${debugMethod}! Используйте __logger в консоли для управления`,
  //   'color: #10B981; font-weight: bold; font-size: 12px;'
  // );
  // console.log(
  //   '%cПримеры команд:',
  //   'color: #6B7280; font-size: 11px; font-weight: bold;'
  // );
  // console.log(
  //   '%c  __logger.setVerbose()                 // Показать все логи',
  //   'color: #6B7280; font-size: 11px;'
  // );
  // console.log(
  //   '%c  __logger.showOnly("STRENGTH")         // Только логи силы привычки',
  //   'color: #6B7280; font-size: 11px;'
  // );
  // console.log(
  //   '%c  __logger.modules                      // Список всех модулей',
  //   'color: #6B7280; font-size: 11px;'
  // );
  // console.log(
  //   '%c  __logger.info("Тест!")                // Тестовое сообщение',
  //   'color: #6B7280; font-size: 11px;'
  // );
}
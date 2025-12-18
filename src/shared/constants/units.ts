/**
 * Универсальные единицы измерения для различных модулей
 * 
 * Единицы хранятся как ключи для i18n.
 * Для получения переведенных названий используйте функцию из @/shared/lib/units
 */

/**
 * Структура единицы измерения
 */
export interface UnitDefinition {
  /** Уникальный ключ для i18n */
  key: string;
  /** Категория единицы */
  category: 'counting' | 'time' | 'distance' | 'weight' | 'volume' | 'calories' | 'reading' | 'currency';
  /** Путь к переводу в формате units:units.{category}.{key} */
  i18nPath: string;
}

/** Единый источник всех единиц измерения */
export const UNIT_DEFINITIONS: readonly UnitDefinition[] = [
  // Единицы подсчёта
  { key: 'times', category: 'counting', i18nPath: 'units:units.counting.times' },
  { key: 'pieces', category: 'counting', i18nPath: 'units:units.counting.pieces' },
  { key: 'points', category: 'counting', i18nPath: 'units:units.counting.points' },
  { key: 'sets', category: 'counting', i18nPath: 'units:units.counting.sets' },
  { key: 'tasks', category: 'counting', i18nPath: 'units:units.counting.tasks' },
  
  // Единицы времени
  { key: 'minutes', category: 'time', i18nPath: 'units:units.time.minutes' },
  { key: 'hours', category: 'time', i18nPath: 'units:units.time.hours' },
  
  // Единицы расстояния и движения
  { key: 'steps', category: 'distance', i18nPath: 'units:units.distance.steps' },
  { key: 'kilometers', category: 'distance', i18nPath: 'units:units.distance.kilometers' },
  { key: 'meters', category: 'distance', i18nPath: 'units:units.distance.meters' },
  
  // Единицы веса
  { key: 'kilograms', category: 'weight', i18nPath: 'units:units.weight.kilograms' },
  { key: 'grams', category: 'weight', i18nPath: 'units:units.weight.grams' },
  
  // Единицы объёма
  { key: 'glasses', category: 'volume', i18nPath: 'units:units.volume.glasses' },
  { key: 'liters', category: 'volume', i18nPath: 'units:units.volume.liters' },
  { key: 'milliliters', category: 'volume', i18nPath: 'units:units.volume.milliliters' },
  { key: 'portions', category: 'volume', i18nPath: 'units:units.volume.portions' },
  { key: 'cups', category: 'volume', i18nPath: 'units:units.volume.cups' },
  
  // Единицы калорий
  { key: 'calories', category: 'calories', i18nPath: 'units:units.calories.calories' },
  
  // Единицы для чтения
  { key: 'pages', category: 'reading', i18nPath: 'units:units.reading.pages' },
  { key: 'words', category: 'reading', i18nPath: 'units:units.reading.words' },
  { key: 'chapters', category: 'reading', i18nPath: 'units:units.reading.chapters' },
  
  // Единицы валют
  { key: 'rub', category: 'currency', i18nPath: 'units:units.currency.rub' },
  { key: 'usd', category: 'currency', i18nPath: 'units:units.currency.usd' },
  { key: 'eur', category: 'currency', i18nPath: 'units:units.currency.eur' },
] as const;

/**
 * Тип для ключей единиц измерения
 */
export type UnitKey = typeof UNIT_DEFINITIONS[number]['key'];

/**
 * Тип для категорий единиц измерения
 */
export type UnitCategory = typeof UNIT_DEFINITIONS[number]['category'];

/** Все доступные ключи единиц измерения */
export const UNIT_KEYS = UNIT_DEFINITIONS.map(u => u.key);

/** Фильтры по категориям */
export const COUNTING_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'counting').map(u => u.key);
export const TIME_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'time').map(u => u.key);
export const DISTANCE_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'distance').map(u => u.key);
export const WEIGHT_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'weight').map(u => u.key);
export const VOLUME_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'volume').map(u => u.key);
export const CALORIE_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'calories').map(u => u.key);
export const READING_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'reading').map(u => u.key);
export const CURRENCY_UNIT_KEYS = UNIT_DEFINITIONS.filter(u => u.category === 'currency').map(u => u.key);

/**
 * Функция для получения переведенных единиц измерения
 * @param t - функция перевода из react-i18next
 * @returns массив единиц с переведенными названиями
 */
export const getTranslatedUnits = (t: (key: string) => string) => {
  return UNIT_DEFINITIONS.map(unit => ({
    key: unit.key,
    label: t(unit.i18nPath),
    category: unit.category,
  }));
};

/**
 * Функция для получения переведенного названия единицы
 * @param unitKey - ключ единицы измерения
 * @param t - функция перевода из react-i18next
 * @returns переведенное название или ключ, если единица не найдена
 */
export const getTranslatedUnit = (unitKey: string, t: (key: string) => string): string => {
  const unit = UNIT_DEFINITIONS.find(u => u.key === unitKey);
  return unit ? t(unit.i18nPath) : unitKey;
};

/**
 * Функция для группировки единиц по категориям с переводами
 * @param t - функция перевода из react-i18next
 * @returns объект с единицами, сгруппированными по категориям
 */
export const getUnitsByCategory = (t: (key: string) => string) => {
  const grouped: Record<UnitCategory, Array<{ key: string; label: string }>> = {
    counting: [],
    time: [],
    distance: [],
    weight: [],
    volume: [],
    calories: [],
    reading: [],
    currency: [],
  };

  UNIT_DEFINITIONS.forEach(unit => {
    grouped[unit.category].push({
      key: unit.key,
      label: t(unit.i18nPath),
    });
  });

  return grouped;
};

/**
 * Создаёт маппинг из локализованных значений единиц в их ключи
 * @param t - функция перевода из react-i18next
 * @returns Record где ключи - локализованные значения, значения - ключи единиц
 */
export const createUnitToKeyMap = (t: (key: string) => string): Record<string, string> => {
  const mapping: Record<string, string> = {};
  
  UNIT_DEFINITIONS.forEach(unit => {
    const localizedValue = t(unit.i18nPath);
    mapping[localizedValue] = unit.key;
    // Также добавляем сам ключ для совместимости
    mapping[unit.key] = unit.key;
  });
  
  return mapping;
};


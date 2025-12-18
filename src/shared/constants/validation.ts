import type { TFunction } from 'i18next';

/**
 * Максимальные длины текстовых полей
 */
export const TEXT_LENGTH_LIMITS = {
  /** Название привычки */
  habitName: {
    min: 1,
    max: 25,
  },
  
  /** Описание привычки */
  habitDescription: {
    min: 0,
    max: 200,
  },
  
  /** Название тега или категории */
  tagName: {
    min: 1,
    max: 15,
  },
  
  /** Название пресета таймера */
  timerPresetName: {
    min: 0,
    max: 10,
  },
  
  /** Причина периода отдыха */
  vacationReason: {
    min: 1,
    max: 25,
  },
  
  /** Заметка к дню (если будет реализовано) */
  dayNote: {
    min: 0,
    max: 500,
  },
} as const;

// ========================================
// ФУНКЦИИ ВАЛИДАЦИИ
// ========================================

/**
 * Валидация названия привычки
 * @param name - Название привычки для проверки
 * @returns true если название валидно
 */
export const validateHabitName = (name: string): boolean => {
  const trimmed = name.trim();
  return (
    trimmed.length >= TEXT_LENGTH_LIMITS.habitName.min &&
    trimmed.length <= TEXT_LENGTH_LIMITS.habitName.max
  );
};

/**
 * Получение ошибки валидации названия привычки
 * @param name - Название привычки для проверки
 * @param t - Функция перевода
 * @returns Текст ошибки или null если валидация пройдена
 */
export const getHabitNameError = (name: string, t: TFunction): string | null => {
  const trimmed = name.trim();
  
  if (trimmed.length < TEXT_LENGTH_LIMITS.habitName.min) {
    return t('validation:habitName.tooShort');
  }
  
  if (trimmed.length > TEXT_LENGTH_LIMITS.habitName.max) {
    return t('validation:habitName.tooLong', { max: TEXT_LENGTH_LIMITS.habitName.max });
  }
  
  return null;
};

/**
 * Валидация описания привычки
 * @param description - Описание для проверки
 * @returns true если описание валидно
 */
export const validateHabitDescription = (description: string): boolean => {
  const trimmed = description.trim();
  return (
    trimmed.length >= TEXT_LENGTH_LIMITS.habitDescription.min &&
    trimmed.length <= TEXT_LENGTH_LIMITS.habitDescription.max
  );
};

/**
 * Получение ошибки валидации описания привычки
 * @param description - Описание для проверки
 * @param t - Функция перевода
 * @returns Текст ошибки или null если валидация пройдена
 */
export const getHabitDescriptionError = (description: string, t: TFunction): string | null => {
  const trimmed = description.trim();
  
  if (trimmed.length > TEXT_LENGTH_LIMITS.habitDescription.max) {
    return t('validation:habitDescription.tooLong', { max: TEXT_LENGTH_LIMITS.habitDescription.max });
  }
  
  return null;
};

/**
 * Валидация названия тега
 * @param name - Название тега для проверки
 * @returns true если название валидно
 */
export const validateTagName = (name: string): boolean => {
  const trimmed = name.trim();
  return (
    trimmed.length >= TEXT_LENGTH_LIMITS.tagName.min &&
    trimmed.length <= TEXT_LENGTH_LIMITS.tagName.max
  );
};

/**
 * Получение ошибки валидации названия тега
 * @param name - Название тега для проверки
 * @param t - Функция перевода
 * @returns Текст ошибки или null если валидация пройдена
 */
export const getTagNameError = (name: string, t: TFunction): string | null => {
  const trimmed = name.trim();
  
  if (trimmed.length < TEXT_LENGTH_LIMITS.tagName.min) {
    return t('validation:tagName.tooShort');
  }
  
  if (trimmed.length > TEXT_LENGTH_LIMITS.tagName.max) {
    return t('validation:tagName.tooLong', { max: TEXT_LENGTH_LIMITS.tagName.max });
  }
  
  return null;
};

/**
 * Валидация причины периода отдыха
 * @param reason - Причина для проверки
 * @returns true если причина валидна
 */
export const validateVacationReason = (reason: string): boolean => {
  const trimmed = reason.trim();
  return (
    trimmed.length >= TEXT_LENGTH_LIMITS.vacationReason.min &&
    trimmed.length <= TEXT_LENGTH_LIMITS.vacationReason.max
  );
};

/**
 * Получение ошибки валидации причины периода отдыха
 * @param reason - Причина для проверки
 * @param t - Функция перевода
 * @returns Текст ошибки или null если валидация пройдена
 */
export const getVacationReasonError = (reason: string, t: TFunction): string | null => {
  const trimmed = reason.trim();
  
  if (trimmed.length < TEXT_LENGTH_LIMITS.vacationReason.min) {
    return t('validation:vacationReason.tooShort');
  }
  
  if (trimmed.length > TEXT_LENGTH_LIMITS.vacationReason.max) {
    return t('validation:vacationReason.tooLong', { max: TEXT_LENGTH_LIMITS.vacationReason.max });
  }
  
  return null;
};

/**
 * Валидация заметки к дню
 * @param note - Заметка для проверки
 * @returns true если заметка валидна
 */
export const validateDayNote = (note: string): boolean => {
  const trimmed = note.trim();
  return (
    trimmed.length >= TEXT_LENGTH_LIMITS.dayNote.min &&
    trimmed.length <= TEXT_LENGTH_LIMITS.dayNote.max
  );
};

/**
 * Получение ошибки валидации заметки к дню
 * @param note - Заметка для проверки
 * @param t - Функция перевода
 * @returns Текст ошибки или null если валидация пройдена
 */
export const getDayNoteError = (note: string, t: TFunction): string | null => {
  const trimmed = note.trim();
  
  if (trimmed.length > TEXT_LENGTH_LIMITS.dayNote.max) {
    return t('validation:dayNote.tooLong', { max: TEXT_LENGTH_LIMITS.dayNote.max });
  }
  
  return null;
};
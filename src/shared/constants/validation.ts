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
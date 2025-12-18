/**
 * Основной интерфейс привычки
 */
export interface Habit {
  /** Уникальный идентификатор */
  id: string;
  /** Название привычки */
  name: string;
  /** Дата создания (ISO формат) */
  createdAt: string;
  /** Дата последнего обновления (ISO формат) - используется для разрешения конфликтов */
  updatedAt?: string;
  /** Дата начала привычки (YYYY-MM-DD) - с этой даты начинается отсчёт и отображение */
  startDate: string;
  /** Записи о выполнении: ключ - дата (YYYY-MM-DD), значение - true/false для binary или число для measurable */
  completions: { [date: string]: boolean | number };
  /** Конфигурация частоты выполнения */
  frequency?: FrequencyConfig;
  /** Описание привычки */
  description?: string;
  /** Флаг для временного состояния (используется в UI) */
  checked?: boolean;
  /** Иконка привычки (emoji или название иконки) */
  icon?: string;
  /** Теги привычки (множественный выбор) */
  tags: string[];
  /** Раздел привычки (Утро, День, Вечер, Другие или кастомный) */
  section: string;
  /** Включены ли напоминания (legacy, для обратной совместимости) */
  reminderEnabled?: boolean;
  /** Время напоминания (legacy, для обратной совместимости) */
  reminderTime?: string;
  /** Массив напоминаний (новый формат) */
  reminders?: Reminder[];
  /** Сила привычки (0-100), рассчитывается по алгоритму EMA */
  strength?: number;
  /** Дата последнего полного пересчёта силы (ISO формат) */
  lastStrengthUpdate?: string;
  /** Базовая сила на момент lastStrengthUpdate (для инкрементального пересчёта) */
  strengthBaseline?: number;
  /** Тип привычки: бинарная (галочка/пропуск) или измеримая (с метриками) */
  type: HabitType;
  /** Единица измерения для measurable типа (км, кг, литров и т.д.) */
  unit?: string;
  /** Целевое значение для measurable типа */
  targetValue?: number;
  /** Тип цели: достичь минимума или не превысить максимум */
  targetType?: 'min' | 'max';
  /** Флаг архивации привычки (архивные привычки скрыты из основного списка) */
  isArchived?: boolean;
  /** Включены ли заметки для этой привычки */
  notesEnabled?: boolean;
  /** Заметки к дням привычки: ключ - дата (YYYY-MM-DD), значение - текст заметки (до 500 символов) */
  notes?: { [date: string]: string };
  /** Настроение к дням привычки: ключ - дата (YYYY-MM-DD), значение - тип настроения */
  moods?: { [date: string]: Mood };
  /** Включен ли таймер для этой привычки */
  timerEnabled?: boolean;
  /** Дефолтное время таймера (минуты) */
  timerDefaultMinutes?: number;
  /** Дефолтное время таймера (секунды) */
  timerDefaultSeconds?: number;
}

/**
 * Данные для создания новой привычки
 */
export interface HabitData {
  name: string;
  description: string;
  startDate: string;
  frequency: FrequencyConfig;
  icon: string;
  tags?: string[];
  section?: string;
  type: HabitType;
  unit?: string;
  targetValue?: number;
  targetType?: 'min' | 'max';
  reminders?: Reminder[];
  notesEnabled?: boolean;
  timerEnabled?: boolean;
  timerDefaultMinutes?: number;
  timerDefaultSeconds?: number;
}

/**
 * Данные для обновления привычки
 * Все поля опциональны, т.к. можно обновлять частично
 */
export type HabitUpdateData = Partial<HabitData>;

/**
 * Настройки для измеримой привычки (используется при обновлении)
 */
export interface MeasurableSettings {
  /** Единица измерения */
  unit?: string;
  /** Целевое значение */
  targetValue?: number;
  /** Тип цели: достичь минимума или не превысить максимум */
  targetType?: 'min' | 'max';
}

/**
 * Конфигурация даты для рендеринга календаря
 * Используется в CalendarGrid, MonthlyStats, StrengthChart, ProgressSection, HabitsList
 */
export interface DateConfig {
  selectedMonth: number;
  selectedYear: number;
  monthDays: { date: Date; day: number }[];
  formatDate: (date: Date) => string;
  getDayName: (date: Date) => string;
}
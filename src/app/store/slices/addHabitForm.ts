/**
 * Slice для управления формой добавления привычки
 * 
 * Содержит всю логику работы с формой:
 * - Состояние полей (name, description, icon, tag, type, frequency, reminders)
 * - UI состояние (currentStep, openPicker)
 * - Handlers для напоминаний, навигации по шагам, валидации
 * - Инициализация формы с начальными данными
 * - Сброс формы после submit
 * 
 * @module app/store/slices/addHabitForm
 * @updated 23 ноября 2025 - миграция category → tag
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import type { FrequencyConfig, Reminder, HabitType } from '@/entities/habit';

/**
 * Данные для инициализации формы
 */
export interface InitializeFormData {
  name?: string;
  description?: string;
  startDate?: string;
  icon?: string;
  tags?: string[];
  section?: string;
  type?: HabitType;
  frequency?: FrequencyConfig;
  reminders?: Reminder[]
;
  unit?: string;
  targetValue?: string;
  targetType?: 'min' | 'max';
  notesEnabled?: boolean;
  timerEnabled?: boolean;
  timerDefaultMinutes?: number;
  timerDefaultSeconds?: number;
}

/**
 * Действия формы добавления привычки
 */
export interface AddHabitFormActions {
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  /** Инициализировать форму с начальными данными */
  initializeAddHabitForm: (initialData?: InitializeFormData) => void;
  /** Сбросить форму к начальному состоянию */
  resetAddHabitForm: () => void;
  
  // ==================== SETTERS: ОСНОВНЫЕ ПОЛЯ ====================
  /** Установить имя привычки */
  setFormName: (name: string) => void;
  /** Установить описание привычки */
  setFormDescription: (description: string) => void;
  /** Установить дату начала привычки */
  setFormStartDate: (startDate: string) => void;
  /** Установить иконку привычки */
  setFormIcon: (icon: string) => void;
  /** Установить теги привычки */
  setFormTags: (tags: string[]) => void;
  /** Установить раздел привычки */
  setFormSection: (section: string) => void;
  /** Установить тип привычки */
  setFormType: (type: HabitType) => void;
  
  // ==================== SETTERS: ЧАСТОТА ====================
  /** Установить частоту выполнения */
  setFormFrequency: (frequency: FrequencyConfig) => void;
  
  // ==================== SETTERS: НАПОМИНАНИЯ ====================
  /** Установить список напоминаний */
  setFormReminders: (reminders: Reminder[]) => void;
  /** Добавить новое напоминание */
  addFormReminder: () => void;
  /** Удалить напоминание */
  deleteFormReminder: (reminderId: string) => void;
  /** Переключить активность напоминания */
  toggleFormReminder: (reminderId: string) => void;
  /** Обновить время напоминания */
  updateFormReminderTime: (reminderId: string, time: string) => void;
  
  // ==================== SETTERS: ИЗМЕРИМАЯ ПРИВЫЧКА ====================
  /** Установить единицу измерения */
  setFormUnit: (unit: string) => void;
  /** Установить целевое значение */
  setFormTargetValue: (value: string) => void;
  /** Установить тип цели (минимум/максимум) */
  setFormTargetType: (type: 'min' | 'max') => void;
  
  // ==================== SETTERS: ЗАМЕТКИ ====================
  setFormNotesEnabled: (enabled: boolean) => void;
  
  // ==================== SETTERS: ТАЙМЕР ====================
  setFormTimerEnabled: (enabled: boolean) => void;
  setFormTimerDefaultMinutes: (minutes: number) => void;
  setFormTimerDefaultSeconds: (seconds: number) => void;
  
  // ==================== SETTERS: UI ====================
  /** Установить текущий шаг */
  setFormCurrentStep: (step: 1 | 2 | 3) => void;
  /** Установить открытый picker */
  setFormOpenPicker: (openPicker: 'targetType' | 'icon' | 'tag' | 'section' | 'type' | null) => void;
  
  // ==================== НАВИГАЦИЯ ПО ШАГАМ ====================
  /** Перейти к следующему шагу */
  handleFormNextStep: () => void;
  /** Вернуться к предыдущему шагу */
  handleFormPreviousStep: () => void;
  /** Получить общее количество шагов */
  getFormTotalSteps: () => number;
  /** Получить номер текущего шага для отображения */
  getFormDisplayStep: () => number;
  
  // ==================== ВАЛИДАЦИЯ ====================
  /** Можно ли перейти с шага 1 */
  canProceedFromFormStep1: () => boolean;
  /** Можно ли перейти с шага 2 */
  canProceedFromFormStep2: () => boolean;
  /** Можно ли отправить форму */
  canSubmitForm: () => boolean;
  
  // ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================
  /** Получить данные формы для отправки */
  getFormData: () => {
    name: string;
    description: string;
    startDate: string;
    icon: string;
    tags: string[];
    section: string;
    type: HabitType;
    frequency: FrequencyConfig;
    reminders: Reminder[];
    unit: string;
    targetValue: string;
    targetType: 'min' | 'max';
    notesEnabled: boolean;
  };
}

/**
 * Начальное состояние формы
 */
const getInitialFormState = () => {
  const today = new Date().toISOString().split('T')[0] ?? '';
  
  return {
    name: '',
    description: '',
    startDate: today,
    icon: 'target',
    tags: [] as string[],
    section: 'other',
    type: 'binary' as HabitType,
    frequency: {
      type: 'by_days_of_week' as const,
      count: 7,
      period: 7,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    },
    reminders: [],
    measurable: {
      unit: '',
      targetValue: '',
      targetType: 'min' as const,
    },
    notesEnabled: false,
    timerEnabled: false,
    timerDefaultMinutes: 0,
    timerDefaultSeconds: 0,
    currentStep: 1 as const,
    openPicker: null,
    isInitialized: false,
  };
};

/**
 * Создать slice для формы добавления привычки
 */
export const createAddHabitFormSlice: StateCreator<
  HabitsState,
  [],
  [],
  AddHabitFormActions
> = (set, get) => ({
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  initializeAddHabitForm: (initialData) => {
    set((state) => {
      const today = new Date().toISOString().split('T')[0] ?? '';
      
      const newState = {
        addHabitForm: {
          name: initialData?.name || '',
          description: initialData?.description || '',
          startDate: initialData?.startDate || today,
          icon: initialData?.icon || 'target',
          tags: initialData?.tags || [],
          section: initialData?.section || 'other',
          type: initialData?.type || 'binary',
          frequency: initialData?.frequency || {
            type: 'by_days_of_week',
            count: 7,
            period: 7,
            daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          },
          reminders: initialData?.reminders || [],
          measurable: {
            unit: initialData?.unit || '',
            targetValue: initialData?.targetValue?.toString() ||'',
            targetType: initialData?.targetType || 'min',
          },
          notesEnabled: initialData?.notesEnabled || false,
          timerEnabled: initialData?.timerEnabled || false,
          timerDefaultMinutes: initialData?.timerDefaultMinutes || 0,
          timerDefaultSeconds: initialData?.timerDefaultSeconds || 0,
          currentStep: 1,
          openPicker: null,
          isInitialized: true,
        },
      };
      return newState;
    });
  },

  resetAddHabitForm: () => {
    set((state) => ({
      addHabitForm: getInitialFormState(),
    }));
  },

  // ==================== SETTERS: ОСНОВНЫЕ ПОЛЯ ====================
  setFormName: (name) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, name },
    }));
  },

  setFormDescription: (description) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, description },
    }));
  },

  setFormStartDate: (startDate) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, startDate },
    }));
  },

  setFormIcon: (icon) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, icon },
    }));
  },

  setFormTags: (tags) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, tags },
    }));
  },

  setFormSection: (section) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, section },
    }));
  },

  setFormType: (type) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, type },
    }));
  },

  // ==================== SETTERS: ЧАСТОТА ====================
  setFormFrequency: (frequency) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, frequency },
    }));
  },

  // ==================== SETTERS: НАПОМИНАНИЯ ====================
  setFormReminders: (reminders) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, reminders },
    }));
  },

  addFormReminder: () => {
    set((state) => {
      const newReminder: Reminder = {
        id: `reminder-${Date.now()}`,
        time: '09:00',
        enabled: true,
      };
      return {
        addHabitForm: {
          ...state.addHabitForm,
          reminders: [...state.addHabitForm.reminders, newReminder],
        },
      };
    });
  },

  deleteFormReminder: (reminderId) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        reminders: state.addHabitForm.reminders.filter((r) => r.id !== reminderId),
      },
    }));
  },

  toggleFormReminder: (reminderId) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        reminders: state.addHabitForm.reminders.map((r) =>
          r.id === reminderId ? { ...r, enabled: !r.enabled } : r
        ),
      },
    }));
  },

  updateFormReminderTime: (reminderId, time) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        reminders: state.addHabitForm.reminders.map((r) =>
          r.id === reminderId ? { ...r, time } : r
        ),
      },
    }));
  },

  // ==================== SETTERS: ИЗМЕРИМАЯ ПРИВЫЧКА ====================
  setFormUnit: (unit) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        measurable: { ...state.addHabitForm.measurable, unit },
      },
    }));
  },

  setFormTargetValue: (targetValue) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        measurable: { ...state.addHabitForm.measurable, targetValue },
      },
    }));
  },

  setFormTargetType: (targetType) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        measurable: { ...state.addHabitForm.measurable, targetType },
      },
    }));
  },

  // ==================== SETTERS: ЗАМЕТКИ ====================
  setFormNotesEnabled: (enabled) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        notesEnabled: enabled,
      },
    }));
  },

  // ==================== SETTERS: ТАЙМЕР ====================
  setFormTimerEnabled: (enabled) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        timerEnabled: enabled,
      },
    }));
  },

  setFormTimerDefaultMinutes: (minutes) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        timerDefaultMinutes: minutes,
      },
    }));
  },

  setFormTimerDefaultSeconds: (seconds) => {
    set((state) => ({
      addHabitForm: {
        ...state.addHabitForm,
        timerDefaultSeconds: seconds,
      },
    }));
  },

  // ==================== SETTERS: UI ====================
  setFormCurrentStep: (currentStep) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, currentStep },
    }));
  },

  setFormOpenPicker: (openPicker) => {
    set((state) => ({
      addHabitForm: { ...state.addHabitForm, openPicker },
    }));
  },

  // ==================== НАВИГАЦИЯ ПО ШАГАМ ====================
  handleFormNextStep: () => {
    const { addHabitForm } = get();
    
    // Проверка: должно быть заполнено имя
    if (!addHabitForm.name.trim()) return;

    if (addHabitForm.currentStep === 1) {
      // Если binary тип - переходим сразу на шаг 3
      // Если measurable тип - переходим на шаг 2
      const nextStep = addHabitForm.type === 'binary' ? 3 : 2;
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: nextStep as 1 | 2 | 3 },
      }));
    } else if (addHabitForm.currentStep === 2) {
      // Со шага 2 (measurable настройки) переходим на шаг 3
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: 3 },
      }));
    }
  },

  handleFormPreviousStep: () => {
    const { addHabitForm } = get();

    if (addHabitForm.currentStep === 3) {
      // Если binary тип - возвращаемся на шаг 1
      // Если measurable тип - возвращаемся на шаг 2
      const prevStep = addHabitForm.type === 'binary' ? 1 : 2;
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: prevStep as 1 | 2 | 3 },
      }));
    } else if (addHabitForm.currentStep === 2) {
      // Со шага 2 возвращаемся на шаг 1
      set((state) => ({
        addHabitForm: { ...state.addHabitForm, currentStep: 1 },
      }));
    }
  },

  getFormTotalSteps: () => {
    const { addHabitForm } = get();
    return addHabitForm.type === 'binary' ? 2 : 3;
  },

  getFormDisplayStep: () => {
    const { addHabitForm } = get();
    
    if (addHabitForm.currentStep === 1) return 1;
    if (addHabitForm.currentStep === 2) return 2; // Только для measurable
    if (addHabitForm.currentStep === 3) {
      return addHabitForm.type === 'binary' ? 2 : 3;
    }
    return 1;
  },

  // ==================== ВАЛИДАЦИЯ ====================
  canProceedFromFormStep1: () => {
    const { addHabitForm } = get();
    return addHabitForm.name.trim() !== '';
  },

  canProceedFromFormStep2: () => {
    const { addHabitForm } = get();
    return (
      addHabitForm.name.trim() !== '' &&
      addHabitForm.measurable.unit.trim() !== '' &&
      addHabitForm.measurable.targetValue.trim() !== ''
    );
  },

  canSubmitForm: () => {
    const { addHabitForm } = get();
    return addHabitForm.name.trim() !== '';
  },

  // ==================== ПОЛУЧЕНИЕ ДАННЫХ ====================
  getFormData: () => {
    const { addHabitForm } = get();
    
    return {
      name: addHabitForm.name.trim(),
      description: addHabitForm.description.trim(),
      startDate: addHabitForm.startDate,
      icon: addHabitForm.icon,
      tags: addHabitForm.tags,
      section: addHabitForm.section,
      type: addHabitForm.type,
      frequency: addHabitForm.frequency.type === 'by_days_of_week'
        ? {
            ...addHabitForm.frequency,
            daysOfWeek: addHabitForm.frequency.daysOfWeek,
          }
        : {
            type: addHabitForm.frequency.type,
            count: addHabitForm.frequency.count,
            period: addHabitForm.frequency.period,
            // ✅ Fix: exactOptionalPropertyTypes - не включаем daysOfWeek вместо undefined
          },
      reminders: addHabitForm.reminders,
      unit: addHabitForm.measurable.unit,
      targetValue: addHabitForm.measurable.targetValue,
      targetType: addHabitForm.measurable.targetType,
      notesEnabled: addHabitForm.notesEnabled,
    };
  },
});
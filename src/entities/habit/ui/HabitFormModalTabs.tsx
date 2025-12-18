/**
 * Базовый компонент модального окна с формой привычки (табы)
 * 
 * @description
 * Универсальная форма для создания и редактирования привычек с разделением на 3 таба:
 * 1. Basic - название, иконка, тип, раздел
 * 2. Schedule - дата начала, частота, напоминания
 * 3. Extra - теги, описание
 * 
 * Используется в:
 * - features/habit-create - для создания новых привычек
 * - features/habit-edit - для редактирования существующих привычек
 * 
 * @module entities/habit/ui/HabitFormModalTabs
 * @created 10 декабря 2025 - вынесение базового компонента в entities слой
 * @updated 10 декабря 2025 - исправлена передача measurable полей (только для measurable типа)
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Calendar as CalendarIcon, Trash2 } from '@/shared/assets/icons/system';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { HabitType } from '@/entities/habit';
import { IconPicker } from '@/shared/ui/icon-picker';
import { getIconOptions, ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants/validation';
import { useHabitsStore, useShallow } from '@/app/store';

// Компоненты из entities слоя
import {
  HabitTypePickerButtons,
  FrequencyButtons,
  DaysSelector,
  TimesSlider,
  IntervalInput,
  SectionButtons,
  HabitRemindersCards,
} from '@/entities/habit/ui';
import { TagButtonsSelector } from '@/entities/tag/ui';
import { declineTimesPerWeek, declineTimesPerMonth } from '@/shared/lib/text';

export interface HabitFormModalTabsProps {
  /** Режим работы формы */
  mode: 'create' | 'edit';
  
  /** Открыта ли модалка */
  isOpen: boolean;
  
  /** Callback закрытия модалки */
  onClose: () => void;
  
  /** Callback сохранения данных */
  onSubmit: (data: HabitData | HabitUpdateData) => void;
  
  /** Количество дней в месяце (для расчетов) */
  daysInMonth?: number;
  
  /** Для режима edit: блокировать изменение типа отслеживания */
  disableTypeChange?: boolean;
  
  /** Для режима edit: показывать кнопку удаления */
  showDelete?: boolean;
  
  /** Для режима edit: callback удаления */
  onDelete?: () => void;
  
  /** Для режима edit: дополнительные элементы футера слева (например, ArchiveButton) */
  footerLeftActions?: React.ReactNode;
  
  /** Начальные данные для формы (при редактировании) */
  initialData?: Partial<Habit>;
}

export const HabitFormModalTabs: React.FC<HabitFormModalTabsProps> = ({
  mode,
  isOpen,
  onClose,
  onSubmit,
  daysInMonth,
  disableTypeChange = false,
  showDelete = false,
  footerLeftActions,
  onDelete,
  initialData,
}) => {
  const { t, i18n } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  
  // Получаем опции иконок с переводами
  const iconOptions = useMemo(() => getIconOptions(t), [t]);
  
  // Определяем локаль для date-fns на основе текущего языка
  const locale = i18n.language === 'ru' ? ru : enUS;
  
  // Локальное состояние для AlertDialog удаления
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  
  // Получаем состояние и actions из store с useShallow для оптимизации
  const {
    form,
    sections,
    tags,
    habits,
    initializeAddHabitForm,
    resetAddHabitForm,
    setFormName,
    setFormDescription,
    setFormStartDate,
    setFormIcon,
    setFormTags,
    setFormSection,
    setFormType,
    setFormFrequency,
    setFormOpenPicker,
    setFormUnit,
    setFormTargetValue,
    setFormTargetType,
    setFormNotesEnabled,
    addFormReminder,
    deleteFormReminder,
    updateFormReminderTime,
    getFormData,
    addSection,
    updateSectionColor,
    deleteSection,
    addTag,
    deleteTag,
    setFormTimerEnabled,
    setFormTimerDefaultMinutes,
    setFormTimerDefaultSeconds,
  } = useHabitsStore(
    useShallow((state) => ({
      form: state.addHabitForm,
      sections: state.sections,
      tags: state.tags,
      habits: state.habits,
      initializeAddHabitForm: state.initializeAddHabitForm,
      resetAddHabitForm: state.resetAddHabitForm,
      setFormName: state.setFormName,
      setFormDescription: state.setFormDescription,
      setFormStartDate: state.setFormStartDate,
      setFormIcon: state.setFormIcon,
      setFormTags: state.setFormTags,
      setFormSection: state.setFormSection,
      setFormType: state.setFormType,
      setFormFrequency: state.setFormFrequency,
      setFormOpenPicker: state.setFormOpenPicker,
      setFormUnit: state.setFormUnit,
      setFormTargetValue: state.setFormTargetValue,
      setFormTargetType: state.setFormTargetType,
      setFormNotesEnabled: state.setFormNotesEnabled,
      addFormReminder: state.addFormReminder,
      deleteFormReminder: state.deleteFormReminder,
      updateFormReminderTime: state.updateFormReminderTime,
      getFormData: state.getFormData,
      addSection: state.addSection,
      updateSectionColor: state.updateSectionColor,
      deleteSection: state.deleteSection,
      addTag: state.addTag,
      deleteTag: state.deleteTag,
      setFormTimerEnabled: state.setFormTimerEnabled,
      setFormTimerDefaultMinutes: state.setFormTimerDefaultMinutes,
      setFormTimerDefaultSeconds: state.setFormTimerDefaultSeconds,
    }))
  );

  // Инициализируем форму при монтировании
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0] ?? '';
    
    initializeAddHabitForm(
      initialData
        ? {
            name: initialData.name,
            description: initialData.description,
            startDate: initialData.startDate || today,
            icon: initialData.icon,
            tags: initialData.tags,
            type: initialData.type as HabitType,
            frequency: initialData.frequency,
            reminders: initialData.reminders,
            unit: initialData.unit,
            targetValue: initialData.targetValue?.toString(),
            targetType: initialData.targetType,
            notesEnabled: initialData.notesEnabled,
            timerEnabled: initialData.timerEnabled,
            timerDefaultMinutes: initialData.timerDefaultMinutes,
            timerDefaultSeconds: initialData.timerDefaultSeconds,
          }
        : {
            startDate: today,
          }
    );

    return () => {
      resetAddHabitForm();
    };
  }, [isOpen]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // State для управления открытием календаря
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  // Автофокус на поле ввода названия
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    resetAddHabitForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    const data = getFormData();
    
    // Базовые данные привычки
    const habitData: HabitData | HabitUpdateData = {
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      icon: data.icon,
      tags: data.tags,
      section: data.section,
      frequency: data.frequency,
      type: data.type,
      reminders: data.reminders,
      notesEnabled: data.notesEnabled,
      timerEnabled: form.timerEnabled,
      timerDefaultMinutes: form.timerDefaultMinutes,
      timerDefaultSeconds: form.timerDefaultSeconds,
    };
    
    // Добавляем measurable поля только если тип measurable
    if (data.type === 'measurable') {
      habitData.unit = data.unit;
      habitData.targetValue = data.targetValue ? parseFloat(data.targetValue) : undefined;
      habitData.targetType = data.targetType;
    }
    
    onSubmit(habitData);
    
    resetAddHabitForm();
    onClose();
  };
  
  const handleDeleteConfirm = () => {
    setShowDeleteAlert(false);
    if (onDelete) {
      onDelete();
    }
  };

  // Проверка возможности отправить форму
  const canSubmit = React.useMemo(() => {
    if (!form.name.trim()) {
      return false;
    }

    if (form.type === 'measurable') {
      if (!form.measurable.unit) {
        return false;
      }
      
      const targetValue = parseFloat(form.measurable.targetValue);
      if (!form.measurable.targetValue || isNaN(targetValue) || targetValue <= 0) {
        return false;
      }
    }

    return true;
  }, [form.name, form.type, form.measurable.unit, form.measurable.targetValue]);

  // Хелпер для обновления частоты при смене типа
  const handleFrequencyTypeChange = (newType: FrequencyType) => {
    let newConfig: FrequencyConfig;
    
    if (newType === 'n_times_week') {
      newConfig = {
        type: newType,
        count: 5,
        period: 1,
        daysOfWeek: [],
      };
    } else if (newType === 'n_times_month') {
      newConfig = {
        type: newType,
        count: 15,
        period: 1,
        daysOfWeek: [],
      };
    } else if (newType === 'by_days_of_week') {
      newConfig = {
        type: newType,
        count: 1,
        period: 1,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Пн-Вс (JS Date индексы)
      };
    } else { // every_n_days
      newConfig = {
        type: newType,
        count: 1,
        period: 2,
        daysOfWeek: [],
      };
    }
    
    setFormFrequency(newConfig);
  };

  // Хелперы для конвертации дней недели
  // MO, TU, WE, TH, FR, SA, SU → числовые индексы JS Date (0-6)
  const dayStringToNumber: Record<string, number> = {
    'SU': 0, // Воскресенье
    'MO': 1, // Понедельник  
    'TU': 2, // Вторник
    'WE': 3, // Среда
    'TH': 4, // Четверг
    'FR': 5, // Пятница
    'SA': 6, // Суббота
  };

  const dayNumberToString: Record<number, string> = {
    0: 'SU',
    1: 'MO',
    2: 'TU',
    3: 'WE',
    4: 'TH',
    5: 'FR',
    6: 'SA',
  };

  const convertDaysToStrings = (days: number[]): string[] => {
    return days.map(d => dayNumberToString[d]).filter(Boolean);
  };

  const convertDaysToNumbers = (days: string[]): number[] => {
    return days.map(d => dayStringToNumber[d]).filter(d => d !== undefined);
  };

  // Функция для подсчета количества привычек с тегом
  const getTagUsageCount = (tagName: string): number => {
    return habits.filter(habit => habit.tags?.includes(tagName)).length;
  };

  return (
    <>
      {isOpen && (
        <Modal.Root level={mode === 'create' ? 'dialog' : 'modal'} onClose={handleClose}>
          <Modal.Backdrop onClick={handleClose} />
          <Modal.Container size="lg" minHeight="610px" maxHeight="610px">
            <Modal.GradientLine />
            
            <Modal.Header 
              title={mode === 'edit' ? t('form.editHabit') : t('form.newHabit')}
              onClose={handleClose}
            />
            
            <Tabs defaultValue="basic" className="w-full flex flex-col flex-1 overflow-hidden">
              <div className="px-[24px] h-12 flex-shrink-0 flex items-center py-[0px]">
                <TabsList className="w-full h-full">
                  <TabsTrigger value="basic" className="flex-1">
                    {t('tabs.basic') || 'Basic'}
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="flex-1">
                    {t('tabs.schedule') || 'Schedule'}
                  </TabsTrigger>
                  <TabsTrigger value="extra" className="flex-1">
                    {t('tabs.extra') || 'Extra'}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <Modal.Content className="px-6 py-4">
                {/* ===== BASIC TAB ===== */}
                <TabsContent value="basic" className="mt-0 space-y-5">
                  {/* Name & Icon */}
                  <div>
                    <label htmlFor="habit-name" className="modal-field-title">
                      {t('form.nameAndIcon')}
                      <span className="text-[var(--status-error)]"> *</span>
                    </label>
                    <div className="mt-2 flex gap-2">
                      <IconPicker
                        value={form.icon}
                        onChange={setFormIcon}
                        iconOptions={iconOptions}
                        iconMap={ICON_MAP}
                        defaultIcon={SmallFilledCircle}
                        open={form.openPicker === 'icon'}
                        onOpenChange={(open) => setFormOpenPicker(open ? 'icon' : null)}
                        showSearch={true}
                      />
                      
                      <Input
                        id="habit-name"
                        ref={nameInputRef}
                        value={form.name}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder={t('form.namePlaceholder')}
                        maxLength={TEXT_LENGTH_LIMITS.habitName.max}
                        showCharCount
                        className="flex-1 h-12"
                        aria-required="true"
                      />
                    </div>
                  </div>
                  
                  {/* Tracking Type */}
                  <div>
                    <Modal.FieldTitle>
                      {t('form.trackingType')}
                    </Modal.FieldTitle>
                    <div className="mt-2">
                      <HabitTypePickerButtons
                        selectedType={form.type}
                        onSelectType={setFormType}
                        readOnly={disableTypeChange}
                      />
                    </div>
                  </div>
                  
                  {/* Number Options */}
                  {form.type === 'measurable' && (
                    <div className="p-4 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)] space-y-4">
                      <div>
                        <label htmlFor="habit-unit" className="modal-field-title">
                          {t('measurable.unit')}
                          <span className="text-[var(--status-error)]"> *</span>
                        </label>
                        <Select 
                          value={form.measurable.unit} 
                          onValueChange={setFormUnit}
                        >
                          <SelectTrigger 
                            id="habit-unit"
                            className="mt-2 bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
                            aria-label={t('measurable.unit')}
                            aria-required="true"
                          >
                            <SelectValue placeholder={t('measurable.unitPlaceholder') || 'Select unit...'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">{t('units.minutes') || 'Minutes'}</SelectItem>
                            <SelectItem value="hours">{t('units.hours') || 'Hours'}</SelectItem>
                            <SelectItem value="times">{t('units.times') || 'Times'}</SelectItem>
                            <SelectItem value="pages">{t('units.pages') || 'Pages'}</SelectItem>
                            <SelectItem value="km">{t('units.km') || 'Kilometers'}</SelectItem>
                            <SelectItem value="glasses">{t('units.glasses') || 'Glasses'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label htmlFor="habit-target-type" className="modal-field-title">
                            {t('measurable.targetType')}
                          </label>
                          <Select 
                            value={form.measurable.targetType} 
                            onValueChange={setFormTargetType}
                          >
                            <SelectTrigger 
                              id="habit-target-type"
                              className="mt-2 bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
                              aria-label={t('measurable.targetType')}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="min">{t('measurable.atLeast') || 'At least'}</SelectItem>
                              <SelectItem value="max">{t('measurable.atMost') || 'At most'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="habit-target-value" className="modal-field-title">
                            {t('measurable.target')}
                            <span className="text-[var(--status-error)]"> *</span>
                          </label>
                          <Input
                            id="habit-target-value"
                            type="number"
                            value={form.measurable.targetValue}
                            onChange={(e) => setFormTargetValue(e.target.value)}
                            placeholder="e.g., 30"
                            className="mt-2 bg-[var(--bg-secondary)] border-[var(--border-tertiary)]"
                            aria-required="true"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Sections */}
                  <div>
                    <Modal.FieldTitle>
                      {t('form.section')}
                    </Modal.FieldTitle>
                    <div className="mt-2">
                      <SectionButtons
                        sections={sections}
                        selectedSection={form.section}
                        onSelectSection={setFormSection}
                        onAddSection={addSection}
                        onDeleteSection={deleteSection}
                        onUpdateSectionColor={updateSectionColor}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* ===== SCHEDULE TAB ===== */}
                <TabsContent value="schedule" className="mt-0 space-y-5">
                  {/* Start Date */}
                  <div>
                    <Modal.FieldTitle>
                      {t('form.startDate')}
                    </Modal.FieldTitle>
                    <div className="mt-2">
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <button 
                            type="button"
                            className="w-full h-[48px] flex items-center gap-3 px-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                          >
                            <CalendarIcon size={16} className="text-[var(--text-tertiary)]" />
                            <span className="text-[var(--text-primary)] text-sm">
                              {form.startDate 
                                ? format(new Date(form.startDate), 'PPP', { locale }) 
                                : t('form.selectDate')}
                            </span>
                            {form.startDate === new Date().toISOString().split('T')[0] && (
                              <span className="ml-auto text-xs text-[var(--accent-secondary-indigo)] px-2 py-0.5 rounded bg-[var(--accent-muted-indigo)]">
                                {t('common:common.today')}
                              </span>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={form.startDate ? new Date(form.startDate) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setFormStartDate(format(date, 'yyyy-MM-dd'));
                                setIsCalendarOpen(false);
                              }
                            }}
                            initialFocus
                            locale={locale}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  {/* Frequency */}
                  <div>
                    <Modal.FieldTitle>
                      {t('form.frequency')}
                    </Modal.FieldTitle>
                    <div className="mt-2">
                      <FrequencyButtons
                        selectedFrequency={form.frequency.type}
                        onSelectFrequency={handleFrequencyTypeChange}
                      />
                    </div>
                  </div>
                  
                  {/* Days Selection */}
                  {form.frequency.type === 'by_days_of_week' && (
                    <div>
                      <Modal.FieldTitle>
                        {t('frequency.selectDays')}
                      </Modal.FieldTitle>
                      <div className="mt-2">
                        <DaysSelector
                          selectedDays={convertDaysToStrings(form.frequency.daysOfWeek || [])}
                          onSelectDays={(days) => setFormFrequency({ ...form.frequency, daysOfWeek: convertDaysToNumbers(days) })}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Times per Week */}
                  {form.frequency.type === 'n_times_week' && (
                    <TimesSlider
                      value={form.frequency.count || 5}
                      onChange={(count) => setFormFrequency({ ...form.frequency, count })}
                      max={7}
                      formatLabel={(count) => `${count} ${declineTimesPerWeek(count, tCommon, i18n.language)}`.toUpperCase()}
                    />
                  )}
                  
                  {/* Times per Month */}
                  {form.frequency.type === 'n_times_month' && (
                    <TimesSlider
                      value={form.frequency.count || 15}
                      onChange={(count) => setFormFrequency({ ...form.frequency, count })}
                      max={31}
                      formatLabel={(count) => `${count} ${declineTimesPerMonth(count, tCommon, i18n.language)}`.toUpperCase()}
                    />
                  )}
                  
                  {/* Interval */}
                  {form.frequency.type === 'every_n_days' && (
                    <IntervalInput
                      value={form.frequency.period || 2}
                      onChange={(period) => setFormFrequency({ ...form.frequency, period })}
                    />
                  )}
                  
                  {/* Reminders */}
                  <HabitRemindersCards
                    reminders={form.reminders}
                    frequency={form.frequency}
                    onAddReminder={addFormReminder}
                    onDeleteReminder={deleteFormReminder}
                    onUpdateReminderTime={updateFormReminderTime}
                  />
                </TabsContent>
                
                {/* ===== EXTRA TAB ===== */}
                <TabsContent value="extra" className="mt-0 space-y-5">
                  {/* Tags */}
                  <TagButtonsSelector
                    tags={tags}
                    selectedTags={form.tags}
                    onSelectTags={setFormTags}
                    onAddTag={addTag}
                    onDeleteTag={deleteTag}
                    getTagUsageCount={getTagUsageCount}
                  />
                  
                  {/* Enable Notes (заглушка на будущее) */}
                  <div 
                    className={`p-4 rounded-md flex items-center justify-between cursor-pointer ${
                      form.notesEnabled 
                        ? 'bg-[var(--accent-muted-indigo)] border border-[var(--ring)]' 
                        : 'bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)]'
                    }`}
                    onClick={() => setFormNotesEnabled(!form.notesEnabled)}
                  >
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">
                        {t('notes.enableDailyNotes') || 'Enable daily notes'}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        {t('notes.enableDailyNotesDescription') || 'Add notes when completing this habit'}
                      </p>
                    </div>
                    <Switch 
                      checked={form.notesEnabled} 
                      onCheckedChange={(e) => e.preventDefault()}
                      className="pointer-events-none"
                    />
                  </div>
                  
                  {/* Enable Timer */}
                  <div>
                    <div 
                      className={`p-4 rounded-md flex items-center justify-between cursor-pointer ${
                        form.timerEnabled 
                          ? 'bg-[var(--accent-muted-indigo)] border border-[var(--ring)]' 
                          : 'bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)]'
                      }`}
                      onClick={() => setFormTimerEnabled(!form.timerEnabled)}
                    >
                      <div>
                        <p className="text-sm text-[var(--text-primary)]">
                          Enable timer for this habit
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                          Use timer mode to track this habit
                        </p>
                      </div>
                      <Switch 
                        checked={form.timerEnabled} 
                        onCheckedChange={(e) => e.preventDefault()}
                        className="pointer-events-none"
                      />
                    </div>
                    
                    {/* Timer Default Time Settings */}
                    {form.timerEnabled && (
                      <div className="mt-3 p-4 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]">
                        <p className="text-xs text-[var(--text-tertiary)] mb-3">
                          DEFAULT TIMER DURATION
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label htmlFor="timer-minutes" className="text-xs text-[var(--text-tertiary)] mb-1 block">
                              Minutes
                            </label>
                            <Input
                              id="timer-minutes"
                              type="number"
                              value={form.timerDefaultMinutes || ''}
                              onChange={(e) => {
                                const value = Math.min(Math.max(parseInt(e.target.value) || 0, 0), 600);
                                setFormTimerDefaultMinutes(value);
                              }}
                              placeholder="0"
                              min="0"
                              max="600"
                              className="bg-[var(--bg-tertiary)] border-[var(--border-tertiary)]"
                              aria-label="Timer default minutes"
                            />
                          </div>
                          <div className="flex-1">
                            <label htmlFor="timer-seconds" className="text-xs text-[var(--text-tertiary)] mb-1 block">
                              Seconds
                            </label>
                            <Input
                              id="timer-seconds"
                              type="number"
                              value={form.timerDefaultSeconds || ''}
                              onChange={(e) => {
                                const value = Math.min(Math.max(parseInt(e.target.value) || 0, 1), 60);
                                setFormTimerDefaultSeconds(value);
                              }}
                              placeholder="0"
                              min="1"
                              max="60"
                              className="bg-[var(--bg-tertiary)] border-[var(--border-tertiary)]"
                              aria-label="Timer default seconds"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="habit-description" className="modal-field-title">
                      {t('form.description')}
                    </label>
                    <Textarea
                      id="habit-description"
                      value={form.description}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder={t('notes.placeholder')}
                      rows={4}
                      maxLength={TEXT_LENGTH_LIMITS.habitDescription.max}
                      showCharCount
                      className="mt-2 min-h-24"
                      aria-label={t('form.description')}
                    />
                  </div>
                </TabsContent>
              </Modal.Content>
            </Tabs>
            
            <Modal.Footer className={showDelete ? '!justify-between' : ''}>
              {showDelete && (
                <div className="flex items-center gap-2">
                  {/* Дополнительные элементы футера слева (например, ArchiveButton) */}
                  {footerLeftActions}
                  <Button
                    variant="ghostDestructive"
                    size="icon"
                    onClick={() => setShowDeleteAlert(true)}
                    title={t('habit.deleteHabit')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              )}
              <div className={showDelete ? 'flex gap-3' : 'w-full flex gap-3 justify-end'}>
                <Button variant="ghost" onClick={handleClose}>
                  {tCommon('common.cancel')}
                </Button>
                <Button disabled={!canSubmit} onClick={handleSubmit}>
                  {mode === 'edit' ? tCommon('common.save') : t('habit.addHabit')}
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Container>

          {/* AlertDialog для подтверждения удаления */}
          {showDelete && (
            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {tCommon('common.delete')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {tCommon('common.deleteConfirm')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
                    {tCommon('common.cancel')}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteConfirm}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {tCommon('common.delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </Modal.Root>
      )}
    </>
  );
};
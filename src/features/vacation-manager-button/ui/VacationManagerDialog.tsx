/**
 * Главная модалка управления периодами отдыха
 * 
 * @module features/vacation-manager-button/ui/VacationManagerDialog
 * @migrated 16 декабря 2025 - перенесено из widgets в features (FSD рефакторинг)
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar as CalendarIcon, Palmtree } from '@/shared/assets/icons/system';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VacationEmptyState } from './VacationEmptyState';
import { VacationPeriodCard } from '@/features/vacation-period-card';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import { sortVacationPeriods, isDateRangeOverlapping } from '@/entities/vacation';
import { IconPicker } from '@/shared/ui/icon-picker';
import { 
  getVacationIconOptions, 
  VACATION_ICON_MAP, 
  type VacationIconKey,
  TEXT_LENGTH_LIMITS,
  ICON_MAP,
  SmallFilledCircle,
} from '@/shared/constants';

interface VacationManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewMode = 'list' | 'create';

export function VacationManagerDialog({
  open,
  onOpenChange,
}: VacationManagerDialogProps) {
  const { t, i18n } = useTranslation('vacation');
  
  const [view, setView] = useState<ViewMode>('list');
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  
  // Form state
  const [reason, setReason] = useState('');
  const [icon, setIcon] = useState<VacationIconKey>('palmtree');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [applyToAll, setApplyToAll] = useState(true);
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isStartCalendarOpen, setIsStartCalendarOpen] = useState(false);
  const [isEndCalendarOpen, setIsEndCalendarOpen] = useState(false);
  
  const reasonInputRef = useRef<HTMLInputElement>(null);
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем все вызовы store в один с useShallow
  const {
    vacationPeriods,
    habits,
    addVacationPeriod,
    updateVacationPeriod,
  } = useHabitsStore(
    useShallow((state) => ({
      vacationPeriods: state.vacationPeriods,
      habits: state.habits,
      addVacationPeriod: state.addVacationPeriod,
      updateVacationPeriod: state.updateVacationPeriod,
    }))
  );
  
  // Получаем опции иконок с переводами
  const iconOptions = useMemo(() => getVacationIconOptions(t), [t]);
  
  // Сортируем периоды по статусу
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0] ?? '';
  const sortedPeriods = sortVacationPeriods(vacationPeriods, todayStr);
  
  const isEmpty = vacationPeriods.length === 0;
  
  // Автофокус на инпуте при переходе в режим создания
  useEffect(() => {
    if (view === 'create' && reasonInputRef.current) {
      setTimeout(() => {
        reasonInputRef.current?.focus();
      }, 100);
    }
  }, [view]);
  
  const handleClose = () => {
    onOpenChange(false);
    // Сбрасываем view при закрытии
    setTimeout(() => {
      setView('list');
      resetForm();
    }, 200);
  };
  
  const resetForm = () => {
    setEditingPeriodId(null);
    setReason('');
    setIcon('palmtree');
    setStartDate(undefined);
    setEndDate(undefined);
    setApplyToAll(true);
    setSelectedHabitIds([]);
    setError('');
    setIsStartCalendarOpen(false);
    setIsEndCalendarOpen(false);
  };
  
  const handleAdd = () => {
    setEditingPeriodId(null);
    resetForm();
    // Устанавливаем дефолтные даты
    const today = new Date();
    const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    setStartDate(today);
    setEndDate(weekLater);
    setView('create');
  };
  
  const handleEdit = (periodId: string) => {
    const period = vacationPeriods.find(p => p.id === periodId);
    if (!period) return;
    
    // Загружаем данные периода в форму
    setEditingPeriodId(periodId);
    setReason(period.reason);
    setIcon(period.icon);
    setStartDate(new Date(period.startDate));
    setEndDate(new Date(period.endDate));
    setApplyToAll(period.applyToAll);
    setSelectedHabitIds(period.habitIds);
    setError('');
    setView('create');
  };
  
  const handleBack = () => {
    setView('list');
    resetForm();
  };
  
  const handleSave = () => {
    setError('');
    
    // Валидация
    if (!reason.trim()) {
      setError(t('reasonRequired'));
      return;
    }
    
    if (!startDate || !endDate) {
      setError(t('dateRangeRequired'));
      return;
    }
    
    // Проверка выбора привычек
    if (!applyToAll && selectedHabitIds.length === 0) {
      setError(t('habitsRequired'));
      return;
    }
    
    // Проверка пересечения дат (исключая текущий период при редактировании)
    if (isDateRangeOverlapping(startDate.toISOString().split('T')[0] ?? '', endDate.toISOString().split('T')[0] ?? '', vacationPeriods, editingPeriodId ?? undefined)) {
      setError(t('dateRangeOverlap'));
      return;
    }
    
    // Создаём или обновляем период
    if (editingPeriodId) {
      updateVacationPeriod(editingPeriodId, {
        reason: reason.trim(),
        icon,
        startDate: startDate.toISOString().split('T')[0] ?? '',
        endDate: endDate.toISOString().split('T')[0] ?? '',
        applyToAll,
        habitIds: applyToAll ? [] : selectedHabitIds,
      });
    } else {
      addVacationPeriod({
        reason: reason.trim(),
        icon,
        startDate: startDate.toISOString().split('T')[0] ?? '',
        endDate: endDate.toISOString().split('T')[0] ?? '',
        applyToAll,
        habitIds: applyToAll ? [] : selectedHabitIds,
      });
    }
    
    setView('list');
    resetForm();
  };
  
  const handleHabitToggle = (habitId: string) => {
    if (applyToAll) return;
    
    setSelectedHabitIds(prev => 
      prev.includes(habitId) 
        ? prev.filter(id => id !== habitId)
        : [...prev, habitId]
    );
  };
  
  const handleApplyToAllToggle = (checked: boolean) => {
    setApplyToAll(checked);
    if (checked) {
      setSelectedHabitIds([]);
    }
  };
  
  const handleToggleAllHabits = () => {
    const activeHabits = habits.filter(h => !h.isArchived);
    const allSelected = activeHabits.length > 0 && selectedHabitIds.length === activeHabits.length;
    
    if (allSelected) {
      setSelectedHabitIds([]);
    } else {
      setSelectedHabitIds(activeHabits.map(h => h.id));
    }
  };
  
  // Проверка валидности формы
  const isFormValid = 
    reason.trim() !== '' && 
    startDate !== undefined && 
    endDate !== undefined && 
    (applyToAll || selectedHabitIds.length > 0);
  
  if (!open) return null;
  
  return (
    <>
      <Modal.Root level="modal" onClose={handleClose}>
        <Modal.Backdrop onClick={handleClose} />
        <Modal.Container size="2xl" className="flex flex-col h-[610px]">
          <Modal.GradientLine />
          
          {view === 'list' && (
            <>
              <Modal.Header
                title={t('title')}
                onClose={handleClose}
              />
              
              <Modal.Content className={isEmpty ? 'flex items-center justify-center' : ''}>
                {isEmpty ? (
                  <VacationEmptyState onCreateClick={handleAdd} />
                ) : (
                  <div className="px-6 py-6 overflow-y-auto">
                    <div className="space-y-3">
                      {sortedPeriods.map((period) => (
                        <VacationPeriodCard
                          key={period.id}
                          period={period}
                          onEdit={() => handleEdit(period.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Modal.Content>
              
              <Modal.Footer className="!justify-between">
                {/* Кнопка + слева - только если есть периоды */}
                {!isEmpty && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleAdd}
                    className="size-9"
                    aria-label={t('createButton')}
                    title={t('createButton')}
                  >
                    <Plus className="size-4" />
                  </Button>
                )}
                
                {/* Кнопка Готово справа */}
                <Button onClick={handleClose} className={isEmpty ? 'ml-auto' : ''}>
                  {t('doneButton')}
                </Button>
              </Modal.Footer>
            </>
          )}
          
          {view === 'create' && (
            <>
              <Modal.Header 
                title={editingPeriodId ? t('editDialogTitle') : t('newVacationTitle')}
                onClose={handleClose}
                showCloseButton={false}
              />
              
              <Modal.Content>
                <div className="px-6 pt-6 pb-4 space-y-5">
                  {/* Приина и иконка */}
                  <div>
                    <Modal.FieldTitle required>
                      {t('reasonLabel')}
                    </Modal.FieldTitle>
                    <div className="mt-2 flex gap-2">
                      {/* Icon Picker */}
                      <IconPicker
                        value={icon}
                        onChange={(value) => setIcon(value as VacationIconKey)}
                        iconOptions={iconOptions}
                        iconMap={VACATION_ICON_MAP}
                        defaultIcon={Palmtree}
                        showSearch={false}
                        ariaLabel={t('iconLabel')}
                      />
                      
                      {/* Reason Input */}
                      <Input
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t('reasonPlaceholder')}
                        maxLength={TEXT_LENGTH_LIMITS.vacationReason.max}
                        showCharCount
                        ref={reasonInputRef}
                        className="flex-1 h-12 rounded-md"
                      />
                    </div>
                  </div>
                  
                  {/* Даты - два отдельных поля */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Modal.FieldTitle>{t('startDateLabel')}</Modal.FieldTitle>
                      <div className="mt-2">
                        <Popover open={isStartCalendarOpen} onOpenChange={setIsStartCalendarOpen}>
                          <PopoverTrigger asChild>
                            <button 
                              type="button"
                              className="w-full h-[48px] flex items-center gap-3 px-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                            >
                              <CalendarIcon className="h-4 w-4 text-[var(--text-tertiary)]" />
                              <span className={!startDate ? "text-[var(--text-tertiary)] text-sm" : "text-[var(--text-primary)] text-sm"}>
                                {startDate ? format(startDate, 'PPP', { locale: i18n.language === 'ru' ? ru : enUS }) : t('dateRangePlaceholder')}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => {
                                setStartDate(date);
                                setIsStartCalendarOpen(false);
                              }}
                              locale={i18n.language === 'ru' ? ru : enUS}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div>
                      <Modal.FieldTitle>{t('endDateLabel')}</Modal.FieldTitle>
                      <div className="mt-2">
                        <Popover open={isEndCalendarOpen} onOpenChange={setIsEndCalendarOpen}>
                          <PopoverTrigger asChild>
                            <button 
                              type="button"
                              className="w-full h-[48px] flex items-center gap-3 px-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                            >
                              <CalendarIcon className="h-4 w-4 text-[var(--text-tertiary)]" />
                              <span className={!endDate ? "text-[var(--text-tertiary)] text-sm" : "text-[var(--text-primary)] text-sm"}>
                                {endDate ? format(endDate, 'PPP', { locale: i18n.language === 'ru' ? ru : enUS }) : t('dateRangePlaceholder')}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(date) => {
                                setEndDate(date);
                                setIsEndCalendarOpen(false);
                              }}
                              locale={i18n.language === 'ru' ? ru : enUS}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  
                  {/* Pause all habits toggle */}
                  <div 
                    className={`flex items-center justify-between p-4 rounded-md cursor-pointer ${
                      applyToAll 
                        ? 'bg-[var(--accent-muted-indigo)] border border-[var(--ring)]' 
                        : 'bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)]'
                    }`}
                    onClick={() => handleApplyToAllToggle(!applyToAll)}
                  >
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">{t('pauseAllHabitsLabel')}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">
                        {t('pauseAllHabitsDescription')}
                      </div>
                    </div>
                    <Switch
                      checked={applyToAll}
                      onCheckedChange={(e) => e.preventDefault()}
                      className="pointer-events-none"
                    />
                  </div>
                  
                  {/* Список привычек */}
                  <div>
                    <div className="flex items-center justify-between">
                      <Modal.FieldTitle className="!mb-0">
                        {t('selectHabitsLabel')}
                      </Modal.FieldTitle>
                      {!applyToAll && (
                        <span className="text-xs text-[var(--text-tertiary)]">
                          {selectedHabitIds.length} {t('selectedCount')}
                        </span>
                      )}
                    </div>
                    
                    {!applyToAll && habits.filter(h => !h.isArchived).length > 0 && (
                      <div className="m-[0px]">
                        <button
                          type="button"
                          onClick={handleToggleAllHabits}
                          className="text-xs text-[var(--accent-secondary-indigo)] hover:text-[var(--accent-secondary-indigo)] transition-colors cursor-pointer"
                        >
                          {selectedHabitIds.length === habits.filter(h => !h.isArchived).length 
                            ? t('deselectAll') 
                            : t('selectAll')}
                        </button>
                      </div>
                    )}
                    
                    <div className="mt-2 rounded-md overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)]">{habits.filter(h => !h.isArchived).map((habit, index) => {
                      // Получаем компонент иконки из ICON_MAP
                      const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;
                      
                      return (
                      <div
                        key={habit.id}
                        className={index !== habits.filter(h => !h.isArchived).length - 1 ? 'border-b border-[var(--border-tertiary)]' : ''}
                      >
                        <div
                          onClick={() => !applyToAll && handleHabitToggle(habit.id)}
                          className={`flex items-center gap-2 px-3 h-12 w-full transition-colors ${
                            !applyToAll ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <Checkbox
                            checked={applyToAll || selectedHabitIds.includes(habit.id)}
                            disabled={applyToAll}
                            className="pointer-events-none size-5 data-[state=unchecked]:!bg-[var(--bg-secondary)]"
                          />
                          
                          <div className="w-8 h-8 rounded-md flex items-center justify-center">
                            <IconComponent className="size-4" strokeWidth={1.5} />
                          </div>
                          
                          <span className="text-sm flex-1">{habit.name}</span>
                        </div>
                      </div>
                      );
                    })}
                    
                    {habits.filter(h => !h.isArchived).length === 0 && (
                      <div className="p-6 text-center text-sm text-[var(--text-tertiary)]">
                        {t('noHabitsAvailable')}
                      </div>
                    )}
                  </div>
                  </div>
                  
                  {/* Ошибка */}
                  {error && (
                    <div className="text-sm text-[var(--status-error)]">
                      {error}
                    </div>
                  )}
                </div>
              </Modal.Content>
              
              <Modal.Footer>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleBack}>
                    {t('cancelButton')}
                  </Button>
                  <Button onClick={handleSave} disabled={!isFormValid}>
                    {editingPeriodId ? t('saveButton') : t('createButton')}
                  </Button>
                </div>
              </Modal.Footer>
            </>
          )}
        </Modal.Container>
      </Modal.Root>
    </>
  );
}
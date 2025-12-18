/**
 * 🎯 UnitPicker — Универсальный picker единиц измерения с поиском и группировкой
 * 
 * Компонент выбора единицы измерения с поиском и группировкой по категориям.
 * Построен на базе shadcn/ui Popover + Command + Accordion для удобного UX.
 * 
 * ВАЖНО: Компонент полностью универсальный - группы единиц передаются через props.
 * Каждый модуль (habit-tracker, finance-tracker и т.д.) собирает свой конфиг
 * из атомарных констант в /shared/constants/units.ts
 * 
 * ОСНОВНЫЕ ВОЗМОЖНОСТИ:
 * ✅ Универсальность - любые единицы через groups prop
 * ✅ Поиск по названию единицы (combobox-стиль)
 * ✅ Группировка с Accordion (можно сворачивать/разворачивать)
 * ✅ Автоматическое раскрытие группы при поиске
 * ✅ Встроенная accessibility (ARIA из Radix)
 * ✅ Клавиатурная навигация (стрелки, Enter, Esc)
 * ✅ Минималистичный дизайн (Jony Ive style)
 * 
 * @example
 * ```tsx
 * import { UnitPicker } from '@/shared/ui/unit-picker';
 * // Примечание: группы единиц передаются из верхних слоёв (entities/features)
 * // Пример: импорт HABIT_UNIT_GROUPS из entities/habit для использования в фичах
 * 
 * const [unit, setUnit] = useState('');
 * 
 * <UnitPicker
 *   value={unit}
 *   onChange={setUnit}
 *   groups={unitGroups} // передаётся из верхнего слоя
 *   placeholder="Выберите единицу"
 * />
 * ```
 * 
 * @module shared/ui/unit-picker
 * @created 29 ноября 2025
 * @updated 2 декабря 2025 (добавлена локализация placeholder)
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Search } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/components/ui/utils';
import type { UnitPickerProps } from './UnitPicker.types';

/**
 * UnitPicker - универсальный компонент выбора единицы измерения
 * 
 * Принимает группы единиц через props, что делает его полностью универсальным
 * и переиспользуемым в разных модулях с разными наборами единиц.
 */
export function UnitPicker({
  value,
  onChange,
  groups,
  placeholder,
  className,
  disabled = false,
}: UnitPickerProps) {
  const { t } = useTranslation('ui');
  
  // Используем переведенный плейсхолдер если не передан явно
  const finalPlaceholder = placeholder ?? t('ui.selectUnit');
  
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  /**
   * Фильтрация групп по поисковому запросу
   */
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;

    const searchLower = search.toLowerCase().trim();
    
    return groups
      .map((group) => ({
        ...group,
        units: group.units.filter((unit) =>
          unit.toLowerCase().includes(searchLower)
        ),
      }))
      .filter((group) => group.units.length > 0);
  }, [groups, search]);

  /**
   * Определяем, какие группы раскрыть по умолчанию
   * Если есть поиск - раскрываем все найденные группы
   */
  const defaultOpenGroups = useMemo(() => {
    if (!search.trim()) return undefined;
    return filteredGroups.map((g) => g.label);
  }, [filteredGroups, search]);

  /**
   * Обработка выбора единицы
   */
  const handleSelect = (unit: string) => {
    onChange(unit);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md border border-border-default bg-bg-primary px-3 py-2 text-base md:text-sm',
            'hover:border-border-focus transition-colors outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'h-9 cursor-pointer',
            !value && 'text-text-tertiary',
            className
          )}
        >
          <span className="truncate">{value || finalPlaceholder}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        {/* Поле поиска */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            variant="borderless"
            placeholder={t('ui.searchUnits')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-0"
          />
        </div>

        {/* Список с группировкой */}
        <div className="h-[280px] overflow-y-auto p-1">
          {filteredGroups.length === 0 ? (
            <div className="py-6 text-center text-sm text-text-tertiary">
              {t('ui.noResults')}
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={defaultOpenGroups}
              key={search} // Пересоздаём при изменении поиска для обновления defaultValue
              className="space-y-0"
            >
              {filteredGroups.map((group) => (
                <AccordionItem
                  key={group.label}
                  value={group.label}
                  className="border-0"
                >
                  <AccordionTrigger className="py-2 px-2 hover:no-underline hover:bg-bg-hover rounded-md text-sm font-medium">
                    {group.label}
                  </AccordionTrigger>
                  
                  <AccordionContent className="pb-1 pt-0">
                    <div className="space-y-0.5 pl-2">
                      {group.units.map((unit) => (
                        <button
                          key={unit}
                          onClick={() => handleSelect(unit)}
                          className={cn(
                            'w-full flex items-center rounded-md px-2 py-1.5 text-sm outline-none',
                            'hover:bg-bg-hover hover:text-text-primary',
                            'focus:bg-bg-hover focus:text-text-primary',
                            'transition-colors cursor-pointer',
                            value === unit && 'bg-bg-hover'
                          )}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === unit ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {unit}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

UnitPicker.displayName = 'UnitPicker';
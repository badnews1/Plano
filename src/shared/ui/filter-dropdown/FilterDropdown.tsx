/**
 * FilterDropdown - generic dropdown компонент для фильтрации
 * 
 * @description
 * Универсальный "глупый" компонент для фильтрации любых данных.
 * Не зависит от конкретных entity (Habit, Task, и т.д.)
 * 
 * Особенности:
 * - Иконка фильтра с индикатором активных фильтров
 * - Dropdown панель с настраиваемыми секциями
 * - Аккордеон секций (на базе shadcn/ui Accordion)
 * - Кнопка "Сбросить" для очистки фильтров
 * - Автозакрытие при клике вне области
 * 
 * @module shared/ui/filter-dropdown
 * @created 29 ноября 2025 - рефакторинг на generic компонент
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label, aria-expanded, role)
 * @updated 18 декабря 2025 - удалены антипаттерны onMouseEnter/onMouseLeave, hover-эффекты переведены на CSS
 */

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterDropdownConfig } from '@/shared/types';
import { Filter, RotateCcw } from '@/shared/assets/icons/system';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutside';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FilterDropdownProps extends FilterDropdownConfig {
  /** Дополнительные CSS классы */
  className?: string;
}

/**
 * Generic dropdown компонент для фильтрации
 * 
 * @example
 * ```tsx
 * const sections: FilterSection[] = [
 *   {
 *     id: 'tags',
 *     title: 'Теги',
 *     options: [
 *       { id: 'sport', label: 'Спорт', checked: true, count: 5, onChange: () => {} },
 *       { id: 'health', label: 'Здоровье', checked: false, count: 3, onChange: () => {} }
 *     ]
 *   }
 * ];
 * 
 * <FilterDropdown
 *   sections={sections}
 *   hasActiveFilters={true}
 *   onClearAll={() => {}}
 *   isOpen={isOpen}
 *   onToggleOpen={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export function FilterDropdown({
  sections,
  hasActiveFilters,
  onClearAll,
  isOpen,
  onToggleOpen,
  className = '',
}: FilterDropdownProps) {
  const { t } = useTranslation('ui');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его области
  useClickOutside(dropdownRef, () => {
    if (isOpen) onToggleOpen();
  });

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка фильтра */}
      <Button
        onClick={onToggleOpen}
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-md"
        aria-label={t('ui.filter')}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={t('ui.filter')}
      >
        <Filter className="w-3.5 h-3.5" aria-hidden="true" />
        {/* Индикатор активных фильтров */}
        {hasActiveFilters && (
          <span 
            className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent-primary rounded-full"
            aria-label="Активные фильтры"
          />
        )}
      </Button>

      {/* Dropdown панель */}
      {isOpen && (
        <div 
          className="absolute mt-2 w-[300px] rounded-md shadow-lg border flex flex-col max-h-[60vh] overflow-hidden"
          style={{ 
            backgroundColor: 'var(--popover)',
            borderColor: 'var(--border-secondary)',
            zIndex: 'var(--z-dropdown)'
          }}
          role="dialog"
          aria-label="Фильтры привычек"
        >
          {/* Header с кнопкой "Сбросить" */}
          <div 
            className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
            style={{ borderColor: 'var(--border-secondary)' }}
          >
            <span className="font-medium text-sm">{t('ui.filter')}</span>
            {hasActiveFilters && (
              <Button
                onClick={onClearAll}
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label={t('ui.reset')}
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </Button>
            )}
          </div>

          {/* Accordion секции фильтров */}
          <Accordion type="multiple" className="w-full overflow-y-auto flex-1">
            {sections.map((section, index) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className={index > 0 ? 'border-t border-b-0' : 'border-b-0'}
                style={index > 0 ? { borderColor: 'var(--border-secondary)' } : undefined}
              >
                <AccordionTrigger 
                  className="px-4 py-3 text-xs font-medium uppercase tracking-wide hover:no-underline hover:bg-bg-tertiary transition-colors"
                  style={{ 
                    color: 'var(--text-secondary)',
                  }}
                >
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-0 pb-2">
                  {section.options.length > 0 ? (
                    section.options.map((option) => (
                      <Label
                        key={option.id}
                        htmlFor={`filter-${section.id}-${option.id}`}
                        className="px-4 py-2 cursor-pointer hover:bg-bg-tertiary transition-colors gap-2"
                      >
                        <Checkbox
                          id={`filter-${section.id}-${option.id}`}
                          checked={option.checked}
                          onCheckedChange={option.onChange}
                          aria-label={`${option.label}${option.count !== undefined ? `, ${option.count} привычек` : ''}`}
                        />
                        <span 
                          className="text-sm" 
                          style={{ color: 'var(--text-primary)' }}
                          aria-hidden="true"
                        >
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span 
                            className="text-xs" 
                            style={{ color: 'var(--text-secondary)' }}
                            aria-hidden="true"
                          >
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    ))
                  ) : (
                    <div 
                      className="px-4 py-2 text-sm text-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('ui.noResults')}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
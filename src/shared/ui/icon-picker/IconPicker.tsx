/**
 * IconPicker - компонент выбора иконки с опциональным поиском и скроллом
 */

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Search } from '@/shared/assets/icons/system';
import { Target } from '@/shared/assets/icons/content';

import type { IconPickerProps } from './IconPicker.types';

export function IconPicker({
  value,
  onChange,
  iconOptions,
  iconMap,
  defaultIcon,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  children,
  className = '',
  showSearch = true,
  ariaLabel = 'Select Icon',
}: IconPickerProps) {
  const { t } = useTranslation('ui');
  
  // ============================================
  // STATE
  // ============================================
  
  const [searchQuery, setSearchQuery] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Используем controlled или uncontrolled состояние
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  // ============================================
  // EFFECTS
  // ============================================

  // Автофокус на поисковый input при открытии (только если поиск включен)
  useEffect(() => {
    if (isOpen && showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, showSearch]);

  // Сброс поиска при закрытии
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // ============================================
  // COMPUTED
  // ============================================

  // Фильтрация иконок по поисковому запросу
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return iconOptions;
    }
    
    const query = searchQuery.toLowerCase();
    return iconOptions.filter((icon) => {
      return icon.label.toLowerCase().includes(query) ||
             icon.key.toLowerCase().includes(query);
    });
  }, [searchQuery, iconOptions]);

  // Получение компонента выбранной иконки
  const SelectedIconComponent = iconMap[value] || defaultIcon || Target;

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectIcon = (iconKey: string) => {
    onChange(iconKey);
    // Закрываем popover после выбора
    setIsOpen(false);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children || (
          <Button
            variant="tertiary"
            size="icon"
            className={`w-12 h-12 rounded-md ${className}`}
            aria-label={t('ui.selectIcon')}
          >
            <SelectedIconComponent className="size-[23px]" strokeWidth={1.5} />
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent 
        className="p-3 w-64"
        align="start"
        sideOffset={8}
      >
        {/* Поиск */}
        {showSearch && (
          <div className="mb-3 relative">
            <Search 
              className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none z-10"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <Input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('ui.searchIcons')}
              className="pl-8"
              aria-label={t('ui.searchIcons')}
            />
          </div>
        )}

        {/* Сетка иконок с скроллом - 4 ряда видимых (как в ColorPicker) */}
        <div className="grid grid-cols-5 gap-2 max-h-[152px] overflow-y-auto">
          {filteredIcons.length > 0 ? (
            filteredIcons.map((iconOption) => {
              const Icon = iconOption.Icon;
              const isSelected = value === iconOption.key;
              
              return (
                <Button
                  key={iconOption.key}
                  type="button"
                  onClick={() => handleSelectIcon(iconOption.key)}
                  variant={isSelected ? 'default' : 'outline'}
                  size="icon"
                  title={iconOption.label}
                  aria-label={iconOption.label}
                  aria-pressed={isSelected}
                >
                  <Icon className="w-5 h-5" />
                </Button>
              );
            })
          ) : (
            <div 
              className="col-span-5 text-center text-sm py-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('ui.iconsNotFound')}
            </div>
          )}
        </div>

        {/* Счетчик результатов (если есть поиск) */}
        {searchQuery && (
          <div 
            className="text-xs mt-2 text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t('ui.found')}: {filteredIcons.length}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
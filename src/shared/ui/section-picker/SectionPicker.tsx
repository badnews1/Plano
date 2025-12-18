/**
 * 🎨 SectionPicker — Универсальный пикер разделов с поиском
 * 
 * Полностью глупый UI компонент для выбора, добавления и удаления разделов.
 * Построен на Radix Popover с поиском и фиксированной высотой.
 * 
 * ПРЕИМУЩЕСТВА:
 * ✅ Нет domain-логики (хардкода "Другие")
 * ✅ Callback `canDelete` вместо хардкода
 * ✅ Родитель решает что делать при удалении
 * ✅ Использует Popover (Radix) для позиционирования
 * ✅ Поиск по разделам для быстрого доступа
 * ✅ Фиксированная высота списка
 * ✅ Не зависит от entities (FSD-совместимый)
 * 
 * @example
 * ```tsx
 * <SectionPicker
 *   sections={['Утро', 'День', 'Вечер', 'Другие']}
 *   selectedSection={section}
 *   onSelectSection={setSection}
 *   onAddSection={(name) => setSections([...sections, name])}
 *   onDeleteSection={(name) => setSections(sections.filter(s => s !== name))}
 *   canDelete={(section) => section !== 'Другие'}
 *   getUsageCount={(section) => habits.filter(h => h.section === section).length}
 *   renderSectionName={(name) => t(`sections:${name}`)}
 * />
 * ```
 * 
 * @module shared/ui/section-picker
 * @created 28 ноября 2025
 * @updated 2 декабря 2025 - удалена зависимость от entities (FSD fix)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Plus, X, AlertCircle, Search, Trash2 } from '@/shared/assets/icons/system';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/shared/ui/color-picker';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import type { ColorVariant } from '@/shared/constants/colors';
import { cn } from '@/components/ui/utils';
import type { SectionPickerProps } from './SectionPicker.types';

/**
 * Универсальный пикер разделов
 */
export function SectionPicker({
  sections,
  selectedSection,
  onSelectSection,
  onAddSection,
  onUpdateSectionColor,
  onDeleteSection,
  canDelete = () => true,
  getUsageCount,
  formatDeleteMessage,
  placeholder = 'Выберите раздел',
  addButtonText = 'Добавить',
  inputPlaceholder = 'Название раздела...',
  maxLength = TEXT_LENGTH_LIMITS.tagName.max,
  open,
  onOpenChange,
  renderSectionName,
}: SectionPickerProps) {
  const { t } = useTranslation('ui');
  const { t: tCommon } = useTranslation('common');
  
  // Функция для отображения имени раздела (переданная или дефолтная)
  const displaySectionName = (name: string) => {
    return renderSectionName ? renderSectionName(name) : name;
  };
  
  // Локальное состояние для поиска
  const [search, setSearch] = useState('');
  
  // Локальное состояние для формы добавления
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState('');
  const [newSectionColor, setNewSectionColor] = useState<ColorVariant>('gray');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const newSectionInputRef = useRef<HTMLInputElement>(null);
  
  // Состояние для удаления
  const [deletingSection, setDeletingSection] = useState<{
    name: string;
    usageCount?: number;
  } | null>(null);

  // Автофокус на input при открытии формы добавления
  useEffect(() => {
    if (isAdding && newSectionInputRef.current) {
      setTimeout(() => {
        newSectionInputRef.current?.focus();
      }, 0);
    }
  }, [isAdding]);

  // Сбрасываем состояние при закрытии popover
  useEffect(() => {
    if (!open) {
      setIsAdding(false);
      setNewSection('');
      setNewSectionColor('gray');
      setIsColorPickerOpen(false);
      setSearch('');
    }
  }, [open]);

  // Фильтрация разделов по поиску
  const filteredSections = sections.filter(section =>
    section.name.toLowerCase().includes(search.toLowerCase())
  );

  // Валидация: нормализация и проверка дубликатов
  const normalized = newSection.trim().replace(/\s+/g, ' ');
  const alreadyExists = normalized && sections.some(
    s => s.name.toLowerCase() === normalized.toLowerCase()
  );

  // Добавить раздел
  const handleAdd = () => {
    if (!normalized || alreadyExists) return;
    
    onAddSection(normalized, newSectionColor);
    setNewSection('');
    setNewSectionColor('gray');
    setIsColorPickerOpen(false);
    setIsAdding(false);
  };

  // Обработка выбора раздела
  const handleSelectSection = (sectionName: string) => {
    onSelectSection(sectionName);
    onOpenChange?.(false);
  };

  // Удалить раздел (с подтверждением)
  const handleDeleteClick = (e: React.MouseEvent, sectionName: string) => {
    e.stopPropagation();
    
    // Проверяем можно ли удалить
    if (!canDelete(sectionName)) return;
    
    const usageCount = getUsageCount?.(sectionName);
    setDeletingSection({ name: sectionName, usageCount });
  };

  const confirmDelete = () => {
    if (!deletingSection) return;
    onDeleteSection(deletingSection.name);
    setDeletingSection(null);
  };
  
  // Защита: если sections не массив или пустой, не рендерим ничего
  if (!Array.isArray(sections) || sections.length === 0) {
    return (
      <Button
        variant="outline"
        role="combobox"
        className="w-full justify-between text-text-tertiary"
        disabled
      >
        {placeholder}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <div
            role="combobox"
            aria-expanded={open}
            tabIndex={0}
            className={cn(
              // Базовые стили как у Input/Select
              'flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm',
              // Интерактивные стили
              'cursor-pointer transition-colors outline-none',
              'hover:border-border-focus focus-visible:border-border-focus',
              // Стили для иконок (как в Select)
              '[&_svg:not([class*=\'text-\'])]:text-text-tertiary [&_svg]:pointer-events-none [&_svg]:shrink-0',
              // Placeholder стиль
              !selectedSection && 'text-text-tertiary'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenChange?.(!open);
              }
            }}
          >
            {selectedSection ? displaySectionName(selectedSection) : placeholder}
            <ChevronDown className="ml-2 h-4 w-4" />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          {/* Поле поиска */}
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              variant="borderless"
              placeholder={t('ui.searchSections')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-0"
            />
          </div>

          {!isAdding ? (
            <>
              {/* Список разделов */}
              <div className="h-[200px] overflow-y-auto p-1">
                {filteredSections.length === 0 ? (
                  <div className="py-6 text-center text-sm text-text-tertiary">
                    {t('ui.noResults')}
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filteredSections.map((section) => {
                      const isSelected = selectedSection === section.name;
                      const isDeletable = canDelete(section.name);
                      
                      return (
                        <div
                          key={section.name}
                          className={cn(
                            'group flex items-center justify-between rounded-sm px-2 py-1.5 text-sm cursor-pointer',
                            'hover:bg-bg-hover hover:text-text-primary',
                            'transition-colors',
                            isSelected && 'bg-bg-hover'
                          )}
                          onClick={() => handleSelectSection(section.name)}
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {/* Цветной индикатор */}
                            <div
                              className="w-3 h-3 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: `var(--palette-${section.color}-bg)` }}
                            />
                            <span className="flex-1">{displaySectionName(section.name)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Кнопка удаления */}
                            {isDeletable && (
                              <button
                                onClick={(e) => handleDeleteClick(e, section.name)}
                                className="p-1 hover:bg-destructive/10 rounded-sm"
                                title={t('ui.deleteSection')}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-destructive" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {/* Кнопка добавления */}
              <div className="border-t p-1">
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-text-tertiary hover:bg-bg-hover hover:text-text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('ui.addSection')}</span>
                </button>
              </div>
            </>
          ) : (
            /* Форма добавления */
            <div className="p-3 space-y-3">
              <div className="flex gap-2 items-start">
                <Input
                  ref={newSectionInputRef}
                  type="text"
                  value={newSection}
                  autoFocus
                  onChange={(e) => setNewSection(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd();
                    }
                    if (e.key === 'Escape') {
                      setNewSection('');
                      setNewSectionColor('gray');
                      setIsColorPickerOpen(false);
                      setIsAdding(false);
                    }
                  }}
                  placeholder={inputPlaceholder}
                  maxLength={10}
                  className="flex-1"
                />
                
                {/* ColorPicker */}
                <ColorPicker
                  value={newSectionColor}
                  onChange={setNewSectionColor}
                  open={isColorPickerOpen}
                  onOpenChange={setIsColorPickerOpen}
                >
                  <button
                    type="button"
                    className="w-9 h-9 rounded border-2 border-border-default hover:border-border-hover transition-colors flex-shrink-0"
                    style={{ backgroundColor: `var(--palette-${newSectionColor}-bg)` }}
                    title={t('ui.selectColor')}
                  />
                </ColorPicker>
                
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleAdd}
                  disabled={!newSection.trim() || alreadyExists}
                  className="text-sm"
                  type="button"
                >
                  {addButtonText}
                </Button>
              </div>

              {/* Сообщение об ошибке */}
              {alreadyExists && (
                <div className="flex items-start gap-1.5 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{t('ui.sectionAlreadyExists')}</span>
                </div>
              )}

              {/* Кнопка отмены */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setNewSection('');
                    setNewSectionColor('gray');
                    setIsColorPickerOpen(false);
                    setIsAdding(false);
                  }}
                  className="text-xs text-text-tertiary hover:text-text-primary transition-colors"
                >
                  {t('ui.cancel')}
                </button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* AlertDialog для подтверждения удаления */}
      <AlertDialog open={!!deletingSection} onOpenChange={(open) => !open && setDeletingSection(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('ui.deleteConfirmation')}
            </AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {deletingSection && (
                formatDeleteMessage 
                  ? formatDeleteMessage(deletingSection.name, deletingSection.usageCount)
                  : `${t('ui.deleteSection')} "${displaySectionName(deletingSection.name)}"?`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingSection(null)}>
              {tCommon('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {tCommon('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
/**
 * 🏷️ TagPicker — Современный tag picker на Radix UI Popover
 * 
 * TagPicker на основе проверенных примитивов:
 * - Popover (Radix UI) - позиционирование, portal, click outside
 * - ToggleChip - универсальные чипсы с Toggle + 20 цветов
 * - TagPickerTrigger - триггер с Badge для отображения выбранных тегов
 * - ColorPicker - выбор цвета с CSS переменными
 * 
 * ПРЕИМУЩЕСТВА:
 * ✅ ~300 строк меньше кода (используем Radix Popover)
 * ✅ Автоматическое позиционирование (collision detection)
 * ✅ Лучшая accessibility (ARIA из Radix)
 * ✅ Сохранён grid-layout для цветных тегов
 * ✅ Multi-select, ColorPicker, AlertDialog
 * ✅ Глупый UI компонент для триггера (TagPickerTrigger)
 * ✅ CSS переменные для цветов (единый формат с Badge)
 * 
 * @example
 * ```tsx
 * import { TagPicker, TagPickerTrigger } from '@/entities/tag';
 * 
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <TagPicker
 *   selectedTags={habit.tags}
 *   onSelectTags={(tags) => updateHabit({ tags })}
 *   tags={allTags}
 *   onAddTag={addTag}
 *   onDeleteTag={deleteTag}
 *   getTagUsageCount={(tag) => habits.filter(h => h.tags.includes(tag)).length}
 *   placeholder="Без тега"
 *   deleteMessageSingular="привычке"
 *   deleteMessagePlural="привычках"
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <TagPickerTrigger
 *     selectedTags={habit.tags}
 *     allTags={allTags}
 *     placeholder="Без тега"
 *     isOpen={isOpen}
 *   />
 * </TagPicker>
 * ```
 * 
 * @module entities/tag/ui/TagPicker
 * @created 28 ноября 2025
 * @migrated 30 ноября 2025 - перенос из features/tag-picker в entities/tag
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslatedTagName } from '@/entities/tag/lib/useTranslatedTagName';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
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
import { ColorPicker } from '@/shared/ui/color-picker';
import { ToggleChip } from '@/shared/ui/toggle-chip';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import type { ColorVariant } from '@/shared/constants/colors';
import { Tag, Plus, XIcon, AlertCircle } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TagPickerProps, BaseTag } from './TagPicker.types';

/**
 * TagPicker - компонент выбора тегов с grid-layout
 */
export function TagPicker<T extends BaseTag = BaseTag>({
  selectedTags,
  onSelectTags,
  tags,
  onAddTag,
  onDeleteTag,
  getTagUsageCount,
  placeholder = 'Без тега',
  deleteMessageSingular = 'элементе',
  deleteMessagePlural = 'элементах',
  open,
  onOpenChange,
  children,
}: TagPickerProps<T>) {
  const { t } = useTranslation('tags');
  const { t: tCommon } = useTranslation('common');
  const getTranslatedTagName = useTranslatedTagName();
  
  // ============================================
  // STATE
  // ============================================
  
  const newTagInputRef = useRef<HTMLInputElement>(null);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newTagColor, setNewTagColor] = useState<ColorVariant>('gray');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [deletingTag, setDeletingTag] = useState<{ name: string; usageCount: number } | null>(null);

  // Логируем пропсы при каждом рендере
  console.log('🏷️ TagPicker рендер', {
    tagsCount: tags?.length || 0,
    tags: tags?.map(t => t.name) || [],
    selectedTags,
    isOpen: open,
  });

  // ============================================
  // EFFECTS
  // ============================================

  // Автофокус на input при открытии формы добавления тега
  useEffect(() => {
    if (isAddingTag && newTagInputRef.current) {
      setTimeout(() => {
        newTagInputRef.current?.focus();
      }, 0);
    }
  }, [isAddingTag]);

  // Сброс состояния при закрытии popover
  useEffect(() => {
    if (!open) {
      setIsAddingTag(false);
      setNewTag('');
      setNewTagColor('gray');
      setIsColorPickerOpen(false);
    }
  }, [open]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleAddTag = () => {
    // Нормализуем пробелы: множественные пробелы → один
    const normalized = newTag.trim().replace(/\s+/g, ' ');
    
    // Проверка дубликата с нормализованным значением
    const alreadyExists = tags && Array.isArray(tags) && tags.some(
      tag => tag.name.trim().toLowerCase() === normalized.toLowerCase()
    );
    
    if (!normalized || alreadyExists) {
      return;
    }
    
    onAddTag(normalized, newTagColor);
    
    // Автоматически добавляем новый тег в выбранные
    onSelectTags([...selectedTags, normalized]);
    
    setNewTag('');
    setNewTagColor('gray');
    setIsColorPickerOpen(false);
    setIsAddingTag(false);
  };

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      // Убираем тег из выбранных
      onSelectTags(selectedTags.filter(t => t !== tagName));
    } else {
      // Добавляем тег к выбранным
      onSelectTags([...selectedTags, tagName]);
    }
  };

  const handleClearAll = () => {
    onSelectTags([]);
  };

  const handleDeleteTag = (tagName: string) => {
    const usageCount = getTagUsageCount(tagName);
    setDeletingTag({ name: tagName, usageCount });
  };

  const confirmDeleteTag = () => {
    if (!deletingTag) return;
    
    onDeleteTag(deletingTag.name);
    // Если это был выбранный тег, убрать из выбранных
    if (selectedTags.includes(deletingTag.name)) {
      onSelectTags(selectedTags.filter(tag => tag !== deletingTag.name));
    }
    setDeletingTag(null);
  };

  // ============================================
  // VALIDATION
  // ============================================

  // Проверяем, существует ли уже тег с таким именем (case-insensitive, trim-aware, нормализованные пробелы)
  const normalized = newTag.trim().replace(/\s+/g, ' ');
  const tagAlreadyExists = normalized && tags && Array.isArray(tags) && tags.some(
    tag => tag.name.trim().toLowerCase() === normalized.toLowerCase()
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        
        <PopoverContent 
          className="p-3 w-[--radix-popover-trigger-width] min-w-[300px] max-w-[500px]"
          align="start"
          sideOffset={8}
        >
          {/* Подсказка */}
          <div className="text-xs text-text-secondary mb-2">
            <span>{t('tags.selectOneOrMore')}</span>
          </div>

          {/* Сетка тегов в виде кнопок */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Кнопка "Без тега" - всегда первая */}
            <button
              onClick={handleClearAll}
              className={
                selectedTags.length === 0 
                  ? 'px-2 py-1 text-xs rounded border bg-bg-disabled text-text-primary border-border-hover cursor-default' 
                  : 'px-2 py-1 text-xs rounded border bg-bg-disabled text-text-secondary border-border-default cursor-pointer'
              }
            >
              {placeholder}
            </button>
            
            {/* Существующие теги */}
            {tags && Array.isArray(tags) && tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.name);
              const displayName = getTranslatedTagName(tag.name);
              return (
                <ToggleChip
                  key={tag.name}
                  label={displayName}
                  variant={tag.color}
                  pressed={isSelected}
                  onPressedChange={() => handleToggleTag(tag.name)}
                  onDelete={() => handleDeleteTag(tag.name)}
                  icon={<Tag className="w-3 h-3" />}
                  className={isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-80 hover:shadow-sm'}
                />
              );
            })}
            
            {/* Кнопка добавления тега */}
            <Button
              variant="outline"
              size="tag"
              onClick={() => setIsAddingTag(!isAddingTag)}
              title={t('tags.addTag')}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {/* Форма добавления нового тега */}
          {isAddingTag && (
            <div className="space-y-2">
              <div className="flex gap-1 items-center">
                <ColorPicker
                  value={newTagColor}
                  onChange={setNewTagColor}
                  open={isColorPickerOpen}
                  onOpenChange={setIsColorPickerOpen}
                />
                <div className="flex-1">
                  <Input
                    ref={newTagInputRef}
                    type="text"
                    value={newTag}
                    autoFocus
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTag();
                      } else if (e.key === 'Escape') {
                        setNewTag('');
                        setNewTagColor('gray');
                        setIsColorPickerOpen(false);
                        setIsAddingTag(false);
                      }
                    }}
                    placeholder={t('tags.newTag')}
                    maxLength={TEXT_LENGTH_LIMITS.tagName.max}
                    showCharCount
                  />
                </div>
                <Button
                  variant="default"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || tagAlreadyExists}
                  className="text-sm !py-2 px-4"
                >
                  {tCommon('common.add')}
                </Button>
              </div>
              
              {/* Визуальное предупреждение о дубликате */}
              {tagAlreadyExists && (
                <p className="text-xs text-status-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {t('tags.tagAlreadyExists')}
                </p>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* AlertDialog для подтверждения удаления */}
      <AlertDialog open={!!deletingTag} onOpenChange={(open) => !open && setDeletingTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tags.deleteTagConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingTag && (
                <>
                  {t('tags.tagUsedIn')} <strong>"{getTranslatedTagName(deletingTag.name)}"</strong> {t('tags.isUsedIn')}{' '}
                  <strong>{deletingTag.usageCount}</strong>{' '}
                  {deletingTag.usageCount === 1
                    ? deleteMessageSingular
                    : deleteMessagePlural}.
                  {deletingTag.usageCount > 0 && (
                    <span className="block mt-2 text-status-warning">
                      {t('tags.willBeRemoved')}
                    </span>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTag}>
              {tCommon('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
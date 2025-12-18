/**
 * Выбор тегов через кнопки (новый дизайн)
 * 
 * @description
 * - Триггер показывает выбранные теги
 * - При раскрытии - кнопки для выбора/отмены
 * - Hover на теге показывает кнопку удаления тега
 * - Кнопка "+" для добавления нового тега
 * - Inline форма добавления с выбором цвета
 * 
 * @module entities/tag/ui/TagButtonsSelector
 * @created 8 декабря 2025
 * @updated 10 декабря 2025 - добавлена форма создания тега
 * @updated 18 декабря 2025 - исправлен magic number maxLength (хардкод 25 → TEXT_LENGTH_LIMITS.tagName.max)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Plus, X } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Modal } from '@/shared/ui/modal';
import { useTranslatedTagName } from '@/entities/tag';
import type { BaseTag } from '@/entities/tag';
import type { ColorVariant } from '@/shared/constants/colors';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants/validation';

interface TagButtonsSelectorProps {
  tags: BaseTag[];
  selectedTags: string[];
  onSelectTags: (tags: string[]) => void;
  onAddTag: (name: string, color: string) => void;
  onDeleteTag: (name: string) => void;
  getTagUsageCount: (tagName: string) => number;
}

export const TagButtonsSelector: React.FC<TagButtonsSelectorProps> = ({
  tags,
  selectedTags,
  onSelectTags,
  onAddTag,
  onDeleteTag,
  getTagUsageCount,
}) => {
  const { t } = useTranslation('habits');
  const getTranslatedTagName = useTranslatedTagName();
  
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<ColorVariant>('indigo');
  const [showNewTagColorPicker, setShowNewTagColorPicker] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Автофокус на инпуте при открытии формы добавления
  useEffect(() => {
    if (showAddTag && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddTag]);
  
  // Обработка ESC для закрытия панели выбора тегов
  useEffect(() => {
    if (!showTagPicker) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Останавливаем всплытие события, чтобы не закрывать родительские модалки
        e.stopPropagation();
        setShowTagPicker(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showTagPicker]);
  
  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onSelectTags(selectedTags.filter(t => t !== tagName));
    } else {
      onSelectTags([...selectedTags, tagName]);
    }
  };
  
  const handleAddTag = () => {
    if (newTagName.trim()) {
      onAddTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setShowAddTag(false);
    }
  };
  
  const onClose = () => {
    setShowTagPicker(false);
    setShowAddTag(false);
  };
  
  return (
    <div>
      <Modal.FieldTitle>
        {t('form.tags') || 'Tags'}
      </Modal.FieldTitle>
      
      <button
        onClick={() => setShowTagPicker(!showTagPicker)}
        className="mt-2 w-full min-h-[48px] px-3 py-2 rounded-md text-left flex items-center gap-2 flex-wrap bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)] cursor-pointer"
        aria-label={t('form.tags') || 'Tags'}
      >
        {selectedTags.length === 0 ? (
          <>
            <Tag className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-tertiary)] text-sm">
              {t('manage.filters.uncategorized') || 'Untagged'}
            </span>
          </>
        ) : (
          selectedTags.map(tagName => {
            const tag = tags.find(t => t.name === tagName);
            if (!tag) return null;
            return (
              <span 
                key={tag.name} 
                className="px-2.5 py-1 rounded-sm text-xs font-medium flex items-center gap-1.5" 
                style={{ 
                  background: `var(--palette-${tag.color}-bg)`,
                  color: `var(--palette-${tag.color}-text)`,
                  border: '1px solid transparent'
                }}
              >
                <Tag className="w-2.5 h-2.5" /> {getTranslatedTagName(tag.name)}
              </span>
            );
          })
        )}
        <svg className="ml-auto text-[var(--text-tertiary)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      
      {showTagPicker && (
        <div 
          className="mt-2 p-4 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)]"
          tabIndex={-1}
          ref={(el) => {
            if (el && !showAddTag) {
              el.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' && !showAddTag) {
              e.stopPropagation();
              onClose();
            }
          }}
        >
          <p className="text-xs text-[var(--text-tertiary)] mb-3">
            {t('tags.selectOne') || 'Select one or more tags'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectTags([])}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-all ${
                selectedTags.length === 0 
                  ? 'bg-[var(--text-secondary)] text-[var(--text-primary)]' 
                  : 'bg-[var(--text-disabled)] text-[var(--text-primary)]'
              }`}
              style={{ height: '28px' }}
              aria-label={t('manage.filters.uncategorized') || 'No tag'}
              aria-pressed={selectedTags.length === 0}
            >
              {t('manage.filters.uncategorized') || 'No tag'}
            </button>
            
            {tags.map(tag => (
              <TagButton
                key={tag.name}
                tag={tag}
                isSelected={selectedTags.includes(tag.name)}
                onToggle={() => toggleTag(tag.name)}
                onDelete={() => onDeleteTag(tag.name)}
                getTranslatedName={getTranslatedTagName}
                usageCount={getTagUsageCount(tag.name)}
              />
            ))}
            
            <Button 
              key="add-new-tag"
              type="button"
              variant="ghost" 
              size="sm" 
              className="border-dashed border border-[var(--border-tertiary)] hover:border-[var(--border-tertiary)] bg-transparent text-[var(--text-tertiary)]"
              style={{ height: '28px' }}
              onClick={() => setShowAddTag(true)}
              aria-label="Add new tag"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          
          {showAddTag && (
            <div className="mt-3 flex items-center gap-2 p-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-tertiary)]">
              <ColorPicker
                value={newTagColor}
                onChange={setNewTagColor}
                open={showNewTagColorPicker}
                onOpenChange={setShowNewTagColorPicker}
              >
                <button
                  type="button"
                  className="w-6 h-6 rounded-full flex-shrink-0 cursor-pointer"
                  style={{ backgroundColor: `var(--palette-${newTagColor}-text)` }}
                />
              </ColorPicker>
              
              <Input
                ref={inputRef}
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder={t('tags.newTag') || 'New tag'}
                variant="tertiary"
                className="flex-1 h-9"
                maxLength={TEXT_LENGTH_LIMITS.tagName.max}
                showCharCount={true}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  } else if (e.key === 'Escape') {
                    e.stopPropagation();
                    setShowAddTag(false);
                    setNewTagName('');
                  }
                }}
              />
              
              <Button
                type="button"
                size="default"
                disabled={!newTagName.trim()}
                onClick={handleAddTag}
                className="min-w-[100px]"
              >
                {t('tags.add') || 'Add'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Кнпка тега с hover для удаления
 */
interface TagButtonProps {
  tag: BaseTag;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  getTranslatedName: (name: string) => string;
  usageCount: number;
}

const TagButton: React.FC<TagButtonProps> = ({ 
  tag, 
  isSelected, 
  onToggle, 
  onDelete,
  getTranslatedName,
  usageCount
}) => {
  const { t } = useTranslation('habits');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };
  
  return (
    <>
      <span
        onClick={onToggle}
        className="group pl-4 pr-4 py-1 rounded-sm text-xs font-medium flex items-center gap-1.5 transition-all overflow-hidden relative cursor-pointer"
        style={{ 
          background: `var(--palette-${tag.color}-bg)`,
          color: `var(--palette-${tag.color}-text)`,
          border: isSelected ? `1px solid var(--palette-${tag.color}-border)` : '1px solid transparent',
          opacity: isSelected ? 1 : 0.6,
          height: '28px'
        }}
        role="button"
        tabIndex={0}
        aria-label={`${getTranslatedName(tag.name)}, ${isSelected ? 'selected' : 'not selected'}`}
        aria-pressed={isSelected}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <Tag className="w-3 h-3 transition-transform duration-200 group-hover:-translate-x-2" />
        <span className="transition-transform duration-200 group-hover:-translate-x-2">
          {getTranslatedName(tag.name)}
        </span>
        <span 
          onClick={handleDeleteClick}
          className="absolute right-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer p-0.5 hover:text-[var(--status-error)]"
          aria-label="Delete tag"
        >
          <X className="w-3 h-3" />
        </span>
      </span>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tags.deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {usageCount > 0 ? (
                // i18next автоматически выберет правильную форму (_one, _few, _many, _other) на основе count
                t('tags.deleteConfirmMessage', { count: usageCount })
              ) : (
                t('tags.deleteConfirmMessageUnused')
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
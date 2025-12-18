/**
 * Выбор раздела через кнопки (новый дизайн)
 * 
 * @description
 * Inline кнопки разделов с цветными точками
 * - Hover для удаления пользовательских разделов
 * - Клик на точку для смены цвета
 * - Кнопка "+" для добавления нового раздела
 * - Inline форма добавления
 * 
 * @module entities/habit/ui/SectionButtons
 * @created 8 декабря 2025
 * @updated 18 декабря 2025 - исправлен magic number maxLength (хардкод 25 → TEXT_LENGTH_LIMITS.tagName.max)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ColorPicker } from '@/shared/ui/color-picker';
import { useTranslatedSectionName } from '@/entities/section';
import { DEFAULT_SECTIONS_WITH_COLORS } from '@/entities/habit';
import type { Section } from '@/entities/habit';
import type { ColorVariant } from '@/shared/constants/colors';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants/validation';

interface SectionButtonsProps {
  sections: Section[];
  selectedSection: string;
  onSelectSection: (sectionName: string) => void;
  onAddSection: (name: string, color: ColorVariant) => void;
  onDeleteSection: (sectionName: string) => void;
  onUpdateSectionColor: (sectionName: string, color: ColorVariant) => void;
}

export const SectionButtons: React.FC<SectionButtonsProps> = ({
  sections,
  selectedSection,
  onSelectSection,
  onAddSection,
  onDeleteSection,
  onUpdateSectionColor,
}) => {
  const { t } = useTranslation('sections');
  const getTranslatedSectionName = useTranslatedSectionName();
  
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionColor, setNewSectionColor] = useState<ColorVariant>('indigo');
  const [colorPickerFor, setColorPickerFor] = useState<string | null>(null);
  const [showNewSectionColorPicker, setShowNewSectionColorPicker] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Автофокус на инпуте при открытии формы добавления
  useEffect(() => {
    if (showAddSection && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAddSection]);
  
  // Обработка ESC для закрытия формы добавления секции
  useEffect(() => {
    if (!showAddSection) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Останавливаем всплытие события, чтобы не закрывать родительские модалки
        e.stopPropagation();
        setShowAddSection(false);
        setNewSectionName('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showAddSection]);
  
  const isDefaultSection = (sectionName: string) => {
    return DEFAULT_SECTIONS_WITH_COLORS.some(s => s.name === sectionName);
  };
  
  const handleAddSection = () => {
    if (newSectionName.trim()) {
      onAddSection(newSectionName.trim(), newSectionColor);
      setNewSectionName('');
      setShowAddSection(false);
    }
  };
  
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sections.map(section => (
          <div key={section.name} className="relative group">
            <button
              onClick={() => onSelectSection(section.name)}
              className={`h-9 px-4 rounded-sm text-sm font-medium transition-all flex items-center gap-2 overflow-hidden cursor-pointer border ${
                selectedSection === section.name 
                  ? 'text-[var(--text-primary)]' 
                  : 'text-[var(--text-tertiary)]'
              }`}
              style={{
                backgroundColor: selectedSection === section.name 
                  ? `var(--palette-${section.color}-bg)` 
                  : 'var(--bg-tertiary)',
                borderColor: selectedSection === section.name 
                  ? `var(--palette-${section.color}-border)` 
                  : 'var(--border-tertiary)'
              }}
            >
              <ColorPicker
                value={section.color}
                onChange={(color) => {
                  onUpdateSectionColor(section.name, color);
                  setColorPickerFor(null);
                }}
                open={colorPickerFor === section.name}
                onOpenChange={(open) => {
                  setColorPickerFor(open ? section.name : null);
                }}
              >
                <span 
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 cursor-pointer" 
                  style={{ background: `var(--palette-${section.color}-text)` }}
                  onClick={(e) => { 
                    e.stopPropagation();
                  }}
                />
              </ColorPicker>
              <span className={`transition-transform duration-200 ${!isDefaultSection(section.name) ? 'group-hover:-translate-x-1' : ''}`}>
                {getTranslatedSectionName(section.name)}
              </span>
              {!isDefaultSection(section.name) && (
                <span 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDeleteSection(section.name);
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--status-error)]"
                >
                  <X className="w-3 h-3" />
                </span>
              )}
            </button>
          </div>
        ))}
        
        <Button
          variant="outline"
          size="default"
          className="border-dashed border-[var(--border-tertiary)] bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          onClick={() => setShowAddSection(!showAddSection)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>
      
      {showAddSection && (
        <div className="mt-2 flex items-center gap-2 p-3 rounded-md bg-[var(--bg-tertiary)] border border-[var(--border-tertiary)]">
          <ColorPicker
            value={newSectionColor}
            onChange={setNewSectionColor}
            open={showNewSectionColorPicker}
            onOpenChange={setShowNewSectionColorPicker}
          >
            <button
              type="button"
              className="w-6 h-6 rounded-full flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: `var(--palette-${newSectionColor}-text)` }}
            />
          </ColorPicker>
          
          <Input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder={t('newPlaceholder') || 'Section name'}
            variant="secondary"
            className="flex-1 h-9"
            maxLength={TEXT_LENGTH_LIMITS.tagName.max}
            showCharCount={true}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddSection();
              } else if (e.key === 'Escape') {
                e.stopPropagation();
                setShowAddSection(false);
                setNewSectionName('');
              }
            }}
            ref={inputRef}
          />
          <Button
            size="default"
            disabled={!newSectionName.trim()}
            onClick={handleAddSection}
            className="min-w-[100px]"
          >
            {t('add') || 'Add'}
          </Button>
        </div>
      )}
    </div>
  );
};
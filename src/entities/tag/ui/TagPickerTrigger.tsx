/**
 * 🎯 TagPickerTrigger — Умный UI компонент для триггера tag picker
 * 
 * Компонент entities слоя, который:
 * - Знает про BaseTag и его структуру (name, color)
 * - Вычисляет overflow тегов
 * - Создаёт Badge компоненты для тегов
 * - Использует OverflowTrigger из shared для визуала
 * 
 * ВАЖНО: Это entities компонент — он специфичен для сущности Tag!
 * 
 * @example
 * ```tsx
 * <TagPickerTrigger
 *   selectedTags={['Здоровье', 'Спорт']}
 *   allTags={tags}
 *   placeholder="Без тега"
 *   onClick={() => setIsOpen(true)}
 * />
 * ```
 * 
 * @module entities/tag/ui
 * @created 28 ноября 2025
 * @updated 30 ноября 2025 - упрощение структуры, вынос типов в model
 */

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { OverflowTrigger } from '@/shared/ui/overflow-trigger';
import { Badge } from '@/components/ui/badge';
import { Tag, ChevronDown } from '@/shared/assets/icons/system';
import type { BaseTag } from '../model/types';
import { useTranslatedTagName } from '../lib/useTranslatedTagName';

/**
 * Пропсы TagPickerTrigger
 */
export interface TagPickerTriggerProps {
  /** Массив имён выбранных тегов */
  selectedTags: string[];
  /** Все доступные теги (для получения цветов) */
  allTags: BaseTag[];
  /** Placeholder когда тегов нет */
  placeholder?: string;
  /** Callback клика */
  onClick?: () => void;
  /** Дополнительные классы */
  className?: string;
  /** Открыт ли попап (для стилизации) */
  isOpen?: boolean;
}

/**
 * TagPickerTrigger - кнопка-триггер с бейджами выбранных тегов
 * Использует OverflowTrigger для отображения
 */
export const TagPickerTrigger = forwardRef<HTMLButtonElement, TagPickerTriggerProps>(
  ({ selectedTags, allTags, placeholder = 'Без тега', onClick, className, isOpen }, ref) => {
    const [visibleTags, setVisibleTags] = useState<number>(selectedTags.length || 0);
    const containerRef = useRef<HTMLDivElement>(null);
    const getTranslatedTagName = useTranslatedTagName();

    // Получить выбранные теги с их цветами
    const selectedTagObjects = allTags && Array.isArray(allTags)
      ? selectedTags
          .map(tagName => allTags.find(tag => tag.name === tagName))
          .filter(Boolean) as BaseTag[]
      : [];

    // Вычисляем сколько тегов помещается
    useEffect(() => {
      const tagsLength = selectedTags.length || 0;
      if (!containerRef.current || tagsLength === 0) {
        setVisibleTags(tagsLength);
        return;
      }

      // Простая эвристика: считаем что тег занимает примерно 80px
      const availableWidth = containerRef.current.offsetWidth - 60; // 60px для ChevronDown и отступов
      const tagWidth = 80; // примерная ширина одного тега
      const maxTags = Math.max(1, Math.floor(availableWidth / tagWidth));
      
      setVisibleTags(Math.min(maxTags, tagsLength));
    }, [selectedTags, containerRef.current?.offsetWidth]);

    // Вычисляем overflow
    const overflowCount = selectedTags.length - visibleTags;
    const displayTags = selectedTagObjects.slice(0, visibleTags);

    // Создаём React элементы для Badge компонентов
    const tagItems = displayTags.map((tag, index) => {
      const displayName = getTranslatedTagName(tag.name);
      return (
        <Badge
          key={`${tag.name}-${index}`}
          variant={tag.color}
          className="flex-shrink-0"
        >
          <Tag className="w-3 h-3" />
          {displayName}
        </Badge>
      );
    });

    // Используем глупый OverflowTrigger для отображения
    return (
      <div ref={containerRef} className="w-full">
        <OverflowTrigger
          ref={ref}
          items={tagItems}
          overflowCount={overflowCount}
          placeholder={placeholder}
          placeholderIcon={<Tag className="w-4 h-4" />}
          icon={<ChevronDown className="w-4 h-4" />}
          onClick={onClick}
          className={className}
          isOpen={isOpen}
        />
      </div>
    );
  }
);

TagPickerTrigger.displayName = 'TagPickerTrigger';

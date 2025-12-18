/**
 * HabitTagPicker для привычек
 * 
 * Специфичная для модуля привычек обёртка над generic TagPicker.
 * Подключается к Zustand store и передаёт habit-specific логику.
 * 
 * @module entities/tag/ui
 * @created 29 ноября 2025 - миграция из /modules/habit-tracker/features/tags
 * @migrated 30 ноября 2025 - перенос из features/habit-tag-picker (FSD fix)
 * @updated 30 ноября 2025 - переименован из TagPicker в HabitTagPicker
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { TagPicker } from './TagPicker';
import { useHabitsStore, useShallow } from '@/app/store';

export interface HabitTagPickerProps {
  /** Выбранные теги */
  selectedTags: string[];
  /** Callback выбора тегов */
  onSelectTags: (tags: string[]) => void;
  /** Открыт ли пикер (controlled) */
  open?: boolean;
  /** Callback изменения состояния */
  onOpenChange?: (open: boolean) => void;
  /** Дочерние элементы (trigger button) */
  children: React.ReactNode;
}

/**
 * HabitTagPicker для привычек
 * 
 * Обёртка над generic TagPicker с подключением к habit store.
 * Автоматически подключает:
 * - Теги из store
 * - CRUD операции из store
 * - Подсчёт использований по привычкам
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <HabitTagPicker
 *   selectedTags={habit.tags}
 *   onSelectTags={(tags) => updateHabit(habit.id, { tags })}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <button>Выбрать теги</button>
 * </HabitTagPicker>
 * ```
 */
export const HabitTagPicker: React.FC<HabitTagPickerProps> = ({
  selectedTags,
  onSelectTags,
  open,
  onOpenChange,
  children,
}) => {
  const { t } = useTranslation('habits');
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем вызовы store в один с useShallow
  const { tags, addTag } = useHabitsStore(
    useShallow((state) => ({
      tags: state.tags,
      addTag: state.addTag,
    }))
  );

  // Обработчик добавления нового тега
  const handleAddTag = (name: string, color: string) => {
    addTag({ name, color });
  };

  return (
    <TagPicker
      selectedTags={selectedTags}
      onSelectTags={onSelectTags}
      tags={tags}
      onAddTag={handleAddTag}
      placeholder={t('habitItem.noTag')}
      deleteMessageSingular={t('habitItem.usedInHabit')}
      deleteMessagePlural={t('habitItem.usedInHabits')}
      open={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </TagPicker>
  );
};
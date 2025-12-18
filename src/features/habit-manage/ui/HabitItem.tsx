/**
 * Элемент списка привычек в ManageHabitsModal
 * 
 * Функционал:
 * - Drag & drop для изменения порядка
 * - Inline редактирование названия
 * - Кнопка редактирования (открывает EditHabitModal)
 * - Бейджи с информацией о типе, теге и напоминаниях (порядок: теги → напоминания → тип)
 * 
 * @module features/habit-manage/ui/HabitItem
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 5 декабря 2025 - упрощение, удаление раскрывающихся блоков
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import { useHabitsStore, useShallow } from '@/app/store';
import { GripVertical, XIcon, Settings, Trash2, Bell, Hash, CheckSquare, Tag } from '@/shared/assets/icons/system';
import { useTranslatedTagName } from '@/entities/tag';
import { HabitNameEditor } from './HabitNameEditor';
import { IconPicker } from '@/shared/ui/icon-picker';
import { getIconOptions, ICON_MAP, SmallFilledCircle } from '@/shared/constants';
import type { Habit } from '@/entities/habit';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ITEM_TYPE = 'HABIT_ITEM';

interface HabitItemProps {
  habit: Habit;
  index: number;
  onUpdateName: (id: string, name: string) => void;
  onUpdateIcon: (id: string, icon: string) => void;
  onDelete: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const HabitItem: React.FC<HabitItemProps> = ({ 
  habit, 
  index, 
  onUpdateName,
  onUpdateIcon,
  onDelete, 
  onMove,
  scrollContainerRef
}) => {
  const { t } = useTranslation('habits');
  const getTranslatedTagName = useTranslatedTagName();
  
  // Получаем опции иконок с переводами
  const iconOptions = useMemo(() => getIconOptions(t), [t]);
  
  // Получаем теги и action для открытия модального окна из store
  const { tags, openEditHabitModal } = useHabitsStore(
    useShallow((state) => ({
      tags: state.tags,
      openEditHabitModal: state.openEditHabitModal,
    }))
  );
  
  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(habit?.name || '');
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  
  // Refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Drag and Drop
  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  preview(drop(ref));

  // Auto-edit mode for new habits with empty name
  useEffect(() => {
    if (!habit.name && !isEditingName) {
      setIsEditingName(true);
    }
  }, [habit.name, isEditingName]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // Handlers
  const handleIconSelect = (iconName: string) => {
    onUpdateIcon(habit.id, iconName);
  };

  return (
    <div
      ref={ref}
      className={`bg-white border border-gray-200 rounded-xl transition-all ${
        isDragging ? 'opacity-30' : 'opacity-100'
      } ${isOver ? 'border-gray-900' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3">
        {/* Drag Handle */}
        <Button
          ref={drag}
          variant="ghost"
          size="icon"
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 h-auto w-auto text-gray-400 hover:text-gray-600"
          title={t('habitItem.dragToReorder')}
        >
          <GripVertical className="w-4 h-4" />
        </Button>

        {/* Icon Picker - полностью автономное управление */}
        <IconPicker
          value={habit.icon}
          onChange={handleIconSelect}
          iconOptions={iconOptions}
          iconMap={ICON_MAP}
          defaultIcon={SmallFilledCircle}
        />

        {/* Habit Name & Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <HabitNameEditor
                name={habit.name}
                isEditing={isEditingName}
                editedName={editedName}
                inputRef={nameInputRef}
                onStartEditing={() => setIsEditingName(true)}
                onStopEditing={() => setIsEditingName(false)}
                onNameChange={setEditedName}
                onSave={(newName) => {
                  onUpdateName(habit.id, newName);
                  setIsEditingName(false);
                }}
              />
            </div>
            
            {!isEditingName && (
              <>
                {/* Tag badges - сначала */}
                {habit.tags && habit.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {habit.tags.map(tagName => {
                      const tag = tags.find(t => t.name === tagName);
                      return (
                        <Badge 
                          key={tagName}
                          variant={tag?.color ?? 'gray'}
                          className="flex-shrink-0"
                        >
                          <Tag className="w-3 h-3" />
                          {getTranslatedTagName(tagName)}
                        </Badge>
                      );
                    })}
                  </div>
                )}
                
                {/* Reminder badge - если есть */}
                {((habit.reminders && habit.reminders.some(r => r.enabled)) || habit.reminderEnabled) && (
                  <Badge 
                    variant="gray"
                    className="flex-shrink-0"
                    title={
                      habit.reminders && habit.reminders.length > 0
                        ? `${habit.reminders.filter(r => r.enabled).length} напоминаний: ${habit.reminders.filter(r => r.enabled).map(r => r.time).join(', ')}`
                        : `Напоминание в ${habit.reminderTime}`
                    }
                  >
                    <Bell className="w-3 h-3" />
                    {habit.reminders && habit.reminders.length > 0 
                      ? habit.reminders.filter(r => r.enabled).length 
                      : habit.reminderTime}
                  </Badge>
                )}
                
                {/* Habit Type badge - всегда отображается, справа перед настройками */}
                <Badge 
                  variant={habit.type === 'measurable' ? 'blue' : 'gray'}
                  className="flex-shrink-0"
                  title={habit.type === 'measurable' ? t('habit.types.measurable') : t('habit.types.binary')}
                >
                  {habit.type === 'measurable' ? (
                    <Hash className="w-3 h-3" />
                  ) : (
                    <CheckSquare className="w-3 h-3" />
                  )}
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Right Controls Group */}
        <div className="flex items-center gap-1.5">
          {/* Edit Button */}
          <Button
            onClick={() => openEditHabitModal(habit.id)}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
            title={t('habitItem.edit')}
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Delete Button */}
          <Button
            onClick={() => onDelete(habit.id)}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title={t('habitItem.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
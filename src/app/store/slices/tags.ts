/**
 * Tags Slice - управление тегами
 * 
 * Содержит actions для:
 * - Добавление тега с автоматическим цветом
 * - Удаление тега (+ очистка у всех привычек)
 * - Обновление цвета тега
 * 
 * @module app/store/slices/tags
 * @created 23 ноября 2025 (миграция с categories)
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 */

import type { StateCreator } from 'zustand';
import type { HabitsState } from '../types';
import { categoryLogger } from '@/shared/lib/logger';

/**
 * Создает slice с actions для работы с тегами
 */
export const createTagsSlice: StateCreator<
  HabitsState,
  [],
  [],
  Pick<HabitsState, 'addTag' | 'deleteTag' | 'updateTagColor'>
> = (set, get) => ({
  addTag: (tagName, color) => {
    const state = get();

    categoryLogger.info('🏷️ Попытка добавить тег', { 
      name: tagName, 
      color,
      currentTagsCount: state.tags?.length || 0,
      currentTags: state.tags?.map(t => t.name) || [],
    });

    // Проверяем уникальность тега (case-insensitive для большей надёжности)
    if (state.tags && Array.isArray(state.tags) && !state.tags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())) {
      // Используем переданный цвет или дефолтный 'gray'
      const newColor = color || 'gray';
      const newTag = { name: tagName, color: newColor };

      const updatedTags = [...state.tags, newTag];
      set({ tags: updatedTags });
      
      categoryLogger.info('✅ Тег успешно добавлен', { 
        name: tagName, 
        color: newColor,
        newTagsCount: updatedTags.length,
        allTags: updatedTags.map(t => t.name),
      });
    } else {
      categoryLogger.warn('⚠️ Тег уже существует', { name: tagName });
    }
  },

  deleteTag: (tagName) => {
    set((state) => ({
      tags: state.tags && Array.isArray(state.tags) 
        ? state.tags.filter((tag) => tag.name !== tagName)
        : state.tags,
      habits: state.habits.map((habit) =>
        habit.tags?.includes(tagName) 
          ? { ...habit, tags: habit.tags.filter(t => t !== tagName) } 
          : habit
      ),
    }));

    categoryLogger.info('Удалён тег', { name: tagName });
  },

  updateTagColor: (tagName, color) => {
    set((state) => ({
      tags: state.tags && Array.isArray(state.tags)
        ? state.tags.map((tag) =>
            tag.name === tagName ? { ...tag, color } : tag
          )
        : state.tags,
    }));

    categoryLogger.debug('Обновлен цвет тега', { name: tagName, color });
  },
});

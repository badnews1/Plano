/**
 * Главный файл Zustand store
 * 
 * Объединяет все slices в единый store с persist middleware.
 * Модульная архитектура позволяет легко находить и модифицировать код.
 * 
 * Структура:
 * - types.ts - все TypeScript интерфейсы
 * - initialState.ts - начальное состояние
 * - slices/ - модули с actions по функциональности
 *   - ui.ts - UI управление (sidebar, section, date)
 *   - modals.ts - модальные окна
 *   - addHabitForm.ts - форма добавления привычки
 *   - habits.ts - CRUD привычек
 *   - tags.ts - управление тегами
 *   - sections.ts - управление разделами
 *   - internal.ts - внутренние системные actions
 *   - language.ts - управление языком
 *   - filters.ts - управление фильтрами
 *   - vacation.ts - управление отпусками
 * 
 * @module app/store
 * @updated 1 декабря 2025 - удалена manageHabitsModal, перенесено на страницу /manage
 * @updated 2 декабря 2025 - миграция из /core/store/ в /app/store/ (FSD архитектура)
 * @see https://github.com/pmndrs/zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore } from './types';
import type { ColorVariant } from '@/shared/constants/colors';
import { getInitialState } from './initialState';
import { createUISlice } from './slices/ui';
import { createModalsSlice } from './slices/modals';
import { createAddHabitFormSlice } from './slices/addHabitForm';
import { createHabitsSlice } from './slices/habits';
import { createTagsSlice } from './slices/tags';
import { createSectionsSlice } from './slices/sections';
import { createInternalSlice } from './slices/internal';
import { createLanguageSlice } from './slices/language';
import { createFiltersSlice } from './slices/filters';
import { createVacationSlice } from '@/entities/vacation';
import { storageLogger } from '@/shared/lib/logger';

// ⚡ ОПТИМИЗАЦИЯ: экспортируем useShallow для использования в компонентах
export { useShallow } from 'zustand/react/shallow';

/**
 * Главный Zustand store приложения
 * 
 * Использует persist middleware для автоматического сохранения данных в localStorage.
 * Только данные (habits, tags, sections, currentLanguage) сохраняются, UI состояние - нет.
 */
export const useHabitsStore = create<AppStore>()(
  persist(
    (...args) => ({
      // Начальное состояние
      ...getInitialState(),

      // Slices с actions
      ...createUISlice(...args),
      ...createModalsSlice(...args),
      ...createAddHabitFormSlice(...args),
      ...createHabitsSlice(...args),
      ...createTagsSlice(...args),
      ...createSectionsSlice(...args),
      ...createInternalSlice(...args),
      ...createLanguageSlice(...args),
      ...createFiltersSlice(...args),
      ...createVacationSlice(...args),
    }),
    {
      name: 'habits-storage', // Ключ для localStorage
      partialize: (state) => {
        const persisted = {
          // Сохраняем только данные, UI состояние не сохраняем
          habits: state.habits,
          tags: state.tags,
          sections: state.sections,
          currentLanguage: state.currentLanguage, // Сохраняем выбранный язык
          vacationPeriods: state.vacationPeriods, // Сохраняем периоды отдыха
        };
        
        // 🔇 Отключаем шумные логи сохранения
        // storageLogger.info('💾 Сохранение в localStorage', {
        //   tagsCount: persisted.tags?.length || 0,
        //   tags: persisted.tags?.map(t => t.name) || [],
        //   habitsCount: persisted.habits?.length || 0,
        //   currentLanguage: persisted.currentLanguage,
        //   vacationPeriodsCount: persisted.vacationPeriods?.length || 0,
        // });
        
        return persisted;
      },
      // Обрабатываем восстановление состояния
      merge: (persistedState: Partial<AppStore> | undefined, currentState: AppStore) => {
        // 🔇 Отключаем шумные логи восстановления
        // storageLogger.info('🔄 Восстановление состояния из localStorage', {
        //   hasTags: !!persistedState?.tags,
        //   tagsCount: persistedState?.tags?.length || 0,
        //   hasSections: !!persistedState?.sections,
        //   sectionsCount: persistedState?.sections?.length || 0,
        //   currentLanguage: persistedState?.currentLanguage || 'en',
        // });

        // Если в сохранённом состоянии нет тегов или они пустые, используем дефолтные
        const tags = persistedState?.tags && Array.isArray(persistedState.tags) && persistedState.tags.length > 0
          ? persistedState.tags
          : currentState.tags;

        // storageLogger.info('✅ Теги восстановлены', { count: tags.length });

        // Миграция разделов: string[] → Section[]
        let sections = currentState.sections;
        
        if (persistedState?.sections && Array.isArray(persistedState.sections) && persistedState.sections.length > 0) {
          // ✅ Fix: доступ по индексу может вернуть undefined
          const firstSection = persistedState.sections[0];
          
          // Проверяем формат данных
          if (firstSection && typeof firstSection === 'object' && 'name' in firstSection && 'color' in firstSection) {
            // Новый формат Section[] - используем как есть
            sections = persistedState.sections;
            // storageLogger.info('✅ Разделы восстановлены (новый формат)', { count: sections.length });
          } else {
            // Старый формат string[] - мигрируем
            // Маппинг старых русских названий на новые ключи
            const legacyToNewMapping: Record<string, string> = {
              'Другие': 'other',
              'Утро': 'morning',
              'День': 'day',
              'Вечер': 'evening',
            };
            
            const defaultColors: Record<string, ColorVariant> = {
              'other': 'gray',
              'morning': 'amber',
              'day': 'sky',
              'evening': 'indigo',
            };
            
            sections = (persistedState.sections as string[]).map(name => {
              // Конвертируем старые русские названия в новые ключи
              const newName = legacyToNewMapping[name] || name;
              return {
                name: newName,
                color: defaultColors[newName] || 'blue', // Для кастомных разделов - синий
              };
            });
            
            // storageLogger.info('🔄 Разделы мигрированы со старого формата', { 
            //   count: sections.length,
            //   sections: sections.map(s => `${s.name} (${s.color})`),
            // });
          }
        } else {
          // storageLogger.info('✅ Разделы: используем дефолтные', { count: sections.length });
        }

        // Восстанавливаем язык или используем дефолтный
        const currentLanguage = persistedState?.currentLanguage || 'en';

        // Миграция привычек: конвертируем старые русские названия разделов
        let habits = persistedState?.habits || currentState.habits;
        if (habits && Array.isArray(habits)) {
          const legacyToNewMapping: Record<string, string> = {
            'Другие': 'other',
            'Утро': 'morning',
            'День': 'day',
            'Вечер': 'evening',
          };
          
          let migrated = false;
          let startDateMigrated = false;
          habits = habits.map(habit => {
            let updatedHabit = { ...habit };
            
            // Миграция section
            if (habit.section && legacyToNewMapping[habit.section]) {
              migrated = true;
              updatedHabit.section = legacyToNewMapping[habit.section];
            }
            
            // Миграция startDate: если нет startDate, используем createdAt или сегодня
            if (!habit.startDate) {
              startDateMigrated = true;
              // Используем createdAt или сегодняшнюю дату
              const createdDate = habit.createdAt 
                ? new Date(habit.createdAt).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];
              updatedHabit.startDate = createdDate ?? new Date().toISOString().split('T')[0] ?? '';
            }
            
            return updatedHabit;
          });
          
          if (migrated) {
            // storageLogger.info('🔄 Названия разделов в привычках мигрированы на английские ключи');
          }
          if (startDateMigrated) {
            // storageLogger.info('🔄 Добавлена дата начала (startDate) для старых привычек');
          }
        }

        return {
          ...currentState,
          ...persistedState,
          habits,
          tags,
          sections,
          currentLanguage,
          vacationPeriods: (persistedState?.vacationPeriods || currentState.vacationPeriods || []).map((period) => ({
            ...period,
            // Миграция: добавляем дефолтную иконку если её нет
            icon: period.icon || 'plane',
          })),
        };
      },
    }
  )
);

// 🔇 Отключаем шумный лог инициализации
// storageLogger.info('Zustand store инициализирован (модульная архитектура)');
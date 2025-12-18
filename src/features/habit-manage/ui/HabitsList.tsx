/**
 * Список привычек для модального окна управления
 * 
 * Функционал:
 * - Рендеринг отфильтрованных привычек
 * - Группировка привычек по разделам (секциям)
 * - Сворачивание/разворачивание разделов (collapsible на базе shadcn/ui Accordion)
 * - Передача handlers в HabitItem
 * - Scroll container для длинных списков
 * 
 * Оптимизация: React.memo для предотвращения лишних ререндеров
 * 
 * @module features/habit-manage/ui/HabitsList
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 5 декабря 2025 - упрощение пропсов (удалены раскрывающиеся блоки)
 */

import React, { useRef, useMemo } from 'react';
import { HabitItem } from './HabitItem';
import type { Habit } from '@/entities/habit';
import { SYSTEM_SECTION_KEYS } from '@/entities/habit';
import { useTranslatedSectionName } from '@/entities/section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HabitsListProps {
  habits: Habit[];
  onUpdateName: (id: string, name: string) => void;
  onUpdateIcon: (id: string, icon: string) => void;
  onDeleteClick: (id: string) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

export const HabitsList: React.FC<HabitsListProps> = React.memo(({
  habits,
  onUpdateName,
  onUpdateIcon,
  onDeleteClick,
  onMove,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const getTranslatedSectionName = useTranslatedSectionName();

  // Группируем привычки по разделам с сохранением глобальных индексов
  const groupedHabits = useMemo(() => {
    const groups = new Map<string, Array<{ habit: Habit; globalIndex: number }>>();
    
    habits.forEach((habit, globalIndex) => {
      const section = habit.section || SYSTEM_SECTION_KEYS.other;
      if (!groups.has(section)) {
        groups.set(section, []);
      }
      groups.get(section)!.push({ habit, globalIndex });
    });

    // Определяем порядок разделов: стандартные + кастомные
    const standardSections = [
      SYSTEM_SECTION_KEYS.morning,
      SYSTEM_SECTION_KEYS.day,
      SYSTEM_SECTION_KEYS.evening,
      SYSTEM_SECTION_KEYS.other,
    ];
    const customSections = Array.from(groups.keys()).filter(
      section => !standardSections.includes(section)
    );
    const orderedSections = [...standardSections, ...customSections].filter(
      section => groups.has(section)
    );

    return orderedSections.map(section => ({
      section,
      habits: groups.get(section)!,
    }));
  }, [habits]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6">
      <Accordion 
        type="multiple" 
        defaultValue={groupedHabits.map(g => g.section)} 
        className="space-y-6"
      >
        {groupedHabits.map(({ section, habits: sectionHabits }) => (
          <AccordionItem key={section} value={section} className="border-0">
            {/* Заголовок раздела */}
            <AccordionTrigger className="w-full mb-3 px-2 py-3 hover:no-underline hover:bg-gray-50 rounded-md transition-colors">
              <span className="text-gray-400 uppercase tracking-wide text-sm">
                {getTranslatedSectionName(section)}
              </span>
            </AccordionTrigger>

            {/* Привычки в разделе */}
            <AccordionContent className="pb-0">
              <div className="space-y-3">
                {sectionHabits.map(({ habit, globalIndex }) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    index={globalIndex}
                    onUpdateName={(id, name) => onUpdateName(id, name)}
                    onUpdateIcon={(id, icon) => onUpdateIcon(id, icon)}
                    onDelete={(id) => onDeleteClick(id)}
                    onMove={onMove}
                    scrollContainerRef={scrollContainerRef}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
});

HabitsList.displayName = 'HabitsList';
/**
 * Модальное окно редактирования привычки (обёртка)
 * 
 * @description
 * Тонкая обёртка над базовым компонентом HabitFormModalTabs из entities слоя.
 * Предоставляет интерфейс для редактирования существующей привычки.
 * 
 * ПРАВИЛА РЕДАКТИРОВАНИЯ:
 * ✅ МОЖНО редактировать:
 *    - Название, иконка, раздел, теги
 *    - Частота, напоминания, описание
 *    - Для измеримых: единицы измерения, тип цели, значение цели
 * ❌ НЕЛЬЗЯ редактировать:
 *    - Тип отслеживания (binary/measurable)
 * 
 * @module features/habit-edit/ui/EditHabitModal
 * @created 5 декабря 2025 - FSD разделение create/edit
 * @updated 10 декабря 2025 - рефакторинг на базовый компонент из entities
 * @updated 16 декабря 2025 - FSD рефакторинг: footerLeftActions передаётся через props
 */

import { useHabitsStore, useShallow } from '@/app/store';
import { HabitFormModalTabs } from '@/entities/habit/ui';
import type { HabitUpdateData } from '@/entities/habit';

interface EditHabitModalProps {
  /** Дополнительные действия для левой части footer (например, ArchiveButton) */
  footerLeftActions?: React.ReactNode;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({ footerLeftActions }) => {
  // Получаем состояние и actions из store с useShallow для оптимизации
  const {
    isOpen,
    habitToEdit,
    closeEditHabitModal,
    updateHabit,
    deleteHabit,
  } = useHabitsStore(
    useShallow((state) => ({
      isOpen: state.isEditHabitModalOpen,
      habitToEdit: state.habitToEdit,
      closeEditHabitModal: state.closeEditHabitModal,
      updateHabit: state.updateHabit,
      deleteHabit: state.deleteHabit,
    }))
  );

  if (!isOpen || !habitToEdit) return null;

  const handleSubmit = (data: HabitUpdateData) => {
    updateHabit(habitToEdit.id, data);
  };

  const handleDelete = () => {
    deleteHabit(habitToEdit.id);
    closeEditHabitModal();
  };

  return (
    <HabitFormModalTabs
      mode="edit"
      isOpen={isOpen}
      onClose={closeEditHabitModal}
      onSubmit={handleSubmit}
      disableTypeChange={true}
      showDelete={true}
      onDelete={handleDelete}
      footerLeftActions={footerLeftActions}
      initialData={{
        name: habitToEdit.name,
        description: habitToEdit.description || '',
        startDate: habitToEdit.startDate,
        icon: habitToEdit.icon,
        tags: habitToEdit.tags || [],
        section: habitToEdit.section,
        type: habitToEdit.type,
        frequency: habitToEdit.frequency,
        reminders: habitToEdit.reminders || [],
        unit: habitToEdit.unit || '',
        targetValue: habitToEdit.targetValue,
        targetType: habitToEdit.targetType || 'min',
        notesEnabled: habitToEdit.notesEnabled,
        timerEnabled: habitToEdit.timerEnabled,
        timerDefaultMinutes: habitToEdit.timerDefaultMinutes,
        timerDefaultSeconds: habitToEdit.timerDefaultSeconds,
      }}
    />
  );
};
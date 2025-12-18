/**
 * Кнопка разархивации привычки
 * 
 * @description
 * Кнопка для возврата привычки из архива.
 * Используется в модалке архива.
 * 
 * @module features/habit-archive/ui/UnarchiveButton
 * @created 5 декабря 2025
 */

import { Button } from '@/components/ui/button';
import { useHabitsStore } from '@/app/store';
import { toast } from 'sonner';

interface UnarchiveButtonProps {
  /** ID привычки для разархивации */
  habitId: string;
}

/**
 * Кнопка разархивации привычки
 */
export function UnarchiveButton({ habitId }: UnarchiveButtonProps) {
  const unarchiveHabit = useHabitsStore((state) => state.unarchiveHabit);

  const handleUnarchive = () => {
    unarchiveHabit(habitId);
    toast.success('Привычка успешно разархивирована');
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleUnarchive}
      className="size-9 hover:bg-transparent"
      aria-label="Разархивировать привычку"
      title="Разархивировать привычку"
    >
      <ArchiveRestore className="size-4" />
    </Button>
  );
}
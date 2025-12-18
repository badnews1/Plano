/**
 * Кнопка архивации привычки
 * 
 * @description
 * Кнопка для архивации привычки с подтверждением.
 * Используется в форме редактирования привычки.
 * 
 * @module features/habit-archive/ui/ArchiveButton
 * @created 5 декабря 2025
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Archive } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
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
import { useHabitsStore } from '@/app/store';
import { toast } from 'sonner';

interface ArchiveButtonProps {
  /** ID привычки для архивации */
  habitId: string;
  /** Название привычки (для отображения в диалоге) */
  habitName: string;
  /** Коллбэк после успешной архивации */
  onArchived?: () => void;
}

/**
 * Кнопка архивации привычки
 */
export function ArchiveButton({ habitId, habitName, onArchived }: ArchiveButtonProps) {
  const { t } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const archiveHabit = useHabitsStore((state) => state.archiveHabit);

  const handleArchive = () => {
    archiveHabit(habitId);
    toast.success(t('archive.archiveSuccess'));
    setIsDialogOpen(false);
    onArchived?.();
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsDialogOpen(true)}
        className="size-9"
        aria-label={t('archive.archiveHabit')}
        title={t('archive.archiveHabit')}
      >
        <Archive className="size-4" />
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('archive.confirmArchive')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('archive.confirmDescription', { habitName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              {t('archive.confirmButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
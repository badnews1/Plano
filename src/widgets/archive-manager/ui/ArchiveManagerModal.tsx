/**
 * Модальное окно со списком архивных привычек
 * 
 * @description
 * Виджет-композиция для управления архивом привычек.
 * Отображает список архивированных привычек с возможностью:
 * - Разархивировать привычку
 * - Удалить привычку навсегда
 * 
 * @module widgets/archive-manager/ui/ArchiveManagerModal
 * @created 5 декабря 2025
 * @migrated 16 декабря 2025 - перенесено из features в widgets (FSD рефакторинг)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from '@/shared/assets/icons/system';
import { ICON_MAP, SmallFilledCircle } from '@/shared/constants/icons';
import { Button } from '@/components/ui/button';
import { Modal } from '@/shared/ui/modal';
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
import { useHabits } from '@/entities/habit';
import { getArchivedHabits } from '@/entities/habit';
import { UnarchiveButton } from '@/features/habit-archive';
import { useHabitsStore } from '@/app/store';
import { toast } from 'sonner';

interface ArchiveManagerModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;
  /** Коллбэк закрытия модального окна */
  onClose: () => void;
}

/**
 * Модальное окно управления архивом привычек
 */
export function ArchiveManagerModal({ isOpen, onClose }: ArchiveManagerModalProps) {
  const { t } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  const { habits } = useHabits();
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<{ id: string; name: string } | null>(null);

  const archivedHabits = getArchivedHabits(habits);

  const handleDeleteClick = (habitId: string, habitName: string) => {
    setHabitToDelete({ id: habitId, name: habitName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (habitToDelete) {
      deleteHabit(habitToDelete.id);
      toast.success(t('habit.deleteSuccess'));
      setDeleteDialogOpen(false);
      setHabitToDelete(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal.Root level="dialog" onClose={onClose}>
        <Modal.Backdrop onClick={onClose} />
        <Modal.Container size="2xl" maxHeight="610px" minHeight="610px">
          <Modal.GradientLine />
          <Modal.Header 
            title={t('archive.title')}
            onClose={onClose}
          />

          <Modal.Content className={archivedHabits.length === 0 ? 'flex items-center justify-center' : 'px-6 py-6'}>
            {archivedHabits.length === 0 ? (
              <div className="text-center">
                <div className="text-muted-foreground">
                  <p className="mb-2">{t('archive.emptyArchive')}</p>
                  <p className="text-sm">{t('archive.emptyArchiveDescription')}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {archivedHabits.map((habit) => {
                  // Получаем компонент иконки из ICON_MAP
                  const IconComponent = habit.icon ? (ICON_MAP[habit.icon] ?? SmallFilledCircle) : SmallFilledCircle;
                  
                  return (
                    <div
                      key={habit.id}
                      className="flex items-center justify-between p-3 rounded-md border border-[var(--border-tertiary)] bg-[var(--bg-tertiary)]"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-text-primary flex-shrink-0" />
                        <div>
                          <div className="font-medium">{habit.name}</div>
                          {habit.description && (
                            <div className="text-sm text-muted-foreground">
                              {habit.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <UnarchiveButton habitId={habit.id} />
                        <Button
                          type="button"
                          variant="ghostDestructive"
                          size="icon"
                          onClick={() => handleDeleteClick(habit.id, habit.name)}
                          className="size-9"
                          aria-label={t('habit.deleteHabit')}
                          title={t('habit.deleteHabit')}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Modal.Content>

          <Modal.Footer>
            <Button onClick={onClose}>
              {tCommon('common.done')}
            </Button>
          </Modal.Footer>
        </Modal.Container>
      </Modal.Root>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tCommon('common.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {tCommon('common.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              {tCommon('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

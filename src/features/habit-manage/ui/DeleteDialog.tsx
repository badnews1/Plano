/**
 * DeleteDialog - диалог подтверждения удаления привычки
 * Используется в ManageHabitsModal для удаления привычки с подтверждением
 * 
 * @module features/habit-manage/ui/DeleteDialog
 * @migrated 30 ноября 2025 - миграция на FSD
 */

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
import { useTranslation } from 'react-i18next';

/**
 * Диалог подтверждения удаления привычки
 */
export function DeleteDialog({
  habitName,
  onConfirm,
  onCancel,
}: {
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  
  return (
    <AlertDialog open onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('manage.delete.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('manage.delete.description', { habitName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {tCommon('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('manage.delete.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
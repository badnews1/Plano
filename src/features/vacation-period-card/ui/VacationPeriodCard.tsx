/**
 * Карточка периода отдыха
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Edit, Trash2, Palmtree } from '@/shared/assets/icons/system';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import type { VacationPeriod } from '@/entities/vacation';
import { getVacationPeriodStatus } from '@/entities/vacation';
import { VACATION_ICON_MAP } from '@/shared/constants/vacation-icons';

interface VacationPeriodCardProps {
  period: VacationPeriod;
  onEdit: () => void;
}

export function VacationPeriodCard({ period, onEdit }: VacationPeriodCardProps) {
  const { t, i18n } = useTranslation('vacation');
  const currentLanguage = i18n.language;
  
  // Состояние для диалога подтверждения удаления
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем вызовы store с useShallow
  const { allHabits, deleteVacationPeriod } = useHabitsStore(
    useShallow((state) => ({
      allHabits: state.habits, // ✅ Берём массив напрямую
      deleteVacationPeriod: state.deleteVacationPeriod,
    }))
  );
  
  // Мемоизируем фильтрацию привычек
  const habits = useMemo(
    () => allHabits.filter(h => !h.isArchived),
    [allHabits]
  );
  
  // Получаем иконку периода (с fallback на пальму)
  const VacationIcon = period.icon ? (VACATION_ICON_MAP[period.icon] ?? Palmtree) : Palmtree;
  
  // Определяем статус
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0] ?? '';
  const status = getVacationPeriodStatus(period, todayStr);
  const isPast = status === 'past';
  
  // Форматируем даты
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);
  const dateFormatter = new Intl.DateTimeFormat(currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  
  const dateRangeStr = `${dateFormatter.format(startDate)} — ${dateFormatter.format(endDate)}`;
  
  return (
    <div 
      className="border rounded-md p-4 group"
      style={{
        borderColor: status === 'active'
          ? 'var(--palette-amber-border)'
          : status === 'upcoming'
          ? 'var(--palette-indigo-border)'
          : 'var(--palette-zinc-border)',
        background: status === 'active'
          ? 'linear-gradient(135deg, var(--palette-amber-bg) 0%, color-mix(in srgb, var(--palette-amber-bg) 30%, transparent) 100%)'
          : status === 'upcoming'
          ? 'linear-gradient(135deg, var(--palette-indigo-bg) 0%, color-mix(in srgb, var(--palette-indigo-bg) 25%, transparent) 100%)'
          : 'linear-gradient(135deg, var(--palette-zinc-bg) 0%, color-mix(in srgb, var(--palette-zinc-bg) 20%, transparent) 100%)'
      }}
    >
      {/* Заголовок */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 flex items-start gap-3">
          {/* Иконка периода */}
          <div className="shrink-0 flex items-center">
            <VacationIcon className="w-[40px] h-[40px]" strokeWidth={1.5} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{period.reason}</span>
              <Badge
                className={
                  status === 'active' 
                    ? 'bg-[var(--palette-amber-bg)] text-[var(--palette-amber-text)] border-transparent leading-none'
                    : status === 'upcoming'
                    ? 'bg-[var(--palette-indigo-bg)] text-[var(--palette-indigo-text)] border-transparent leading-none'
                    : 'bg-[var(--palette-zinc-bg)] text-[var(--palette-zinc-text)] border-transparent leading-none'
                }
              >
                {t(`status${status.charAt(0).toUpperCase() + status.slice(1)}`)}
              </Badge>
            </div>
            <div className="text-xs text-[var(--text-secondary)] font-medium mt-1.5">
              {dateRangeStr}
            </div>
            
            {/* Информация о привычках */}
            <div className="mt-4 flex items-center gap-2">
              {period.applyToAll || period.habitIds.length === habits.length ? (
                <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                  <span 
                    style={{ 
                      color: status === 'active' 
                        ? 'var(--palette-amber-text)' 
                        : status === 'upcoming'
                        ? 'var(--palette-indigo-text)'
                        : 'var(--palette-zinc-text)'
                    }}
                  >
                    ✓
                  </span> 
                  {t('allHabitsPaused')}
                </span>
              ) : (
                <span className="text-xs text-[var(--text-secondary)]">
                  {t('habitsCountPaused', { count: period.habitIds.length, total: habits.length })}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isPast && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit style={{ width: 16, height: 16 }} />
            </Button>
          )}
          <Button
            variant="ghostDestructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 style={{ width: 16, height: 16 }} />
          </Button>
        </div>
      </div>
      
      {/* Диалог подтверждения удаления */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('deleteConfirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                {/* Информация о периоде */}
                <div className="text-sm">
                  <div><strong>{period.reason}</strong></div>
                  <div className="text-[var(--text-secondary)]">{dateRangeStr}</div>
                </div>
                
                {/* Предупреждение */}
                <div className="space-y-2">
                  <div className="font-medium">{t('deleteConfirmWarning')}</div>
                  <ul className="space-y-1 text-sm text-[var(--text-secondary)] list-none pl-0">
                    <li>• {t('deleteConfirmPoint1')}</li>
                    <li>• {t('deleteConfirmPoint2')}</li>
                    <li>• {t('deleteConfirmPoint3')}</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('deleteConfirmCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteVacationPeriod(period.id)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {t('deleteConfirmDelete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
/**
 * EmptyState для модалки режима отдыха
 * 
 * @module features/vacation-manager-button/ui/VacationEmptyState
 * @migrated 16 декабря 2025 - перенесено из widgets в features (FSD рефакторинг)
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface VacationEmptyStateProps {
  onCreateClick: () => void;
}

export function VacationEmptyState({ onCreateClick }: VacationEmptyStateProps) {
  const { t } = useTranslation('vacation');
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h3 className="mb-2">{t('emptyStateTitle')}</h3>
      <p className="text-[var(--text-secondary)] mb-6 max-w-md">
        {t('emptyStateDescription')}
      </p>
      <Button onClick={onCreateClick}>
        {t('createButton')}
      </Button>
    </div>
  );
}

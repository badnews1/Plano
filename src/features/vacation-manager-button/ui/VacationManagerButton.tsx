/**
 * Кнопка открытия модалки "Режим отдыха" в header
 * 
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label)
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Palmtree } from '@/shared/assets/icons/system';
import { VacationManagerDialog } from './VacationManagerDialog';

export function VacationManagerButton() {
  const { t } = useTranslation('vacation');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant="outline"
        size="icon"
        title={t('title')}
        className="h-8 w-8 rounded-md"
        aria-label={t('title') || 'Режим отдыха'}
      >
        <Palmtree className="w-3.5 h-3.5" aria-hidden="true" />
      </Button>
      
      <VacationManagerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
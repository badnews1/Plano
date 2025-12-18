/**
 * Кнопка архива для хеддера
 * 
 * @description
 * Компонент кнопки с иконкой архива, которая открывает модалку со списком архивных привычек.
 * Используется в хеддере главной страницы трекера.
 * 
 * @module widgets/archive-manager/ui/ArchiveHeaderButton
 * @created 5 декабря 2025
 * @migrated 16 декабря 2025 - перенесено из features в widgets (FSD рефакторинг)
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (aria-label)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Archive } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { ArchiveManagerModal } from './ArchiveManagerModal';

/**
 * Кнопка архива в хеддере
 */
export function ArchiveHeaderButton() {
  const { t } = useTranslation('habits');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-md"
        title={t('archive.title')}
        aria-label={t('archive.title') || 'Архив привычек'}
      >
        <Archive className="w-3.5 h-3.5" aria-hidden="true" />
      </Button>

      <ArchiveManagerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
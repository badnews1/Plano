/**
 * Компонент для загрузки аватарки пользователя
 * 
 * Функционал:
 * - Загрузка файла через input[type="file"]
 * - Валидация формата (jpg, png) и размера (5MB)
 * - Открытие модалки для обрезки изображения
 * - Сохранение в userStore
 * 
 * @module features/avatar-upload/ui/AvatarUploadButton
 * @created 17 декабря 2025
 */

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera } from '@/shared/assets/icons/system';
import { validateImageFile, getFileSizeInMB, MAX_FILE_SIZE } from '../lib/utils';
import { AvatarCropModal } from './AvatarCropModal';
import { toast } from 'sonner';

interface AvatarUploadButtonProps {
  // Дополнительные классы для стилизации
  className?: string;
}

export function AvatarUploadButton({ className }: AvatarUploadButtonProps) {
  const { t } = useTranslation('common');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Валидация файла
    const validation = validateImageFile(file);
    if (!validation.valid) {
      if (validation.error === 'invalidFormat') {
        toast.error(t('errors.avatarInvalidFormat'));
      } else if (validation.error === 'fileTooLarge') {
        toast.error(
          t('errors.avatarFileTooLarge', {
            size: getFileSizeInMB(MAX_FILE_SIZE),
          })
        );
      }
      // Сбрасываем input
      event.target.value = '';
      return;
    }

    // Создаем временный URL для файла
    const fileUrl = URL.createObjectURL(file);
    setImageSrc(fileUrl);
    setIsCropModalOpen(true);

    // Сбрасываем input чтобы можно было загрузить тот же файл снова
    event.target.value = '';
  };

  const handleCloseCropModal = () => {
    setIsCropModalOpen(false);
    // Очищаем временный URL
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
      setImageSrc(null);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={className}
        aria-label={t('profile.changeAvatar')}
        type="button"
      >
        <Camera className="w-5 h-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      {imageSrc && (
        <AvatarCropModal
          imageSrc={imageSrc}
          isOpen={isCropModalOpen}
          onClose={handleCloseCropModal}
        />
      )}
    </>
  );
}
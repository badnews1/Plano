/**
 * Модалка для обрезки аватарки
 * 
 * Функционал:
 * - Отображение превью изображения
 * - Инструменты обрезки (react-easy-crop)
 * - Масштабирование (zoom slider)
 * - Сохранение/отмена
 * 
 * @module features/avatar-upload/ui/AvatarCropModal
 * @created 17 декабря 2025
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Cropper, { Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { getCroppedImg } from '../lib/cropImage';
import { useUserStore } from '@/entities/user';
import { toast } from 'sonner';

interface AvatarCropModalProps {
  // URL выбранного файла (временный object URL)
  imageSrc: string;
  // Открыта ли модалка
  isOpen: boolean;
  // Callback для закрытия модалки
  onClose: () => void;
}

export function AvatarCropModal({ imageSrc, isOpen, onClose }: AvatarCropModalProps) {
  const { t } = useTranslation('common');
  const setAvatar = useUserStore((state) => state.setAvatar);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setAvatar(croppedImage);
      toast.success(t('success.avatarUpdated'));
      onClose();
    } catch (error) {
      console.error('Failed to crop image:', error);
      toast.error(t('errors.avatarUploadFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Очищаем временный URL
    URL.revokeObjectURL(imageSrc);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('profile.cropAvatar')}</DialogTitle>
          <DialogDescription>
            {t('profile.cropAvatarDescription')}
          </DialogDescription>
        </DialogHeader>

        {/* Область кропа */}
        <div className="relative w-full h-[400px] bg-background-primary">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Слайдер зума */}
        <div className="px-4 py-2">
          <label className="text-sm mb-2 block">{t('profile.zoom')}</label>
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? t('common.loading') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
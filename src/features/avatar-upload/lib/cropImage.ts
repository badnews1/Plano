/**
 * Утилита для обрезки изображения
 * 
 * Принимает:
 * - URL изображения
 * - Область обрезки (croppedAreaPixels из react-easy-crop)
 * 
 * Возвращает:
 * - base64 обрезанного изображения
 * 
 * @module features/avatar-upload/lib/cropImage
 * @created 17 декабря 2025
 */

import { Area } from 'react-easy-crop';

/**
 * Создает canvas и обрезает изображение
 */
export async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Устанавливаем размер canvas равный области обрезки
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // Рисуем обрезанную часть изображения
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // Конвертируем canvas в base64
  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Загружает изображение и возвращает HTMLImageElement
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

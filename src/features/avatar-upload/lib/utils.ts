/**
 * Утилиты для работы с загрузкой аватарки
 * 
 * @module features/avatar-upload/lib/utils
 * @created 17 декабря 2025
 */

// Максимальный размер файла в байтах (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Разрешенные MIME типы
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

// Разрешенные расширения файлов
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

/**
 * Валидация файла изображения
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Проверка типа файла
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'invalidFormat',
    };
  }

  // Проверка размера файла
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'fileTooLarge',
    };
  }

  return { valid: true };
}

/**
 * Конвертация файла в base64
 * 
 * После интеграции с Supabase эта функция будет заменена на загрузку в Supabase Storage
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Получить размер файла в МБ для отображения
 */
export function getFileSizeInMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(2);
}

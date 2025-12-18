/**
 * 🏷️ Утилиты для работы с title браузера
 * 
 * @module features/timer/lib/browserTitle
 * @created 13 декабря 2025
 */

const ORIGINAL_TITLE = 'HabitFlow';
let blinkInterval: NodeJS.Timeout | null = null;

/** Форматирует время в HH:MM:SS или MM:SS */
export function formatTimeForTitle(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/** Обновляет title с текущим временем таймера */
export function updateTitleWithTimer(seconds: number): void {
  const timeStr = formatTimeForTitle(seconds);
  document.title = `(${timeStr}) ${ORIGINAL_TITLE}`;
}

/** Сбрасывает title к исходному */
export function resetTitle(): void {
  stopTitleBlink();
  document.title = ORIGINAL_TITLE;
}

/** Запускает мигание title при завершении таймера */
export function startTitleBlink(): void {
  stopTitleBlink(); // Останавливаем предыдущее мигание
  
  let isAlertShown = true;
  blinkInterval = setInterval(() => {
    document.title = isAlertShown ? `⏰ TIME'S UP! | ${ORIGINAL_TITLE}` : ORIGINAL_TITLE;
    isAlertShown = !isAlertShown;
  }, 1000); // Меняем каждую секунду
}

/** Останавливает мигание title */
export function stopTitleBlink(): void {
  if (blinkInterval) {
    clearInterval(blinkInterval);
    blinkInterval = null;
  }
}

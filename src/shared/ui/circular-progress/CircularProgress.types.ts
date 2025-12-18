/**
 * Типы для CircularProgress
 */

export interface CircularProgressProps {
  /** Процент выполнения от 0 до 100 */
  progress: number;
  /** Размер диаграммы в пикселях */
  size?: number;
  /** Толщина линии круга */
  strokeWidth?: number;
  /** CSS класс для кастомизации */
  className?: string;
  /** Показывать процент внутри круга */
  showLabel?: boolean;
  /** Дополнительный текст под процентом */
  label?: string;
  /** Цвет прогресса (CSS переменная или значение) */
  progressColor?: string;
  /** Цвет фона круга (CSS переменная или значение) */
  backgroundColor?: string;
}

/**
 * Типы для компонента SpeedometerChart
 */

export interface SpeedometerChartProps {
  /** Прогресс от 0 до 100 */
  progress: number;
  /** Размер диаграммы в пикселях */
  size?: number;
  /** Размер толщины линии (xs=4px, sm=6px, md=8px, lg=12px, xl=16px) */
  strokeSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** @deprecated Используйте strokeSize вместо strokeWidth */
  strokeWidth?: number;
  /** Показывать ли процент внутри */
  showLabel?: boolean;
  /** Кастомный текст вместо процента */
  label?: string;
  /** Цвет прогресса */
  progressColor?: string;
  /** Цвет фона */
  backgroundColor?: string;
  /** CSS класс */
  className?: string;
}
/**
 * 🔵 CircularProgress — Универсальная круговая диаграмма прогресса
 * 
 * Компонент отображает прогресс в виде кругового индикатора.
 * Заполняется по часовой стрелке, начиная сверху.
 * 
 * ВОЗМОЖНОСТИ:
 * ✅ Базовый режим - только круговая диаграмма
 * ✅ Режим с лейблом - процент или кастомный текст внутри круга
 * ✅ Кастомные цвета для прогресса и фона
 * 
 * @example
 * // Базовое использование
 * <CircularProgress progress={75} size={20} />
 * 
 * // С процентом внутри
 * <CircularProgress progress={75} size={120} showLabel />
 * 
 * // С кастомным текстом
 * <CircularProgress progress={2} size={120} label="PROGRESS" />
 */

import React from 'react';
import type { CircularProgressProps } from './CircularProgress.types';

/**
 * CircularProgress - универсальный компонент круговой диаграммы прогресса
 */
export function CircularProgress({ 
  progress, 
  size = 80,
  strokeWidth = 3,
  className = '',
  showLabel = false,
  label,
  progressColor = 'var(--accent-primary-indigo)',
  backgroundColor = 'var(--border-secondary)',
}: CircularProgressProps) {
  // Ограничиваем прогресс от 0 до 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Параметры круга
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Вычисляем offset для stroke-dasharray (начинаем с верхней точки)
  const offset = circumference - (clampedProgress / 100) * circumference;
  
  // Размер шрифта для процента (20% от размера круга)
  const percentageFontSize = size * 0.2;
  // Размер шрифта для лейбла (8% от размера круга)
  const labelFontSize = size * 0.08;
  
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* SVG с кругом */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 absolute inset-0"
      >
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Прогресс круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      
      {/* Текст внутри круга */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Процент */}
          <div 
            style={{ 
              fontSize: `${percentageFontSize}px`,
              fontWeight: 700,
              lineHeight: 1,
              color: 'var(--text-primary)',
            }}
          >
            {Math.round(clampedProgress)}%
          </div>
          
          {/* Дополнительный лейбл под процентом */}
          {label && (
            <div 
              className="uppercase tracking-wider"
              style={{ 
                fontSize: `${labelFontSize}px`,
                fontWeight: 600,
                marginTop: '4px',
                color: 'var(--text-secondary)',
              }}
            >
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

CircularProgress.displayName = 'CircularProgress';
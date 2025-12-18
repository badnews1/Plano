/**
 * SpeedometerChart - круговая диаграмма в стиле спидометра
 */

import { useId } from 'react';

interface SpeedometerChartProps {
  /** Прогресс от 0 до 100 */
  progress: number;
  /** Размер диаграммы в пикселях */
  size?: number;
  /** Размер толщины линии (xs=4px, sm=6px, md=7px, lg=12px, xl=16px) */
  strokeSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** @deprecated Используйте strokeSize вместо strokeWidth */
  strokeWidth?: number;
  /** Показывать ли процент внутри */
  showLabel?: boolean;
  /** Кастомный текст вместо процента */
  label?: string;
  /** Цвет прогресса (можно использовать 'gradient' для встроенного градиента) */
  progressColor?: string;
  /** Цвет фона */
  backgroundColor?: string;
  /** CSS класс */
  className?: string;
  /** Показывать декоративные точки */
  showDots?: boolean;
  /** Цвет точек */
  dotsColor?: string;
  /** Размер точек (по умолчанию 1.5) */
  dotsSize?: number;
  /** Отступ точек от дуги */
  dotsOffset?: number;
  /** Показывать внутренние точки */
  showInnerDots?: boolean;
  /** Показывать внешние точки */
  showOuterDots?: boolean;
  /** Количество внутренних точек */
  innerDotsCount?: number;
  /** Количество внешних точек */
  outerDotsCount?: number;
  /** Включить градиент прозрачности для внешних точек (снизу прозрачнее) */
  outerDotsGradient?: boolean;
  /** Угол дуги в градусах (по умолчанию 270) */
  arcAngle?: number;
}

export function SpeedometerChart({
  progress,
  size = 100,
  strokeSize = 'md',
  strokeWidth,
  showLabel = false,
  label,
  progressColor = 'gradient',
  backgroundColor = 'var(--border-secondary)',
  className = '',
  showDots = false,
  dotsColor = 'var(--border-secondary)',
  dotsSize = 1.5,
  dotsOffset = 8,
  showInnerDots = true,
  showOuterDots = true,
  innerDotsCount = 60,
  outerDotsCount = 60,
  outerDotsGradient = false,
  arcAngle = 270,
}: SpeedometerChartProps) {
  // Маппинг размеров strokeSize
  const strokeSizes = {
    xs: 4,
    sm: 6,
    md: 7,
    lg: 12,
    xl: 16,
  };
  
  const finalStrokeWidth = strokeWidth ?? strokeSizes[strokeSize];
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - finalStrokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const arcLength = (arcAngle / 360) * circumference;
  const offset = arcLength - (clampedProgress / 100) * arcLength;
  
  // Вычисляем стартовый угол для центрирования дуги
  const startAngle = (360 - arcAngle) / 2 + 90;
  
  // Уникальный ID для градиентов (чтобы несколько компонентов на странице работали)
  const gradientId = useId();

  // Генерация точек по дуге
  const generateDots = (radiusOffset: number, count: number, isOuter: boolean = false) => {
    const dots = [];
    
    for (let i = 0; i <= count; i++) {
      const angle = startAngle + (i / count) * arcAngle;
      const rad = (angle * Math.PI) / 180;
      const dotRadius = radius + radiusOffset;
      const x = centerX + dotRadius * Math.cos(rad);
      const y = centerY + dotRadius * Math.sin(rad);
      
      // Расчёт прозрачности для градиента внешних точек
      // Точки внизу (середина дуги) более прозрачные
      // Точки по краям (начало и конец) более яркие
      let opacity = 1;
      if (isOuter && outerDotsGradient) {
        const normalizedPos = i / count;
        // Параболическая функция: минимум в середине, максимум по краям
        opacity = 0.1 + 0.9 * (1 - Math.pow(2 * Math.abs(normalizedPos - 0.5), 1.5));
      }
      
      // Парсим цвет для применения opacity
      let fillColor = dotsColor;
      if (isOuter && outerDotsGradient) {
        const rgbaMatch = dotsColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch) {
          const [, r, g, b, a = '1'] = rgbaMatch;
          const baseAlpha = parseFloat(a);
          fillColor = `rgba(${r}, ${g}, ${b}, ${baseAlpha * opacity})`;
        }
      }
      
      dots.push(
        <circle
          key={`dot-${radiusOffset}-${i}`}
          cx={x}
          cy={y}
          r={dotsSize}
          fill={fillColor}
          style={isOuter && outerDotsGradient && !dotsColor.includes('rgba') ? { opacity } : undefined}
        />
      );
    }
    return dots;
  };
  
  // Определяем цвет stroke - либо градиент, либо переданный цвет
  const strokeColor = progressColor === 'gradient' ? `url(#${gradientId})` : progressColor;
  
  // Вычисляем высоту контейнера в зависимости от arcAngle
  const getContainerHeight = () => {
    if (arcAngle >= 270) return size * 0.87; // Для 270° и больше (стандартный спидометр)
    if (arcAngle >= 200) return size * 0.7; // Для 200-270° (больше половины)
    if (arcAngle >= 180) return size * 0.5;  // Для 180° (половина круга)
    return size * (arcAngle / 360);           // Для меньших углов
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`} 
      style={{ width: size, height: getContainerHeight(), overflow: 'visible' }}
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        {/* Определение градиента */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--chart-gradient-start, #06b6d4)" />
            <stop offset="50%" stopColor="var(--chart-gradient-middle, #3b82f6)" />
            <stop offset="100%" stopColor="var(--chart-gradient-end, #6366F1)" />
          </linearGradient>
        </defs>
        
        {/* Декоративные точки */}
        {showDots && (
          <g>
            {showOuterDots && generateDots(finalStrokeWidth / 2 + dotsOffset, outerDotsCount, true)}
            {showInnerDots && generateDots(-finalStrokeWidth / 2 - dotsOffset, innerDotsCount, false)}
          </g>
        )}
        
        {/* Дуги */}
        <g style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: 'center' }}>
          {/* Фоновая дуга */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={finalStrokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          
          {/* Дуга прогресса */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={finalStrokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </g>
      </svg>
      
      {/* Текст в центре */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-[13px]">
          <div 
            style={{ 
              fontSize: 'var(--speedometer-percentage-size, 1.625rem)',
              fontWeight: 700,
              lineHeight: 1,
              color: 'var(--text-primary)',
            }}
          >
            {Math.round(clampedProgress)}%
          </div>
          
          {label && (
            <div 
              style={{ 
                fontSize: 'var(--text-2xs)',
                fontWeight: 600,
                lineHeight: 1,
                marginTop: '6px',
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

SpeedometerChart.displayName = 'SpeedometerChart';
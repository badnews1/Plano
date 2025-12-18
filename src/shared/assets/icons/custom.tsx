import React from 'react';

/**
 * Кастомные SVG иконки
 * 
 * Здесь размещаются собственные SVG компоненты, которые не входят в Lucide React.
 * Все кастомные иконки должны соответствовать интерфейсу LucideIcon.
 */

/** Иконка маленького заполненного круга */
export const SmallFilledCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" />
  </svg>
);

/**
 * 🎨 ColorPicker — Современный color picker на Radix UI Popover
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { COLOR_VARIANTS } from '@/shared/constants/colors';
import { Check } from '@/shared/assets/icons/system';
import type { ColorPickerProps } from './ColorPicker.types';
import type { ColorVariant } from '@/shared/constants/colors';

/**
 * ColorPicker - компонент выбора цвета с сеткой 5x4
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  open,
  onOpenChange,
  children,
  className = '',
}) => {
  const { t } = useTranslation('ui');
  const [internalOpen, setInternalOpen] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================

  const handleSelectColor = (color: ColorVariant) => {
    onChange(color);
    // Закрываем popover после выбора
    onOpenChange?.(false);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children || (
          <button
            type="button"
            className={`w-[38px] h-[38px] rounded flex items-center justify-center transition-all hover:opacity-80 cursor-pointer ${className}`}
            style={{ backgroundColor: 'var(--bg-primary)' }}
            aria-label={t('ui.selectColor')}
          >
            {/* Цветной кружок внутри кнопки */}
            <div 
              className="w-5 h-5 rounded-full"
              style={{
                backgroundColor: `var(--palette-${value}-text)`,
              }}
            />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent 
        className="p-3 w-auto"
        align="start"
        sideOffset={8}
      >
        {/* Сетка цветов 5x4 */}
        <div className="grid grid-cols-5 gap-2">
          {COLOR_VARIANTS.map((color) => {
            const isSelected = value === color;
            
            return (
              <Button
                key={color}
                onClick={() => handleSelectColor(color)}
                variant="outline"
                className="relative w-8 h-8 p-0 transition-all hover:scale-110 border-[var(--border-secondary)]"
                style={{
                  backgroundColor: `var(--palette-${color}-text)`,
                }}
                aria-label={color}
                aria-pressed={isSelected}
              >
                {/* Галочка для выбранного цвета */}
                {isSelected && (
                  <Check 
                    className="absolute inset-0 m-auto w-4 h-4 drop-shadow-sm"
                    style={{
                      color: 'var(--bg-primary)',
                    }}
                  />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
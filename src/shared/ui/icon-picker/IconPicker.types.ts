/**
 * IconPicker Types — Типы для пикера иконок
 */

import type { ReactNode } from 'react';
import type { LucideIcon } from '@/shared/assets/icons/system';

/** Опция иконки */
export interface IconOption {
  key: string;
  label: string;
  Icon: LucideIcon | React.FC<{ className?: string }>;
}

/** Props для компонента IconPicker */
export interface IconPickerProps {
  /** Ключ выбранной иконки */
  value: string;
  /** Callback при выборе иконки */
  onChange: (iconKey: string) => void;
  /** Массив опций иконок */
  iconOptions: IconOption[];
  /** Маппинг ключ -> компонент иконки */
  iconMap: Record<string, LucideIcon | React.FC<{ className?: string }>>;
  /** Компонент иконки по умолчанию (опционально, по умолчанию используется target) */
  defaultIcon?: LucideIcon | React.FC<{ className?: string }>;
  /** Controlled состояние открытия */
  open?: boolean;
  /** Callback изменения состояния открытия */
  onOpenChange?: (open: boolean) => void;
  /** Кастомный триггер */
  children?: ReactNode;
  /** CSS класс */
  className?: string;
  /** Показывать ли поле поиска (по умолчанию true) */
  showSearch?: boolean;
  /** Label для aria-label кнопки (по умолчанию "Select Icon") */
  ariaLabel?: string;
}
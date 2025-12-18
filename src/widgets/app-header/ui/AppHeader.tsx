/**
 * Универсальный header приложения
 * 
 * Переиспользуемый виджет для отображения header'а на всех страницах приложения.
 * Обеспечивает единообразный дизайн (отступы, высота, стили) и позволяет
 * кастомизировать содержимое через пропсы.
 * 
 * @module widgets/app-header/ui/AppHeader
 * @created 1 декабря 2025
 * @updated 1 декабря 2025 - унификация сепаратора на shadcn Separator
 * @updated 17 декабря 2025 - добавлена accessibility поддержка (role, aria-label)
 * @updated 17 декабря 2025 - отступы используют CSS переменные для 4K адаптации
 */

import React from 'react';
import { Separator } from '@/components/ui/separator';

interface AppHeaderProps {
  /** Левый элемент (иконка, кнопка назад и т.д.) */
  leftElement?: React.ReactNode;
  
  /** Заголовок страницы */
  title: string;
  
  /** Правый элемент (опционально, для будущих нужд) */
  rightElement?: React.ReactNode;
}

export function AppHeader({ leftElement, title, rightElement }: AppHeaderProps) {
  return (
    <header 
      className="sticky top-0 z-[var(--z-sticky)] bg-bg-primary"
      role="banner"
      aria-label={`Заголовок страницы: ${title}`}
    >
      {/* Обёртка с отступами - синхронизирована с PageContainer */}
      <div 
        className="w-full max-w-[var(--container-max-width)] mx-auto flex items-center gap-2"
        style={{ 
          paddingLeft: 'var(--page-padding-x)',
          paddingRight: 'var(--page-padding-x)',
          height: 'var(--header-height)'
        }}
      >
        {leftElement}
        <h1 className="text-base text-text-primary">{title}</h1>
        {rightElement && (
          <nav className="ml-auto" aria-label="Действия страницы">
            {rightElement}
          </nav>
        )}
      </div>
      <Separator />
    </header>
  );
}
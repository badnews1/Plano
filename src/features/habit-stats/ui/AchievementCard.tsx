/**
 * Карточка достижения
 * 
 * Отображает:
 * - Иконку и название достижения
 * - Редкость (common/rare/epic/legendary)
 * - Прогресс-бар
 * - Статус (разблокировано/заблокировано)
 * - Sparkles эффект для разблокированных
 * 
 * Дизайн из образца new-file3.tsx
 * 
 * @module features/habit-stats/ui/AchievementCard
 * @created 15 декабря 2025
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Achievement } from '../model/achievements';
import * as systemIcons from '@/shared/assets/icons/system';
import { Check } from '@/shared/assets/icons/system';

interface AchievementCardProps {
  achievement: Achievement;
}

/**
 * Получает CSS переменные для редкости
 */
function getRarityColors(rarity: Achievement['rarity']) {
  switch (rarity) {
    case 'common':
      return {
        bg: 'var(--palette-gray-bg)',
        border: 'var(--palette-gray-border)',
        text: 'var(--palette-gray-text)',
      };
    case 'rare':
      return {
        bg: 'var(--palette-blue-bg)',
        border: 'var(--palette-blue-border)',
        text: 'var(--palette-blue-text)',
      };
    case 'epic':
      return {
        bg: 'var(--palette-purple-bg)',
        border: 'var(--palette-purple-border)',
        text: 'var(--palette-purple-text)',
      };
    case 'legendary':
      return {
        bg: 'var(--palette-yellow-bg)',
        border: 'var(--palette-yellow-border)',
        text: 'var(--palette-yellow-text)',
      };
  }
}

/**
 * Получает цвет для достижения из palette
 */
function getAchievementColor(color: string): string {
  return `var(--palette-${color}-text)`;
}

/**
 * Получает фон для достижения
 */
function getAchievementBg(color: string): string {
  return `var(--palette-${color}-bg)`;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { t } = useTranslation();
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const progressPercent = Math.min((achievement.progress / achievement.total) * 100, 100);
  const rarityColors = getRarityColors(achievement.rarity);
  const achievementColor = getAchievementColor(achievement.color);
  const achievementBg = getAchievementBg(achievement.color);

  // Генерируем sparkles для разблокированных достижений
  useEffect(() => {
    if (achievement.unlocked) {
      setSparkles(
        Array.from({ length: 4 }, (_, i) => ({
          id: i,
          x: 20 + Math.random() * 60,
          y: 20 + Math.random() * 60,
          delay: Math.random() * 2,
        }))
      );
    }
  }, [achievement.unlocked]);

  // Получаем иконку из system.ts
  const IconComponent = systemIcons[achievement.icon as keyof typeof systemIcons] || systemIcons.Star;

  return (
    <div
      className={`relative rounded-md p-4 transition-all ${achievement.unlocked ? 'hover:scale-[1.02]' : ''}`}
      style={{
        background: achievement.unlocked
          ? `linear-gradient(135deg, ${achievementBg} 0%, color-mix(in srgb, var(--bg-secondary) 2%, transparent) 100%)`
          : 'var(--bg-tertiary)',
        border: `1px solid ${achievement.unlocked ? achievementColor : 'var(--border-primary)'}`,
        opacity: achievement.unlocked ? 1 : 0.6,
      }}
    >
      {/* Sparkles для разблокированных */}
      {achievement.unlocked && (
        <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="absolute w-1 h-1 rounded-full achievement-sparkle"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                background: achievementColor,
                boxShadow: `0 0 4px ${achievementColor}`,
                '--sparkle-delay': `${s.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex items-start gap-3">
        {/* Иконка */}
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${
            achievement.unlocked ? '' : 'grayscale'
          }`}
          style={{
            background: achievementBg,
            color: achievementColor,
          }}
        >
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="font-semibold truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {t(achievement.titleKey)}
            </h4>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded uppercase flex-shrink-0"
              style={{
                background: rarityColors.bg,
                color: rarityColors.text,
                border: `1px solid ${rarityColors.border}`,
                fontWeight: 500,
              }}
            >
              {t(`stats:achievements.rarity.${achievement.rarity}`)}
            </span>
          </div>
          <p className="text-[11px] mb-2" style={{ color: 'var(--text-tertiary)' }}>
            {t(achievement.descriptionKey)}
          </p>

          {/* Прогресс-бар */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--bg-quaternary)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: achievementColor,
                }}
              />
            </div>
            <span className="text-[10px] w-12 text-right" style={{ color: 'var(--text-tertiary)' }}>
              {achievement.progress}/{achievement.total}
            </span>
          </div>
        </div>

        {/* Индикатор разблокировки */}
        {achievement.unlocked && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: achievementColor }}
          >
            <Check className="w-3 h-3" style={{ color: 'white', strokeWidth: 3 }} />
          </div>
        )}
      </div>

      {/* Стили для анимации sparkles */}
      <style>{`
        .achievement-sparkle {
          animation: achievementSparkle 2s ease-in-out infinite;
          animation-delay: var(--sparkle-delay);
        }
        @keyframes achievementSparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
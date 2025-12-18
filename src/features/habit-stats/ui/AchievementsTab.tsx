/**
 * Таб достижений
 * 
 * Отображает:
 * - Статистику по разблокированным достижениям
 * - Счетчики по редкости
 * - Список разблокированных достижений
 * - Список достижений в прогрессе
 * 
 * Дизайн из образца new-file3.tsx
 * 
 * @module features/habit-stats/ui/AchievementsTab
 * @created 15 декабря 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Achievement, AchievementRarity } from '../model/achievements';
import { AchievementCard } from './AchievementCard';
import { Trophy } from '@/shared/assets/icons/system';

interface AchievementsTabProps {
  achievements: Achievement[];
}

/**
 * Получает цвета для редкости
 */
function getRarityColors(rarity: AchievementRarity) {
  switch (rarity) {
    case 'common':
      return {
        bg: 'var(--palette-gray-bg)',
        text: 'var(--palette-gray-text)',
      };
    case 'rare':
      return {
        bg: 'var(--palette-blue-bg)',
        text: 'var(--palette-blue-text)',
      };
    case 'epic':
      return {
        bg: 'var(--palette-purple-bg)',
        text: 'var(--palette-purple-text)',
      };
    case 'legendary':
      return {
        bg: 'var(--palette-yellow-bg)',
        text: 'var(--palette-yellow-text)',
      };
  }
}

export function AchievementsTab({ achievements }: AchievementsTabProps) {
  const { t } = useTranslation();

  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const rarities: AchievementRarity[] = ['common', 'rare', 'epic', 'legendary'];

  return (
    <div className="space-y-4">
      {/* Статистика */}
      <div
        className="flex items-center justify-between p-4 rounded-md"
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-primary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center"
            style={{ background: 'var(--palette-yellow-bg)' }}
          >
            <Trophy className="w-5 h-5" style={{ color: 'var(--palette-yellow-text)' }} />
          </div>
          <div>
            <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
              {unlocked.length}/{achievements.length}
            </div>
            <div
              className="text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {t('stats:achievements.unlocked')}
            </div>
          </div>
        </div>

        {/* Счетчики по редкости */}
        <div className="flex gap-2">
          {rarities.map((rarity) => {
            const count = achievements.filter((a) => a.rarity === rarity && a.unlocked).length;
            const total = achievements.filter((a) => a.rarity === rarity).length;
            const colors = getRarityColors(rarity);

            return (
              <div
                key={rarity}
                className="text-center px-3 py-1 rounded-md"
                style={{ background: colors.bg }}
              >
                <div className="font-black" style={{ color: colors.text }}>
                  {count}
                </div>
                <div className="text-[8px] uppercase" style={{ color: colors.text }}>
                  {t(`stats:achievements.rarity.${rarity}`)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Разблокированные достижения */}
      {unlocked.length > 0 && (
        <div>
          <h3
            className="text-[10px] tracking-widest uppercase mb-3"
            style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}
          >
            {t('stats:achievements.unlockedList')} ({unlocked.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {unlocked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Достижения в прогрессе */}
      {locked.length > 0 && (
        <div>
          <h3
            className="text-[10px] tracking-widest uppercase mb-3"
            style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}
          >
            {t('stats:achievements.inProgress')} ({locked.length})
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {locked.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/**
 * Система достижений для привычек
 * 
 * Структура:
 * - Типы достижений и редкости
 * - Конфигурация всех достижений
 * - Функция расчета прогресса достижений
 * 
 * @module features/habit-stats/model/achievements
 * @created 15 декабря 2025
 */

import type { Habit } from '@/entities/habit';
import { isHabitCompletedForDate, isDateAutoSkipped } from '@/entities/habit';
import type { VacationPeriod } from '@/entities/vacation';

/**
 * Редкость достижения
 */
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Категория достижения
 */
export type AchievementCategory = 'progress' | 'streak' | 'strength' | 'social' | 'special';

/**
 * Конфигурация достижения (базовая информация)
 */
export interface AchievementConfig {
  id: string;
  titleKey: string; // ключ для i18n
  descriptionKey: string; // ключ для i18n
  rarity: AchievementRarity;
  category: AchievementCategory;
  icon: string; // название иконки из system.ts
  color: string; // CSS переменная из globals.css (например, 'green')
}

/**
 * Достижение с прогрессом
 */
export interface Achievement extends AchievementConfig {
  progress: number; // текущий прогресс
  total: number; // требуемое значение
  unlocked: boolean; // разблокировано ли
}

/**
 * Конфигурация всех достижений
 */
export const achievementsConfig: AchievementConfig[] = [
  // ============================================
  // COMMON (Обычные)
  // ============================================
  {
    id: 'first_step',
    titleKey: 'stats:achievements.firstStep.title',
    descriptionKey: 'stats:achievements.firstStep.description',
    rarity: 'common',
    category: 'progress',
    icon: 'Target',
    color: 'green',
  },
  {
    id: 'week_warrior',
    titleKey: 'stats:achievements.weekWarrior.title',
    descriptionKey: 'stats:achievements.weekWarrior.description',
    rarity: 'common',
    category: 'streak',
    icon: 'Shield',
    color: 'blue',
  },
  {
    id: 'beginner_strength',
    titleKey: 'stats:achievements.beginnerStrength.title',
    descriptionKey: 'stats:achievements.beginnerStrength.description',
    rarity: 'common',
    category: 'strength',
    icon: 'TrendingUp',
    color: 'cyan',
  },
  {
    id: 'first_note',
    titleKey: 'stats:achievements.firstNote.title',
    descriptionKey: 'stats:achievements.firstNote.description',
    rarity: 'common',
    category: 'social',
    icon: 'FileText',
    color: 'violet',
  },
  {
    id: 'monday_master',
    titleKey: 'stats:achievements.mondayMaster.title',
    descriptionKey: 'stats:achievements.mondayMaster.description',
    rarity: 'common',
    category: 'special',
    icon: 'Calendar',
    color: 'indigo',
  },

  // ============================================
  // RARE (Редкие)
  // ============================================
  {
    id: 'consistency_king',
    titleKey: 'stats:achievements.consistencyKing.title',
    descriptionKey: 'stats:achievements.consistencyKing.description',
    rarity: 'rare',
    category: 'progress',
    icon: 'Crown',
    color: 'amber',
  },
  {
    id: 'gaining_power',
    titleKey: 'stats:achievements.gainingPower.title',
    descriptionKey: 'stats:achievements.gainingPower.description',
    rarity: 'rare',
    category: 'strength',
    icon: 'Zap',
    color: 'sky',
  },
  {
    id: 'unstoppable',
    titleKey: 'stats:achievements.unstoppable.title',
    descriptionKey: 'stats:achievements.unstoppable.description',
    rarity: 'rare',
    category: 'streak',
    icon: 'Flame',
    color: 'orange',
  },
  {
    id: 'emotional',
    titleKey: 'stats:achievements.emotional.title',
    descriptionKey: 'stats:achievements.emotional.description',
    rarity: 'rare',
    category: 'social',
    icon: 'Heart',
    color: 'pink',
  },
  {
    id: 'perfectionist',
    titleKey: 'stats:achievements.perfectionist.title',
    descriptionKey: 'stats:achievements.perfectionist.description',
    rarity: 'rare',
    category: 'special',
    icon: 'CheckSquare',
    color: 'emerald',
  },

  // ============================================
  // EPIC (Эпические)
  // ============================================
  {
    id: 'habit_master',
    titleKey: 'stats:achievements.habitMaster.title',
    descriptionKey: 'stats:achievements.habitMaster.description',
    rarity: 'epic',
    category: 'progress',
    icon: 'Trophy',
    color: 'purple',
  },
  {
    id: 'strong_habit',
    titleKey: 'stats:achievements.strongHabit.title',
    descriptionKey: 'stats:achievements.strongHabit.description',
    rarity: 'epic',
    category: 'strength',
    icon: 'Gauge',
    color: 'violet',
  },
  {
    id: 'tsunami',
    titleKey: 'stats:achievements.tsunami.title',
    descriptionKey: 'stats:achievements.tsunami.description',
    rarity: 'epic',
    category: 'streak',
    icon: 'BarChart3',
    color: 'rose',
  },
  {
    id: 'chronicler',
    titleKey: 'stats:achievements.chronicler.title',
    descriptionKey: 'stats:achievements.chronicler.description',
    rarity: 'epic',
    category: 'social',
    icon: 'BookOpen',
    color: 'fuchsia',
  },
  {
    id: 'phoenix',
    titleKey: 'stats:achievements.phoenix.title',
    descriptionKey: 'stats:achievements.phoenix.description',
    rarity: 'epic',
    category: 'special',
    icon: 'Sparkles',
    color: 'orange',
  },

  // ============================================
  // LEGENDARY (Легендарные)
  // ============================================
  {
    id: 'legend',
    titleKey: 'stats:achievements.legend.title',
    descriptionKey: 'stats:achievements.legend.description',
    rarity: 'legendary',
    category: 'progress',
    icon: 'Star',
    color: 'yellow',
  },
  {
    id: 'diamond_habit',
    titleKey: 'stats:achievements.diamondHabit.title',
    descriptionKey: 'stats:achievements.diamondHabit.description',
    rarity: 'legendary',
    category: 'strength',
    icon: 'Gem',
    color: 'cyan',
  },
  {
    id: 'supernova',
    titleKey: 'stats:achievements.supernova.title',
    descriptionKey: 'stats:achievements.supernova.description',
    rarity: 'legendary',
    category: 'streak',
    icon: 'Rocket',
    color: 'purple',
  },
  {
    id: 'unicorn',
    titleKey: 'stats:achievements.unicorn.title',
    descriptionKey: 'stats:achievements.unicorn.description',
    rarity: 'legendary',
    category: 'streak',
    icon: 'Infinity',
    color: 'pink',
  },
  {
    id: 'automatism',
    titleKey: 'stats:achievements.automatism.title',
    descriptionKey: 'stats:achievements.automatism.description',
    rarity: 'legendary',
    category: 'strength',
    icon: 'Award',
    color: 'amber',
  },
];

/**
 * Рассчитывает достижения для привычки
 */
export function calculateAchievements(
  habit: Habit,
  vacationPeriods: VacationPeriod[] = []
): Achievement[] {
  // Подготовка данных
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const habitStartDate = new Date(habit.startDate || habit.createdAt);
  habitStartDate.setHours(0, 0, 0, 0);

  // Считаем общее количество выполненных дней
  let totalCompleted = 0;
  let currentDate = new Date(habitStartDate);
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0] ?? '';
    if (isHabitCompletedForDate(habit, dateStr)) {
      totalCompleted++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Рассчитываем текущий стрик
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  currentDate = new Date(habitStartDate);
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split('T')[0] ?? '';
    const isCompleted = isHabitCompletedForDate(habit, dateStr);
    const isSkipped = habit.skipped?.[dateStr];
    const isAutoSkipped = isDateAutoSkipped(habit, dateStr, vacationPeriods);

    if (isCompleted || isSkipped || isAutoSkipped) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Текущий стрик с конца
  currentDate = new Date(today);
  while (currentDate >= habitStartDate) {
    const dateStr = currentDate.toISOString().split('T')[0] ?? '';
    const isCompleted = isHabitCompletedForDate(habit, dateStr);
    const isSkipped = habit.skipped?.[dateStr];
    const isAutoSkipped = isDateAutoSkipped(habit, dateStr, vacationPeriods);

    if (isCompleted || isSkipped || isAutoSkipped) {
      currentStreak++;
    } else {
      break;
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Сила привычки (используем strength вместо ema)
  const strength = habit.strength ?? 0;

  // Количество заметок
  const notesCount = Object.keys(habit.notes || {}).length;

  // Количество настроений
  const moodsCount = Object.keys(habit.moods || {}).length;

  // Считаем понедельники подряд
  let mondaysStreak = 0;
  currentDate = new Date(today);
  while (currentDate >= habitStartDate) {
    if (currentDate.getDay() === 1) {
      // Понедельник
      const dateStr = currentDate.toISOString().split('T')[0] ?? '';
      const isCompleted = isHabitCompletedForDate(habit, dateStr);
      if (isCompleted) {
        mondaysStreak++;
      } else {
        break;
      }
    }
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Проверяем 100% за месяц
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  let monthTotal = 0;
  let monthCompleted = 0;
  currentDate = new Date(monthStart);
  
  while (currentDate <= monthEnd && currentDate <= today) {
    monthTotal++;
    const dateStr = currentDate.toISOString().split('T')[0] ?? '';
    if (isHabitCompletedForDate(habit, dateStr)) {
      monthCompleted++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const monthPercentage = monthTotal > 0 ? (monthCompleted / monthTotal) * 100 : 0;

  // Проверяем восстановление (феникс)
  // Упрощенная логика: смотрим был ли спад силы больше чем на 40%
  const hasPhoenixRecovery = strength >= 75 && totalCompleted >= 30;

  // Маппинг достижений на прогресс
  return achievementsConfig.map((config): Achievement => {
    let progress = 0;
    let total = 0;
    let unlocked = false;

    switch (config.id) {
      // COMMON
      case 'first_step':
        progress = totalCompleted;
        total = 1;
        unlocked = totalCompleted >= 1;
        break;

      case 'week_warrior':
        progress = currentStreak;
        total = 7;
        unlocked = currentStreak >= 7;
        break;

      case 'beginner_strength':
        progress = Math.round(strength);
        total = 25;
        unlocked = strength >= 25;
        break;

      case 'first_note':
        progress = notesCount;
        total = 1;
        unlocked = notesCount >= 1;
        break;

      case 'monday_master':
        progress = mondaysStreak;
        total = 5;
        unlocked = mondaysStreak >= 5;
        break;

      // RARE
      case 'consistency_king':
        progress = totalCompleted;
        total = 30;
        unlocked = totalCompleted >= 30;
        break;

      case 'gaining_power':
        progress = Math.round(strength);
        total = 50;
        unlocked = strength >= 50;
        break;

      case 'unstoppable':
        progress = currentStreak;
        total = 14;
        unlocked = currentStreak >= 14;
        break;

      case 'emotional':
        progress = moodsCount;
        total = 10;
        unlocked = moodsCount >= 10;
        break;

      case 'perfectionist':
        progress = Math.round(monthPercentage);
        total = 100;
        unlocked = monthPercentage >= 100;
        break;

      // EPIC
      case 'habit_master':
        progress = totalCompleted;
        total = 50;
        unlocked = totalCompleted >= 50;
        break;

      case 'strong_habit':
        progress = Math.round(strength);
        total = 75;
        unlocked = strength >= 75;
        break;

      case 'tsunami':
        progress = currentStreak;
        total = 30;
        unlocked = currentStreak >= 30;
        break;

      case 'chronicler':
        progress = notesCount;
        total = 25;
        unlocked = notesCount >= 25;
        break;

      case 'phoenix':
        progress = hasPhoenixRecovery ? 1 : 0;
        total = 1;
        unlocked = hasPhoenixRecovery;
        break;

      // LEGENDARY
      case 'legend':
        progress = totalCompleted;
        total = 100;
        unlocked = totalCompleted >= 100;
        break;

      case 'diamond_habit':
        progress = Math.round(strength);
        total = 90;
        unlocked = strength >= 90;
        break;

      case 'supernova':
        progress = currentStreak;
        total = 60;
        unlocked = currentStreak >= 60;
        break;

      case 'unicorn':
        progress = currentStreak;
        total = 90;
        unlocked = currentStreak >= 90;
        break;

      case 'automatism':
        progress = Math.round(strength);
        total = 95;
        unlocked = strength >= 95;
        break;

      default:
        progress = 0;
        total = 1;
        unlocked = false;
    }

    return {
      ...config,
      progress: unlocked ? total : progress, // Если разблокировано - фиксируем на total
      total,
      unlocked,
    };
  });
}
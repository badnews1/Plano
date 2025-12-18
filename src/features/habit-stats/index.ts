/**
 * Фича просмотра статистики привычек
 * 
 * Предоставляет модальное окно с детальной статистикой:
 * - Сила привычки (EMA) с историей на графике
 * - Текущий и лучший стрик
 * - Месячный прогресс выполнения
 * - Возраст привычки
 * - Всего выполнений
 * - Система достижений
 * 
 * @module features/habit-stats
 * @migrated 30 ноября 2025 - миграция на FSD
 * @updated 9 декабря 2025 - добавлен виджет HabitStrengthHero, StreakCompact, CompletedCard и HabitAgeCard
 * @updated 15 декабря 2025 - добавлена система достижений
 */

export { HabitStatisticsModal } from './ui/HabitStatisticsModal';
export { HabitStrengthHero } from './ui/HabitStrengthHero';
export { StreakCompact } from './ui/StreakCompact';
export { CompletedCard } from './ui/CompletedCard';
export { HabitAgeCard } from './ui/HabitAgeCard';
export { AchievementCard } from './ui/AchievementCard';
export { AchievementsTab } from './ui/AchievementsTab';
export { calculateAchievements } from './model/achievements';
export type { Achievement, AchievementRarity, AchievementCategory } from './model/achievements';
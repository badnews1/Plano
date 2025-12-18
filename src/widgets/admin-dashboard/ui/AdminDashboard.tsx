/**
 * Dashboard для админской панели
 * 
 * Отображает основные метрики:
 * - Всего пользователей
 * - Активных пользователей (последние 7 дней)
 * - Всего привычек
 * - Среднее количество привычек на пользователя
 * 
 * @module widgets/admin-dashboard/ui/AdminDashboard
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - интеграция с Supabase
 */

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { User, CheckCircle, Target, TrendingUp } from '@/shared/assets/icons/system';
import { useMemo, useEffect, useState } from 'react';
import { serverFetch } from '../../../shared/lib/supabase/client';

// Типы для статистики
interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalHabits: number;
  avgHabitsPerUser: number;
}

export const AdminDashboard = () => {
  const { t } = useTranslation('admin');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalHabits: 0,
    avgHabitsPerUser: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем статистику при монтировании
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await serverFetch('/admin/stats');
        
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          console.error('Failed to fetch admin stats');
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Карточки статистики
  const statsCards = useMemo(() => [
    {
      title: t('admin.stats.totalUsers'),
      value: isLoading ? '...' : stats.totalUsers.toLocaleString(),
      icon: User,
      color: 'palette-blue-text',
      bgColor: 'palette-blue-bg',
    },
    {
      title: t('admin.stats.activeUsers'),
      value: isLoading ? '...' : stats.activeUsers.toLocaleString(),
      icon: CheckCircle,
      color: 'palette-green-text',
      bgColor: 'palette-green-bg',
    },
    {
      title: t('admin.stats.totalHabits'),
      value: isLoading ? '...' : stats.totalHabits.toLocaleString(),
      icon: Target,
      color: 'palette-purple-text',
      bgColor: 'palette-purple-bg',
    },
    {
      title: t('admin.stats.avgHabitsPerUser'),
      value: isLoading ? '...' : stats.avgHabitsPerUser.toFixed(1),
      icon: TrendingUp,
      color: 'palette-orange-text',
      bgColor: 'palette-orange-bg',
    },
  ], [t, stats, isLoading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `var(--${stat.bgColor})` }}
              >
                <Icon 
                  className="size-4"
                  style={{ color: `var(--${stat.color})` }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
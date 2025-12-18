/**
 * Виджет топ-10 привычек по проценту выполнения
 * 
 * Отображает рейтинг привычек, отсортированных по проценту выполнения.
 * Обёртка над компонентом TopHabitsRanking из entities с полной структурой Card.
 * 
 * @module widgets/habit-top10
 * @created 30 ноября 2025 - выделено из features/statistics/StrengthChart
 * @updated 1 декабря 2025 - обёрнут в Card компонент
 * @refactored 2 декабря 2025 - добавлена структура CardHeader + CardContent
 * @refactored 3 декабря 2025 - унификация отступов с HabitMonthlyStats
 */

import type { Habit, DateConfig } from '@/entities/habit';
import { TopHabitsRanking } from '@/entities/habit';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface HabitTop10Props {
  /** Список привычек для отображения рейтинга */
  habits: Habit[];
  /** Конфигурация дат (для расчёта процентов выполнения) */
  dateConfig: DateConfig;
}

/**
 * Виджет топ-10 привычек
 * 
 * Показывает рейтинг лучших привычек по проценту выполнения за месяц.
 * Делегирует логику расчёта компоненту TopHabitsRanking из entities,
 * сам отвечает только за структуру Card и отступы.
 */
export function HabitTop10({
  habits,
  dateConfig,
}: HabitTop10Props) {
  const { t } = useTranslation('stats');
  
  return (
    <Card className="p-4">
      {/* Заголовок виджета */}
      <CardHeader className="text-center pt-[12px] pr-[0px] pb-[0px] pl-[0px]">
        <span className="text-xs font-medium tracking-wider uppercase">
          {t('stats.top10Title')}
        </span>
      </CardHeader>
      
      {/* Список топ-10 привычек */}
      <CardContent className="p-0 pb-4">
        <TopHabitsRanking
          habits={habits}
          dateConfig={dateConfig}
        />
      </CardContent>
    </Card>
  );
}
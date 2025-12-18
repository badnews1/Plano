import { cn } from '@/components/ui/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Контейнер страницы с responsive отступами
 * 
 * Отступы используют CSS переменные:
 * - Базовые: 25px horizontal, 25px vertical
 * - 4K (3840px+): 38px horizontal, 38px vertical (×1.52)
 * 
 * Max-width: из CSS переменной --container-max-width
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        // Full width
        'w-full',
        
        // Max width из CSS переменной
        'max-w-[var(--container-max-width)]',

        // Центрирование контейнера на экране
        'mx-auto',

        // Spacing между дочерними элементами
        'space-y-4 sm:space-y-6',

        className
      )}
      style={{
        paddingLeft: 'var(--page-padding-x)',
        paddingRight: 'var(--page-padding-x)',
        paddingTop: 'var(--page-padding-y)',
        paddingBottom: 'var(--page-padding-y)',
      }}
    >
      {children}
    </div>
  );
}
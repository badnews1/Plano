import { useState, useEffect } from 'react';
import { BREAKPOINTS, getMediaQuery, type BreakpointKey } from '@/shared/config/breakpoints';

/**
 * React хук для отслеживания соответствия текущей ширины окна заданному breakpoint
 * 
 * Использует window.matchMedia() и подписывается на изменения размера окна.
 * Автоматически обновляет значение при resize.
 * 
 * @param breakpoint - Ключ breakpoint из BREAKPOINTS (xs, sm, md, lg, xl, 2xl)
 * @returns true если текущая ширина >= указанного breakpoint, иначе false
 * 
 * @example
 * ```typescript
 * // Проверка одного breakpoint
 * const isTablet = useBreakpoint('md'); // true если >= 768px
 * 
 * // Адаптивная логика
 * const isMobile = !useBreakpoint('md'); // true если < 768px
 * const isDesktop = useBreakpoint('lg'); // true если >= 1024px
 * 
 * // Условный рендеринг
 * {isTablet ? <TabletView /> : <MobileView />}
 * ```
 * 
 * @module shared/lib/hooks/useBreakpoint
 * @created 18 декабря 2025
 */
export function useBreakpoint(breakpoint: BreakpointKey): boolean {
  // SSR-безопасная инициализация (возвращаем false на сервере)
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(getMediaQuery(breakpoint)).matches;
  });

  useEffect(() => {
    // Проверяем что мы в браузере
    if (typeof window === 'undefined') return;

    // Создаем MediaQueryList
    const mediaQuery = window.matchMedia(getMediaQuery(breakpoint));

    // Обработчик изменения
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Устанавливаем начальное значение (на случай если изменилось между рендерами)
    setMatches(mediaQuery.matches);

    // Подписываемся на изменения
    // Используем современный API (addEventListener) вместо устаревшего addListener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup: отписываемся при размонтировании или изменении breakpoint
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return matches;
}

/**
 * Хук для получения текущего breakpoint (наибольший подходящий)
 * 
 * Возвращает наибольший breakpoint, которому соответствует текущая ширина окна.
 * Полезно для определения "в каком режиме мы сейчас".
 * 
 * @returns Текущий breakpoint или null если меньше xs
 * 
 * @example
 * ```typescript
 * const currentBreakpoint = useCurrentBreakpoint();
 * // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null
 * 
 * // Разная логика для разных breakpoints
 * switch (currentBreakpoint) {
 *   case 'xs':
 *   case 'sm':
 *     return <MobileLayout />;
 *   case 'md':
 *     return <TabletLayout />;
 *   default:
 *     return <DesktopLayout />;
 * }
 * ```
 */
export function useCurrentBreakpoint(): BreakpointKey | null {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey | null>(() => {
    if (typeof window === 'undefined') return null;
    return getCurrentBreakpoint();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Обработчик resize
    const handleResize = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    // Устанавливаем начальное значение
    setCurrentBreakpoint(getCurrentBreakpoint());

    // Подписываемся на resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return currentBreakpoint;
}

/**
 * Вспомогательная функция для определения текущего breakpoint
 * Проверяет все breakpoints от большего к меньшему
 */
function getCurrentBreakpoint(): BreakpointKey | null {
  if (typeof window === 'undefined') return null;

  const width = window.innerWidth;

  // Проверяем от большего к меньшему
  const breakpointKeys: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];

  for (const key of breakpointKeys) {
    if (width >= BREAKPOINTS[key]) {
      return key;
    }
  }

  return null; // Меньше xs
}

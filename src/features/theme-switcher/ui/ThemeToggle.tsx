/**
 * Feature: Theme Switcher - UI
 * 
 * Кнопка переключения темы (светлая/тёмная).
 * Отображает иконку солнца для светлой темы и луны для тёмной.
 */

import { useTranslation } from 'react-i18next';
import { Moon, Sun } from '@/shared/assets/icons/system';
import { useTheme } from '../model/useTheme';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { t } = useTranslation('app');
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-hover transition-colors"
            aria-label={isDark ? t('app.theme.switchToLight') : t('app.theme.switchToDark')}
          >
            {isDark ? (
              <Moon className="w-5 h-5 text-text-secondary" />
            ) : (
              <Sun className="w-5 h-5 text-text-secondary" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isDark ? t('app.theme.light') : t('app.theme.dark')}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
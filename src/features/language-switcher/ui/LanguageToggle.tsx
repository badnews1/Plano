import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Globe } from '@/shared/assets/icons/system';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../model';
import { useTranslation } from 'react-i18next';

/**
 * Кнопка переключения языка приложения
 * 
 * Особенности:
 * - Иконка глобуса (используем Globe из lucide-react)
 * - Tooltip с названием текущего языка
 * - Переключение между EN ↔ RU
 * - Минималистичный дизайн в стиле ThemeToggle
 */
export function LanguageToggle() {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const { t } = useTranslation('app');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLanguage}
          aria-label={t('app.language.toggle')}
          className="relative"
        >
          <Globe className="w-5 h-5" />
          {/* Маленький индикатор текущего языка */}
          <span className="absolute bottom-1 right-1 text-xs font-semibold opacity-60 uppercase">
            {currentLanguage}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={8}>
        {currentLanguage === 'en' 
          ? t('app.language.ru') 
          : t('app.language.en')}
      </TooltipContent>
    </Tooltip>
  );
}
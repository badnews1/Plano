/**
 * Компонент выбора языка через выпадающее меню
 * 
 * Отличия от LanguageToggle:
 * - Использует DropdownMenu вместо кнопки-переключателя
 * - Показывает полное название языка
 * - Более явный выбор языка для пользователя
 * 
 * Используется:
 * - На странице профиля для настройки языка
 * - Сохраняет выбор в Zustand store и синхронизирует с i18next
 * 
 * @module features/language-switcher/ui/LanguageSelect
 * @created 17 декабря 2025
 * @updated 17 декабря 2025 - переход с Select на DropdownMenu для лучшего UX
 */

import { useLanguage } from '../model';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check } from '@/shared/assets/icons/system';
import type { Language } from '@/app/store/slices/language';

// Конфигурация языков
const LANGUAGES = [
  { 
    code: 'en' as Language, 
  },
  { 
    code: 'ru' as Language, 
  },
] as const;

export function LanguageSelect() {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation('app');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="font-normal">
          {t(`app.language.${currentLanguage}`)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
          >
            <span className="flex-1">{t(`app.language.${lang.code}`)}</span>
            {currentLanguage === lang.code && (
              <Check className="size-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
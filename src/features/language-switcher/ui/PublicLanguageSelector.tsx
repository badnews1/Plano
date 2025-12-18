/**
 * Селектор языка для публичных страниц (неавторизованные пользователи)
 * 
 * Отличия от LanguageSelect и LanguageToggle:
 * - Работает без AuthContext (для неавторизованных пользователей)
 * - Изменяет язык только локально (i18next + Zustand store + localStorage)
 * - Минималистичный дизайн с иконкой глобуса и выпадающим списком
 * - Показывает флаг и название языка
 * 
 * Используется на:
 * - Landing Page
 * - Login Page
 * - SignUp Page
 * 
 * @module features/language-switcher/ui/PublicLanguageSelector
 * @created 17 декабря 2025
 */

import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import { Globe } from '@/shared/assets/icons/system';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import type { Language } from '@/app/store/slices/language';

// Конфигурация языков с флагами и названиями
const LANGUAGES = [
  { 
    code: 'en' as Language, 
    flag: '🇬🇧',
    nativeName: 'English',
  },
  { 
    code: 'ru' as Language, 
    flag: '🇷🇺',
    nativeName: 'Русский',
  },
] as const;

interface PublicLanguageSelectorProps {
  /**
   * Вариант отображения:
   * - 'minimal' - только иконка глобуса с индикатором (для навбара лендинга)
   * - 'full' - иконка + текст текущего языка (для страниц авторизации)
   */
  variant?: 'minimal' | 'full';
  
  /**
   * Размер кнопки
   */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Публичный селектор языка
 * Работает без авторизации, изменяет язык только локально
 */
export function PublicLanguageSelector({ 
  variant = 'minimal',
  size = 'default'
}: PublicLanguageSelectorProps) {
  const { i18n } = useTranslation();
  
  // Получаем текущий язык и функцию изменения из store
  const { currentLanguage, setLanguage } = useHabitsStore(
    useShallow((state) => ({
      currentLanguage: state.currentLanguage,
      setLanguage: state.setLanguage,
    }))
  );

  /**
   * Обработчик изменения языка
   * Обновляет язык в i18next и Zustand store (который сохраняет в localStorage)
   */
  const handleLanguageChange = (language: Language) => {
    // Обновляем i18next
    i18n.changeLanguage(language);
    
    // Обновляем store (автоматически сохранится в localStorage через middleware)
    setLanguage(language);
  };

  // Находим данные текущего языка
  const currentLang = LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === 'minimal' ? 'icon' : size}
          className="relative gap-2"
          aria-label="Выбрать язык"
        >
          <Globe className="w-5 h-5" />
          
          {variant === 'full' && currentLang && (
            <div className="flex items-center gap-2">
              <span>{currentLang.flag}</span>
              <span>{currentLang.nativeName}</span>
            </div>
          )}
          
          {variant === 'minimal' && (
            <span className="absolute bottom-1 right-1 text-xs font-semibold opacity-60 uppercase">
              {currentLanguage}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
            {lang.code === currentLanguage && (
              <span className="ml-auto text-accent-primary-indigo">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
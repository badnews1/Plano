import { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import { AuthContext } from '@/app/contexts/AuthContext';
import type { Language } from '@/app/store/slices/language';

/**
 * Хук для работы с языком приложения
 * 
 * Синхронизирует язык между:
 * - Zustand store (источник истины)
 * - i18next (для переводов)
 * - localStorage (персистентность)
 * - Supabase user_metadata (для авторизованных пользователей, опционально)
 * 
 * Примечание: Хук работает как внутри, так и вне AuthProvider.
 * Синхронизация с backend происходит только если хук вызван внутри AuthProvider.
 * 
 * @returns Объект с текущим языком и функцией переключения
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  
  // Безопасно получаем AuthContext (может быть undefined если вне AuthProvider)
  const auth = useContext(AuthContext);
  
  // ⚡ ОПТИМИЗАЦИЯ: объединяем вызовы store в один с useShallow
  const { currentLanguage, setLanguage } = useHabitsStore(
    useShallow((state) => ({
      currentLanguage: state.currentLanguage,
      setLanguage: state.setLanguage,
    }))
  );

  // Синхронизируем i18next с store при монтировании и при входе пользователя
  useEffect(() => {
    // Если пользователь авторизован и у него есть сохраненный язык - используем его
    if (auth?.user?.preferredLanguage && auth.user.preferredLanguage !== currentLanguage) {
      setLanguage(auth.user.preferredLanguage);
      i18n.changeLanguage(auth.user.preferredLanguage);
    } else if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, auth?.user?.preferredLanguage, i18n, setLanguage]);

  /**
   * Переключение языка
   */
  const toggleLanguage = () => {
    const newLanguage: Language = currentLanguage === 'en' ? 'ru' : 'en';
    changeLanguage(newLanguage);
  };

  /**
   * Установка конкретного языка
   */
  const changeLanguage = async (language: Language) => {
    // Обновляем локально
    setLanguage(language);
    i18n.changeLanguage(language);
    
    // Если пользователь авторизован и backend доступен - сохраняем на backend
    if (auth?.user && auth?.updateLanguage) {
      try {
        await auth.updateLanguage(language);
      } catch (error) {
        console.error('Ошибка при сохранении языка на сервере:', error);
        // Не показываем ошибку пользователю, язык уже изменен локально
      }
    }
  };

  return {
    currentLanguage,
    toggleLanguage,
    changeLanguage,
  };
}
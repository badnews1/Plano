import { StateCreator } from 'zustand';
import type { AppStore } from '../types';
import { getInitialLanguage } from '@/shared/lib/i18n';
import { syncSettings, saveSettingsToServer } from '@/entities/user';
import type { UserSettings } from '@/entities/user';

/**
 * Поддерживаемые языки приложения
 */
export type Language = 'en' | 'ru';

/**
 * Слайс для управления языком приложения
 * 
 * Автоматически определяет язык в следующем порядке:
 * 1. Сохраненный язык в localStorage
 * 2. Язык браузера (navigator.language)
 * 3. Английский по умолчанию
 * 
 * При изменении языка - синхронизируется с сервером.
 */
export interface LanguageSlice {
  /** Текущий язык приложения */
  currentLanguage: Language;
  
  /** Установить язык */
  setLanguage: (language: Language) => void;
  
  /** Синхронизировать язык с сервером (вызывается при логине) */
  syncLanguageFromServer: (theme: string) => Promise<void>;
}

/**
 * Создание слайса управления языком
 */
export const createLanguageSlice: StateCreator<
  AppStore,
  [],
  [],
  LanguageSlice
> = (set, get) => ({
  // Состояние: автоматически определяем язык из localStorage или браузера
  currentLanguage: getInitialLanguage('app-language'),
  
  // Действия
  setLanguage: (language) =>
    set(() => {
      // Сохраняем выбор в localStorage для персистентности
      localStorage.setItem('app-language', language);
      
      // Синхронизируем с сервером (в фоновом режиме)
      syncLanguageToServer(language);
      
      return { currentLanguage: language };
    }),
  
  syncLanguageFromServer: async (theme: string) => {
    try {
      const localSettings: UserSettings = {
        theme: theme as 'light' | 'dark',
        language: get().currentLanguage,
        updatedAt: new Date().toISOString(),
      };
      
      // Синхронизируем настройки с сервером (Last Write Wins)
      const syncedSettings = await syncSettings(localSettings);
      
      // Применяем синхронизированный язык
      if (syncedSettings.language !== get().currentLanguage) {
        console.log('[Language] Применяем язык с сервера:', syncedSettings.language);
        set({ currentLanguage: syncedSettings.language });
        localStorage.setItem('app-language', syncedSettings.language);
      }
    } catch (error) {
      console.error('[Language] Ошибка синхронизации языка с сервером:', error);
    }
  },
});

/**
 * Синхронизирует язык с сервером (в фоновом режиме)
 */
async function syncLanguageToServer(language: Language) {
  try {
    // Получаем текущую тему из localStorage
    const themeStore = localStorage.getItem('habit-tracker-theme');
    const theme = themeStore ? JSON.parse(themeStore).state.theme : 'light';
    
    const settings: UserSettings = {
      theme,
      language,
      updatedAt: new Date().toISOString(),
    };
    
    await saveSettingsToServer(settings);
    console.log('[Language] Язык синхронизирован с сервером');
  } catch (error) {
    // Игнорируем ошибки синхронизации (пользователь может быть не авторизован)
    console.debug('[Language] Не удалось синхронизировать язык с сервером (возможно, пользователь не авторизован)');
  }
}
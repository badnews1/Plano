/**
 * Feature: Theme Switcher
 * 
 * Zustand store для управления темой приложения (светлая/тёмная).
 * Тема сохраняется в localStorage и применяется через класс 'dark' на html элементе.
 * При изменении темы - синхронизируется с сервером.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { syncSettings, saveSettingsToServer } from '@/entities/user';
import type { UserSettings } from '@/entities/user';

type Theme = 'light' | 'dark';

interface ThemeState {
  /** Текущая тема */
  theme: Theme;
  /** Переключить тему на противоположную */
  toggleTheme: () => void;
  /** Установить конкретную тему */
  setTheme: (theme: Theme) => void;
  /** Синхронизировать тему с сервером (вызывается при логине) */
  syncThemeFromServer: (language: string) => Promise<void>;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          applyTheme(newTheme);
          
          // Синхронизируем с сервером (в фоновом режиме)
          syncThemeToServer(newTheme, get);
          
          return { theme: newTheme };
        }),
      
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
        
        // Синхронизируем с сервером (в фоновом режиме)
        syncThemeToServer(theme, get);
      },
      
      syncThemeFromServer: async (language: string) => {
        try {
          const localSettings: UserSettings = {
            theme: get().theme,
            language: language as 'ru' | 'en',
            updatedAt: new Date().toISOString(),
          };
          
          // Синхронизируем настройки с сервером (Last Write Wins)
          const syncedSettings = await syncSettings(localSettings);
          
          // Применяем синхронизированную тему
          if (syncedSettings.theme !== get().theme) {
            console.log('[Theme] Применяем тему с сервера:', syncedSettings.theme);
            set({ theme: syncedSettings.theme });
            applyTheme(syncedSettings.theme);
          }
        } catch (error) {
          console.error('[Theme] Ошибка синхронизации темы с сервером:', error);
        }
      },
    }),
    {
      name: 'habit-tracker-theme',
      // После загрузки из localStorage применяем тему
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

/**
 * Применяет тему к html элементу
 */
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Синхронизирует тему с сервером (в фоновом режиме)
 */
async function syncThemeToServer(theme: Theme, get: () => ThemeState) {
  try {
    // Получаем текущий язык из localStorage
    const languageStore = localStorage.getItem('habit-tracker-language');
    const language = languageStore ? JSON.parse(languageStore).state.language : 'en';
    
    const settings: UserSettings = {
      theme,
      language,
      updatedAt: new Date().toISOString(),
    };
    
    await saveSettingsToServer(settings);
    console.log('[Theme] Тема синхронизирована с сервером');
  } catch (error) {
    // Игнорируем ошибки синхронизации (пользователь может быть не авторизован)
    console.debug('[Theme] Не удалось синхронизировать тему с сервером (возможно, пользователь не авторизован)');
  }
}
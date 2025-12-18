export default {
  app: {
    habitTracker: "Трекер-привычек",
    profile: "Профиль",
    admin: "Админ панель",
    
    // Выход
    logout: {
      button: "Выйти",
      confirmTitle: "Вы уверены, что хотите выйти?",
      confirmDescription: "Это действие завершит вашу сессию и вы выйдете из приложения.",
      cancel: "Отмена",
      confirm: "Выйти",
    },
    
    // Тема
    theme: {
      light: "Светлая",
      dark: "Тёмная",
      switchToLight: "Переключить на светлую тему",
      switchToDark: "Переключить на тёмную тему",
    },
    
    // Язык
    language: {
      en: "English",
      ru: "Русский",
      toggle: "Переключить язык",
    }
  }
} as const;
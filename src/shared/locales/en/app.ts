export default {
  app: {
    habitTracker: "Habit Tracker",
    profile: "Profile",
    admin: "Admin Panel",
    
    // Logout
    logout: {
      button: "Logout",
      confirmTitle: "Are you sure you want to logout?",
      confirmDescription: "This action will end your session and log you out of the application.",
      cancel: "Cancel",
      confirm: "Logout",
    },
    
    // Theme
    theme: {
      light: "Light",
      dark: "Dark",
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
    
    // Language
    language: {
      en: "English",
      ru: "Russian",
      toggle: "Switch language",
    }
  }
} as const;
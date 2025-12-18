/**
 * Переводы для страниц авторизации (RU)
 * 
 * @module shared/locales/ru/auth
 * @created 17 декабря 2025
 */

export default {
  auth: {
    // Login Page
    login: {
      title: "Вход в аккаунт",
      subtitle: "Продолжай строить свои привычки",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      emailAria: "Email адрес",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      passwordAria: "Пароль",
      submitButton: "Войти",
      submitting: "Вход...",
      divider: "или",
      googleButton: "Войти через Google",
      noAccount: "Нет аккаунта?",
      signupLink: "Зарегистрироваться",
      backToHome: "← Вернуться на главную",
      errorGeneric: "Ошибка входа",
      errorGoogle: "Ошибка входа через Google",
    },

    // SignUp Page
    signup: {
      title: "Создание аккаунта",
      subtitle: "Начни строить лучшие привычки сегодня",
      nameLabel: "Имя",
      namePlaceholder: "Ваше имя",
      nameAria: "Полное имя",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      emailAria: "Email адрес",
      passwordLabel: "Пароль",
      passwordPlaceholder: "••••••••",
      passwordAria: "Пароль (минимум 6 символов)",
      passwordHint: "Минимум 6 символов",
      submitButton: "Создать аккаунт",
      submitting: "Создание...",
      divider: "или",
      googleButton: "Регистрация через Google",
      hasAccount: "Уже есть аккаунт?",
      loginLink: "Войти",
      backToHome: "← Вернуться на главную",
      errorGeneric: "Ошибка регистрации",
      errorGoogle: "Ошибка регистрации через Google",
      successTitle: "Успешно!",
      successMessage: "Ваш аккаунт успешно создан. Теперь вы можете войти.",
      successButton: "Перейти к входу",
    },

    // Общие элементы
    common: {
      clearingSession: "🧹 Обнаружена старая сессия, очищаем...",
    },
  }
} as const;

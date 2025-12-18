/**
 * Переводы для страниц авторизации (EN)
 * 
 * @module shared/locales/en/auth
 * @created 17 декабря 2025
 */

export default {
  auth: {
    // Login Page
    login: {
      title: "Log In",
      subtitle: "Continue building your habits",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      emailAria: "Email address",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      passwordAria: "Password",
      submitButton: "Log In",
      submitting: "Logging in...",
      divider: "or",
      googleButton: "Log in with Google",
      noAccount: "Don't have an account?",
      signupLink: "Sign Up",
      backToHome: "← Back to home",
      errorGeneric: "Login error",
      errorGoogle: "Google login error",
    },

    // SignUp Page
    signup: {
      title: "Create Account",
      subtitle: "Start building better habits today",
      nameLabel: "Name",
      namePlaceholder: "Your Name",
      nameAria: "Full name",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      emailAria: "Email address",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      passwordAria: "Password (minimum 6 characters)",
      passwordHint: "Minimum 6 characters",
      submitButton: "Create Account",
      submitting: "Creating...",
      divider: "or",
      googleButton: "Sign up with Google",
      hasAccount: "Already have an account?",
      loginLink: "Log In",
      backToHome: "← Back to home",
      errorGeneric: "Registration error",
      errorGoogle: "Google registration error",
      successTitle: "Success!",
      successMessage: "Your account has been created successfully. You can now log in.",
      successButton: "Go to Login",
    },

    // Общие элементы
    common: {
      clearingSession: "🧹 Old session detected, clearing...",
    },
  }
} as const;

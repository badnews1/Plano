/**
 * Переводы для лендинга (EN)
 * 
 * @module shared/locales/en/landing
 * @created 17 декабря 2025
 */

export default {
  landing: {
    // Навигация
    nav: {
      login: "Log in",
      signup: "Get Started",
      openApp: "Open App",
    },

    // Hero секция
    hero: {
      badge: "Your path to better habits",
      title: "Plano",
      tagline: "Small steps, big wins",
      description: "A simple and effective habit tracker that helps you achieve your goals every day. Track your progress, get analytics, and build your best self.",
      ctaStart: "Start for Free",
      ctaLearnMore: "Learn More",
    },

    // Features секция
    features: {
      title: "Everything for your habits",
      subtitle: "Simple and powerful tools to achieve your goals",
      
      tracking: {
        title: "Habit Tracking",
        description: "Mark your habits every day. Numeric habits, skips, notes — everything is under control.",
      },
      
      analytics: {
        title: "Analytics & Statistics",
        description: "Track your progress with detailed statistics, charts, and the habit strength system.",
      },
      
      reminders: {
        title: "Smart Reminders",
        description: "Get reminders at the right time. Configure the schedule for each habit individually.",
      },
      
      schedule: {
        title: "Flexible Schedule",
        description: "Set weekdays for each habit. Auto-skip inactive days and vacation mode.",
      },
      
      strength: {
        title: "Strength System",
        description: "A unique system for calculating habit strength based on execution consistency and history.",
      },
      
      categories: {
        title: "Categories & Goals",
        description: "Organize habits by categories. Set goals and track their achievement in real time.",
      },
    },

    // How It Works секция
    howItWorks: {
      title: "How it works",
      subtitle: "Three simple steps to your goals",
      
      step1: {
        title: "Create Habits",
        description: "Add the habits you want to develop. Set up icon, color, schedule, and reminders. Choose the type: regular, numeric, or with notes.",
      },
      
      step2: {
        title: "Track Completion",
        description: "Mark completed habits every day. Follow your current streak and habit strength. Add notes and track your mood.",
      },
      
      step3: {
        title: "Analyze Progress",
        description: "View detailed statistics: current streak, best streak, completion percentage. Use charts to visualize progress and find patterns.",
      },
      
      ctaTry: "Try Now",
    },

    // Preview секция
    preview: {
      title: "Simple and convenient interface",
      subtitle: "Everything you need for habit tracking in one place",
      placeholder: "App Screenshot",
    },

    // FAQ секция
    faq: {
      title: "Frequently Asked Questions",
      
      q1: {
        question: "How much does Plano cost?",
        answer: "Plano is completely free. All features are available without limitations.",
      },
      
      q2: {
        question: "Does data sync between devices?",
        answer: "Yes, after registration all your habits and progress automatically sync between all devices.",
      },
      
      q3: {
        question: "Can I use Plano offline?",
        answer: "Yes, the app works fully offline. Data syncs automatically when connected to the internet.",
      },
      
      q4: {
        question: "Is my data safe?",
        answer: "Yes, all data is stored securely and is only accessible to you. We don't share your information with third parties.",
      },
    },

    // Footer
    footer: {
      tagline: "Small steps, big wins.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  }
} as const;

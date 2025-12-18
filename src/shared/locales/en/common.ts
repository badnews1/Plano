export default {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this habit?",
    confirmDelete: "Confirm Deletion",
    edit: "Edit",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    apply: "Apply",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    add: "Add",
    remove: "Remove",
    clear: "Clear",
    reset: "Reset",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    month: "Month",
    year: "Year",
    done: "Done",
    today: "Today",
    skip: "Skip",
    disable: "Disable",
    joined: "Joined",
    totalHabits: "Total Habits",
    activeHabits: "Active Habits",
    archivedHabits: "Archived",
    settings: "Settings",
    theme: "Theme",
    themeDescription: "Choose your preferred theme",
    language: "Language",
    languageDescription: "Select your language",
    accountActions: "Account Actions",
    logout: "Logout",
    security: "Security",
    changePassword: "Change Password",
    changePasswordDescription: "Update your account password",
    currentPassword: "Current password",
    newPassword: "New password",
    confirmNewPassword: "Confirm new password",
    changing: "Changing..."
  },
  
  // Profile
  profile: {
    changeAvatar: "Change avatar",
    cropAvatar: "Crop avatar",
    cropAvatarDescription: "Adjust the image position and zoom to fit",
    zoom: "Zoom"
  },
  
  // Success messages
  success: {
    avatarUpdated: "Avatar updated successfully",
    passwordChanged: "Password changed successfully"
  },
  
  // Error messages
  errors: {
    avatarInvalidFormat: "Invalid file format. Only JPG and PNG are allowed",
    avatarFileTooLarge: "File is too large. Maximum size is {{size}}MB",
    avatarUploadFailed: "Failed to upload avatar. Please try again"
  },
  
  // Склонения и множественные формы
  plurals: {
    // Дни
    day_one: "day",
    day_other: "days",
    
    // Разы
    time_one: "time",
    time_other: "times",
    
    // Привычки
    habit_one: "habit",
    habit_other: "habits",
    
    // Напоминания
    reminder_one: "reminder",
    reminder_other: "reminders",
    
    // Фразы для частоты
    timesPerWeek_one: "time per week",
    timesPerWeek_other: "times per week",
    
    timesPerMonth_one: "time per month",
    timesPerMonth_other: "times per month",
    
    // Единицы измерения (ключи соответствуют UNIT_DEFINITIONS из @/shared/constants/units)
    // Counting units
    unit_times_one: "time",
    unit_times_other: "times",
    
    unit_pieces_one: "piece",
    unit_pieces_other: "pieces",
    
    unit_points_one: "point",
    unit_points_other: "points",
    
    unit_sets_one: "set",
    unit_sets_other: "sets",
    
    unit_tasks_one: "task",
    unit_tasks_other: "tasks",
    
    // Time units
    unit_minutes_one: "minute",
    unit_minutes_other: "minutes",
    
    unit_hours_one: "hour",
    unit_hours_other: "hours",
    
    // Distance units
    unit_steps_one: "step",
    unit_steps_other: "steps",
    
    unit_kilometers_one: "kilometer",
    unit_kilometers_other: "kilometers",
    
    unit_meters_one: "meter",
    unit_meters_other: "meters",
    
    // Weight units
    unit_kilograms_one: "kilogram",
    unit_kilograms_other: "kilograms",
    
    unit_grams_one: "gram",
    unit_grams_other: "grams",
    
    // Volume units
    unit_glasses_one: "glass",
    unit_glasses_other: "glasses",
    
    unit_liters_one: "liter",
    unit_liters_other: "liters",
    
    unit_milliliters_one: "milliliter",
    unit_milliliters_other: "milliliters",
    
    unit_portions_one: "serving",
    unit_portions_other: "servings",
    
    unit_cups_one: "cup",
    unit_cups_other: "cups",
    
    // Calorie units
    unit_calories_one: "calorie",
    unit_calories_other: "calories",
    
    // Reading units
    unit_pages_one: "page",
    unit_pages_other: "pages",
    
    unit_words_one: "word",
    unit_words_other: "words",
    
    unit_chapters_one: "chapter",
    unit_chapters_other: "chapters",
  },
  
  weekdays: {
    full: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
    short: {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    },
    shortest: {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    },
  },
  
  months: {
    short: {
      january: "Jan",
      february: "Feb",
      march: "Mar",
      april: "Apr",
      may: "May",
      june: "Jun",
      july: "Jul",
      august: "Aug",
      september: "Sep",
      october: "Oct",
      november: "Nov",
      december: "Dec"
    },
    full: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    },
    genitive: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    }
  },
  
  frequency: {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    custom: "Custom",
    timesPerWeek: "times per week",
    timesPerMonth: "times per month",
    specificDays: "Specific days",
    everyNDays: "Every N days",
    type: "Frequency Type",
    target: "Target"
  },
  
  notifications: {
    permission: {
      title: "Enable Notifications",
      description: "Get reminders for your habits to stay on track",
      enable: "Enable Notifications",
      dismiss: "Not Now"
    },
    granted: "Notifications enabled",
    denied: "Notifications blocked",
    default: "Notifications not configured",
    
    // Планировщик уведомлений
    scheduler: {
      // Типы напоминаний
      types: {
        habit: "Habits",
        task: "Tasks",
        finance: "Finance",
        event: "Events",
        other: "Other"
      },
      
      // Групповое уведомление
      groupedTitle_one: "You have {{count}} task for this time",
      groupedTitle_other: "You have {{count}} tasks for this time",
      
      // Уведомление о привычке
      habitReminder: "Time to complete habit: {{habitName}}"
    }
  }
} as const;
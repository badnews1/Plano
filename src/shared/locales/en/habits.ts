export default {
  habit: {
    title: "Habits",
    name: "Name",
    description: "Description",
    icon: "Icon",
    color: "Color",
    addHabit: "Add Habit",
    editHabit: "Edit Habit",
    deleteHabit: "Delete Habit",
    deleteSuccess: "Habit deleted",
    confirmDeleteDescription: "Habit \"{{habitName}}\" will be permanently deleted. All completion data will be lost.",
    confirmDeleteButton: "Delete",
    edit: "Edit",
    section: "Section",
    tags: "Tags",
    type: "Type",
    unit: "Unit",
    targetValue: "Target",
    frequency: "Frequency",
    notes: "NOTES",
    addNotes: "Add description...",
    noName: "No name",
    noHabits: "No habits yet",
    createFirstHabit: "Create your first habit to start tracking",
    // Actions in numeric input modal
    decrease: "Decrease",
    increase: "Increase",
    clearProgress: "Clear progress",
    setTarget: "Set target",
    // Habit notes
    noteLabel: "Note",
    notePlaceholder: "Add a note for this day...",
    moodLabel: "Mood",
    deleteNoteConfirm: "Are you sure you want to delete this note? This action cannot be undone.",
    noNotes: "No notes for this month",
    disableNotes: "Disable notes",
    disableNotesTitle: "Disable notes?",
    disableNotesDescription: "Notes will no longer appear after marking the habit as complete. Previously created notes will remain available in the habit statistics."
  },
  type: {
    binary: "Simple Checkbox",
    measurable: "Number Input",
    selectType: "Select Type",
    binaryDescription: "Complete or not complete",
    measurableDescription: "Track specific values"
  },
  target: {
    none: "No target",
    daily: "Daily target",
    weekly: "Weekly target",
    monthly: "Monthly target",
    value: "Target value",
    unit: "Unit"
  },
  // ℹ️ Единицы измерения перенесены в units.ts для устранения дублирования
  // Используйте units:units.{category}.{key} вместо habits:units.{key}
  completion: {
    completed: "Completed",
    notCompleted: "Not completed",
    partiallyCompleted: "Partially completed",
    markComplete: "Mark as complete",
    markIncomplete: "Mark as incomplete",
    enterValue: "Enter value",
    currentValue: "Current value",
    targetValue: "Target value"
  },
  frequency: {
    title: "Frequency",
    daily: "Every day",
    weekly: "Weekly",
    monthly: "Monthly",
    custom: "Custom",
    timesPerWeek: "{{count}} times per week",
    timesPerMonth: "{{count}} times per month",
    everyNDays: "Every {{count}} days",
    specificDays: "Specific days of the week",
    selectDays: "Select days",
    daysSelected: "{{count}} days selected",
    days: "Days",
    interval: "Interval",
    intervalLabel: "Repeat every N days",
    every: "Every",
    weekdays: "Weekdays",
    weekend: "Weekend",
    everyday: "Every day"
  },
  strength: {
    title: "Habit Strength",
    value: "Strength",
    description: "Habit strength shows how established this habit is based on your completion history"
  },
  reminders: {
    title: "Reminders",
    addReminder: "Add Reminder",
    add: "Add Reminder",
    editReminder: "Edit Reminder",
    deleteReminder: "Delete Reminder",
    noReminders: "No reminders",
    time: "Time",
    selectTime: "Select time",
    enabled: "Enabled",
    disabled: "Disabled",
    everyday: "Every day",
    everyNDays: "Every {{n}} days",
    nTimesWeek: "{{n}} times a week",
    nTimesMonth: "{{n}} times a month"
  },
  stats: {
    title: "Statistics",
    currentStreak: "Current Streak",
    longestStreak: "Longest Streak",
    completionRate: "Completion Rate",
    totalCompletions: "Total Completions",
    thisWeek: "This Week",
    thisMonth: "This Month",
    allTime: "All Time",
    progress: "Progress",
    history: "History",
    viewStats: "View Statistics"
  },
  filter: {
    all: "All Habits",
    active: "Active",
    completed: "Completed",
    notCompleted: "Not Completed",
    bySection: "By Section",
    byTag: "By Tag",
    sortBy: "Sort by",
    sortByName: "Name",
    sortByStrength: "Strength",
    sortByCreated: "Date Created",
    sortByCompletion: "Completion Rate"
  },
  manage: {
    title: "Manage Habits",
    settings: "Settings",
    general: "General",
    frequency: "Frequency",
    reminders: "Reminders",
    measurable: "Measurable Settings",
    deleteConfirm: "Are you sure you want to delete this habit?",
    filters: {
      tags: "Tags",
      sections: "Sections",
      trackingType: "Tracking Type",
      uncategorized: "Untagged"
    },
    delete: {
      title: "Delete Habit?",
      description: "Habit \"{{habitName}}\" and all completion history will be permanently deleted.",
      confirm: "Delete"
    }
  },
  calendar: {
    today: "Today",
    goToToday: "Go to today",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    selectMonth: "Select month",
    selectPeriod: "Select period"
  },
  form: {
    newHabit: "New Habit",
    editHabit: "Edit Habit",
    mainSettings: "Main Settings",
    additionalSettings: "Additional Settings",
    showAdditionalSettings: "Additional",
    hideAdditionalSettings: "Hide additional settings",
    nameAndIcon: "Name and Icon",
    startDate: "Start Date",
    selectDate: "Select date",
    section: "Section",
    tags: "Tags",
    trackingType: "Tracking Type",
    unitOfMeasurement: "Unit of Measurement",
    targetType: "Target Type",
    targetValue: "Target",
    targetPlaceholder: "e.g., 2 or 1.5",
    namePlaceholder: "e.g., Morning Run",
    description: "Description",
    frequency: "Frequency"
  },
  typePicker: {
    binaryTitle: "Simple Checkbox",
    binaryDescription: "For habits that are either done or not done.",
    binaryExample: "Example: \"Make the bed\", \"Meditation\"",
    measurableTitle: "Number Input",
    measurableDescription: "For habits where you need to reach a goal.",
    measurableExample: "Example: \"Drink 2L of water\", \"Read 10 pages\""
  },
  targetType: {
    min: "At least",
    max: "No more than"
  },
  notes: {
    label: "Description",
    placeholder: "Add description to the habit...",
    enableDailyNotes: "Enable daily notes",
    enableDailyNotesDescription: "Add notes when completing this habit"
  },
  frequencyConfig: {
    title: "Frequency",
    byDays: "By Days",
    perWeek: "Per Week",
    perMonth: "Per Month",
    interval: "Interval",
    every: "Every"
  },
  habitItem: {
    dragToReorder: "Drag to reorder",
    collapse: "Collapse",
    settings: "Habit settings",
    edit: "Edit",
    delete: "Delete habit",
    section: "Section",
    tags: "Tags",
    noTag: "No tag",
    clickToEdit: "Click to edit",
    untitled: "Untitled",
    usedInHabit: "habit",
    usedInHabits: "habits"
  },
  measurableSettings: {
    unit: "Unit of measurement",
    targetType: "Target Type",
    target: "Target",
    placeholder: "e.g., 2 or 1.5"
  },
  archive: {
    title: "Archive",
    archiveHabit: "Archive Habit",
    unarchiveHabit: "Unarchive",
    confirmArchive: "Archive habit?",
    confirmDescription: "Habit \"{{habitName}}\" will be hidden from the main list. Completion history will be preserved.",
    confirmButton: "Archive",
    emptyArchive: "Archive is empty",
    emptyArchiveDescription: "Archived habits will be displayed here",
    archivedHabits: "Archived Habits",
    deleteFromArchive: "Delete from archive",
    unarchiveSuccess: "Habit unarchived",
    archiveSuccess: "Habit archived"
  },
  tabs: {
    basic: "Basic",
    schedule: "Schedule",
    extra: "Extra"
  },
  measurable: {
    unit: "Unit",
    unitPlaceholder: "Select unit...",
    targetType: "Target Type",
    target: "Target",
    atLeast: "At least",
    atMost: "At most"
  },
  tags: {
    selectOne: "Select one or more tags"
  }
} as const;
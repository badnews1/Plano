export default {
  title: "Vacation Mode",
  newVacationTitle: "New Vacation",
  emptyStateTitle: "Vacation Mode",
  emptyStateDescription: "Create vacation periods to pause habit tracking. You can apply them to all habits or select specific ones.",
  createButton: "+ Add Vacation Period",
  editButton: "Edit",
  deleteButton: "Delete",
  cancelButton: "Cancel",
  saveButton: "Save",
  doneButton: "Done",
  backButton: "Back",
  
  createDialogTitle: "Create Vacation Period",
  createDialogDescription: "Pause habit tracking during vacation, travel, or any break you need.",
  editDialogTitle: "Edit Vacation Period",
  editDialogDescription: "Update the details of your vacation period.",
  
  reasonLabel: "Reason",
  reasonPlaceholder: "e.g., Travel",
  reasonRequired: "Reason is required",
  habitsRequired: "Select at least one habit",
  
  startDateLabel: "Start Date",
  endDateLabel: "End Date",
  
  dateRangeLabel: "Date Range",
  dateRangePlaceholder: "Select start and end dates",
  dateRangeRequired: "Date range is required",
  dateRangeOverlap: "This period overlaps with an existing vacation period",
  
  iconLabel: "Icon",
  
  pauseAllHabitsLabel: "Pause all habits",
  pauseAllHabitsDescription: "All your habits will be paused during this period",
  
  applyToAllLabel: "Apply to all habits",
  applyToAllDescription: "Enable vacation mode for all habits during this period",
  
  selectHabitsLabel: "Select habits to pause",
  selectHabitsDescription: "Choose which habits to pause during this period",
  selectAll: "Select all",
  deselectAll: "Deselect all",
  noHabitsSelected: "No habits selected",
  noHabitsAvailable: "No habits available",
  selectedCount: "selected",
  
  allHabitsPaused: "All habits paused",
  habitsCountPaused: "{{count}} of {{total}} habits paused",
  
  statusActive: "Active",
  statusUpcoming: "Upcoming",
  statusPast: "Past",
  
  periodDeleted: "Vacation period deleted",
  periodCreated: "Vacation period created",
  periodUpdated: "Vacation period updated",
  
  deleteConfirmTitle: "Delete vacation period?",
  deleteConfirmWarning: "⚠️ Warning:",
  deleteConfirmPoint1: "Days from this period will become regular days again",
  deleteConfirmPoint2: "This may affect statistics and habit completion percentages",
  deleteConfirmPoint3: "Completion marks made during vacation will be preserved",
  deleteConfirmCancel: "Cancel",
  deleteConfirmDelete: "Delete",
  
  selectIcon: "Select Icon",
  
  // Иконки для режима отдыха
  icons: {
    pill: "Illness",
    plane: "Travel",
    palmtree: "Beach Vacation",
    gift: "Holiday",
    home: "Home Rest",
    mountain: "Mountain Trip",
    briefcase: "Work/Deadlines",
    heart: "Family Event",
    snowflake: "Winter Holiday",
    cloudRain: "Bad Weather",
  },
} as const;
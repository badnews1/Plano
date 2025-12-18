export default {
  required: "This field is required",
  habitName: {
    required: "Habit name is required",
    minLength: "Habit name must be at least {{min}} characters",
    maxLength: "Habit name must be at most {{max}} characters",
    tooShort: "Habit name cannot be empty",
    tooLong: "Habit name must be at most {{max}} characters"
  },
  habitDescription: {
    tooLong: "Description must be at most {{max}} characters"
  },
  tagName: {
    tooShort: "Tag name cannot be empty",
    tooLong: "Tag name must be at most {{max}} characters"
  },
  vacationReason: {
    tooShort: "Vacation reason cannot be empty",
    tooLong: "Vacation reason must be at most {{max}} characters"
  },
  dayNote: {
    tooLong: "Note must be at most {{max}} characters"
  },
  target: {
    required: "Target value is required",
    positive: "Target must be a positive number",
    min: "Target must be at least {{min}}",
    max: "Target must be at most {{max}}"
  },
  frequency: {
    required: "Frequency is required",
    invalidDays: "Please select at least one day",
    invalidInterval: "Interval must be at least 1 day"
  },
  reminder: {
    timeRequired: "Time is required",
    invalidTime: "Please select a valid time"
  },
  section: {
    nameRequired: "Section name is required",
    nameExists: "Section with this name already exists"
  },
  tag: {
    nameRequired: "Tag name is required",
    nameExists: "Tag with this name already exists"
  }
} as const;
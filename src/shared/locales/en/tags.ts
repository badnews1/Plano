export default {
  tags: {
    // General
    tag: "Tag",
    tags: "Tags",
    
    // Actions
    addTag: "Add Tag",
    newTag: "New tag",
    selectOneOrMore: "Select one or more tags",
    
    // Messages
    tagAlreadyExists: "Tag already exists",
    
    // Delete confirmation
    deleteTagConfirm: "Delete Tag?",
    deleteConfirmTitle: "Delete Tag?",
    // Множественные формы для deleteConfirmMessage
    deleteConfirmMessage_one: "This tag is used in {{count}} habit. Deleting the tag will remove it from this habit.",
    deleteConfirmMessage_other: "This tag is used in {{count}} habits. Deleting the tag will remove it from all habits.",
    deleteConfirmMessageUnused: "Are you sure you want to delete this tag?",
    tagUsedIn: "Tag",
    isUsedIn: "is used in",
    willBeRemoved: "It will be removed from these items.",
    
    // Default tags (system tags)
    defaultTags: {
      health: "Health",
      study: "Study",
      work: "Work",
      sports: "Sports",
      nutrition: "Nutrition",
      sleep: "Sleep",
      creativity: "Creativity",
      selfDevelopment: "Self-Development",
      relationships: "Relationships",
      finance: "Finance",
      home: "Home",
    }
  }
} as const;
export default {
  tags: {
    // Общие
    tag: "Тег",
    tags: "Теги",
    
    // Действия
    addTag: "Добавить тег",
    newTag: "Новый тег",
    selectOneOrMore: "Выберите один или несколько тегов",
    
    // Сообщения
    tagAlreadyExists: "Тег уже существует",
    
    // Подтверждение удаления
    deleteTagConfirm: "Удалить тег?",
    deleteConfirmTitle: "Удалить тег?",
    // Множественные формы для deleteConfirmMessage (русский язык: one, few, many)
    deleteConfirmMessage_one: "Этот тег используется в {{count}} привычке. При удалении тега он будет удалён из этой привычки.",
    deleteConfirmMessage_few: "Этот тег используется в {{count}} привычках. При удалении тега он будет удалён из всех привычек.",
    deleteConfirmMessage_many: "Этот тег используется в {{count}} привычках. При удалении тега он будет удалён из всех привычек.",
    deleteConfirmMessageUnused: "Вы уверены, что хотите удалить этот тег?",
    tagUsedIn: "Тег",
    isUsedIn: "используется в",
    willBeRemoved: "Он будет удалён из этих элементов.",
    
    // Дефолтные теги (системные теги)
    defaultTags: {
      health: "Здоровье",
      study: "Учёба",
      work: "Работа",
      sports: "Спорт",
      nutrition: "Питание",
      sleep: "Сон",
      creativity: "Творчество",
      selfDevelopment: "Саморазвитие",
      relationships: "Отношения",
      finance: "Финансы",
      home: "Дом",
    }
  }
} as const;
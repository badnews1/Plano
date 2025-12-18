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
    deleteConfirmMessage: "Этот тег используется в {{count}} {{count === 1 ? 'привычке' : 'привычках'}}. При удалении тега он будет удален из всех привычек.",
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
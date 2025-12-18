export default {
  habit: {
    title: "Привычки",
    name: "Название",
    description: "Описание",
    icon: "Иконка",
    color: "Цвет",
    addHabit: "Добавить привычку",
    editHabit: "Редактировать привычку",
    deleteHabit: "Удалить привычку",
    deleteSuccess: "Привычка удалена",
    confirmDeleteDescription: "Привычка \"{{habitName}}\" будет удалена безвозвратно. Все данные о выполнении будут потеряны.",
    confirmDeleteButton: "Удалить",
    edit: "Редактировать",
    section: "Раздел",
    tags: "Теги",
    type: "Тип",
    unit: "Единица измерения",
    targetValue: "Целевое значение",
    frequency: "Частота",
    notes: "ЗАМЕТКИ",
    addNotes: "Добавить описание...",
    noName: "Без названия",
    noHabits: "Пока нет привычек",
    createFirstHabit: "Создайте свою первую привычку для начала отслеживания",
    // Действия в модальном окне с числовым вводом
    decrease: "Уменьшить",
    increase: "Увеличить",
    clearProgress: "Очистить прогресс",
    setTarget: "Установить цель",
    // Заметки к привычкам
    noteLabel: "Заметка",
    notePlaceholder: "Добавьте заметку к этому дню...",
    moodLabel: "Настроение",
    deleteNoteConfirm: "Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить.",
    noNotes: "Нет заметок за этот месяц",
    disableNotes: "Отключить заметки",
    disableNotesTitle: "Отключить заметки?",
    disableNotesDescription: "Заметки больше не будут появляться после отметки выполнения привычки. Ранее созданные заметки останутся доступны в статистике привычки."
  },
  type: {
    binary: "Простая отметка",
    measurable: "Ввод числа",
    selectType: "Выберите тип",
    binaryDescription: "Выполнено или не выполнено",
    measurableDescription: "Отслеживание конкретных значений"
  },
  target: {
    none: "Без цели",
    daily: "Ежедневная цель",
    weekly: "Еженедельная цель",
    monthly: "Ежемесячная цель",
    value: "Целевое значение",
    unit: "Единица измерения"
  },
  // ℹ️ Единицы измерения перенесены в units.ts для устранения дублирования
  // Используйте units:units.{category}.{key} вместо habits:units.{key}
  completion: {
    completed: "Выполнено",
    notCompleted: "Не выполнено",
    partiallyCompleted: "Частично выполнено",
    markComplete: "Отметить как выполненное",
    markIncomplete: "Отметить как невыполненное",
    enterValue: "Введите значение",
    currentValue: "Текущее значение",
    targetValue: "Целевое значение"
  },
  // ⚠️ Секция frequency - глобальный источник переводов для частоты привычек
  // Используется во всём приложении для настроек частоты выполнения
  // Ранее дублировалась в common.frequency - теперь единственный источник истины
  frequency: {
    title: "Частота",
    daily: "Каждый день",
    weekly: "Еженедельно",
    monthly: "Ежемесячно",
    custom: "Произвольно",
    timesPerWeek: "{{count}} раз в неделю",
    timesPerMonth: "{{count}} раз в месяц",
    everyNDays: "Каждые {{count}} дней",
    specificDays: "Определённые дни недели",
    selectDays: "Выберите дни",
    daysSelected: "Выбрано дней: {{count}}",
    days: "Дни",
    interval: "Интервал",
    intervalLabel: "Повторять каждые N дней",
    every: "Каждые",
    weekdays: "Будни",
    weekend: "Выходные",
    everyday: "Каждый день"
  },
  strength: {
    title: "Сила привычки",
    value: "Сила",
    description: "Сила привычки показывает насколько укоренилась привычка на основе истории выполнения"
  },
  reminders: {
    title: "Напоминания",
    addReminder: "Добавить напоминание",
    add: "Добавить напоминание",
    editReminder: "Редактировать напоминание",
    deleteReminder: "Удалить напоминание",
    noReminders: "Нет напоминаний",
    time: "Время",
    selectTime: "Выберите время",
    enabled: "Включено",
    disabled: "Отключено",
    everyday: "Каждый день",
    everyNDays: "Каждые {{n}} дней",
    nTimesWeek: "{{n}} раз в неделю",
    nTimesMonth: "{{n}} раз в месяц"
  },
  stats: {
    title: "Статистика",
    currentStreak: "Текущая серия",
    longestStreak: "Лучшая серия",
    completionRate: "Процент выполнения",
    totalCompletions: "Всего выполнений",
    thisWeek: "На этой неделе",
    thisMonth: "В этом месяце",
    allTime: "За всё время",
    progress: "Прогресс",
    history: "История",
    viewStats: "Посмотреть статистику"
  },
  filter: {
    all: "Все привычки",
    active: "Активные",
    completed: "Выполненные",
    notCompleted: "Не выполненные",
    bySection: "По разделу",
    byTag: "По тегу",
    sortBy: "Сортировать по",
    sortByName: "Названию",
    sortByStrength: "Силе",
    sortByCreated: "Дате создания",
    sortByCompletion: "Проценту выполнения"
  },
  manage: {
    title: "Управление привычками",
    settings: "Настройки",
    general: "Общие",
    frequency: "Частота",
    reminders: "Напоминания",
    measurable: "Настройки измеримой привычки",
    deleteConfirm: "Вы уверены, что хотите удалить эту привычку?",
    filters: {
      tags: "Теги",
      sections: "Разделы",
      trackingType: "Тип отслеживания",
      uncategorized: "Без тега"
    },
    delete: {
      title: "Удалить привычку?",
      description: "Привычка \"{{habitName}}\" и вся история выполнения будут удалены навсегда.",
      confirm: "Удалить"
    }
  },
  calendar: {
    today: "Сегодня",
    goToToday: "Перейти к сегодня",
    previousMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    selectMonth: "Выбрать месяц",
    selectPeriod: "Выбор периода"
  },
  form: {
    newHabit: "Новая привычка",
    editHabit: "Редактировать привычку",
    mainSettings: "Основные настройки",
    additionalSettings: "Дополнительные настройки",
    showAdditionalSettings: "Дополнительно",
    hideAdditionalSettings: "Скрыть дополнительные настройки",
    nameAndIcon: "Название и иконка",
    startDate: "Дата начала",
    selectDate: "Выберите дату",
    section: "Раздел",
    tags: "Теги",
    trackingType: "Тип отслеживания",
    unitOfMeasurement: "Единица измерения",
    targetType: "Тип цели",
    targetValue: "Цель",
    targetPlaceholder: "Например: 2 или 1.5",
    namePlaceholder: "Например: Утренняя пробежка",
    description: "Описание",
    frequency: "Частота"
  },
  typePicker: {
    binaryTitle: "Простая отметка",
    binaryDescription: "Для привычек, которые либо выполнены, либо нет.",
    binaryExample: "Напрмер: \"Заправить постель\", \"Медитация\"",
    measurableTitle: "Ввод числа",
    measurableDescription: "Для привычек, где нужно достичь цели.",
    measurableExample: "Например: \"Выпить 2л воды\", \"Прочитать 10 страниц\""
  },
  targetType: {
    min: "Не меньше",
    max: "Не больше"
  },
  notes: {
    label: "Описание",
    placeholder: "Добавьте описание к привычке...",
    enableDailyNotes: "Включить заметки",
    enableDailyNotesDescription: "Добавляйте заметки при выполнении привычки"
  },
  frequencyConfig: {
    title: "Частота",
    byDays: "По дням",
    perWeek: "В неделю",
    perMonth: "В месяц",
    interval: "Интервал",
    every: "Каждые"
  },
  habitItem: {
    dragToReorder: "Перетащите для изменения порядка",
    collapse: "Свернуть",
    settings: "Настройки привычки",
    edit: "Редактировать",
    delete: "Удалить привычку",
    section: "Раздел",
    tags: "Теги",
    noTag: "Без тега",
    clickToEdit: "Нажмите для редактирования",
    untitled: "Без названия",
    usedInHabit: "привычке",
    usedInHabits: "привычках"
  },
  measurableSettings: {
    unit: "Единица измрения",
    targetType: "Тип цели",
    target: "Цель",
    placeholder: "Например: 2 или 1.5"
  },
  archive: {
    title: "Архив",
    archiveHabit: "Архивировать привычку",
    unarchiveHabit: "Разархивировать",
    confirmArchive: "Архивировать привычку?",
    confirmDescription: "Привычка \"{{habitName}}\" будет скрыта из основного списка. История выполнения сохранится.",
    confirmButton: "Архивировать",
    emptyArchive: "Архив пуст",
    emptyArchiveDescription: "Здесь будут отображаться архивированные привычки",
    archivedHabits: "Архивированные привычки",
    deleteFromArchive: "Удалить из архива",
    unarchiveSuccess: "Привычка разархивирована",
    archiveSuccess: "Привычка архивирована"
  },
  tabs: {
    basic: "Основное",
    schedule: "Расписание",
    extra: "Дополнительно"
  },
  measurable: {
    unit: "Единица",
    unitPlaceholder: "Выберите единицу...",
    targetType: "Тип цели",
    target: "Цель",
    atLeast: "Не меньше",
    atMost: "Не больше"
  },
  tags: {
    selectOne: "Выберите один или несколько тегов"
  }
} as const;
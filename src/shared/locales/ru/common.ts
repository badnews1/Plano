export default {
  common: {
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    deleteConfirm: "Вы уверены, что хотите удалить эту привычку?",
    confirmDelete: "Подтвердите удаление",
    edit: "Изменить",
    close: "Закрыть",
    confirm: "Подтвердить",
    back: "Назад",
    next: "Далее",
    apply: "Применить",
    search: "Поиск",
    filter: "Фильтр",
    sort: "Сортировка",
    add: "Добавить",
    remove: "Удалить",
    clear: "Очистить",
    reset: "Сбросить",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
    warning: "Предупреждение",
    info: "Информация",
    month: "Месяц",
    year: "Год",
    done: "Готово",
    today: "Сегодня",
    skip: "Пропустить",
    disable: "Отключить",
    joined: "Присоединился",
    totalHabits: "Всего привычек",
    activeHabits: "Активных",
    archivedHabits: "Архивных",
    settings: "Настройки",
    theme: "Тема",
    themeDescription: "Выберите предпочитаемую тему",
    language: "Язык",
    languageDescription: "Выберите язык интерфейса",
    accountActions: "Действия с аккаунтом",
    logout: "Выйти",
    security: "Безопасность",
    changePassword: "Изменить пароль",
    changePasswordDescription: "Обновите пароль для вашего аккаунта",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmNewPassword: "Подтвердите новый пароль",
    changing: "Изменение..."
  },
  
  // Profile
  profile: {
    changeAvatar: "Изменить аватарку",
    cropAvatar: "Обрезать аватарку",
    cropAvatarDescription: "Отрегулируйте положение и масштаб изображения",
    zoom: "Масштаб"
  },
  
  // Success messages
  success: {
    avatarUpdated: "Аватарка успешно обновлена",
    passwordChanged: "Пароль успешно изменен"
  },
  
  // Error messages
  errors: {
    avatarInvalidFormat: "Неверный формат файла. Разрешены только JPG и PNG",
    avatarFileTooLarge: "Файл слишком большой. Максимальный размер {{size}}МБ",
    avatarUploadFailed: "Не удалось загрузить аватарку. Попробуйте еще раз"
  },
  
  // Склонения и множественные формы
  plurals: {
    // Дни
    day_one: "день",
    day_few: "дня",
    day_many: "дней",
    
    // Разы
    time_one: "раз",
    time_few: "раза",
    time_many: "раз",
    
    // Привычки
    habit_one: "привычка",
    habit_few: "привычки",
    habit_many: "привычек",
    
    // Напоминания
    reminder_one: "напоминание",
    reminder_few: "напоминания",
    reminder_many: "напоминаний",
    
    // Фразы для частоты
    timesPerWeek_one: "раз в неделю",
    timesPerWeek_few: "раза в неделю",
    timesPerWeek_many: "раз в неделю",
    
    timesPerMonth_one: "раз в месяц",
    timesPerMonth_few: "раза в месяц",
    timesPerMonth_many: "раз в месяц",
    
    // Единицы измерения (ключи соответствуют UNIT_DEFINITIONS из @/shared/constants/units)
    // Counting units
    unit_times_one: "раз",
    unit_times_few: "раза",
    unit_times_many: "раз",
    
    unit_pieces_one: "штука",
    unit_pieces_few: "штуки",
    unit_pieces_many: "штук",
    
    unit_points_one: "балл",
    unit_points_few: "балла",
    unit_points_many: "баллов",
    
    unit_sets_one: "подход",
    unit_sets_few: "подхода",
    unit_sets_many: "подходов",
    
    unit_tasks_one: "задача",
    unit_tasks_few: "задачи",
    unit_tasks_many: "задач",
    
    // Time units
    unit_minutes_one: "минута",
    unit_minutes_few: "минуты",
    unit_minutes_many: "минут",
    
    unit_hours_one: "час",
    unit_hours_few: "часа",
    unit_hours_many: "часов",
    
    // Distance units
    unit_steps_one: "шаг",
    unit_steps_few: "шага",
    unit_steps_many: "шагов",
    
    unit_kilometers_one: "километр",
    unit_kilometers_few: "километра",
    unit_kilometers_many: "километров",
    
    unit_meters_one: "метр",
    unit_meters_few: "метра",
    unit_meters_many: "метров",
    
    // Weight units
    unit_kilograms_one: "килограмм",
    unit_kilograms_few: "килограмма",
    unit_kilograms_many: "килограммов",
    
    unit_grams_one: "грамм",
    unit_grams_few: "грамма",
    unit_grams_many: "граммов",
    
    // Volume units
    unit_glasses_one: "стакан",
    unit_glasses_few: "стакана",
    unit_glasses_many: "стаканов",
    
    unit_liters_one: "литр",
    unit_liters_few: "литра",
    unit_liters_many: "литров",
    
    unit_milliliters_one: "миллилитр",
    unit_milliliters_few: "миллилитра",
    unit_milliliters_many: "миллилитров",
    
    unit_portions_one: "порция",
    unit_portions_few: "порции",
    unit_portions_many: "порций",
    
    unit_cups_one: "чашка",
    unit_cups_few: "чашки",
    unit_cups_many: "чашек",
    
    // Calorie units
    unit_calories_one: "калория",
    unit_calories_few: "калории",
    unit_calories_many: "калорий",
    
    // Reading units
    unit_pages_one: "страница",
    unit_pages_few: "страницы",
    unit_pages_many: "страниц",
    
    unit_words_one: "слово",
    unit_words_few: "слова",
    unit_words_many: "слов",
    
    unit_chapters_one: "глава",
    unit_chapters_few: "главы",
    unit_chapters_many: "глав",
  },
  
  weekdays: {
    full: {
      monday: "Понедельник",
      tuesday: "Вторник",
      wednesday: "Среда",
      thursday: "Четверг",
      friday: "Пятница",
      saturday: "Суббота",
      sunday: "Воскресенье",
    },
    short: {
      monday: "Пн",
      tuesday: "Вт",
      wednesday: "Ср",
      thursday: "Чт",
      friday: "Пт",
      saturday: "Сб",
      sunday: "Вс",
    },
    // В русском нет естественных сокращений короче 2 букв, поэтому shortest = short
    shortest: {
      monday: "Пн",
      tuesday: "Вт",
      wednesday: "Ср",
      thursday: "Чт",
      friday: "Пт",
      saturday: "Сб",
      sunday: "Вс",
    },
  },
  
  months: {
    short: {
      january: "Янв",
      february: "Фев",
      march: "Мар",
      april: "Апр",
      may: "Май",
      june: "Июн",
      july: "Июл",
      august: "Авг",
      september: "Сен",
      october: "Окт",
      november: "Ноя",
      december: "Дек"
    },
    full: {
      january: "Январь",
      february: "Февраль",
      march: "Март",
      april: "Апрель",
      may: "Май",
      june: "Июнь",
      july: "Июль",
      august: "Август",
      september: "Сентябрь",
      october: "Октябрь",
      november: "Ноябрь",
      december: "Декабрь"
    },
    genitive: {
      january: "января",
      february: "февраля",
      march: "марта",
      april: "апреля",
      may: "мая",
      june: "июня",
      july: "июля",
      august: "августа",
      september: "сентября",
      october: "октября",
      november: "ноября",
      december: "декабря"
    }
  },
  
  // ⚠️ Секция frequency удалена - используйте habits.frequency вместо этого
  
  notifications: {
    permission: {
      title: "Включите уведомления",
      description: "Получайте напоминания о важных событиях в выбранное время",
      enable: "Включить",
      dismiss: "Позже"
    },
    granted: "Уведомления включены",
    denied: "Уведомления заблокированы",
    default: "Уведомления не настроены",
    
    // Планировщик уведомлений
    scheduler: {
      // Типы напоминаний
      types: {
        habit: "Привычки",
        task: "Задачи",
        finance: "Финансы",
        event: "События", // Исправлено: было "обытия"
        other: "Другое"
      },
      
      // Групповое уведомление
      groupedTitle_one: "У вас {{count}} дело на это время",
      groupedTitle_few: "У вас {{count}} дела на это время",
      groupedTitle_many: "У вас {{count}} дел на это время",
      
      // Уведомление о привычке
      habitReminder: "Время выполнить привычку: {{habitName}}"
    }
  }
} as const;
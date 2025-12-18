export default {
  admin: {
    title: "Панель администратора",
    dashboard: "Панель управления",
    users: "Пользователи",
    
    // Статистика
    stats: {
      totalUsers: "Всего пользователей",
      activeUsers: "Активных пользователей",
      totalHabits: "Всего привычек",
      avgHabitsPerUser: "Привычек на пользователя",
    },
    
    // Таблица пользователей
    usersTable: {
      title: "Список пользователей",
      search: "Поиск пользователей...",
      loading: "Загрузка...",
      columns: {
        id: "ID",
        email: "Email",
        name: "Имя",
        role: "Роль",
        habits: "Привычек",
        joinedAt: "Дата регистрации",
        status: "Статус",
        actions: "Действия",
      },
      roles: {
        user: "Пользователь",
        admin: "Администратор",
      },
      status: {
        active: "Активен",
        blocked: "Заблокирован",
      },
      actions: {
        view: "Просмотр",
        block: "Заблокировать",
        unblock: "Разблокировать",
        delete: "Удалить",
      },
      empty: "Пользователи не найдены",
      noResults: "По вашему запросу ничего не найдено",
    },
    
    // Сообщения
    messages: {
      userBlocked: "Пользователь заблокирован",
      userUnblocked: "Пользователь разблокирован",
      userDeleted: "Пользователь удален",
      actionConfirm: "Вы уверены?",
    },
    
    // Навигация
    nav: {
      dashboard: "Панель управления",
      users: "Пользователи",
      settings: "Настройки",
      backToApp: "Вернуться в приложение",
    },
  }
} as const;
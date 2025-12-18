/**
 * Класс централизованного планировщика уведомлений
 * 
 * Singleton - используется единственный экземпляр для всего приложения
 */
class NotificationSchedulerClass {
  /** Хранилище напоминаний: Map<время, массив напоминаний> */
  private reminders: Map<string, ScheduledReminder[]> = new Map();
  
  /** Активные таймеры для каждого временного слота */
  private timers: Map<string, NodeJS.Timeout> = new Map();
  
  /** Cleanup функции для активных уведомлений */
  private cleanupFunctions: Map<string, (() => void)[]> = new Map();
  
  /** Конфигурация группировки */
  private config: NotificationGroupingConfig = {
    enabled: true,
    minCount: 2,
    groupByType: true
  };

  /**
   * Регистрация напоминания в планировщике
   * 
   * @param reminder - Напоминание для регистрации
   * @returns true если успешно, false если дубликат
   * 
   * @example
   * ```typescript
   * NotificationScheduler.register({
   *   id: 'habit-123-09:00',
   *   type: 'habit',
   *   time: '09:00',
   *   title: 'Зарядка',
   *   body: 'Время выполнить привычку: Зарядка',
   *   data: { habitId: '123' }
   * });
   * ```
   */
  register(reminder: ScheduledReminder): boolean {
    const { time, id } = reminder;
    
    // Получаем или создаём массив напоминаний для этого времени
    if (!this.reminders.has(time)) {
      this.reminders.set(time, []);
    }
    
    const timeSlot = this.reminders.get(time)!;
    
    // Проверка на дубликаты
    if (timeSlot.some(r => r.id === id)) {
      console.warn(`[NotificationScheduler] Дубликат напоминания: ${id}`);
      return false;
    }
    
    // Добавляем напоминание
    timeSlot.push(reminder);
    
    // Планируем показ уведомления
    this.scheduleNotification(time);
    
    console.log(`[NotificationScheduler] Зарегистрировано: ${id} на ${time}`);
    return true;
  }

  /**
   * Отмена напоминания
   * 
   * @param id - ID напоминания
   * @returns true если успешно удалено
   */
  unregister(id: string): boolean {
    let removed = false;
    
    // Ищем и удаляем напоминание из всех временных слотов
    this.reminders.forEach((reminders, time) => {
      const index = reminders.findIndex(r => r.id === id);
      if (index !== -1) {
        reminders.splice(index, 1);
        removed = true;
        
        // Если слот пустой, удаляем его и таймер
        if (reminders.length === 0) {
          this.reminders.delete(time);
          this.clearTimer(time);
        }
      }
    });
    
    if (removed) {
      console.log(`[NotificationScheduler] Удалено: ${id}`);
    }
    
    return removed;
  }

  /**
   * Обновление существующего напоминания
   * 
   * @param id - ID напоминания
   * @param updates - Обновления для применения
   */
  update(id: string, updates: Partial<ScheduledReminder>): boolean {
    // Сначала находим и удаляем старое
    const oldReminder = this.find(id);
    if (!oldReminder) {
      return false;
    }
    
    this.unregister(id);
    
    // Регистрируем обновлённое
    const newReminder = { ...oldReminder, ...updates };
    return this.register(newReminder);
  }

  /**
   * Поиск напоминания по ID
   */
  private find(id: string): ScheduledReminder | null {
    for (const reminders of this.reminders.values()) {
      const found = reminders.find(r => r.id === id);
      if (found) return found;
    }
    return null;
  }

  /**
   * Планирование показа уведомления на указанное время
   * 
   * @param time - Время в формате "HH:mm"
   */
  private scheduleNotification(time: string): void {
    // Если таймер уже существует, не создаём новый
    if (this.timers.has(time)) {
      return;
    }
    
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // Если время уже прошло сегодня, планируем на завтра
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const delay = scheduledTime.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      this.triggerNotifications(time);
      this.clearTimer(time);
    }, delay);
    
    this.timers.set(time, timer);
    
    console.log(`[NotificationScheduler] Запланировано на ${time} (через ${Math.round(delay / 1000 / 60)} мин)`);
  }

  /**
   * Показ уведомлений для указанного времени
   */
  private async triggerNotifications(time: string): Promise<void> {
    const reminders = this.reminders.get(time);
    
    if (!reminders || reminders.length === 0) {
      return;
    }
    
    // Фильтруем напоминания через shouldShow (если определен)
    const validReminders = reminders.filter(reminder => {
      if (reminder.shouldShow) {
        const shouldShow = reminder.shouldShow();
        if (!shouldShow) {
          console.log(`[NotificationScheduler] Пропуск ${reminder.id} - shouldShow вернул false`);
          return false;
        }
      }
      return true;
    });
    
    if (validReminders.length === 0) {
      console.log(`[NotificationScheduler] Все напоминания на ${time} отфильтрованы`);
      // После проверки удаляем напоминания
      this.reminders.delete(time);
      return;
    }
    
    console.log(`[NotificationScheduler] Показ ${validReminders.length} уведомлений на ${time}`);
    
    // Проверяем нужно ли группировать
    if (this.shouldGroup(validReminders)) {
      await this.showGroupedNotification(validReminders);
    } else {
      // Показываем каждое уведомление отдельно
      for (const reminder of validReminders) {
        await this.showSingleNotification(reminder);
      }
    }
    
    // После показа удаляем напоминания (они одноразовые)
    this.reminders.delete(time);
  }

  /**
   * Проверка нужно ли группировать уведомления
   */
  private shouldGroup(reminders: ScheduledReminder[]): boolean {
    if (!this.config.enabled) {
      return false;
    }
    
    const minCount = this.config.minCount ?? 2;
    return reminders.length >= minCount;
  }

  /**
   * Показ одного уведомления
   */
  private async showSingleNotification(reminder: ScheduledReminder): Promise<void> {
    try {
      const cleanup = await NotificationService.show({
        title: reminder.title,
        body: reminder.body,
        tag: reminder.id,
        icon: reminder.icon,
        data: reminder.data
      });
      if (cleanup) {
        if (!this.cleanupFunctions.has(reminder.id)) {
          this.cleanupFunctions.set(reminder.id, []);
        }
        this.cleanupFunctions.get(reminder.id)!.push(cleanup);
      }
    } catch (error) {
      console.error(`[NotificationScheduler] Ошибка показа уведомления ${reminder.id}:`, error);
    }
  }

  /**
   * Показ сгруппированного уведомления
   */
  private async showGroupedNotification(reminders: ScheduledReminder[]): Promise<void> {
    const count = reminders.length;
    
    let body = '';
    
    if (this.config.groupByType) {
      // Группируем по типам
      const byType = this.groupByType(reminders);
      
      const typeEmojis: Record<ReminderType, string> = {
        habit: '🎯',
        task: '✅',
        finance: '💰',
        event: '📅',
        other: '🔔'
      };
      
      Object.entries(byType).forEach(([type, items]) => {
        const emoji = typeEmojis[type as ReminderType] || '🔔';
        const label = i18n.t(`common:notifications.scheduler.types.${type}`, { defaultValue: type });
        const titles = items.map(r => r.title).join(', ');
        body += `${emoji} ${label}: ${titles}\n`;
      });
    } else {
      // Простой список
      body = reminders.map(r => `• ${r.title}`).join('\n');
    }
    
    // Заголовок с правильной формой множественного числа
    const title = i18n.t('common:notifications.scheduler.groupedTitle', { 
      count,
      defaultValue: `You have ${count} tasks for this time`
    });
    
    try {
      const cleanup = await NotificationService.show({
        title,
        body: body.trim(),
        tag: 'grouped-notification',
        data: { 
          grouped: true,
          reminders: reminders.map(r => r.data) 
        }
      });
      if (cleanup) {
        if (!this.cleanupFunctions.has('grouped-notification')) {
          this.cleanupFunctions.set('grouped-notification', []);
        }
        this.cleanupFunctions.get('grouped-notification')!.push(cleanup);
      }
    } catch (error) {
      console.error('[NotificationScheduler] Ошибка показа групповго уведомления:', error);
    }
  }

  /**
   * Группировка напоминаний по типу
   */
  private groupByType(reminders: ScheduledReminder[]): Record<string, ScheduledReminder[]> {
    const groups: Record<string, ScheduledReminder[]> = {};
    
    reminders.forEach(reminder => {
      const type = reminder.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      // ✅ Fix: noUncheckedIndexedAccess - проверяем что массив существует
      const typeGroup = groups[type];
      if (typeGroup) {
        typeGroup.push(reminder);
      }
    });
    
    return groups;
  }

  /**
   * Очистка таймера для временного слота
   */
  private clearTimer(time: string): void {
    const timer = this.timers.get(time);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(time);
    }
  }

  /**
   * Обновление конфигурации группировки
   */
  configure(config: Partial<NotificationGroupingConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('[NotificationScheduler] Конфигурация обновлена:', this.config);
  }

  /**
   * Получение текущей конфигурации
   */
  getConfig(): NotificationGroupingConfig {
    return { ...this.config };
  }

  /**
   * Получение статистики планировщика (для отладки)
   */
  getStats(): SchedulerStats {
    let totalReminders = 0;
    let maxRemindersInSlot = 0;
    const byType: Record<ReminderType, number> = {
      habit: 0,
      task: 0,
      finance: 0,
      event: 0,
      other: 0
    };
    
    this.reminders.forEach(reminders => {
      totalReminders += reminders.length;
      maxRemindersInSlot = Math.max(maxRemindersInSlot, reminders.length);
      
      reminders.forEach(r => {
        byType[r.type] = (byType[r.type] || 0) + 1;
      });
    });
    
    return {
      totalReminders,
      uniqueTimeSlots: this.reminders.size,
      byType,
      maxRemindersInSlot
    };
  }

  /**
   * Очистка всех напоминаний и таймеров (для тестов)
   */
  clear(): void {
    // Очищаем все таймеры
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    
    // Очищаем напоминания
    this.reminders.clear();
    
    // Вызываем cleanup функции
    this.cleanupFunctions.forEach(cleanupList => {
      cleanupList.forEach(cleanup => cleanup());
    });
    this.cleanupFunctions.clear();
    
    console.log('[NotificationScheduler] Очищено');
  }

  /**
   * Получение всех напоминаний (для отладки)
   */
  getAll(): Map<string, ScheduledReminder[]> {
    return new Map(this.reminders);
  }
}

// Singleton экземпляр
export const NotificationScheduler = new NotificationSchedulerClass();
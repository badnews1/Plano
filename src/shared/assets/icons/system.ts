/**
 * Системные иконки для интерфейса
 * 
 * Используются в компонентах UI, кнопках, навигации и других элементах интерфейса.
 * Эти иконки НЕ показываются пользователю в пикерах.
 */

export {
  Plus, // Плюс
  XIcon, // Крестик
  Check, // Галочка
  Minus, // Минус
  Eraser, // Ластик
  Undo, // Отменить
  RotateCcw, // Сбросить (стрелка против часовой)
  ChevronDown, // Стрелка вниз
  ChevronUp, // Стрелка вверх
  ChevronLeft, // Стрелка влево
  ChevronRight, // Стрелка вправо
  ArrowLeft, // Стрелка назад
  ArrowRight, // Стрелка вправо
  FastForward, // Двойная стрелка вправо (автопропуск дней)
  Circle, // Круг (точка для автопропуска)
  Settings, // Шестерёнка
  Filter, // Воронка
  Search, // Лупа
  AlertCircle, // Восклицательный знак
  Pause, // Пауза
  Bell, // Колокольчик
  BellOff, // Колокольчик выкл
  Tag, // Теги
  Hash, // Решётка
  CheckSquare, // Квадрат галочка
  Target, // Мишень
  BarChart3, // Гистограмма
  Calendar, // Календарь
  Clock, // Часы
  LayoutDashboard, // Панель
  Trash2, // Корзина
  GripVertical, // Ручка
  TrendingUp, // График вверх
  Edit, // Редактировать
  Pencil, // Карандаш
  Copy, // Копировать
  Loader2, // Спиннер загрузки
  Moon, // Луна (тёмная тема)
  Sun, // Солнце (светлая тема)
  User, // Пользователь
  Palette, // Палитра цветов
  Languages, // Языки (переключение языка)
  Globe, // Глобус (переключение языка)
  X, // Крестик (альтернатива XIcon)
  Sparkles, // Искры (демо, эксперименты)
  Archive, // Архив (коробка)
  ArchiveRestore, // Разархивировать (коробка со стрелкой)
  Gauge, // Спидометр
  BarChart2, // График статистики
  Package, // Пакет (компоненты)
  Palmtree, // Пальма (vacation mode)
  Square, // Квадрат (кнопки демо)
  Download, // Скачать
  Upload, // Загрузить
  Heart, // Сердце
  Star, // Звезда
  Power, // Выключение
  Play, // Play (запуск таймера)
  CirclePlay, // Play с заполненным кругом
  StopCircle, // Stop (остановка)
  CirclePause, // Pause с заполненным кругом
  Timer, // Таймер
  Minimize2, // Свернуть
  Notebook, // Блокнот (иконки демо)
  Coffee, // Кофе (брейк таймера)
  Trophy, // Кубок (завершение всех сессий)
  Shield, // Щит (достижения)
  Crown, // Корона (достижения)
  Zap, // Молния (достижения)
  Flame, // Пламя (достижения)
  BookOpen, // Открытая книга (достижения)
  FileText, // Файл с текстом (достижения)
  Gem, // Драгоценный камень (достижения)
  Award, // Медаль (достижения)
  Rocket, // Ракета (достижения)
  CircleCheck, // Круг с галочкой (достижения)
  Infinity, // Бесконечность (достижения)
  Link, // Связь (привязка таймера к привычке)
  LogOut, // Выход из аккаунта
  Mail, // Почта (email)
  Camera, // Камера (загрузка фото)
  MailOpen, // Открытое письмо (email templates demo)
  QrCode, // QR-код (2FA)
  ShieldCheck, // Щит с галочкой (2FA включена)
  Smartphone, // Смартфон (2FA, authenticator app)
  Wifi, // WiFi (online статус)
  WifiOff, // WiFi выключен (offline статус)
  Cloud, // Облако (синхронизация)
  CloudOff, // Облако выключено (нет синхронизации)
  
  // Эмоции/Настроения
  Angry, // Злое лицо
  Frown, // Грустное лицо
  Meh, // Нейтральное лицо
  Smile, // Улыбка
  Laugh, // Смех
  
  // Типы (полезны для типизации пропсов компонентов)
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

// Алиасы для обратной совместимости
export { CircleCheck as CheckCircle } from 'lucide-react';
/**
 * Системные иконки для интерфейса
 * 
 * Используются в компонентах UI, кнопках, навигации и других элементах интерфейса.
 * Эти иконки НЕ показываются пользователю в пикерах.
 * Общие иконки (используемые и в content, и в system) импортируются из shared.ts
 */

// Реэкспорт общих иконок
export {
  Target,
  Timer,
  Clock,
  Calendar,
  Heart,
  Star,
  Square,
  Moon,
  Sun,
  Palette,
  Languages,
  Flame,
  Zap,
  Rocket,
  Archive,
  Package,
  Tag,
  Trash2,
  Notebook,
  FileText,
  Mail,
  Camera,
  Gem,
  Crown,
  Angry,
  Frown,
  Meh,
  Smile,
  Laugh,
  Coffee,
  Palmtree,
  Wifi,
  AlertCircle,
  X,
  type LucideIcon,
  type LucideProps,
} from './shared';

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
  // AlertCircle - из shared.ts
  Pause, // Пауза
  Bell, // Колокольчик
  BellOff, // Колокольчик выкл
  // Tag - из shared.ts
  Hash, // Решётка
  CheckSquare, // Квадрат галочка
  // Target - из shared.ts
  BarChart3, // Гистограмма
  // Calendar - из shared.ts
  // Clock - из shared.ts
  LayoutDashboard, // Панель
  // Trash2 - из shared.ts
  GripVertical, // Ручка
  TrendingUp, // График вверх
  Edit, // Редактировать
  Pencil, // Карандаш
  Copy, // Копировать
  Loader2, // Спиннер загрузки
  // Moon - из shared.ts
  // Sun - из shared.ts
  User, // Пользователь
  // Palette - из shared.ts
  // Languages - из shared.ts
  Globe, // Глобус (переключение языка)
  // X - из shared.ts
  Sparkles, // Искры (демо, эксперименты)
  // Archive - из shared.ts
  ArchiveRestore, // Разархивировать (коробка со стрелкой)
  Gauge, // Спидометр
  BarChart2, // График статистики
  // Package - из shared.ts
  // Palmtree - из shared.ts
  // Square - из shared.ts
  Download, // Скачать
  Upload, // Загрузить
  // Heart - из shared.ts
  // Star - из shared.ts
  Power, // Выключение
  Play, // Play (запуск таймера)
  CirclePlay, // Play с заполненным кругом
  CircleStop, // Stop (остановка)
  CirclePause, // Pause с заполненным кругом
  // Timer - из shared.ts
  Minimize2, // Свернуть
  // Notebook - из shared.ts
  // Coffee - из shared.ts
  Trophy, // Кубок (завершение всех сессий)
  Shield, // Щит (достижения)
  // Crown - из shared.ts
  // Zap - из shared.ts
  // Flame - из shared.ts
  BookOpen, // Открытая книга (достижения)
  // FileText - из shared.ts
  // Gem - из shared.ts
  Award, // Медаль (достижения)
  // Rocket - из shared.ts
  CircleCheck, // Круг с галочкой (достижения)
  Infinity, // Бесконечность (достижения)
  Link, // Связь (привязка таймера к привычке)
  LogOut, // Выход из аккаунта
  // Mail - из shared.ts
  // Camera - из shared.ts
  MailOpen, // Открытое письмо (email templates demo)
  QrCode, // QR-код (2FA)
  ShieldCheck, // Щит с галочкой (2FA включена)
  Smartphone, // Смартфон (2FA, authenticator app)
  // Wifi - из shared.ts
  WifiOff, // WiFi выключен (offline статус)
  Cloud, // Облако (синхронизация)
  CloudOff, // Облако выключено (нет синхронизации)
  
  // Эмоции/Настроения уже экспортированы из shared.ts:
  // Angry, Frown, Meh, Smile, Laugh
} from 'lucide-react';

// Алиасы для обратной совместимости
export { CircleCheck as CheckCircle } from 'lucide-react';
export { CircleStop as StopCircle } from 'lucide-react';
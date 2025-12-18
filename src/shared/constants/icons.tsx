import React from 'react';
import * as ContentIcons from '@/shared/assets/icons/content';
import { SmallFilledCircle } from '@/shared/assets/icons/custom';
import { type LucideIcon } from '@/shared/assets/icons/system';

/**
 * Единый источник всех иконок приложения
 * ICON_MAP и типы генерируются автоматически из этого массива
 */
export const ICON_OPTIONS = [
  // ========================================
  // СПОРТ И ФИТНЕС
  // ========================================
  { key: 'dumbbell', Icon: ContentIcons.Dumbbell },
  { key: 'bike', Icon: ContentIcons.Bike },
  { key: 'heart', Icon: ContentIcons.Heart },
  { key: 'footprints', Icon: ContentIcons.Footprints },
  { key: 'waves', Icon: ContentIcons.Waves },
  { key: 'target', Icon: ContentIcons.Target },
  { key: 'timer', Icon: ContentIcons.Timer },
  { key: 'flame', Icon: ContentIcons.Flame },
  { key: 'zap', Icon: ContentIcons.Zap },

  // ========================================
  // ЗДОРОВЬЕ И САМОЧУВСТВИЕ
  // ========================================
  { key: 'brain', Icon: ContentIcons.Brain },
  { key: 'moon', Icon: ContentIcons.Moon },
  { key: 'pill', Icon: ContentIcons.Pill },
  { key: 'syringe', Icon: ContentIcons.Syringe },
  { key: 'heartPulse', Icon: ContentIcons.HeartPulse },
  { key: 'bed', Icon: ContentIcons.Bed },
  { key: 'sun', Icon: ContentIcons.Sun },
  { key: 'microscope', Icon: ContentIcons.Microscope },

  // ========================================
  // ПИТАНИЕ И НАПИТКИ
  // ========================================
  { key: 'droplet', Icon: ContentIcons.Droplet },
  { key: 'apple', Icon: ContentIcons.Apple },
  { key: 'coffee', Icon: ContentIcons.Coffee },
  { key: 'utensils', Icon: ContentIcons.Utensils },
  { key: 'wine', Icon: ContentIcons.Wine },
  { key: 'beer', Icon: ContentIcons.Beer },
  { key: 'soup', Icon: ContentIcons.Soup },
  { key: 'salad', Icon: ContentIcons.Salad },
  { key: 'cookie', Icon: ContentIcons.Cookie },
  { key: 'pizza', Icon: ContentIcons.Pizza },
  { key: 'cake', Icon: ContentIcons.Cake },
  { key: 'candy', Icon: ContentIcons.Candy },

  // ========================================
  // ОБУЧЕНИЕ И ОБРАЗОВАНИЕ
  // ========================================
  { key: 'book', Icon: ContentIcons.Book },
  { key: 'graduationCap', Icon: ContentIcons.GraduationCap },
  { key: 'library', Icon: ContentIcons.Library },
  { key: 'podcast', Icon: ContentIcons.Podcast },
  { key: 'languages', Icon: ContentIcons.Languages },
  { key: 'notebook', Icon: ContentIcons.Notebook },

  // ========================================
  // РАБОТА И ПРОДУКТИВНОСТЬ
  // ========================================
  { key: 'briefcase', Icon: ContentIcons.Briefcase },
  { key: 'clock', Icon: ContentIcons.Clock },
  { key: 'checkCircle', Icon: ContentIcons.CheckCircle2 },
  { key: 'listTodo', Icon: ContentIcons.ListTodo },
  { key: 'calendar', Icon: ContentIcons.Calendar },
  { key: 'lineChart', Icon: ContentIcons.LineChart },
  { key: 'trendingUp', Icon: ContentIcons.TrendingUp },
  { key: 'paperclip', Icon: ContentIcons.Paperclip },
  { key: 'fileText', Icon: ContentIcons.FileText },
  { key: 'folder', Icon: ContentIcons.Folder },
  { key: 'archive', Icon: ContentIcons.Archive },

  // ========================================
  // ТВОРЧЕСТВО И ХОББИ
  // ========================================
  { key: 'palette', Icon: ContentIcons.Palette },
  { key: 'music', Icon: ContentIcons.Music },
  { key: 'camera', Icon: ContentIcons.Camera },
  { key: 'brush', Icon: ContentIcons.Brush },
  { key: 'mic', Icon: ContentIcons.Mic },
  { key: 'film', Icon: ContentIcons.Film },
  { key: 'scissors', Icon: ContentIcons.Scissors },
  { key: 'shapes', Icon: ContentIcons.Shapes },
  { key: 'paintbrush', Icon: ContentIcons.Paintbrush },
  { key: 'piano', Icon: ContentIcons.Piano },
  { key: 'drum', Icon: ContentIcons.Drum },
  { key: 'music2', Icon: ContentIcons.Music2 },
  { key: 'music4', Icon: ContentIcons.Music4 },

  // ========================================
  // ФИНАНСЫ
  // ========================================
  { key: 'dollarSign', Icon: ContentIcons.DollarSign },
  { key: 'piggyBank', Icon: ContentIcons.PiggyBank },
  { key: 'trendingDown', Icon: ContentIcons.TrendingDown },
  { key: 'wallet', Icon: ContentIcons.Wallet },
  { key: 'creditCard', Icon: ContentIcons.CreditCard },
  { key: 'coins', Icon: ContentIcons.Coins },
  { key: 'chartBar', Icon: ContentIcons.ChartBar },

  // ========================================
  // ОТНОШЕНИЯ И СОЦИАЛЬНОЕ
  // ========================================
  { key: 'users', Icon: ContentIcons.Users },
  { key: 'userPlus', Icon: ContentIcons.UserPlus },
  { key: 'phone', Icon: ContentIcons.Phone },
  { key: 'video', Icon: ContentIcons.Video },
  { key: 'mail', Icon: ContentIcons.Mail },
  { key: 'gift', Icon: ContentIcons.Gift },

  // ========================================
  // ДОМ И БЫТ
  // ========================================
  { key: 'home', Icon: ContentIcons.Home },
  { key: 'trash', Icon: ContentIcons.Trash2 },
  { key: 'lightbulb', Icon: ContentIcons.Lightbulb },
  { key: 'hammer', Icon: ContentIcons.Hammer },
  { key: 'armchair', Icon: ContentIcons.Armchair },
  { key: 'showerHead', Icon: ContentIcons.ShowerHead },
  { key: 'leaf', Icon: ContentIcons.Leaf },
  { key: 'cookingPot', Icon: ContentIcons.CookingPot },
  { key: 'washingMachine', Icon: ContentIcons.WashingMachine },

  // ========================================
  // ЭМОЦИИ И НАСТРОЕНИЕ
  // ========================================
  { key: 'smile', Icon: ContentIcons.Smile },
  { key: 'laugh', Icon: ContentIcons.Laugh },
  { key: 'meh', Icon: ContentIcons.Meh },
  { key: 'frown', Icon: ContentIcons.Frown },
  { key: 'angry', Icon: ContentIcons.Angry },
  { key: 'star', Icon: ContentIcons.Star },

  // ========================================
  // КРАСОТА И УХОД
  // ========================================
  { key: 'eye', Icon: ContentIcons.Eye },
  { key: 'gem', Icon: ContentIcons.Gem },
  { key: 'crown', Icon: ContentIcons.Crown },

  // ========================================
  // РАЗВЛЕЧЕНИЯ И ОТДЫХ
  // ========================================
  { key: 'gamepad', Icon: ContentIcons.Gamepad2 },
  { key: 'tv', Icon: ContentIcons.Tv },
  { key: 'popcorn', Icon: ContentIcons.Popcorn },
  { key: 'headphones', Icon: ContentIcons.Headphones },
  { key: 'radio', Icon: ContentIcons.Radio },

  // ========================================
  // ПУТЕШЕСТВИЯ И ТРАНСПОРТ
  // ========================================
  { key: 'plane', Icon: ContentIcons.Plane },
  { key: 'car', Icon: ContentIcons.Car },
  { key: 'bus', Icon: ContentIcons.Bus },
  { key: 'train', Icon: ContentIcons.Train },
  { key: 'ship', Icon: ContentIcons.Ship },
  { key: 'mapPin', Icon: ContentIcons.MapPin },
  { key: 'map', Icon: ContentIcons.Map },
  { key: 'mountain', Icon: ContentIcons.Mountain },
  { key: 'rocket', Icon: ContentIcons.Rocket },
  { key: 'truck', Icon: ContentIcons.Truck },

  // ========================================
  // ПРИРОДА И ЭКОЛОГИЯ
  // ========================================
  { key: 'treePine', Icon: ContentIcons.TreePine },
  { key: 'cloudRain', Icon: ContentIcons.CloudRain },
  { key: 'cloudSnow', Icon: ContentIcons.CloudSnow },
  { key: 'cloudSun', Icon: ContentIcons.CloudSun },
  { key: 'sprout', Icon: ContentIcons.Sprout },
  { key: 'bug', Icon: ContentIcons.Bug },
  { key: 'bird', Icon: ContentIcons.Bird },
  { key: 'fish', Icon: ContentIcons.Fish },
  { key: 'snowflake', Icon: ContentIcons.Snowflake },
  { key: 'palmtree', Icon: ContentIcons.Palmtree },
  { key: 'squirrel', Icon: ContentIcons.Squirrel },

  // ========================================
  // ТЕХНОЛОГИИ
  // ========================================
  { key: 'laptop', Icon: ContentIcons.Laptop },
  { key: 'code', Icon: ContentIcons.Code },
  { key: 'cpu', Icon: ContentIcons.Cpu },
  { key: 'wifi', Icon: ContentIcons.Wifi },
  { key: 'monitor', Icon: ContentIcons.Monitor },
  { key: 'database', Icon: ContentIcons.Database },

  // ========================================
  // ДУХОВНОСТЬ
  // ========================================
  { key: 'heartHandshake', Icon: ContentIcons.HeartHandshake },
  { key: 'church', Icon: ContentIcons.Church },
  { key: 'bookHeart', Icon: ContentIcons.BookHeart },

  // ========================================
  // ВРЕДНЫЕ ПРИВЫЧКИ
  // ========================================
  { key: 'cigarette', Icon: ContentIcons.Cigarette },
  { key: 'ban', Icon: ContentIcons.Ban },
  { key: 'x', Icon: ContentIcons.X },
  { key: 'alertCircle', Icon: ContentIcons.AlertCircle },
  { key: 'xCircle', Icon: ContentIcons.XCircle },

  // ========================================
  // ДРУГОЕ (OTHER)
  // ========================================
  { key: 'dog', Icon: ContentIcons.Dog },
  { key: 'cat', Icon: ContentIcons.Cat },
  { key: 'shoppingCart', Icon: ContentIcons.ShoppingCart },
  { key: 'store', Icon: ContentIcons.Store },
  { key: 'tag', Icon: ContentIcons.Tag },
  { key: 'package', Icon: ContentIcons.Package },
  { key: 'box', Icon: ContentIcons.Box },
  { key: 'umbrella', Icon: ContentIcons.Umbrella },
  { key: 'flag', Icon: ContentIcons.Flag },
  { key: 'square', Icon: ContentIcons.Square },
  { key: 'hexagon', Icon: ContentIcons.Hexagon },
  { key: 'diamond', Icon: ContentIcons.Diamond },
  { key: 'pentagon', Icon: ContentIcons.Pentagon },
  { key: 'triangle', Icon: ContentIcons.Triangle },
  { key: 'octagon', Icon: ContentIcons.Octagon },
] as const;

/**
 * Тип для элемента опции иконки
 */
export type IconOption = typeof ICON_OPTIONS[number];

/**
 * Тип для ключей иконок (автоматически извлекается из ICON_OPTIONS)
 */
export type IconKey = typeof ICON_OPTIONS[number]['key'];

/**
 * ICON_MAP генерируется автоматически из ICON_OPTIONS
 * Используется для быстрого доступа к иконке по ключу
 */
export const ICON_MAP = Object.fromEntries(
  ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])
) as Record<IconKey, LucideIcon | React.FC<{ className?: string }>>;

/**
 * Функция для получения опций иконок с переводами
 * @param t - функция перевода из react-i18next
 * @returns массив опций иконок с переведенными labels
 */
export const getIconOptions = (t: (key: string) => string) => {
  return ICON_OPTIONS.map(({ key, Icon }) => ({
    key,
    label: t(`icons:icons.${key}`),
    Icon,
  }));
};

// Реэкспорт кастомных иконок для удобства использования
export { SmallFilledCircle } from '@/shared/assets/icons/custom';
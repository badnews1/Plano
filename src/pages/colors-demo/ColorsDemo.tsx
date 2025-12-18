/**
 * Страница демонстрации цветов дизайн-системы
 * Показывает все CSS переменные цветов для светлой и тёмной темы
 */

import { useTheme } from '@/features/theme-switcher';

interface ColorItem {
  name: string;
  label: string;
  description?: string;
  reference?: string; // Ссылка на основную переменную (для shadcn/ui токенов)
}

interface PaletteColor {
  name: string;
  label: string;
}

export default function ColorsDemo() {
  const { theme, toggleTheme } = useTheme();

  // Палитра из 20 цветов
  const paletteColors: PaletteColor[] = [
    { name: 'gray', label: 'Gray' },
    { name: 'zinc', label: 'Zinc' },
    { name: 'stone', label: 'Stone' },
    { name: 'red', label: 'Red' },
    { name: 'rose', label: 'Rose' },
    { name: 'pink', label: 'Pink' },
    { name: 'orange', label: 'Orange' },
    { name: 'amber', label: 'Amber' },
    { name: 'yellow', label: 'Yellow' },
    { name: 'lime', label: 'Lime' },
    { name: 'green', label: 'Green' },
    { name: 'emerald', label: 'Emerald' },
    { name: 'teal', label: 'Teal' },
    { name: 'cyan', label: 'Cyan' },
    { name: 'sky', label: 'Sky' },
    { name: 'blue', label: 'Blue' },
    { name: 'indigo', label: 'Indigo' },
    { name: 'violet', label: 'Violet' },
    { name: 'purple', label: 'Purple' },
    { name: 'fuchsia', label: 'Fuchsia' },
  ];

  // Все цветовые переменные (исключая --palette-*)
  const colorGroups: { title: string; colors: ColorItem[] }[] = [
    {
      title: 'Фон (Background)',
      colors: [
        { name: '--bg-primary', label: 'Primary', description: 'Основной фон приложения' },
        { name: '--bg-secondary', label: 'Secondary', description: 'Карточки, модалки' },
        { name: '--bg-tertiary', label: 'Tertiary', description: 'Вложенные секции' },
        { name: '--bg-quaternary', label: 'Quaternary', description: 'Четвертый уровень фона' },
        { name: '--bg-disabled', label: 'Disabled', description: 'Disabled элементы' },
      ],
    },
    {
      title: 'Текст (Text)',
      colors: [
        { name: '--text-primary', label: 'Primary', description: 'Основной текст' },
        { name: '--text-secondary', label: 'Secondary', description: 'Вторичный текст' },
        { name: '--text-tertiary', label: 'Tertiary', description: 'Третичный текст' },
        { name: '--text-disabled', label: 'Disabled', description: 'Disabled текст' },
      ],
    },
    {
      title: 'Границы (Border)',
      colors: [
        { name: '--border-secondary', label: 'Secondary', description: 'Основная граница' },
        { name: '--border-tertiary', label: 'Tertiary', description: 'Hover состояние' },
      ],
    },
    {
      title: 'Акценты (Accent)',
      colors: [
        { name: '--accent-primary-indigo', label: 'Primary Indigo', description: 'Основной акцент (Indigo-500)' },
        { name: '--accent-secondary-indigo', label: 'Secondary Indigo', description: 'Hover состояние (Indigo-400, светлее)' },
        { name: '--accent-muted-indigo', label: 'Muted Indigo (прозрачный)', description: 'Полупрозрачный фон (15% opacity)' },
        { name: '--accent-text-indigo', label: 'Text on Accent', description: 'Текст на акцентном фоне' },
      ],
    },
    {
      title: 'Статусы (Status)',
      colors: [
        { name: '--status-success', label: 'Success', description: 'Успех (Green-600 / Green-500)' },
        { name: '--status-success-bg', label: 'Success Background', description: 'Фон успеха (10% / 15% opacity)' },
        { name: '--status-error', label: 'Error', description: 'Ошибка (Red-600 / Red-500)' },
        { name: '--status-error-bg', label: 'Error Background', description: 'Фон ошибки (10% / 15% opacity)' },
        { name: '--status-warning', label: 'Warning', description: 'Предупреждение (Amber-600 / Amber-500)' },
        { name: '--status-warning-bg', label: 'Warning Background', description: 'Фон предупреждения (10% / 15% opacity)' },
        { name: '--status-info', label: 'Info', description: 'Информация (Blue-500)' },
        { name: '--status-info-bg', label: 'Info Background', description: 'Фон информации (15% opacity)' },
      ],
    },
    {
      title: 'Графики (Charts)',
      colors: [
        { name: '--chart-1', label: 'Chart 1 (Indigo)', description: 'Indigo #6366F1 — primary' },
        { name: '--chart-2', label: 'Chart 2 (Violet)', description: 'Violet #8B5CF6' },
        { name: '--chart-3', label: 'Chart 3 (Cyan)', description: 'Cyan #06B6D4' },
        { name: '--chart-4', label: 'Chart 4 (Emerald)', description: 'Emerald #10B981' },
        { name: '--chart-5', label: 'Chart 5 (Amber)', description: 'Amber #F59E0B' },
      ],
    },
    {
      title: 'Градиенты (Gradients)',
      colors: [
        { name: '--chart-gradient-start', label: 'Gradient Start', description: 'Cyan-500 #06b6d4' },
        { name: '--chart-gradient-middle', label: 'Gradient Middle', description: 'Blue-500 #3b82f6' },
        { name: '--chart-gradient-end', label: 'Gradient End', description: 'Indigo-500 #6366F1' },
      ],
    },
    {
      title: 'Shadcn/UI Токены (ссылаются на основные переменные)',
      colors: [
        { name: '--background', label: 'background', reference: 'var(--bg-primary)' },
        { name: '--foreground', label: 'foreground', reference: 'var(--text-primary)' },
        { name: '--card', label: 'card', reference: 'var(--bg-secondary)' },
        { name: '--card-foreground', label: 'card-foreground', reference: 'var(--text-primary)' },
        { name: '--popover', label: 'popover', reference: 'var(--bg-secondary)' },
        { name: '--popover-foreground', label: 'popover-foreground', reference: 'var(--text-primary)' },
        { name: '--primary', label: 'primary', reference: 'var(--accent-primary-indigo)' },
        { name: '--primary-foreground', label: 'primary-foreground', reference: 'var(--accent-text-indigo)' },
        { name: '--secondary', label: 'secondary', reference: 'var(--bg-tertiary)' },
        { name: '--secondary-foreground', label: 'secondary-foreground', reference: 'var(--text-primary)' },
        { name: '--muted', label: 'muted', reference: 'var(--bg-tertiary)' },
        { name: '--muted-foreground', label: 'muted-foreground', reference: 'var(--text-secondary)' },
        { name: '--accent', label: 'accent', reference: 'var(--bg-tertiary)' },
        { name: '--accent-foreground', label: 'accent-foreground', reference: 'var(--text-primary)' },
        { name: '--destructive', label: 'destructive', reference: 'var(--status-error)' },
        { name: '--destructive-foreground', label: 'destructive-foreground', reference: 'var(--accent-text-indigo)' },
        { name: '--border', label: 'border', reference: 'var(--border-secondary)' },
        { name: '--input', label: 'input', reference: 'var(--border-tertiary)' },
        { name: '--input-background', label: 'input-background', reference: 'var(--bg-tertiary)' },
        { name: '--switch-background', label: 'switch-background', reference: 'var(--bg-quaternary)' },
        { name: '--ring', label: 'ring', reference: 'var(--accent-primary-indigo)' },
        { name: '--sidebar', label: 'sidebar', reference: 'var(--bg-secondary)' },
        { name: '--sidebar-foreground', label: 'sidebar-foreground', reference: 'var(--text-primary)' },
        { name: '--sidebar-primary', label: 'sidebar-primary', reference: 'var(--accent-primary-indigo)' },
        { name: '--sidebar-primary-foreground', label: 'sidebar-primary-foreground', reference: 'var(--accent-text-indigo)' },
        { name: '--sidebar-accent', label: 'sidebar-accent', reference: 'var(--bg-tertiary)' },
        { name: '--sidebar-accent-foreground', label: 'sidebar-accent-foreground', reference: 'var(--text-primary)' },
        { name: '--sidebar-border', label: 'sidebar-border', reference: 'светлая: var(--border-secondary) / тёмная: var(--bg-tertiary)' },
        { name: '--sidebar-ring', label: 'sidebar-ring', reference: 'var(--accent-primary-indigo)' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок и переключатель темы */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">Цвета дизайн-системы</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Демонстрация всех цветовых переменных для {theme === 'dark' ? 'тёмной' : 'светлой'} темы
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-6 py-3 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary-indigo)',
              color: 'white',
            }}
          >
            {theme === 'dark' ? '☀️ Светлая' : '🌙 Тёмная'}
          </button>
        </div>

        {/* Группы цветов */}
        <div className="space-y-8">
          {/* Секция универсальной палитры */}
          <div>
            <h2 className="mb-4">🎨 Универсальная палитра (20 цветов)</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6 text-sm">
              Для тегов, меток, категорий. Каждый цвет содержит: фон (15% opacity), границу (31% opacity) и текст (100% яркость)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paletteColors.map((color) => (
                <PaletteColorCard key={color.name} colorName={color.name} label={color.label} />
              ))}
            </div>
          </div>

          {colorGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4">{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.colors.map((color) => (
                  <ColorCard 
                    key={color.name}
                    colorVar={color.name}
                    label={color.label}
                    description={color.description}
                    reference={color.reference}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Карточка с образцом цвета
 */
function ColorCard({ 
  colorVar, 
  label, 
  description, 
  reference 
}: { 
  colorVar: string; 
  label: string; 
  description?: string;
  reference?: string;
}) {
  // Получаем значение цвета из CSS переменной
  const colorValue =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim()
      : '';

  return (
    <div
      className="rounded-lg p-4 border transition-all hover:scale-105"
      style={{
        borderColor: 'var(--border-secondary)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Образец цвета */}
      <div
        className="w-full h-20 rounded-md mb-3 border"
        style={{
          backgroundColor: `var(${colorVar})`,
          borderColor: 'var(--border-secondary)',
        }}
      />

      {/* Информация */}
      <div className="space-y-1">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </p>
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--text-secondary)' }}
        >
          {colorVar}
        </p>
        
        {/* Если есть референс, показываем его */}
        {reference && (
          <p
            className="text-xs font-mono"
            style={{ color: 'var(--accent-primary-indigo)' }}
          >
            ↳ {reference}
          </p>
        )}
        
        <p
          className="text-xs font-mono"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {colorValue}
        </p>
        
        {description && (
          <span
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Карточка с образцом цвета из универсальной палитры
 * Показывает комбинацию фона, границы и текста вместе
 */
function PaletteColorCard({ 
  colorName, 
  label
}: { 
  colorName: string; 
  label: string; 
}) {
  // Получаем значения всех трёх переменных для этого цвета
  const bgValue =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(`--palette-${colorName}-bg`).trim()
      : '';
  
  const borderValue =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(`--palette-${colorName}-border`).trim()
      : '';
      
  const textValue =
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(`--palette-${colorName}-text`).trim()
      : '';

  return (
    <div
      className="rounded-lg p-4 border transition-all hover:scale-105"
      style={{
        borderColor: 'var(--border-secondary)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      {/* Живой пример: badge/tag с комбинацией всех трёх цветов */}
      <div className="w-full mb-4 flex items-center justify-center py-8">
        <div
          className="px-4 py-2 rounded-md border-2 inline-flex items-center gap-2"
          style={{
            backgroundColor: `var(--palette-${colorName}-bg)`,
            borderColor: `var(--palette-${colorName}-border)`,
            color: `var(--palette-${colorName}-text)`,
          }}
        >
          {/* Цветная точка */}
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: `var(--palette-${colorName}-text)`,
            }}
          />
          <span className="text-sm font-medium">{label}</span>
        </div>
      </div>

      {/* Информация о переменных */}
      <div className="space-y-2">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </p>
        
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            <div
              className="w-3 h-3 rounded border shrink-0 mt-0.5"
              style={{
                backgroundColor: `var(--palette-${colorName}-bg)`,
                borderColor: 'var(--border-secondary)',
              }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-mono truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                --palette-{colorName}-bg
              </p>
              <p
                className="text-xs font-mono truncate"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {bgValue}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div
              className="w-3 h-3 rounded border-2 shrink-0 mt-0.5"
              style={{
                borderColor: `var(--palette-${colorName}-border)`,
                backgroundColor: 'transparent',
              }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-mono truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                --palette-{colorName}-border
              </p>
              <p
                className="text-xs font-mono truncate"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {borderValue}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div
              className="w-3 h-3 rounded shrink-0 mt-0.5"
              style={{
                backgroundColor: `var(--palette-${colorName}-text)`,
              }}
            />
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-mono truncate"
                style={{ color: 'var(--text-secondary)' }}
              >
                --palette-{colorName}-text
              </p>
              <p
                className="text-xs font-mono truncate"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {textValue}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
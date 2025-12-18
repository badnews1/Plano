/**
 * Переиспользуемый компонент Area Chart
 * 
 * Универсальный график с градиентной заливкой для отображения
 * любых данных в виде Area Chart. Полностью настраиваемый и
 * не зависит от предметной области.
 */

import { ResponsiveContainer, AreaChart as RechartsAreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export interface AreaChartDataPoint {
  /** Метка для оси X (день, дата и т.д.) */
  label: string | number;
  /** Значение для оси Y */
  value: number;
  /** Флаг фиктивной точки (для отключения tooltip) */
  isPadding?: boolean;
}

export interface AreaChartProps {
  /** Данные для отображения */
  data: AreaChartDataPoint[];
  /** Высота графика в пикселях */
  height?: number;
  /** Цвет линии и градиента (hex) */
  color?: string;
  /** Название значения для tooltip */
  valueLabel?: string;
  /** Показывать ли tooltip при наведении */
  showTooltip?: boolean;
  /** Добавлять ли фиктивные точки по краям для плавного отображения */
  addPaddingPoints?: boolean;
  /** ID для градиента (если нужно несколько графиков на странице) */
  gradientId?: string;
  /** Толщина линии */
  strokeWidth?: number;
  /** Прозрачность заливки градиента (0-1) */
  fillOpacity?: number;
  /** Дополнительные CSS классы для контейнера */
  className?: string;
  /** Кастомный форматтер для значения в tooltip */
  tooltipFormatter?: (value: number) => [string, string];
  /** Кастомный форматтер для метки в tooltip */
  labelFormatter?: (label: string | number) => string;
}

/**
 * Area Chart с градиентной заливкой
 * 
 * Рендерит красивый график с настраиваемыми параметрами.
 * Можно использовать для любых временных рядов или последовательностей данных.
 * 
 * @example
 * ```tsx
 * <AreaChart
 *   data={[
 *     { label: 1, value: 5 },
 *     { label: 2, value: 8 },
 *     { label: 3, value: 6 },
 *   ]}
 *   height={200}
 *   color="#3b82f6"
 *   valueLabel="Выполнено"
 * />
 * ```
 */
export function AreaChart({
  data, // Массив данных для построения графика
  height = 200, // Высота графика в пикселях (default: 200)
  color = 'var(--accent-primary-indigo)', // Цвет линии и градиента (default: --accent-primary-indigo)
  valueLabel = 'Значение', // Название значения для отображения в tooltip (default: 'Значение')
  showTooltip = true, // Показывать ли tooltip при наведении (default: true)
  addPaddingPoints = true, // Добавлять ли фиктивные точки по краям для плавного отображения (default: true)
  gradientId = 'areaChartGradient', // Уникальный ID для градиента (нужен если несколько графиков на странице) (default: 'areaChartGradient')
  strokeWidth = 2, // Толщина линии графика в пикселях (default: 2)
  fillOpacity = 1, // Прозрачность заливки градиента от 0 до 1 (default: 1)
  className, // Дополнительные CSS классы для контейнера
  tooltipFormatter, // Кастомный форматтер для значения в tooltip
  labelFormatter, // Кастомный форматтер для метки в tooltip
}: AreaChartProps) {
  // Подготовка данных: добавление фиктивных точек по краям если нужно
  // Это делается для того, чтобы график начинался и заканчивался плавно,
  // а не обрезался на первой и последней точке
  const chartData = (() => {
    // Если не нужны дополнительные точки или данных нет - возвращаем как есть
    if (!addPaddingPoints || data.length === 0) {
      return data;
    }

    // Определяем метки для первой и последней точки
    const firstLabel = typeof data[0].label === 'number' ? data[0].label : 0;
    const lastLabel = typeof data[data.length - 1].label === 'number' 
      ? data[data.length - 1].label 
      : data.length;

    // Возвращаем данные с добавленными точками по краям
    return [
      { 
        label: typeof firstLabel === 'number' ? firstLabel - 1 : 0, 
        value: data[0].value, // Значение такое же как у первой точки
        isPadding: true, // Флаг фиктивной точки
      },
      ...data, // Основные данные
      { 
        label: typeof lastLabel === 'number' ? lastLabel + 1 : data.length + 1, 
        value: data[data.length - 1].value, // Значение такое же как у последней точки
        isPadding: true, // Флаг фиктивной точки
      },
    ];
  })();

  return (
    <div 
      style={{ 
        height: `${height}px`, // Фиксированная высота
        minHeight: `${height}px`, // Минимальная высота (для предотвращения схлопывания)
        minWidth: '200px', // Минимальная ширина (для корректного отображения)
        overflow: 'visible', // Разрешаем переполнение (график может выходить за границы)
      }}
      className={className}
    >
      {/* ResponsiveContainer адаптирует график под ширину родителя */}
      <ResponsiveContainer width="100%" height={height} minHeight={height}>
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }} // Добавляем отступ сверху для overflow
        >
          {/* Определение градиента для заливки области под графиком */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} /> {/* Верх: 20% прозрачности */}
              <stop offset="95%" stopColor={color} stopOpacity={0} /> {/* Низ: полностью прозрачный */}
            </linearGradient>
          </defs>
          
          {/* Ось X (скрытая, используется для позиционирования точек) */}
          <XAxis 
            dataKey="label" 
            hide={true}
            type="category"
          />
          
          {/* Ось Y (скрытая, используется для масштабирования значений) */}
          <YAxis hide={true} />
          
          {/* Tooltip показывается при наведении на график */}
          {showTooltip && (
            <Tooltip
              content={(props) => {
                // Не показываем tooltip для фиктивных точек
                if (props.payload?.[0]?.payload?.isPadding) {
                  return null;
                }
                
                // Стандартный tooltip для обычных точек
                const { active, payload, label } = props;
                if (!active || !payload || payload.length === 0) return null;

                return (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-secondary)',
                      borderRadius: '8px',
                      fontSize: 'var(--text-xs)', // 11-12px
                      padding: '6px 8px',
                    }}
                  >
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        marginBottom: '2px',
                        fontSize: 'var(--text-xs)', // 12px для заголовка (даты)
                      }}
                    >
                      {labelFormatter ? labelFormatter(label) : label}
                    </div>
                    {payload.map((entry, index) => (
                      <div
                        key={`item-${index}`}
                        style={{
                          padding: '2px 0',
                          lineHeight: '1.2',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {tooltipFormatter
                          ? tooltipFormatter(entry.value as number)[0]
                          : `${entry.name}: ${entry.value}`}
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          )}
          
          {/* Сама область графика с линией и заливкой */}
          <Area
            type="monotone" // Плавная интерполяция между точками
            dataKey="value" // Ключ для значений по оси Y
            stroke={color} // Цвет линии
            strokeWidth={strokeWidth} // Толщина линии
            fillOpacity={fillOpacity} // Прозрачность заливки
            fill={`url(#${gradientId})`} // Ссылка на градиент
            name={valueLabel} // Название для tooltip
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
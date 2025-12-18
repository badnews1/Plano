/**
 * Виджет отображения силы привычки
 * 
 * Показывает силу привычки с динамическими цветами, частицами и градациями:
 * - Starting (0-19%): красный
 * - Developing (20-39%): оранжевый
 * - Building (40-59%): синий
 * - Strong (60-79%): индиго
 * - Mastered (80-100%): зелёный
 * 
 * @module features/habit-stats/ui/HabitStrengthHero
 * @created 9 декабря 2025
 */

import { useTranslation } from 'react-i18next';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface HabitStrengthHeroProps {
  /** Значение силы привычки (0-100) */
  value: number;
}

// ============================================
// CONSTANTS
// ============================================
const PARTICLES: Particle[] = [
  { id: 0, x: 15, y: 25, size: 4, duration: 5, delay: 0 },
  { id: 1, x: 70, y: 15, size: 3, duration: 6, delay: 0.5 },
  { id: 2, x: 40, y: 60, size: 5, duration: 4.5, delay: 1 },
  { id: 3, x: 85, y: 45, size: 2.5, duration: 5.5, delay: 1.5 },
  { id: 4, x: 25, y: 80, size: 4.5, duration: 4, delay: 2 },
  { id: 5, x: 60, y: 35, size: 3.5, duration: 6.5, delay: 2.5 },
  { id: 6, x: 10, y: 50, size: 3, duration: 5.2, delay: 0.8 },
  { id: 7, x: 80, y: 70, size: 4, duration: 4.8, delay: 1.2 },
  { id: 8, x: 45, y: 20, size: 2, duration: 6.2, delay: 1.8 },
  { id: 9, x: 30, y: 40, size: 5.5, duration: 5.8, delay: 0.3 },
  { id: 10, x: 65, y: 85, size: 3, duration: 4.2, delay: 2.2 },
  { id: 11, x: 90, y: 30, size: 4.5, duration: 5.5, delay: 1.5 },
];

/**
 * Виджет отображения силы привычки с анимацией
 */
export function HabitStrengthHero({ value = 0 }: HabitStrengthHeroProps) {
  const { t } = useTranslation('stats');
  const percentage = Math.min(Math.max(value, 0), 100);
  
  const getLevel = () => {
    if (percentage >= 80) return { 
      key: 'mastered', 
      color: 'var(--palette-green-text)',
      colorLight: 'color-mix(in srgb, var(--palette-green-text) 70%, white 30%)'
    };
    if (percentage >= 60) return { 
      key: 'strong', 
      color: 'var(--palette-indigo-text)',
      colorLight: 'color-mix(in srgb, var(--palette-indigo-text) 70%, white 30%)'
    };
    if (percentage >= 40) return { 
      key: 'building', 
      color: 'var(--palette-blue-text)',
      colorLight: 'color-mix(in srgb, var(--palette-blue-text) 70%, white 30%)'
    };
    if (percentage >= 20) return { 
      key: 'developing', 
      color: 'var(--palette-amber-text)',
      colorLight: 'color-mix(in srgb, var(--palette-amber-text) 70%, white 30%)'
    };
    return { 
      key: 'starting', 
      color: 'var(--palette-red-text)',
      colorLight: 'color-mix(in srgb, var(--palette-red-text) 70%, white 30%)'
    };
  };
  
  const level = getLevel();
  
  const segments = [
    { min: 0, max: 20 },
    { min: 20, max: 40 },
    { min: 40, max: 60 },
    { min: 60, max: 80 },
    { min: 80, max: 100 },
  ];
  
  return (
    <div 
      className="rounded-md p-5 relative overflow-hidden"
      style={{ 
        background: `linear-gradient(135deg, color-mix(in srgb, ${level.color} 15%, transparent) 0%, color-mix(in srgb, ${level.color} 8%, transparent) 100%)`,
        border: `1px solid color-mix(in srgb, ${level.color} 25%, transparent)`
      }}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full particle-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, color-mix(in srgb, ${level.color} 50%, transparent) 0%, transparent 70%)`,
              '--float-duration': `${p.duration}s`,
              '--float-delay': `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      {/* Subtle glow */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl"
        style={{ background: level.color, opacity: 0.08 }}
      />
      
      {/* CSS for particle animation */}
      <style>{`
        .particle-float {
          animation: floatParticle var(--float-duration) ease-in-out infinite;
          animation-delay: var(--float-delay);
        }
        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.5; 
          }
          50% { 
            transform: translateY(-15px) scale(1.3); 
            opacity: 0.9; 
          }
        }
      `}</style>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: level.color, boxShadow: `0 0 8px ${level.color}` }}
            />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: level.color }}>
              {t('habitStats.strength')}
            </span>
          </div>
          <div 
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: `color-mix(in srgb, ${level.color} 20%, transparent)`, color: level.color }}
          >
            {t(`strengthLevels.${level.key}`)}
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-5">
          <span 
            className="text-6xl font-black"
            style={{ color: level.color, textShadow: `0 0 40px color-mix(in srgb, ${level.color} 40%, transparent)` }}
          >
            {value}
          </span>
          <span className="text-2xl font-medium text-text-tertiary">%</span>
        </div>
        
        <div className="flex gap-1.5 h-2.5">
          {segments.map((seg, i) => {
            const segmentFill = Math.max(0, Math.min(100, ((percentage - seg.min) / (seg.max - seg.min)) * 100));
            
            return (
              <div 
                key={i}
                className="flex-1 rounded-full overflow-hidden"
                style={{ background: 'color-mix(in srgb, var(--text-primary) 8%, transparent)' }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${segmentFill}%`,
                    background: `linear-gradient(90deg, ${level.color}, ${level.colorLight})`,
                  }}
                />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] text-text-tertiary">
          {[0, 20, 40, 60, 80, 100].map(n => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
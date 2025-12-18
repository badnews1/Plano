/**
 * Компонент компактного отображения стриков
 * 
 * Показывает текущий стрик с анимированными огоньками и лучший стрик.
 * Использует градиенты и анимации для визуального эффекта.
 * 
 * @module features/habit-stats/ui/StreakCompact
 * @created 9 декабря 2025
 */

// ============================================
// TYPES
// ============================================
interface Ember {
  x: number;
  delay: number;
  duration: number;
}

interface StreakCompactProps {
  /** Текущий стрик (количество дней подряд) */
  currentStreak: number;
  /** Лучший стрик за всё время */
  bestStreak: number;
}

// ============================================
// CONSTANTS
// ============================================
const EMBERS: Ember[] = [
  { x: 15, delay: 0, duration: 4 },
  { x: 30, delay: 1.5, duration: 3.5 },
  { x: 50, delay: 0.8, duration: 4.5 },
  { x: 70, delay: 2, duration: 3.8 },
  { x: 85, delay: 0.5, duration: 4.2 },
];

// ============================================
// ICONS
// ============================================
const FlameIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22M18 2H6v7a6 6 0 1012 0V2z" />
  </svg>
);

// ============================================
// STREAK COMPACT
// ============================================
export function StreakCompact({ currentStreak, bestStreak }: StreakCompactProps) {
  return (
    <div 
      className="relative overflow-hidden rounded-md p-4 h-full"
      style={{
        background: 'linear-gradient(135deg, var(--palette-orange-bg) 0%, color-mix(in srgb, var(--palette-orange-bg) 30%, transparent) 100%)',
        border: '1px solid var(--palette-orange-border)'
      }}
    >
      {/* Flames animation */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Тлеющие угольки поднимаются вверх */}
        {EMBERS.map((ember, i) => (
          <div
            key={i}
            className="absolute ember-rise"
            style={{
              left: `${ember.x}%`,
              bottom: '-5px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'var(--palette-amber-text)',
              boxShadow: '0 0 4px var(--palette-orange-text)',
              '--ember-duration': `${ember.duration}s`,
              '--ember-delay': `${ember.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-orange-400"><FlameIcon /></div>
          <span className="text-[10px] font-semibold tracking-widest text-orange-400 uppercase">Streak</span>
        </div>
        
        <div className="flex items-baseline gap-1.5">
          <span 
            className="text-3xl font-black bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, var(--palette-orange-text), var(--palette-amber-text), var(--palette-yellow-text))' }}
          >
            {currentStreak}
          </span>
          <span className="text-orange-400/70 text-xs">days</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] text-orange-300/60 mt-2">
          <span>Best: {bestStreak}d</span>
        </div>
      </div>
      
      <style>{`
        .ember-rise {
          animation: emberRise var(--ember-duration) ease-out infinite;
          animation-delay: var(--ember-delay);
        }
        @keyframes emberRise {
          0% { 
            transform: translateY(0) scale(1); 
            opacity: 0.8; 
          }
          100% { 
            transform: translateY(-80px) scale(0); 
            opacity: 0; 
          }
        }
      `}</style>
    </div>
  );
}
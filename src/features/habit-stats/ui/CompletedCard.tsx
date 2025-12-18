/**
 * Компонент карточки завершённых дней
 * 
 * Показывает количество выполненных дней из целевого количества
 * с процентом успешности. Использует анимированные искры для визуального эффекта.
 * 
 * @module features/habit-stats/ui/CompletedCard
 * @created 9 декабря 2025
 */

// ============================================
// TYPES
// ============================================
interface Spark {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  sparkX: number;
  sparkY: number;
}

interface CompletedCardProps {
  /** Количество выполненных дней */
  completed: number;
  /** Целевое количество дней */
  total: number;
}

// ============================================
// CONSTANTS
// ============================================
const SPARKS: Spark[] = [
  { id: 0, x: 25, y: 30, delay: 0, duration: 2, sparkX: -8, sparkY: 5 },
  { id: 1, x: 70, y: 25, delay: 0.3, duration: 1.8, sparkX: 10, sparkY: -7 },
  { id: 2, x: 45, y: 60, delay: 0.6, duration: 2.2, sparkX: -5, sparkY: 8 },
  { id: 3, x: 80, y: 55, delay: 0.9, duration: 1.9, sparkX: 7, sparkY: -5 },
  { id: 4, x: 30, y: 70, delay: 1.2, duration: 2.1, sparkX: -9, sparkY: -6 },
  { id: 5, x: 60, y: 40, delay: 1.5, duration: 2.3, sparkX: 6, sparkY: 9 },
  { id: 6, x: 50, y: 80, delay: 1.8, duration: 1.7, sparkX: -7, sparkY: -8 },
  { id: 7, x: 85, y: 35, delay: 0.2, duration: 2.4, sparkX: 8, sparkY: 6 },
];

// ============================================
// ICONS
// ============================================
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

// ============================================
// COMPLETED CARD
// ============================================
export function CompletedCard({ completed, total }: CompletedCardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div 
      className="rounded-md p-4 h-full relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, var(--palette-green-bg) 0%, color-mix(in srgb, var(--palette-green-bg) 30%, transparent) 100%)', 
        border: '1px solid var(--palette-green-border)' 
      }}
    >
      {/* Animated sparks */}
      <div className="absolute inset-0 overflow-hidden">
        {SPARKS.map(spark => (
          <div
            key={spark.id}
            className="absolute spark-burst"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: '4px',
              height: '4px',
              background: 'var(--palette-green-text)',
              borderRadius: '50%',
              boxShadow: '0 0 6px var(--palette-green-text)',
              '--spark-duration': `${spark.duration}s`,
              '--spark-delay': `${spark.delay}s`,
              '--spark-x': `${spark.sparkX}px`,
              '--spark-y': `${spark.sparkY}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-green-400"><CheckIcon /></div>
          <span className="text-[10px] font-semibold tracking-widest text-green-400/80 uppercase">This month&apos;s progress</span>
        </div>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-green-400">{completed}</span>
          <span className="text-green-400/50 text-xs">/ {total}</span>
        </div>
        
        <p className="text-[10px] text-green-300/50 mt-2">
          {percentage}% success rate
        </p>
      </div>
      
      <style>{`
        .spark-burst {
          animation: sparkBurst var(--spark-duration) ease-in-out infinite;
          animation-delay: var(--spark-delay);
        }
        @keyframes sparkBurst {
          0%, 100% { 
            transform: translate(0, 0) scale(0.8) rotate(0deg); 
            opacity: 0.3; 
          }
          50% { 
            transform: translate(var(--spark-x), var(--spark-y)) scale(1.3) rotate(180deg); 
            opacity: 0.8; 
          }
        }
      `}</style>
    </div>
  );
}
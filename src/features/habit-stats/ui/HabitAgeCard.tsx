/**
 * Компонент карточки возраста привычки
 * 
 * Показывает количество дней с момента начала привычки.
 * Использует анимированные волны для визуального эффекта.
 * 
 * @module features/habit-stats/ui/HabitAgeCard
 * @created 9 декабря 2025
 */

import { Calendar } from '@/shared/assets/icons/system';

// ============================================
// TYPES
// ============================================
interface Wave {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

interface HabitAgeCardProps {
  /** Дата начала привычки */
  startDate: string;
}

// ============================================
// CONSTANTS
// ============================================
const WAVES: Wave[] = [
  { id: 0, x: 15, delay: 0, duration: 2.5 },
  { id: 1, x: 30, delay: 0.4, duration: 2.8 },
  { id: 2, x: 45, delay: 0.8, duration: 2.2 },
  { id: 3, x: 60, delay: 1.2, duration: 3.0 },
  { id: 4, x: 75, delay: 1.6, duration: 2.6 },
  { id: 5, x: 88, delay: 0.6, duration: 2.9 },
];

// ============================================
// HABIT AGE CARD
// ============================================
export function HabitAgeCard({ startDate }: HabitAgeCardProps) {
  // Рассчитываем возраст привычки в днях
  const calculateAge = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const age = calculateAge();
  
  // Генерируем подпись в зависимости от возраста
  const getMessage = () => {
    if (age === 0) return 'Just started!';
    if (age < 7) return 'Fresh start!';
    if (age < 30) return 'Building momentum';
    if (age < 90) return 'Growing strong';
    if (age < 365) return 'Impressive journey';
    return 'Legendary habit!';
  };
  
  return (
    <div 
      className="rounded-md p-4 h-full relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, var(--palette-indigo-bg) 0%, color-mix(in srgb, var(--palette-indigo-bg) 30%, transparent) 100%)', 
        border: '1px solid var(--palette-indigo-border)' 
      }}
    >
      {/* Animated waves */}
      <div className="absolute inset-0 overflow-hidden">
        {WAVES.map(wave => (
          <div
            key={wave.id}
            className="absolute bottom-0 wave-rise"
            style={{
              left: `${wave.x}%`,
              width: '2px',
              height: '30px',
              background: 'linear-gradient(to top, var(--palette-indigo-text), transparent)',
              borderRadius: '2px',
              opacity: 0.4,
              '--wave-duration': `${wave.duration}s`,
              '--wave-delay': `${wave.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-indigo-400"><Calendar size={20} /></div>
          <span className="text-[10px] font-semibold tracking-widest text-indigo-400/80 uppercase">Habit age</span>
        </div>
        
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black text-indigo-400">{age}</span>
          <span className="text-indigo-400/50 text-xs">{age === 1 ? 'day' : 'days'}</span>
        </div>
        
        <p className="text-[10px] text-indigo-300/50 mt-2">
          {getMessage()}
        </p>
      </div>
      
      <style>{`
        .wave-rise {
          animation: waveRise var(--wave-duration) ease-in-out infinite;
          animation-delay: var(--wave-delay);
        }
        @keyframes waveRise {
          0%, 100% { 
            transform: translateY(10px) scaleY(0.8); 
            opacity: 0.3; 
          }
          50% { 
            transform: translateY(-5px) scaleY(1.2); 
            opacity: 0.7; 
          }
        }
      `}</style>
    </div>
  );
}
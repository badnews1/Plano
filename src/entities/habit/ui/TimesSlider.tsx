/**
 * Слайдер для выбора количества раз (новый дизайн)
 * 
 * @description
 * Range input + отображение числа справа
 * Используется для "N раз в неделю" и "N раз в месяц"
 * 
 * @module entities/habit/ui/TimesSlider
 * @created 8 декабря 2025
 */

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Modal } from '@/shared/ui/modal';

interface TimesSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  /** Функция для форматирования label на основе текущего значения */
  formatLabel: (value: number) => string;
}

export const TimesSlider: React.FC<TimesSliderProps> = ({
  value,
  onChange,
  min = 1,
  max,
  formatLabel,
}) => {
  const [inputValue, setInputValue] = React.useState(String(value));

  // Синхронизируем локальное состояние с внешним значением (когда меняется слайдер)
  React.useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Разрешаем только цифры и пустую строку (блокируем ., ,, -, +, e и т.д.)
    if (newValue !== '' && !/^\d+$/.test(newValue)) {
      return;
    }
    
    // Если пустая строка - разрешаем (для редактирования)
    if (newValue === '') {
      setInputValue('');
      return;
    }
    
    const numValue = Number(newValue);
    
    // Автокоррекция при вводе
    if (numValue < min) {
      setInputValue(String(min));
      onChange(min);
    } else if (numValue > max) {
      setInputValue(String(max));
      onChange(max);
    } else {
      setInputValue(newValue);
      onChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Блокируем ввод недопустимых символов: точка, запятая, минус, плюс, e, E
    if (['.', ',', '-', '+', 'e', 'E'].includes(e.key)) {
      e.preventDefault();
    }
  };
  
  const handleInputBlur = () => {
    // При потере фокуса, если поле пустое - возвращаем текущее значение
    if (inputValue === '') {
      setInputValue(String(value));
    }
  };

  return (
    <div>
      <Modal.FieldTitle>
        {formatLabel(value)}
      </Modal.FieldTitle>
      <div className="mt-2 flex items-center gap-4">
        <Slider 
          min={min} 
          max={max} 
          value={[value]} 
          onValueChange={(values) => onChange(values[0])} 
          className="flex-1"
        />
        <div className="w-14 shrink-0">
          <Input
            type="number"
            min={min}
            max={max}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            variant="tertiary"
            className="h-10 text-center"
          />
        </div>
      </div>
    </div>
  );
};
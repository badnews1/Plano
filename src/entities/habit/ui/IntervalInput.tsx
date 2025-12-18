/**
 * Инпут для интервала в днях (новый дизайн)
 * 
 * @description
 * "Every [N] days" - инпут с текстом слева и справа
 * 
 * @module entities/habit/ui/IntervalInput
 * @created 8 декабря 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Modal } from '@/shared/ui/modal';
import { declineDays } from '@/shared/lib/text';

interface IntervalInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const IntervalInput: React.FC<IntervalInputProps> = ({
  value,
  onChange,
}) => {
  const { t, i18n } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  const [inputValue, setInputValue] = React.useState(String(value));

  // Синхронизируем локальное состояние с внешним значением
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
    if (numValue < 2) {
      setInputValue('2');
      onChange(2);
    } else if (numValue > 365) {
      setInputValue('365');
      onChange(365);
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
        {`${t('frequency.every')} ${value} ${declineDays(value, tCommon, i18n.language)}`.toUpperCase()}
      </Modal.FieldTitle>
      <div className="mt-2 flex items-center gap-3 w-fit">
        <span className="text-[var(--text-tertiary)] text-sm">
          {t('frequency.every') || 'Every'}
        </span>
        <Input
          type="number"
          min={2}
          max={365}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          className="w-20 text-center"
        />
        <span className="text-[var(--text-tertiary)] text-sm">
          {declineDays(value, tCommon, i18n.language)}
        </span>
      </div>
    </div>
  );
};
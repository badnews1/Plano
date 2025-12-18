/**
 * Модальное окно выбора месяца и года для навигации по датам
 * 
 * @module features/date-navigation
 * @updated 2 декабря 2025 - исправлен namespace для переводов (изменен заголовок на "Выбор периода")
 */

import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from '@/shared/assets/icons/system';

export function MonthYearPicker({
  isOpen,
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
}: {
  isOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation(['common', 'habits']);
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [yearWindowStart, setYearWindowStart] = useState(() => {
    // Центрируем окно на выбранном году
    return Math.max(2010, selectedYear - 2);
  });

  // Синхронизируем внутреннее состояние с пропсами при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setTempYear(selectedYear);
      setTempMonth(selectedMonth);
      setYearWindowStart(Math.max(2010, selectedYear - 2));
    }
  }, [isOpen, selectedYear, selectedMonth]);

  // Месяцы из переводов
  const months = [
    t('months.full.january'),
    t('months.full.february'),
    t('months.full.march'),
    t('months.full.april'),
    t('months.full.may'),
    t('months.full.june'),
    t('months.full.july'),
    t('months.full.august'),
    t('months.full.september'),
    t('months.full.october'),
    t('months.full.november'),
    t('months.full.december'),
  ];

  // Генерируем диапазон годов с 2010 до 2040
  const MIN_YEAR = 2010;
  const MAX_YEAR = 2040;
  const VISIBLE_YEARS = 5; // Показываем 5 годов одновременно
  
  const visibleYears = Array.from(
    { length: VISIBLE_YEARS },
    (_, i) => yearWindowStart + i
  ).filter(year => year >= MIN_YEAR && year <= MAX_YEAR);
  
  const canGoPrevYear = yearWindowStart > MIN_YEAR;
  const canGoNextYear = yearWindowStart + VISIBLE_YEARS - 1 < MAX_YEAR;
  
  const handlePrevYears = () => {
    if (canGoPrevYear) {
      setYearWindowStart(prev => Math.max(MIN_YEAR, prev - 1));
    }
  };
  
  const handleNextYears = () => {
    if (canGoNextYear) {
      setYearWindowStart(prev => Math.min(MAX_YEAR - VISIBLE_YEARS + 1, prev + 1));
    }
  };

  return (
    <>
      {isOpen && (
        <Modal.Root level="modal" onClose={onClose}>
          <Modal.Backdrop onClick={onClose} />
          <Modal.Container size="md">
            <Modal.GradientLine />
            
            <Modal.Header 
              title={t('calendar.selectPeriod', { ns: 'habits' })}
              onClose={onClose}
            />

            <Modal.Content>
              <div className="p-6">
                <div className="space-y-8">
                  {/* Year Selector */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrevYears}
                        disabled={!canGoPrevYear}
                        className="shrink-0"
                        aria-label="Previous years"
                      >
                        <ChevronLeft className="size-5" />
                      </Button>
                      <div className="grid grid-cols-5 gap-2 flex-1">
                        {visibleYears.map((year) => (
                          <Button
                            key={year}
                            onClick={() => setTempYear(year)}
                            variant={tempYear === year ? 'default' : 'tertiary'}
                            aria-label={`Select year ${year}`}
                            aria-pressed={tempYear === year}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextYears}
                        disabled={!canGoNextYear}
                        className="shrink-0"
                        aria-label="Next years"
                      >
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Month Selector */}
                  <div>
                    <div className="grid grid-cols-3 gap-2">
                      {months.map((month, index) => (
                        <Button
                          key={index}
                          onClick={() => setTempMonth(index)}
                          variant={tempMonth === index ? 'default' : 'tertiary'}
                          aria-label={`Select month ${month}`}
                          aria-pressed={tempMonth === index}
                        >
                          {month}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Content>

            <Modal.Footer>
              <Button
                variant="outline"
                onClick={onClose}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="default"
                onClick={() => onSelect(tempMonth, tempYear)}
              >
                {t('common.apply')}
              </Button>
            </Modal.Footer>
          </Modal.Container>
        </Modal.Root>
      )}
    </>
  );
}
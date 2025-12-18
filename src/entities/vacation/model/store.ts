/**
 * Zustand store слайс для управления периодами отдыха
 */

import type { StateCreator } from 'zustand';
import type { VacationPeriod } from './types';

/**
 * Срез store для периодов отдыха
 */
export interface VacationSlice {
  vacationPeriods: VacationPeriod[];
  
  addVacationPeriod: (period: Omit<VacationPeriod, 'id' | 'createdAt'>) => void;
  updateVacationPeriod: (id: string, updates: Partial<Omit<VacationPeriod, 'id' | 'createdAt'>>) => void;
  deleteVacationPeriod: (id: string) => void;
}

/**
 * Создаёт слайс для периодов отдыха
 */
export const createVacationSlice: StateCreator<VacationSlice> = (set) => ({
  vacationPeriods: [],

  addVacationPeriod: (period) =>
    set((state) => ({
      vacationPeriods: [
        ...state.vacationPeriods,
        {
          ...period,
          id: `vacation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateVacationPeriod: (id, updates) =>
    set((state) => ({
      vacationPeriods: state.vacationPeriods.map((period) =>
        period.id === id ? { ...period, ...updates } : period
      ),
    })),

  deleteVacationPeriod: (id) =>
    set((state) => ({
      vacationPeriods: state.vacationPeriods.filter((period) => period.id !== id),
    })),
});

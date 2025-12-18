/**
 * Сущность "Период отдыха"
 * 
 * @module entities/vacation
 */

export type { VacationPeriod, VacationPeriodStatus, VacationSlice } from './model';
export { createVacationSlice } from './model';

export {
  isDateInVacation,
  getVacationPeriodForDate,
  getVacationPeriodStatus,
  isPeriodPast,
  isDateRangeOverlapping,
  sortVacationPeriods,
  countVacationDaysInPeriod,
} from './lib';
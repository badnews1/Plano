/**
 * Public API для shared/ui
 * 
 * Generic UI компоненты, используемые в разных слоях приложения.
 * Все компоненты presentational, не зависят от конкретных entity.
 */

// Filter components
export { FilterDropdown } from './filter-dropdown';

// Picker components
export { ColorPicker } from './color-picker';
export { IconPicker } from './icon-picker';
export { SectionPicker, type SectionItem } from './section-picker';
export { UnitPicker } from './unit-picker';

// Progress components
export { CircularProgress } from './circular-progress';
export { ProgressBar } from './progress-bar';
export { SpeedometerChart } from './speedometer-chart';

// Chart components
export { AreaChart, type AreaChartProps, type AreaChartDataPoint } from './area-chart';

// Button components
export { CompletionButton } from './completion-button';

// Toggle components
export { ToggleChip } from './toggle-chip';

// Modal components
export { Modal } from './modal';

// Reminders components
export { ReminderList, type ReminderItem } from './reminder-list';

// Calendar components
export { CalendarWeekdaysRow, CalendarDatesRow } from './calendar-day-header';

// Layout components
export { PageContainer } from './page-container';

// Utility components
export { OverflowTrigger } from './overflow-trigger';
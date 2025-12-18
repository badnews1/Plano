/**
 * 💾 localStorage утилиты для таймера
 * 
 * @module features/timer/lib/storage
 * @created 13 декабря 2025
 */

import type { PomodoroPreset } from '../model/types';

const STORAGE_KEYS = {
  PRESETS: 'habitflow_timer_presets',
  DEFAULT_PRESET: 'habitflow_timer_default_preset',
} as const;

/** Загрузить пресеты из localStorage */
export function loadPresets(): PomodoroPreset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRESETS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load timer presets:', error);
  }
  return [];
}

/** Сохранить пресеты в localStorage */
export function savePresets(presets: PomodoroPreset[]): void {
  try {
    // Сохраняем только кастомные пресеты (не дефолтные)
    const customPresets = presets.filter(p => !p.id.startsWith('default-'));
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(customPresets));
  } catch (error) {
    console.error('Failed to save timer presets:', error);
  }
}

/** Загрузить ID дефолтного пресета */
export function loadDefaultPreset(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.DEFAULT_PRESET);
  } catch (error) {
    console.error('Failed to load default preset:', error);
    return null;
  }
}

/** Сохранить ID дефолтного пресета */
export function saveDefaultPreset(presetId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DEFAULT_PRESET, presetId);
  } catch (error) {
    console.error('Failed to save default preset:', error);
  }
}

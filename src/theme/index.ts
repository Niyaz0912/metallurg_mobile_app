// src/theme/index.ts
import { colors } from './colors';
import { typography } from './typography';
import { spacing, componentSpacing } from './spacing';
import { shadows } from './shadows';

// Экспорты
export { colors } from './colors';
export { typography } from './typography';
export { spacing, componentSpacing } from './spacing';
export { shadows } from './shadows';

// Объединенная тема
export const theme = {
  colors,
  typography,
  spacing,
  componentSpacing,
  shadows,
} as const;

export type Theme = typeof theme;

// src/theme/spacing.ts
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

// Специальные отступы для компонентов
export const componentSpacing = {
  cardPadding: spacing[4], // 16
  cardMargin: spacing[4],  // 16
  screenPadding: spacing[5], // 20
  sectionGap: spacing[6],  // 24
  buttonPadding: spacing[4], // 16
} as const;

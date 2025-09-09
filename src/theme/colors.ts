// src/theme/colors.ts
export const colors = {
  // Основные цвета бренда
  primary: {
    50: '#EBF5FF',
    100: '#DBEAFE', 
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#1C64F2', // Основной синий
    600: '#1A56DB',
    700: '#1E429F',
    800: '#1E3A8A',
    900: '#1E40AF',
  },

  // Семантические цвета
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0', // ← ДОБАВИЛИ
    500: '#0E9F6E', // Зеленый успеха
    600: '#0D8F62',
    700: '#047857',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A', // ← ДОБАВИЛИ
    500: '#D97706', // Оранжевый внимания
    600: '#B45309',
    700: '#A16207', // ← ДОБАВИЛИ
  },

  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA', // ← ДОБАВИЛИ
    500: '#E02424', // Красный критичности
    600: '#DC2626',
    700: '#B91C1C',
  },

  // Нейтральные цвета
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Специальные цвета для приложения
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  
  // Статусы заданий
  status: {
    urgent: '#E02424',
    normal: '#D97706', 
    low: '#0E9F6E',
    completed: '#0E9F6E',
    pending: '#6B7280',
    inProgress: '#1C64F2',
  },
} as const;

// Типы для TypeScript
export type ColorPalette = typeof colors;
export type ColorKey = keyof ColorPalette;

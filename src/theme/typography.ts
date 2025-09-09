// src/theme/typography.ts
import { TextStyle } from 'react-native';

export const typography = {
  // Размеры шрифтов
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Веса шрифтов
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,

  // Высота строк
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Готовые стили текста
  heading: {
    h1: {
      fontSize: 30,
      fontWeight: '700',
      lineHeight: 36,
    } as TextStyle,
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    } as TextStyle,
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    } as TextStyle,
    h4: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
    } as TextStyle,
  },

  body: {
    large: {
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28,
    } as TextStyle,
    base: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    } as TextStyle,
    small: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    } as TextStyle,
    xs: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    } as TextStyle,
  },

  label: {
    large: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
    } as TextStyle,
    medium: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    } as TextStyle,
    small: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    } as TextStyle,
  },
} as const;

// src/components/ui/ProgressBar/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../theme';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'linear',
  size = 'medium',
  showLabel = true,
  label
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  const heights = {
    small: 4,
    medium: 8,
    large: 12,
  };
  
  const height = heights[size];

  const getColor = (val: number) => {
    if (val < 30) return colors.danger[500];
    if (val < 70) return colors.warning[500];
    return colors.success[500];
  };
  
  const barColor = getColor(safeProgress);
  const barBackground = colors.gray[200];

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>{label ?? `${safeProgress}%`}</Text>
      )}
      <View style={[
        styles.track, 
        { 
          height: height, 
          borderRadius: height / 2, 
          backgroundColor: barBackground 
        }
      ]}>
        <View style={[
          styles.fill, 
          { 
            width: `${safeProgress}%`, 
            height: height, 
            borderRadius: height / 2, 
            backgroundColor: barColor 
          }
        ]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing[1],
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[700],
  },
  track: {
    overflow: 'hidden',
  },
  fill: {
    // Без transition свойств
  },
});


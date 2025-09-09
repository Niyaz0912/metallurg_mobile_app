// src/components/ui/StatusChip/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../../theme';

export type StatusType = 'urgent' | 'normal' | 'low' | 'completed' | 'pending' | 'inProgress';

interface StatusChipProps {
  status: StatusType;
  size?: 'small' | 'medium';
  label?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  size = 'medium',
  label 
}) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'urgent':
        return {
          backgroundColor: colors.danger[50],
          borderColor: colors.danger[100],
          textColor: colors.danger[700],
          icon: '🔴',
          defaultLabel: 'Срочное',
        };
      case 'normal':
        return {
          backgroundColor: colors.warning[50],
          borderColor: colors.warning[100],
          textColor: colors.warning[700],
          icon: '🟡',
          defaultLabel: 'Обычное',
        };
      case 'low':
        return {
          backgroundColor: colors.success[50],
          borderColor: colors.success[100],
          textColor: colors.success[700],
          icon: '🟢',
          defaultLabel: 'Низкий',
        };
      case 'completed':
        return {
          backgroundColor: colors.success[50],
          borderColor: colors.success[100],
          textColor: colors.success[700],
          icon: '✅',
          defaultLabel: 'Выполнено',
        };
      case 'pending':
        return {
          backgroundColor: colors.gray[50],
          borderColor: colors.gray[200],
          textColor: colors.gray[700],
          icon: '⏸️',
          defaultLabel: 'Ожидает',
        };
      case 'inProgress':
        return {
          backgroundColor: colors.primary[50],
          borderColor: colors.primary[200],
          textColor: colors.primary[700],
          icon: '🔄',
          defaultLabel: 'В работе',
        };
      default:
        return {
          backgroundColor: colors.gray[50],
          borderColor: colors.gray[200],
          textColor: colors.gray[700],
          icon: '⚪',
          defaultLabel: 'Неизвестно',
        };
    }
  };

  const config = getStatusConfig(status);
  const displayLabel = label || config.defaultLabel;
  
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        paddingHorizontal: isSmall ? spacing[2] : spacing[3],
        paddingVertical: isSmall ? spacing[1] : spacing[2],
      }
    ]}>
      <Text style={{ fontSize: isSmall ? 10 : 12 }}>
        {config.icon}
      </Text>
      <Text style={[
        styles.label,
        {
          color: config.textColor,
          fontSize: isSmall ? typography.fontSize.xs : typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          marginLeft: spacing[1],
        }
      ]}>
        {displayLabel}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    textAlign: 'center',
  },
});

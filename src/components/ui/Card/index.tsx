import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusChip, ProgressBar } from '../';
import { colors, typography, spacing, shadows } from '../../../theme';

export interface CardData {
  id: number | string;
  title: string;
  subtitle?: string;
  status?: 'urgent' | 'normal' | 'low' | 'completed' | 'pending' | 'inProgress';
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  metadata?: Array<{
    label: string;
    value: string;
  }>;
  deadline?: string;
  actions?: Array<{
    title: string;
    type: 'primary' | 'secondary';
    onPress: () => void;
  }>;
}

interface CardProps {
  data: CardData;
  layout?: 'assignment' | 'techcard' | 'plan' | 'minimal';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  data,
  layout = 'minimal',
  onPress,
}) => {
  const isCompleted = data.status === 'completed';
  const isUrgent = data.status === 'urgent';

  const CardContent = () => (
    <View style={[
      styles.card,
      isCompleted && styles.completedCard,
      isUrgent && styles.urgentCard,
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{data.title}</Text>
          {data.subtitle && (
            <Text style={styles.subtitle}>{data.subtitle}</Text>
          )}
        </View>
        
        <View style={styles.headerRight}>
          {data.status && (
            <StatusChip status={data.status} size="medium" />
          )}
          <Text style={styles.id}>#{data.id}</Text>
        </View>
      </View>

      {/* Metadata */}
      {data.metadata && layout !== 'minimal' && (
        <View style={styles.metadata}>
          {data.metadata.map((item, index) => (
            <View key={index} style={styles.metadataRow}>
              <Text style={styles.metadataLabel}>{item.label}:</Text>
              <Text style={styles.metadataValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Progress */}
      {data.progress && layout === 'assignment' && (
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Выполнение</Text>
            <Text style={styles.progressValue}>
              {data.progress.current}/{data.progress.total} шт
            </Text>
          </View>
          <ProgressBar 
            progress={data.progress.percentage}
            showLabel={false}
            size="medium"
          />
        </View>
      )}

      {/* Deadline */}
      {data.deadline && (
        <View style={styles.deadlineSection}>
          <Text style={[
            styles.deadline,
            isUrgent && styles.urgentDeadline
          ]}>
            ⏰ До: {data.deadline}
          </Text>
        </View>
      )}

      {/* Actions */}
      {data.actions && data.actions.length > 0 && (
        <View style={styles.actions}>
          {data.actions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                action.type === 'primary' ? styles.primaryAction : styles.secondaryAction,
                isUrgent && action.type === 'primary' && styles.urgentAction,
              ]}
              onPress={action.onPress}
            >
              <Text style={[
                styles.actionText,
                action.type === 'primary' ? styles.primaryActionText : styles.secondaryActionText,
              ]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  if (onPress && !data.actions) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4], // 16px отступы по бокам
    marginVertical: spacing[2],    // 8px отступы сверху/снизу
    padding: spacing[4],           // 16px внутренние отступы
    borderRadius: 12,
    ...shadows.small,
  },
  completedCard: {
    opacity: 0.85,
    borderLeftWidth: 4,
    borderLeftColor: colors.success[500],
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger[500],
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing[3],
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: spacing[2],
  },
  title: {
    ...typography.heading.h4,
    color: colors.gray[900],
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.body.small,
    color: colors.gray[600],
  },
  id: {
    ...typography.body.xs,
    color: colors.gray[500],
    fontWeight: typography.fontWeight.medium,
  },

  // Metadata
  metadata: {
    marginBottom: spacing[3],
  },
  metadataRow: {
    flexDirection: 'row',
    marginBottom: spacing[1],
  },
  metadataLabel: {
    ...typography.body.small,
    color: colors.gray[600],
    width: 100,
  },
  metadataValue: {
    ...typography.body.small,
    color: colors.gray[800],
    flex: 1,
    fontWeight: typography.fontWeight.medium,
  },

  // Progress
  progressSection: {
    marginBottom: spacing[3],
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  progressLabel: {
    ...typography.label.medium,
    color: colors.gray[700],
  },
  progressValue: {
    ...typography.label.medium,
    color: colors.gray[900],
  },

  // Deadline
  deadlineSection: {
    marginBottom: spacing[3],
  },
  deadline: {
    ...typography.body.small,
    color: colors.warning[600],
    fontWeight: typography.fontWeight.medium,
  },
  urgentDeadline: {
    color: colors.danger[600],
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryAction: {
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  primaryAction: {
    backgroundColor: colors.primary[500],
    flex: 1,
  },
  urgentAction: {
    backgroundColor: colors.danger[500],
  },
  actionText: {
    ...typography.label.medium,
    fontWeight: typography.fontWeight.medium,
  },
  secondaryActionText: {
    color: colors.gray[700],
  },
  primaryActionText: {
    color: colors.surface,
  },
});

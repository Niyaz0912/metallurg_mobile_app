import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, componentSpacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

// Импорт или определение компонентов для департаментов
import AdministrativeMain from '../components/department-portals/AdministrativeMain';
import CommercialMain from '../components/department-portals/CommercialMain';
import FinancialMain from '../components/department-portals/FinancialMain';
import HRMain from '../components/department-portals/HRMain';
import ProductionMain from '../components/department-portals/ProductionMain';
import QualityMain from '../components/department-portals/QualityMain';

const departmentComponents: Record<string, React.FC> = {
  '1': AdministrativeMain,
  '2': HRMain,
  '3': QualityMain,
  '4': CommercialMain,
  '5': ProductionMain,
  '6': FinancialMain,
};

export default function DepartmentScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notAuth}>Не авторизован</Text>
      </View>
    );
  }

  const DepartmentComponent = user.department ? departmentComponents[user.department.id.toString()] : null;

  return (
    <View style={styles.container}>
      {/* Блок информации о сотруднике */}
      <View style={styles.profileBlock}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.avatar}
        />
        <Text style={styles.header}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.label}>Роль: <Text style={styles.value}>{user.role}</Text></Text>
        <Text style={styles.label}>Департамент: <Text style={styles.value}>{user.department?.name || 'не указан'}</Text></Text>
      </View>

      {/* Рендеринг контента департамента */}
      <View style={styles.section}>
        {DepartmentComponent ? (
          <DepartmentComponent />
        ) : (
          <Text>Департамент не найден или для него нет контента.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: componentSpacing.screenPadding,
    backgroundColor: colors.background,
  },
  profileBlock: {
    alignItems: 'center',
    marginBottom: componentSpacing.sectionGap,
  },
  avatar: {
    width: spacing[16],
    height: spacing[16],
    borderRadius: spacing[8],
    marginBottom: spacing[6],
    backgroundColor: colors.surface,
  },
  header: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.gray[900],
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    marginTop: spacing[2],
    fontWeight: typography.fontWeight.medium,
  },
  value: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.normal,
  },
  section: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuth: {
    fontSize: typography.fontSize.lg,
    color: colors.danger[600],
    fontWeight: typography.fontWeight.bold,
  },
});


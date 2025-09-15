import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

import { colors } from '../theme/colors';
import { spacing, componentSpacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

export default function ProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notAuth}>Не авторизован</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarBlock}>
        {/* Можно заменить на user.avatar, если есть изображение */}
        <Image
          source={require('../../assets/icon.png')}
          style={styles.avatar}
        />
        <Text style={styles.header}>Профиль</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Имя: <Text style={styles.value}>{user.firstName}</Text></Text>
        <Text style={styles.label}>Фамилия: <Text style={styles.value}>{user.lastName}</Text></Text>
        <Text style={styles.label}>Роль: <Text style={styles.value}>{user.role}</Text></Text>
        <Text style={styles.label}>Департамент: <Text style={styles.value}>{user.department?.name || 'не указан'}</Text></Text>
      </View>
      {/* Здесь можно добавить дополнительные секции */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: componentSpacing.screenPadding, // 20
    backgroundColor: colors.background,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: componentSpacing.sectionGap, // 24
  },
  avatar: {
    width: spacing[16], // 64
    height: spacing[16], // 64
    borderRadius: spacing[8], // 32
    marginBottom: spacing[6], // 24
    backgroundColor: colors.surface,
  },
  header: {
    fontSize: typography.fontSize['2xl'], // 24
    fontWeight: typography.fontWeight.semibold, // 600
    color: colors.gray[900], // более тёмный для заголовков
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: componentSpacing.cardPadding, // 16
    ...shadows.medium,
  },
  label: {
    fontSize: typography.fontSize.base, // 16
    color: colors.gray[600],
    marginTop: spacing[2], // 8
    fontWeight: typography.fontWeight.medium, // 500
  },
  value: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.normal, // 400
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuth: {
    fontSize: typography.fontSize.lg, // 18
    color: colors.danger[600],
    fontWeight: typography.fontWeight.bold, // 700
  },
});


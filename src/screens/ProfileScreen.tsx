import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, componentSpacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { shadows } from '../theme/shadows';

export default function ProfileScreen() {
  const { 
    user, 
    isProfileLoading, 
    profileError, 
    refreshUserProfile 
  } = useAuth();

  // Логирование для отладки
  useEffect(() => {
    console.log('ProfileScreen state:', {
      hasUser: !!user,
      userId: user?.id,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      departmentId: user?.department?.id,
      departmentName: user?.department?.name,
      isProfileLoading,
      profileError
    });
  }, [user, isProfileLoading, profileError]);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notAuth}>Не авторизован</Text>
      </View>
    );
  }

  if (isProfileLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <Text style={styles.loadingText}>Загрузка профиля...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarBlock}>
        <Image style={styles.avatar} />
        <Text style={styles.header}>Профиль</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.label}>
          Имя: <Text style={styles.value}>{user.firstName || 'не указано'}</Text>
        </Text>
        <Text style={styles.label}>
          Фамилия: <Text style={styles.value}>{user.lastName || 'не указано'}</Text>
        </Text>
        <Text style={styles.label}>
          Роль: <Text style={styles.value}>{user.role}</Text>
        </Text>
        <Text style={styles.label}>
          Департамент: <Text style={styles.value}>
            {user.department?.name || 'не указан'}
          </Text>
        </Text>
      </View>

      {profileError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{profileError}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={refreshUserProfile}
          >
            <Text style={styles.retryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: componentSpacing.screenPadding, // 20
    backgroundColor: colors.background, // #F9FAFB
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
    backgroundColor: colors.surface, // #FFFFFF
  },
  header: {
    fontSize: typography.fontSize['2xl'], // 24
    fontWeight: typography.fontWeight.semibold, // '600'
    color: colors.gray[900], // #111827
  },
  card: {
    backgroundColor: colors.surface, // #FFFFFF
    borderRadius: 12,
    padding: componentSpacing.cardPadding, // 16
    ...shadows.medium,
  },
  label: {
    fontSize: typography.fontSize.base, // 16
    color: colors.gray[600], // #4B5563
    marginTop: spacing[2], // 8
    fontWeight: typography.fontWeight.medium, // '500'
  },
  value: {
    color: colors.primary[600], // #1A56DB
    fontWeight: typography.fontWeight.normal, // '400'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notAuth: {
    fontSize: typography.fontSize.lg, // 18
    color: colors.danger[600], // #DC2626
    fontWeight: typography.fontWeight.bold, // '700'
  },
  loadingText: {
    marginTop: spacing[4], // 16
    fontSize: typography.fontSize.base, // 16
    color: colors.gray[600], // #4B5563
  },
  errorContainer: {
    marginTop: spacing[4], // 16
    padding: componentSpacing.cardPadding, // 16
    backgroundColor: colors.danger[50], // #FEF2F2
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger[200], // #FECACA
  },
  errorText: {
    color: colors.danger[600], // #DC2626
    fontSize: typography.fontSize.sm, // 14
    textAlign: 'center',
    marginBottom: spacing[2], // 8
  },
  retryButton: {
    backgroundColor: colors.primary[600], // #1A56DB
    paddingVertical: spacing[2], // 8
    paddingHorizontal: spacing[4], // 16
    borderRadius: 6,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: colors.surface, // #FFFFFF вместо colors.white
    fontSize: typography.fontSize.sm, // 14
    fontWeight: typography.fontWeight.medium, // '500'
  },
});

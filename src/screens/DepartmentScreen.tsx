import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getDepartmentMockData, departmentNames } from '../data/mockData';

const DepartmentScreen = () => {
  const { user } = useAuth();

  // Получаем mock-данные для департамента пользователя
  const departmentId = user?.departmentId || 1;
  const mockData = getDepartmentMockData(departmentId);
  const departmentName = departmentNames[departmentId];

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.departmentTitle}>🏢 {departmentName}</Text>
        <Text style={styles.welcomeMessage}>{mockData.welcomeMessage}</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Статистика</Text>
        <View style={styles.statsGrid}>
          {mockData.stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Быстрые действия</Text>
        <View style={styles.actionsGrid}>
          {mockData.quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={[styles.actionCard, { backgroundColor: action.color + '20' }]}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Последняя активность</Text>
        <View style={styles.activityContainer}>
          {mockData.recentActivity.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityDot}>•</Text>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Charts (if available) */}
      {mockData.chartData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Аналитика</Text>
          <View style={styles.chartContainer}>
            {mockData.chartData.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <Text style={styles.chartLabel}>{item.label}</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${item.value}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
                <Text style={styles.chartValue}>{item.value}%</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Notifications (if available) */}
      {mockData.notifications && mockData.notifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Уведомления</Text>
          {mockData.notifications.map((notification, index) => (
            <View key={index} style={[styles.notificationCard, styles[`notification_${notification.type}`]]}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  departmentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    color: '#2c3e50',
  },
  activityContainer: {
    paddingLeft: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  activityDot: {
    fontSize: 16,
    color: '#3498db',
    marginRight: 10,
    marginTop: 2,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  chartContainer: {
    paddingVertical: 10,
  },
  chartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartLabel: {
    width: 100,
    fontSize: 14,
    color: '#2c3e50',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartValue: {
    width: 40,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'right',
  },
  notificationCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  notification_info: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196f3',
  },
  notification_warning: {
    backgroundColor: '#fff3e0',
    borderLeftColor: '#ff9800',
  },
  notification_success: {
    backgroundColor: '#e8f5e8',
    borderLeftColor: '#4caf50',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default DepartmentScreen;

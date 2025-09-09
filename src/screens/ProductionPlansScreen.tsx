import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { getProductionPlans } from '../services/productionService';
import { ProductionPlan } from '../types/production';

export default function ProductionPlansScreen() {
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setError(null);
      const fetchedPlans = await getProductionPlans();
      if (Array.isArray(fetchedPlans)) {
        setPlans(fetchedPlans);
      } else {
        console.warn('getProductionPlans did not return an array:', fetchedPlans);
        setPlans([]); // Set to empty array to prevent crash
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Ошибка загрузки данных');
      setPlans([]); // Also set to empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPlans();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Загрузка планов...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Производственные планы</Text>
        <Text style={styles.subtitle}>Всего планов: {plans.length}</Text>
        {error && (
          <Text style={styles.errorText}>⚠️ {error}</Text>
        )}
      </View>
      
      {plans.map((plan) => (
        <ProductionPlanCard key={plan.id} plan={plan} />
      ))}
    </ScrollView>
  );
}

function ProductionPlanCard({ plan }: { plan: ProductionPlan }) {
  const getProgressColor = (progress: number) => {
    if (progress < 30) return '#ef4444';
    if (progress < 70) return '#f59e0b';
    return '#10b981';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const produced = Math.round(plan.quantity * plan.progressPercent / 100);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.customer}>🏢 {plan.customerName}</Text>
        <Text style={styles.order}>📋 {plan.orderName}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <Text style={styles.quantity}>📦 Количество: {plan.quantity} шт</Text>
        <Text style={styles.deadline}>📅 Срок: {formatDate(plan.deadline)}</Text>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Прогресс: {produced}/{plan.quantity} ({plan.progressPercent}%)
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${plan.progressPercent}%`,
                backgroundColor: getProgressColor(plan.progressPercent)
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  customer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  order: {
    fontSize: 14,
    color: '#64748b',
  },
  cardBody: {
    marginBottom: 16,
  },
  quantity: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  deadline: {
    fontSize: 14,
    color: '#374151',
  },
  progressSection: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
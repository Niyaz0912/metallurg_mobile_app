import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ShiftAssignment } from '../types/assignments';
import { getAssignments } from '../services/assignmentService';

export default function ShiftAssignmentsScreen() {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = async () => {
    try {
      setError(null);
      const fetchedAssignments = await getAssignments();
      if (Array.isArray(fetchedAssignments)) {
        setAssignments(fetchedAssignments);
      } else {
        console.warn('getAssignments did not return an array:', fetchedAssignments);
        setAssignments([]); // Set to empty array to prevent crash
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Ошибка загрузки заданий');
      setAssignments([]); // Also set to empty array on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAssignments();
  };

  const handleViewPDF = (assignment: ShiftAssignment) => {
    Alert.alert(
      'Техкарта',
      `Открытие PDF для: ${assignment.productName}`,
      [{ text: 'OK' }]
    );
  };

  const handleReport = (assignment: ShiftAssignment) => {
    Alert.alert(
      'Отчет',
      `Переход к отчету по заданию ${assignment.taskNumber}`,
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  const currentShift = getCurrentShift();
  const pendingTasks = assignments.filter(a => a.status !== 'completed').length;
  const completedTasks = assignments.filter(a => a.status === 'completed').length;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.shiftHeader}>
        <Text style={styles.shiftTitle}>📋 Сменные задания</Text>
        <Text style={styles.shiftTime}>Смена: {currentShift}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>К выполнению</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10b981' }]}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Выполнено</Text>
          </View>
        </View>
      </View>

      {assignments.map((assignment) => (
        <AssignmentCard 
          key={assignment.id} 
          assignment={assignment} 
          onViewPDF={() => handleViewPDF(assignment)}
          onReport={() => handleReport(assignment)}
        />
      ))}
    </ScrollView>
  );
}

function AssignmentCard({ 
  assignment, 
  onViewPDF, 
  onReport 
}: { 
  assignment: ShiftAssignment;
  onViewPDF: () => void;
  onReport: () => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'normal': return '#f59e0b'; 
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '🔴 Срочное';
      case 'normal': return '🟡 В процессе';
      case 'low': return '🟢 Низкий приоритет';
      default: return '⚪ Обычное';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнено';
      default: return status;
    }
  };

  const progressPercent = Math.round((assignment.completedQuantity / assignment.quantity) * 100);
  const isCompleted = assignment.status === 'completed';

  return (
    <View style={[styles.card, isCompleted && styles.completedCard]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.priority, { color: getPriorityColor(assignment.priority) }]}>
          {getPriorityLabel(assignment.priority)}
        </Text>
        <Text style={styles.status}>{getStatusLabel(assignment.status)}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.taskNumber}>Задание #{assignment.taskNumber}</Text>
        <Text style={styles.productName}>{assignment.productName}</Text>
        <Text style={styles.customer}>Заказчик: {assignment.customerName}</Text>
        <Text style={styles.order}>Заказ: {assignment.orderName}</Text>
      </View>

      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          План: {assignment.quantity} шт | Сдано: {assignment.completedQuantity} шт ({progressPercent}%)
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progressPercent}%`,
                backgroundColor: isCompleted ? '#10b981' : '#3b82f6'
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.timeSection}>
        <Text style={styles.deadline}>
          ⏰ До: {new Date(assignment.deadline).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.pdfButton} onPress={onViewPDF}>
          <Text style={styles.pdfButtonText}>📄 PDF</Text>
        </TouchableOpacity>
        
        {!isCompleted && (
          <TouchableOpacity style={styles.reportButton} onPress={onReport}>
            <Text style={styles.reportButtonText}>📝 Отчитаться</Text>
          </TouchableOpacity>
        )}
        
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✅ Выполнено</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function getCurrentShift(): string {
  const now = new Date();
  const hours = now.getHours();
  
  if (hours >= 7 && hours < 19) {
    return "7:00 - 19:00 (День)";
  } else {
    return "19:00 - 7:00 (Ночь)";
  }
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
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    margin: 10,
  },
  shiftHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  shiftTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  shiftTime: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
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
  completedCard: {
    opacity: 0.8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priority: {
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardBody: {
    marginBottom: 16,
  },
  taskNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  productName: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  customer: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  order: {
    fontSize: 14,
    color: '#64748b',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
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
  timeSection: {
    marginBottom: 16,
  },
  deadline: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '500',
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  pdfButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  reportButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
  },
  completedText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '500',
  },
});
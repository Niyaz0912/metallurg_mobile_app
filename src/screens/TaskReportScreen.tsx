import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { ShiftAssignment } from '../types/assignments';

interface TaskReportScreenProps {
  route: {
    params: {
      assignment: ShiftAssignment;
      onReportSuccess: (assignmentId: number, completedQuantity: number) => void;
    };
  };
  navigation: {
    goBack: () => void;
  };
}

export default function TaskReportScreen({ route, navigation }: TaskReportScreenProps) {
  const { assignment, onReportSuccess } = route.params;
  const [completedQuantity, setCompletedQuantity] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const remaining = assignment.quantity - assignment.completedQuantity;
  const maxAllowed = remaining;

  const handleSubmit = async () => {
    // Валидация
    const quantity = parseInt(completedQuantity);
    
    if (!completedQuantity || isNaN(quantity)) {
      Alert.alert('Ошибка', 'Введите корректное количество');
      return;
    }

    if (quantity <= 0) {
      Alert.alert('Ошибка', 'Количество должно быть больше 0');
      return;
    }

    if (quantity > maxAllowed) {
      Alert.alert(
        'Ошибка', 
        `Нельзя сдать больше ${maxAllowed} шт (осталось к изготовлению)`
      );
      return;
    }

    // Подтверждение
    Alert.alert(
      'Подтверждение',
      `Отчитаться о выполнении ${quantity} шт?`,
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Отправить', 
          onPress: async () => {
            setIsSubmitting(true);
            
            try {
              // Имитация API запроса
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Уведомляем родительский компонент об успехе
              onReportSuccess(assignment.id, quantity);
              
              Alert.alert(
                'Успех!', 
                `Отчет отправлен. Сдано: ${quantity} шт`,
                [{ 
                  text: 'OK', 
                  onPress: () => navigation.goBack() 
                }]
              );
              
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось отправить отчет');
            } finally {
              setIsSubmitting(false);
            }
          }
        }
      ]
    );
  };

  const currentProgress = Math.round((assignment.completedQuantity / assignment.quantity) * 100);
  const newQuantity = parseInt(completedQuantity) || 0;
  const newTotal = assignment.completedQuantity + newQuantity;
  const newProgress = Math.round((newTotal / assignment.quantity) * 100);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Заголовок */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Назад</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Отчет о выполнении</Text>
        </View>

        {/* Информация о задании */}
        <View style={styles.assignmentCard}>
          <Text style={styles.taskNumber}>Задание #{assignment.taskNumber}</Text>
          <Text style={styles.productName}>{assignment.productName}</Text>
          <Text style={styles.customer}>Заказчик: {assignment.customerName}</Text>
          <Text style={styles.order}>Заказ: {assignment.orderName}</Text>
          
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Текущий прогресс:</Text>
            <Text style={styles.progressText}>
              {assignment.completedQuantity}/{assignment.quantity} шт ({currentProgress}%)
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${currentProgress}%`, backgroundColor: '#3b82f6' }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Форма отчета */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>📝 Данные для отчета</Text>
          
          {/* Количество */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Произведено за смену *</Text>
            <Text style={styles.inputHint}>
              Максимум: {maxAllowed} шт (осталось к изготовлению)
            </Text>
            <TextInput
              style={styles.quantityInput}
              value={completedQuantity}
              onChangeText={setCompletedQuantity}
              placeholder="0"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          {/* Предварительный расчет */}
          {newQuantity > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>📊 Предварительный результат:</Text>
              <Text style={styles.previewText}>
                Будет сдано: {newTotal}/{assignment.quantity} шт ({newProgress}%)
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min(newProgress, 100)}%`, 
                      backgroundColor: newProgress >= 100 ? '#10b981' : '#3b82f6' 
                    }
                  ]} 
                />
              </View>
            </View>
          )}

          {/* Комментарий */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Комментарий (необязательно)</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Дополнительная информация, замечания..."
              multiline={true}
              numberOfLines={3}
            />
          </View>

          {/* Кнопка отправки */}
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!completedQuantity || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!completedQuantity || isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '📤 Отправка...' : '✅ Отправить отчет'}
            </Text>
          </TouchableOpacity>

          {/* Предупреждения */}
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ Важно:</Text>
            <Text style={styles.warningText}>
              • После отправки отчет нельзя изменить
            </Text>
            <Text style={styles.warningText}>
              • Данные обновятся в техкартах и планах производства
            </Text>
            <Text style={styles.warningText}>
              • Мастер получит уведомление о выполнении
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  assignmentCard: {
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
    marginBottom: 16,
  },
  progressInfo: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#1f2937',
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
  formCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  quantityInput: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#ffffff',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  warningCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#78350f',
    marginBottom: 4,
  },
});

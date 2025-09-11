import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ShiftAssignment } from '../types/assignments';
import { getAssignments } from '../services/assignmentService';
import { Card, CardData } from '../components/ui';  // Исправленный импорт
import { colors, typography, spacing } from '../theme';

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
                setAssignments([]);
            }
        } catch (error) {
            console.error('Error loading assignments:', error);
            setError('Ошибка загрузки заданий');
            setAssignments([]);
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
        console.log('Opening PDF for:', assignment.productName);
        // TODO: Реализовать открытие PDF
    };

    const handleReport = (assignment: ShiftAssignment) => {
        console.log('Opening report for:', assignment.taskNumber);
        // TODO: Реализовать переход к отчету
    };

    // Преобразуем assignment в CardData
    const convertToCardData = (assignment: ShiftAssignment): CardData => {
        const progressPercent = Math.round((assignment.completedQuantity / assignment.quantity) * 100);
        const isCompleted = assignment.status === 'completed';

        // Определяем статус для StatusChip
        let status: 'urgent' | 'normal' | 'low' | 'completed' | 'pending' | 'inProgress' = 'normal';
        
        if (assignment.status === 'completed') {
            status = 'completed';
        } else if (assignment.priority === 'urgent') {
            status = 'urgent';
        } else if (assignment.status === 'in_progress') {
            status = 'inProgress';
        } else if (assignment.status === 'pending') {
            status = 'pending';
        }

        return {
            id: assignment.taskNumber || assignment.id,
            title: assignment.productName,
            status: status,
            metadata: [
                { label: 'Заказчик', value: assignment.customerName },
                { label: 'Заказ', value: assignment.orderName || 'Не указан' },
            ],
            progress: {
                current: assignment.completedQuantity,
                total: assignment.quantity,
                percentage: progressPercent,
            },
            deadline: new Date(assignment.deadline).toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            actions: isCompleted ? [] : [
                {
                    title: '📄 Техкарта',
                    type: 'secondary' as const,
                    onPress: () => handleViewPDF(assignment),
                },
                {
                    title: '📝 Отчитаться',
                    type: 'primary' as const,
                    onPress: () => handleReport(assignment),
                },
            ],
        };
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={styles.loadingText}>Загрузка заданий...</Text>
            </View>
        );
    }

    const currentShift = getCurrentShift();
    const pendingTasks = assignments.filter(a => a.status !== 'completed').length;
    const completedTasks = assignments.filter(a => a.status === 'completed').length;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={onRefresh}
                    colors={[colors.primary[500]]}
                />
            }
            showsVerticalScrollIndicator={false}
        >
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
            
            {/* Заголовок смены */}
            <View style={styles.shiftHeader}>
                <Text style={styles.shiftTitle}>📋 Сменные задания</Text>
                <Text style={styles.shiftTime}>{currentShift}</Text>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{pendingTasks}</Text>
                        <Text style={styles.statLabel}>К выполнению</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: colors.success[500] }]}>
                            {completedTasks}
                        </Text>
                        <Text style={styles.statLabel}>Выполнено</Text>
                    </View>
                </View>
            </View>
            
            {/* Список заданий */}
            {assignments.length === 0 && !loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Нет заданий на смену</Text>
                </View>
            ) : (
                assignments.map((assignment) => (
                    <Card
                        key={assignment.id}
                        data={convertToCardData(assignment)}
                        layout="assignment"
                    />
                ))
            )}

            {/* Отступ для навигации */}
            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

function getCurrentShift(): string {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 7 && hours < 19 ? "Дневная смена: 7:00 - 19:00" : "Ночная смена: 19:00 - 7:00";
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        ...typography.body.base,
        color: colors.gray[600],
        marginTop: spacing[2],
    },
    errorContainer: {
        backgroundColor: colors.danger[50],
        borderColor: colors.danger[200],
        borderWidth: 1,
        borderRadius: 8,
        margin: spacing[4],
        padding: spacing[3],
    },
    errorText: {
        ...typography.body.base,
        color: colors.danger[700],
        textAlign: 'center',
    },
    shiftHeader: {
        backgroundColor: colors.surface,
        padding: spacing[5],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: spacing[4],
    },
    shiftTitle: {
        ...typography.heading.h2,
        color: colors.gray[900],
        marginBottom: spacing[1],
    },
    shiftTime: {
        ...typography.body.base,
        color: colors.gray[600],
        marginBottom: spacing[4],
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        ...typography.heading.h1,
        color: colors.primary[500],
        fontWeight: typography.fontWeight.bold,
    },
    statLabel: {
        ...typography.body.xs,
        color: colors.gray[600],
        marginTop: spacing[1],
        textAlign: 'center',
    },
    emptyContainer: {
        padding: spacing[8],
        alignItems: 'center',
    },
    emptyText: {
        ...typography.body.base,
        color: colors.gray[500],
        textAlign: 'center',
    },
    bottomSpacing: {
        height: 100,
    },
});


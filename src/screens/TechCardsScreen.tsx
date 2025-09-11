import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Card, CardData } from '../components/ui/Card';
import { colors, typography, spacing } from '../theme';

const mockTechCards = [
  { id: 1, name: 'Корпус подшипника', createdAt: '2025-09-10T10:00:00Z' },
  { id: 2, name: 'Вал привода', createdAt: '2025-09-08T14:30:00Z' },
  { id: 3, name: 'Крышка двигателя', createdAt: '2025-09-05T09:15:00Z' },
];

export default function TechCardsScreen() {
    const [techCards] = useState(mockTechCards);
    const [refreshing, setRefreshing] = useState(false);

    const handleTechCardPress = (id: number) => {
        console.log('Opening techcard:', id);
    };

    const handleCreateTechCard = () => {
        console.log('Creating new techcard');
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    // Преобразуем techcard в CardData
    const convertToCardData = (techCard: any): CardData => ({
        id: techCard.id,
        title: techCard.name,
        subtitle: `Создано: ${new Date(techCard.createdAt).toLocaleDateString('ru-RU')}`,
    });

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Техкарты</Text>
                <Text style={styles.subtitle}>Всего: {techCards.length}</Text>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handleCreateTechCard}>
                <Text style={styles.createButtonText}>+ СОЗДАТЬ ТЕХКАРТУ</Text>
            </TouchableOpacity>

            {/* Универсальные карточки техкарт */}
            {techCards.map((techCard) => (
                <Card
                    key={techCard.id}
                    data={convertToCardData(techCard)}
                    layout="techcard"
                    onPress={() => handleTechCardPress(techCard.id)}
                />
            ))}

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        padding: spacing[5],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        marginBottom: spacing[4],
    },
    title: {
        ...typography.heading.h2,
        color: colors.gray[900],
        marginBottom: spacing[1],
    },
    subtitle: {
        ...typography.body.base,
        color: colors.gray[600],
    },
    createButton: {
        backgroundColor: colors.primary[500],
        marginHorizontal: spacing[4],
        paddingVertical: spacing[4],
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    createButtonText: {
        ...typography.label.large,
        color: colors.surface,
        fontWeight: typography.fontWeight.bold,
    },
});

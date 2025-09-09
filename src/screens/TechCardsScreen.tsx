import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getTechCards } from '../services/techService';
import { TechCard } from '../types/tech';

const TechCardsScreen: React.FC = () => {
  const [techCards, setTechCards] = useState<TechCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechCards = async () => {
      try {
        const fetchedTechCards = await getTechCards();
        if (Array.isArray(fetchedTechCards)) {
          setTechCards(fetchedTechCards);
        } else {
          console.warn('getTechCards did not return an array:', fetchedTechCards);
          setTechCards([]);
        }
      } catch (err) {
        setError('Failed to fetch tech cards');
        setTechCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechCards();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Создать техкарту" onPress={() => { /* TODO: Navigate to create tech card screen */ }} />
      <FlatList
        data={techCards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.techCardItem}>
            <Text style={styles.techCardTitle}>{item.productName}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'red',
  },
  techCardItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  techCardTitle: {
    fontWeight: 'bold',
  },
});

export default TechCardsScreen;
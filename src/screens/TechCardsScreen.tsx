import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type TechCardsScreenProps = StackScreenProps<RootStackParamList, 'TechCards'>;

const TechCardsScreen: React.FC<TechCardsScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Технологические карты</Text>
      <Button title="Создать техкарту" onPress={() => {}} />
      <Button title="Список техкарт" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default TechCardsScreen;

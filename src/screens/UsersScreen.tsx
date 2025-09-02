import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type UsersScreenProps = StackScreenProps<RootStackParamList, 'Users'>;

const UsersScreen: React.FC<UsersScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Управление пользователями</Text>
      <Button title="Создать" onPress={() => {}} />
      <Button title="Список пользователей" onPress={() => {}} />
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

export default UsersScreen;
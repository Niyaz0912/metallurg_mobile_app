import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type ProductionPlansScreenProps = StackScreenProps<RootStackParamList, 'ProductionPlans'>;

const ProductionPlansScreen: React.FC<ProductionPlansScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Планы производства</Text>
      <Button title="Создать план" onPress={() => {}} />
      <Button title="Список планов" onPress={() => {}} />
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

export default ProductionPlansScreen;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Button } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import UsersScreen from './src/screens/UsersScreen';
import ProductionPlansScreen from './src/screens/ProductionPlansScreen';
import TechCardsScreen from './src/screens/TechCardsScreen';

import { UserRole } from './src/types/auth';
import { AuthProvider, useAuth } from './src/context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Users: undefined;
  ProductionPlans: undefined;
  TechCards: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Helper component for the logout button
function LogoutButton() {
  const { logout } = useAuth();
  return <Button onPress={logout} title="Выход" color="#dc3545" />;
}

function MainNavigator() {
  const { user } = useAuth();

  if (!user) {
    // This should not happen if the routing is correct, but it's a good safeguard
    return null;
  }

  return (
    <Tab.Navigator>
      {[UserRole.ADMIN, UserRole.DIRECTOR, UserRole.MASTER].includes(user.role) && (
        <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'Пользователи' }} />
      )}
      <Tab.Screen name="ProductionPlans" component={ProductionPlansScreen} options={{ title: 'Планирование' }} />
      <Tab.Screen name="TechCards" component={TechCardsScreen} options={{ title: 'Тех. карты' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator} 
            options={{
              title: 'Главный экран',
              headerLeft: () => null, // Hides the back button
              headerRight: () => <LogoutButton />,
            }}
          />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
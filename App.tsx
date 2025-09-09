import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Button, Text, Platform } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import UsersScreen from './src/screens/UsersScreen';
import ProductionPlansScreen from './src/screens/ProductionPlansScreen';
import TechCardsScreen from './src/screens/TechCardsScreen';
import ShiftAssignmentsScreen from './src/screens/ShiftAssignmentsScreen';
import TaskReportScreen from './src/screens/TaskReportScreen';

import { UserRole } from './src/types/auth';
import { AuthProvider, useAuth } from './src/context/AuthContext';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  TaskReport: {
    assignment: any;
    onReportSuccess: (assignmentId: number, completedQuantity: number) => void;
  };
};

export type MainTabParamList = {
  ShiftAssignments: undefined;
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
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 2,
          borderTopColor: '#3b82f6',
          height: Platform.OS === 'web' ? 70 : 60,
          paddingBottom: Platform.OS === 'web' ? 12 : 8,
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="ShiftAssignments" 
        component={ShiftAssignmentsScreen} 
        options={{
          tabBarLabel: 'Задания',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '📋' : '📄'}
            </Text>
          ),
        }}
      />

      {[UserRole.ADMIN, UserRole.DIRECTOR, UserRole.MASTER].includes(user.role) && (
        <Tab.Screen 
          name="Users" 
          component={UsersScreen} 
          options={{
            tabBarLabel: 'Пользователи',
            tabBarIcon: ({ focused, color }) => (
              <Text style={{ fontSize: 24, color }}>
                {focused ? '👤' : '👥'}
              </Text>
            ),
          }}
        />
      )}
      
      <Tab.Screen 
        name="ProductionPlans" 
        component={ProductionPlansScreen} 
        options={{
          tabBarLabel: 'Планы',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '📊' : '📈'}
            </Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="TechCards" 
        component={TechCardsScreen} 
        options={{
          tabBarLabel: 'Техкарты',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '🔧' : '⚙️'}
            </Text>
          ),
        }}
      />
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
          <>
            <Stack.Screen 
              name="Main" 
              component={MainNavigator} 
              options={{
                title: 'Metallurg Mobile',
                headerLeft: () => null,
                headerRight: () => <LogoutButton />,
                headerStyle: {
                  backgroundColor: '#1f2937',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="TaskReport" 
              component={TaskReportScreen} 
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
          </>
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

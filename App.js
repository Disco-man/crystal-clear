import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import WaterScreen from './src/screens/WaterScreen';
import EnergyScreen from './src/screens/EnergyScreen';
import EfficiencyScreen from './src/screens/EfficiencyScreen';
import ForecastScreen from './src/screens/ForecastScreen';
import { theme } from './src/theme';

const Tab = createBottomTabNavigator();

export { theme };

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f1f5f9' }}>
          <Text style={{ fontSize: 16, color: '#c94b4b', textAlign: 'center' }}>
            Ошибка: {this.state.error?.message || String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                const icons = {
                  'Главная': 'home',
                  'Вода': 'water',
                  'Энергия': 'flash',
                  'КПД и CO₂': 'leaf',
                  'Прогноз': 'trending-up',
                };
                return <Ionicons name={icons[route.name]} size={size} color={color} />;
              },
              tabBarActiveTintColor: theme.accent,
              tabBarInactiveTintColor: theme.textMuted,
              tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '600', fontSize: 18 },
            })}
          >
            <Tab.Screen name="Главная" component={DashboardScreen} />
            <Tab.Screen name="Вода" component={WaterScreen} />
            <Tab.Screen name="Энергия" component={EnergyScreen} />
            <Tab.Screen name="КПД и CO₂" component={EfficiencyScreen} />
            <Tab.Screen name="Прогноз" component={ForecastScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

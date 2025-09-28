import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Platform, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import DialogsListScreen from './screens/DialogsListScreen';
import DialogDetailScreen from './screens/DialogDetailScreen';
import VocabularyScreen from './screens/VocabularyScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366F1',
    primaryContainer: '#EEF2FF',
    secondary: '#8B5CF6',
    tertiary: '#EC4899',
    surface: '#FFFFFF',
    background: '#F8FAFC',
    surfaceVariant: '#F1F5F9',
    outline: '#6366F1',
    onPrimary: '#FFFFFF',
    onSurface: '#1E293B',
    onSurfaceVariant: '#475569',
    shadow: '#000000',
    error: '#EF4444',
    success: '#10B981',
  },
  roundness: 24,
};

// Stack Navigator для диалогов
function DialogsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Скрываем заголовки, так как используем кастомные
      }}
    >
      <Stack.Screen 
        name="DialogsList" 
        component={DialogsListScreen}
      />
      <Stack.Screen 
        name="DialogDetail" 
        component={DialogDetailScreen}
      />
    </Stack.Navigator>
  );
}

// Главная Tab Navigation
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'DialogsTab':
              iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
              break;
            case 'VocabularyTab':
              iconName = focused ? 'book-alphabet' : 'book-alphabet';
              break;
            case 'ProgressTab':
              iconName = focused ? 'chart-line' : 'chart-line-variant';
              break;
            case 'SettingsTab':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -5 },
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: 'absolute',
          marginHorizontal: 0,
          ...(Platform.OS === 'web' && {
            position: 'relative',
            height: 70,
            paddingBottom: 10,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      })}
    >
      <Tab.Screen 
        name="DialogsTab" 
        component={DialogsStack}
        options={{
          tabBarLabel: 'Диалоги',
        }}
      />
      <Tab.Screen 
        name="VocabularyTab" 
        component={VocabularyScreen}
        options={{
          tabBarLabel: 'Словарь',
        }}
      />
      <Tab.Screen 
        name="ProgressTab" 
        component={ProgressScreen}
        options={{
          tabBarLabel: 'Прогресс',
        }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Настройки',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#4338CA" />
        <View style={{ 
          flex: 1, 
          backgroundColor: theme.colors.background,
          ...(Platform.OS === 'web' && { height: '100vh' })
        }}>
          <MainTabNavigator />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
} 
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { createAppTheme } from './shared/constants';
import { Platform, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Импортируем настройки (Context Provider)
import { SettingsProvider, useSettings } from './features/settings';

// Импортируем экраны напрямую
import { DialogsListScreen } from './features/dialogs/screens/DialogsListScreen';
import { DialogDetailScreen } from './features/dialogs/screens/DialogDetailScreen';
import { VocabularyScreen } from './features/vocabulary/screens/VocabularyScreen';
import { ProgressScreen } from './features/progress/screens/ProgressScreen';
import { SettingsScreen } from './features/settings/screens/SettingsScreen';
import { LoadingScreen } from './shared/components/feedback/LoadingScreen';
import { initDb, seedDbIfEmpty } from './db';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


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

// Главная Tab Navigation - теперь с динамической темой
function MainTabNavigator({ theme }) {
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
        tabBarInactiveTintColor: theme.dark ? '#94A3B8' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
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

/**
 * ThemedApp - Inner component that consumes settings and applies theme
 */
function ThemedApp() {
  const { isReady, settings } = useSettings();
  const [dbReady, setDbReady] = useState(false);
  const theme = createAppTheme(settings.darkTheme);

  useEffect(() => {
    let isMounted = true;

    async function prepareDb() {
      try {
        await initDb();
        await seedDbIfEmpty();
      } catch (error) {
        console.warn('DB init error', error);
      } finally {
        if (isMounted) {
          setDbReady(true);
        }
      }
    }

    prepareDb();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading screen until settings are loaded from storage
  if (!isReady || !dbReady) {
    return <LoadingScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar 
          style={settings.darkTheme ? 'light' : 'light'} 
          backgroundColor={settings.darkTheme ? '#0F172A' : '#4338CA'} 
        />
        <View style={{ 
          flex: 1, 
          backgroundColor: theme.colors.background,
          ...(Platform.OS === 'web' && { height: '100vh' })
        }}>
          <MainTabNavigator theme={theme} />
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}

/**
 * App - Root component wrapped with SettingsProvider
 */
export default function App() {
  return (
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  );
} 

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
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.dark ? 'rgba(17,24,39,0.9)' : 'rgba(255,255,255,0.9)',
          borderTopWidth: 0,
          elevation: 24,
          shadowOpacity: 0.15,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -8 },
          height: Platform.OS === 'ios' ? 82 : 72,
          paddingBottom: Platform.OS === 'ios' ? 18 : 12,
          paddingTop: 12,
          borderRadius: 26,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 12 : 10,
          position: 'absolute',
          ...(Platform.OS === 'web' && {
            position: 'relative',
            marginHorizontal: 0,
            marginBottom: 0,
            height: 72,
            borderRadius: 0,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          borderRadius: 18,
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
          style={settings.darkTheme ? 'light' : 'dark'} 
          backgroundColor={settings.darkTheme ? '#050915' : '#0EA5E9'} 
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

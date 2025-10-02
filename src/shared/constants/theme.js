import { MD3LightTheme } from 'react-native-paper';

export const theme = {
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

export const colors = {
  difficulty: {
    'مبتدئ': '#10B981',
    'متوسط': '#F59E0B', 
    'متقدم': '#EF4444',
  },
  category: {
    'места': '#10B981',
    'еда': '#F59E0B',
    'профессии': '#EF4444',
    'прилагательные': '#8B5CF6',
    'основные': '#3B82F6',
    'деньги': '#F97316',
    'наука': '#06B6D4',
    'предметы': '#84CC16',
  },
};


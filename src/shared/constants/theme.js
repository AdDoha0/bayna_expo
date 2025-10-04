import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Light theme configuration
 */
const lightTheme = {
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

/**
 * Dark theme configuration
 */
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#8B5CF6',
    primaryContainer: '#5B21B6',
    secondary: '#A78BFA',
    tertiary: '#F472B6',
    surface: '#1E293B',
    background: '#0F172A',
    surfaceVariant: '#334155',
    outline: '#8B5CF6',
    onPrimary: '#FFFFFF',
    onSurface: '#F1F5F9',
    onSurfaceVariant: '#CBD5E1',
    shadow: '#000000',
    error: '#EF4444',
    success: '#10B981',
  },
  roundness: 24,
};

/**
 * Factory function to get theme based on user preference
 * @param {boolean} isDark - Whether dark theme is enabled
 * @returns {Object} Theme configuration for React Native Paper
 */
export function createAppTheme(isDark = false) {
  return isDark ? darkTheme : lightTheme;
}

/**
 * Default theme export (light) for backwards compatibility
 */
export const theme = lightTheme;

/**
 * Theme-agnostic colors for categories and difficulty levels
 */
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



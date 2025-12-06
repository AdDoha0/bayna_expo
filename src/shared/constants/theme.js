import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

/**
 * Light theme configuration
 */
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0EA5E9',
    primaryContainer: '#E0F2FE',
    secondary: '#F59E0B',
    tertiary: '#10B981',
    surface: '#FFFFFF',
    background: '#F9FAFB',
    surfaceVariant: '#F1F2F6',
    outline: '#0EA5E9',
    onPrimary: '#FFFFFF',
    onSurface: '#0F172A',
    onSurfaceVariant: '#475569',
    shadow: '#000000',
    error: '#EF4444',
    success: '#22C55E',
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
    primary: '#38BDF8',
    primaryContainer: '#0F172A',
    secondary: '#FBBF24',
    tertiary: '#34D399',
    surface: '#0B1220',
    background: '#050915',
    surfaceVariant: '#111827',
    outline: '#38BDF8',
    onPrimary: '#0B1220',
    onSurface: '#E2E8F0',
    onSurfaceVariant: '#94A3B8',
    shadow: '#000000',
    error: '#F87171',
    success: '#4ADE80',
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
  partOfSpeech: {
    noun: '#10B981',
    verb: '#F97316',
    adj: '#8B5CF6',
    adv: '#06B6D4',
    phrase: '#3B82F6',
  },
};

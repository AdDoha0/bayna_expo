import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { getPlatformStyles, isWeb } from '../../../utils';

export function Screen({ children, style, paddingBottom = true }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[
      styles.container,
      paddingBottom && styles.withPadding,
      isWeb() && styles.webContainer,
      style
    ]}>
      {children}
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  withPadding: {
    paddingBottom: 70, // Отступ для навигационной панели
  },
  webContainer: {
    height: '100vh',
    overflow: 'hidden',
    paddingBottom: 0,
  },
});


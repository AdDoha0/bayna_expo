import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { isWeb } from '../../../utils';

export function Screen({ children, style, paddingBottom = true }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={theme.dark ? ['#050915', '#0B1220'] : ['#FCFCFD', '#F2F3F5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <View style={[
        styles.content,
        paddingBottom && styles.withPadding,
        isWeb() && styles.webContainer,
      ]}>
        {children}
      </View>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
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

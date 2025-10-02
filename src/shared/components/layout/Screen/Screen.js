import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getPlatformStyles, isWeb } from '../../../utils';

export function Screen({ children, style, paddingBottom = true }) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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


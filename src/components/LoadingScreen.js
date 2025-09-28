import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  return (
    <LinearGradient
      colors={['#4338CA', '#6366F1', '#8B5CF6']}
      style={styles.container}
    >
      <Surface style={styles.content} elevation={0}>
        <Text variant="displayLarge" style={styles.arabicTitle}>
          بين يديك
        </Text>
        <Text variant="headlineMedium" style={styles.subtitle}>
          📖 Изучение арабского языка
        </Text>
        
        <View style={styles.decorativeElement}>
          <View style={styles.decorativeDot} />
          <View style={styles.decorativeLine} />
          <View style={styles.decorativeDot} />
        </View>
        
        <Surface style={styles.loaderContainer} elevation={3}>
          <ActivityIndicator 
            size="large" 
            color="#6366F1" 
            style={styles.loader}
          />
        </Surface>
        
        <Text variant="titleMedium" style={styles.loadingText}>
          Загрузка диалогов...
        </Text>
      </Surface>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    padding: 48,
  },
  arabicTitle: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  decorativeElement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E7FF',
    opacity: 0.8,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E7FF',
    opacity: 0.6,
  },
  loaderContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  loader: {
    // No additional styles needed
  },
  loadingText: {
    color: '#E0E7FF',
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.95,
  },
}); 
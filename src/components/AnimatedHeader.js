import React from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import {
  Text,
  Surface,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const HEADER_HEIGHT = 240;

export default function AnimatedHeader({
  scrollY,
  arabicTitle,
  title,
  subtitle,
  decorativeElement = null,
}) {
  // Анимация для заголовка
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.5, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Анимация для контента - убираем отступ сверху при скролле
  const contentPaddingTop = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT + 20, 20],
    extrapolate: 'clamp',
  });

  return {
    headerComponent: (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={['#4338CA', '#6366F1', '#8B5CF6']}
          style={styles.headerGradient}
        >
          <Surface style={styles.headerSurface} elevation={0}>
            <Text variant="displaySmall" style={styles.headerArabic}>
              {arabicTitle}
            </Text>
            <Text variant="headlineLarge" style={styles.headerTitle}>
              {title}
            </Text>
            <Text variant="titleMedium" style={styles.headerSubtitle}>
              {subtitle}
            </Text>
            {decorativeElement}
          </Surface>
        </LinearGradient>
      </Animated.View>
    ),
    contentPaddingTop,
    HEADER_HEIGHT,
  };
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
    paddingBottom: 32,
    paddingTop: Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0) + 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerSurface: {
    backgroundColor: 'transparent',
    padding: 28,
    paddingTop: 20,
  },
  headerArabic: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '800',
    marginBottom: 12,
    writingDirection: 'rtl',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  headerTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    color: '#E0E7FF',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 24,
  },
}); 
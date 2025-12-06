import React from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  Animated,
  View,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

// Базовая высота контента хедера
const BASE_HEADER_HEIGHT = 240;

// Полная высота хедера с учетом StatusBar и platform
function getFullHeaderHeight() {
  const statusBarHeight = Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0);
  return BASE_HEADER_HEIGHT + statusBarHeight;
}

export function AnimatedHeader({
  scrollY,
  arabicTitle,
  title,
  subtitle,
  decorativeElement = null,
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const fullHeaderHeight = getFullHeaderHeight();
  
  // Динамические цвета градиента в зависимости от темы
  const gradientColors = theme.dark
    ? ['#0B1220', '#0F172A', '#12243A']
    : ['#0EA5E9', '#2563EB', '#0EA5E9'];
  const accentPillColor = theme.dark ? 'rgba(56,189,248,0.12)' : 'rgba(14,165,233,0.12)';
  const accentBackdrop = theme.dark ? 'rgba(59,130,246,0.12)' : 'rgba(244, 187, 74, 0.16)';
  
  // Анимация для заголовка
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, fullHeaderHeight],
    outputRange: [0, -fullHeaderHeight],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, fullHeaderHeight * 0.5, fullHeaderHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  // Анимация для контента - убираем отступ сверху при скролле
  // Используем полную высоту хедера с учетом StatusBar
  const contentPaddingTop = scrollY.interpolate({
    inputRange: [0, fullHeaderHeight],
    outputRange: [fullHeaderHeight + 20, 20],
    extrapolate: 'clamp',
  });

  return {
    headerComponent: (
      <Animated.View
        style={[
          styles.headerContainer,
          {
            height: fullHeaderHeight,
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          style={styles.headerGradient}
        >
          <View style={[styles.blob, styles.blobPrimary]} />
          <View style={[styles.blob, styles.blobSecondary]} />

          <Surface style={styles.headerSurface} elevation={0}>
            <View style={styles.pill}>
              <Text variant="labelLarge" style={styles.pillText}>
                Подборка для вас
              </Text>
            </View>
            <Text variant="displaySmall" style={styles.headerArabic}>
              {arabicTitle}
            </Text>
            <View style={styles.titleRow}>
              <Text variant="headlineLarge" style={styles.headerTitle}>
                {title}
              </Text>
              <Surface style={[styles.accentBadge, { backgroundColor: accentBackdrop }]} elevation={0}>
                <Text variant="labelLarge" style={styles.accentBadgeText}>
                  Новый вид
                </Text>
              </Surface>
            </View>
            <Surface style={[styles.subtitleCard, { backgroundColor: accentPillColor }]} elevation={0}>
              <Text variant="titleMedium" style={styles.headerSubtitle}>
                {subtitle}
              </Text>
            </Surface>
            {decorativeElement}
          </Surface>
        </LinearGradient>
      </Animated.View>
    ),
    contentPaddingTop,
    HEADER_HEIGHT: fullHeaderHeight,
  };
}

const createStyles = (theme) => StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    flex: 1,
    paddingBottom: 32,
    paddingTop: Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0) + 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  headerSurface: {
    backgroundColor: 'transparent',
    padding: 28,
    paddingTop: 20,
    gap: 12,
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.5,
    transform: [{ rotate: '25deg' }],
  },
  blobPrimary: {
    width: 260,
    height: 260,
    top: -60,
    right: -40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  blobSecondary: {
    width: 200,
    height: 200,
    bottom: -60,
    left: -50,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  headerSubtitle: {
    color: theme.dark ? '#E0E7FF' : '#0F172A',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 24,
  },
  pill: {
    alignSelf: 'center',
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pillText: {
    color: '#E0F2FE',
    fontWeight: '700',
  },
  accentBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  accentBadgeText: {
    color: theme.dark ? '#E0F2FE' : theme.colors.onSurface,
    fontWeight: '700',
  },
  subtitleCard: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'center',
  },
});

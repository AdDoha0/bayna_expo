import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export function Card({ 
  children, 
  style, 
  gradient = false, 
  gradientColors,
  elevation = 6,
  mode = "elevated",
  onPress,
  ...props 
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  // Дефолтные цвета градиента зависят от темы
  const defaultGradientColors = theme.dark 
    ? [theme.colors.surface, theme.colors.surfaceVariant]
    : [theme.colors.surface, '#FAFBFF'];
  
  const finalGradientColors = gradientColors || defaultGradientColors;
  
  const cardContent = (
    <PaperCard
      style={[styles.card, style]}
      mode={mode}
      elevation={elevation}
      onPress={onPress}
      {...props}
    >
      {gradient ? (
        <LinearGradient
          colors={finalGradientColors}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </PaperCard>
  );

  return cardContent;
}

const createStyles = (theme) => StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  gradient: {
    borderRadius: 24,
  },
});


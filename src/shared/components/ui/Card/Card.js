import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export function Card({ 
  children, 
  style, 
  gradient = false, 
  gradientColors = ['#FFFFFF', '#FAFBFF'],
  elevation = 6,
  mode = "elevated",
  onPress,
  ...props 
}) {
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
          colors={gradientColors}
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  gradient: {
    borderRadius: 24,
  },
});


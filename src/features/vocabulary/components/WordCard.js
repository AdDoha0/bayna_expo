import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card, Chip } from '../../../shared/components';
import { colors } from '../../../shared/constants';

export function WordCard({ word }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  function getCategoryColor(category) {
    return colors.category[category] || theme.colors.primary;
  }

  return (
    <Card style={styles.wordCard} elevation={4}>
      <PaperCard.Content style={styles.wordContent}>
        <View style={styles.wordHeader}>
          <Text variant="headlineSmall" style={styles.arabicWord}>
            {word.arabic}
          </Text>
          <Chip
            backgroundColor={getCategoryColor(word.category) + '20'}
            textColor={getCategoryColor(word.category)}
            style={styles.categoryChip}
            textStyle={styles.categoryChipText}
          >
            {word.category}
          </Chip>
        </View>
        <Text variant="titleMedium" style={styles.transcription}>
          {word.transcription}
        </Text>
        <Text variant="titleLarge" style={styles.russianWord}>
          {word.russian}
        </Text>
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  wordCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  wordContent: {
    padding: 20,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arabicWord: {
    color: theme.colors.primary,
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  categoryChip: {
    marginLeft: 12,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transcription: {
    color: theme.colors.secondary,
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  russianWord: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    textAlign: 'center',
  },
});


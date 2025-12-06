import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card, Chip } from '../../../shared/components';
import { colors } from '../../../shared/constants';
import { PARTS_OF_SPEECH_LABELS } from '../../../db';

export function WordCard({ word }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const posLabel = PARTS_OF_SPEECH_LABELS[word.part_of_speech] || word.part_of_speech || '—';
  
  function getCategoryColor(partOfSpeech) {
    return colors.partOfSpeech?.[partOfSpeech] || theme.colors.primary;
  }

  return (
    <Card style={styles.wordCard} elevation={4}>
      <PaperCard.Content style={styles.wordContent}>
        <View style={styles.wordHeader}>
          <Text variant="headlineSmall" style={styles.arabicWord}>
            {word.arabic}
          </Text>
          <Chip
            backgroundColor={getCategoryColor(word.part_of_speech) + '20'}
            textColor={getCategoryColor(word.part_of_speech)}
            style={styles.categoryChip}
            textStyle={styles.categoryChipText}
          >
            {posLabel}
          </Chip>
        </View>
        <Text variant="titleMedium" style={styles.transcription}>
          {word.transcription}
        </Text>
        <Text variant="titleLarge" style={styles.russianWord}>
          {word.translation_ru}
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
    borderWidth: 1,
    borderColor: theme.colors.primary + '12',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
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
    color: theme.colors.onSurfaceVariant,
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

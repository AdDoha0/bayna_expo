import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card } from '../../../shared/components';

export function ProgressChart({ progressData }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const progressPercentage = (progressData.completedLessons / progressData.totalLessons) * 100;
  const wordsPercentage = (progressData.learnedWords / progressData.totalWords) * 100;

  function ProgressItem({ title, current, total, progress, color }) {
    return (
      <View style={styles.progressItem}>
        <View style={styles.progressHeader}>
          <Text variant="titleMedium">{title}</Text>
          <Text variant="bodyMedium" style={styles.progressValue}>
            {current}/{total}
          </Text>
        </View>
        <ProgressBar
          progress={progress / 100}
          color={color}
          style={styles.progressBar}
        />
      </View>
    );
  }

  return (
    <Card style={styles.progressCard} elevation={3}>
      <PaperCard.Content style={styles.progressContent}>
        <Text variant="titleLarge" style={styles.progressTitle}>
          🎯 Общий прогресс
        </Text>
        
        <ProgressItem
          title="Уроки"
          current={progressData.completedLessons}
          total={progressData.totalLessons}
          progress={progressPercentage}
          color={theme.colors.primary}
        />

        <ProgressItem
          title="Словарь"
          current={progressData.learnedWords}
          total={progressData.totalWords}
          progress={wordsPercentage}
          color={theme.colors.success}
        />
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  progressCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginBottom: 20,
  },
  progressContent: {
    padding: 20,
  },
  progressTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 20,
    textAlign: 'center',
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressValue: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceVariant,
  },
});


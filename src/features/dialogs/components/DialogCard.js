import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Surface, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card, Chip } from '../../../shared/components';
import { colors } from '../../../shared/constants';

export function DialogCard({ dialog, onPress }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const dialoguesCount = Array.isArray(dialog.dialogues) ? dialog.dialogues.length : (dialog.dialoguesCount || 0);
  
  function getDifficultyColor(difficulty) {
    return colors.difficulty[difficulty] || theme.colors.primary;
  }

  function getDifficultyText(difficulty) {
    switch (difficulty) {
      case 'مبتدئ': return 'Начальный';
      case 'متوسط': return 'Средний';
      case 'متقدم': return 'Продвинутый';
      default: return difficulty;
    }
  }

  return (
    <Card
      style={styles.dialogCard}
      gradient={true}
      onPress={() => onPress(dialog)}
    >
      <PaperCard.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text variant="headlineSmall" style={styles.arabicTitle}>
              {dialog.title}
            </Text>
            <Text variant="titleLarge" style={styles.russianTitle}>
              {dialog.subtitle}
            </Text>
          </View>
          <Chip
            backgroundColor={getDifficultyColor(dialog.difficulty) + '20'}
            textColor={getDifficultyColor(dialog.difficulty)}
            style={styles.difficultyChip}
          >
            {getDifficultyText(dialog.difficulty || '—')}
          </Chip>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.dialogInfo}>
            <Surface style={styles.infoChip} elevation={1}>
              <Text variant="labelLarge" style={styles.infoText}>
                📚 {dialoguesCount} реплик
              </Text>
            </Surface>
          </View>
          <Surface style={styles.arrowButton} elevation={2}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={theme.colors.primary}
              style={styles.arrowIcon}
            />
          </Surface>
        </View>
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  dialogCard: {
    marginBottom: 20,
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 16,
  },
  arabicTitle: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 8,
    lineHeight: 32,
  },
  russianTitle: {
    lineHeight: 28,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  difficultyChip: {
    alignSelf: 'flex-start',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialogInfo: {
    flex: 1,
  },
  infoChip: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  infoText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  arrowButton: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 20,
    marginLeft: 12,
  },
  arrowIcon: {
    margin: 0,
  },
});

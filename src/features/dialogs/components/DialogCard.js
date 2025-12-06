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
      elevation={0}
      onPress={() => onPress(dialog)}
    >
      <PaperCard.Content style={styles.cardContent}>
        <View style={styles.metaRow}>
          <Chip
            backgroundColor={getDifficultyColor(dialog.difficulty) + '20'}
            textColor={getDifficultyColor(dialog.difficulty)}
            style={styles.difficultyChip}
          >
            {getDifficultyText(dialog.difficulty || '—')}
          </Chip>
          <Surface style={styles.countBadge} elevation={0}>
            <Text variant="labelLarge" style={styles.infoText}>
              {dialoguesCount} реплик
            </Text>
          </Surface>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text variant="headlineSmall" style={styles.arabicTitle}>
              {dialog.title}
            </Text>
            <Text variant="titleLarge" style={styles.russianTitle}>
              {dialog.subtitle}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text variant="bodyLarge" style={styles.ctaText}>
            Открыть диалог
          </Text>
          <Surface style={styles.arrowButton} elevation={3}>
            <IconButton
              icon="arrow-right"
              size={26}
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
    borderWidth: 1,
    borderColor: theme.colors.primary + '18',
    backgroundColor: theme.dark ? '#0F172A' : '#FFFFFF',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  cardContent: {
    padding: 24,
    gap: 6,
  },
  cardHeader: {
    marginBottom: 10,
  },
  titleContainer: {
    marginBottom: 8,
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
  infoText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  arrowButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary + '25',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  arrowIcon: {
    margin: 0,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countBadge: {
    backgroundColor: theme.dark ? 'rgba(59,130,246,0.12)' : theme.colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  ctaText: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
});

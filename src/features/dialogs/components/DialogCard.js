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
            backgroundColor={theme.colors.primary + '12'}
            textColor={theme.colors.onSurface}
            style={styles.difficultyChip}
          >
            {getDifficultyText(dialog.difficulty || '—')}
          </Chip>
          <Surface style={styles.countBadge} elevation={0}>
            <Text variant="labelMedium" style={styles.infoText}>
              {dialoguesCount} реплик
            </Text>
          </Surface>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text variant="titleLarge" style={styles.arabicTitle}>
              {dialog.title}
            </Text>
            <Text variant="titleMedium" style={styles.russianTitle}>
              {dialog.subtitle}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text variant="bodyMedium" style={styles.ctaText}>
            Открыть диалог
          </Text>
          <IconButton
            icon="arrow-right"
            size={24}
            iconColor={theme.colors.primary}
            style={styles.arrowIcon}
            containerColor="transparent"
          />
        </View>
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  dialogCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '12',
    backgroundColor: theme.dark ? '#0D1118' : '#FFFFFF',
    borderRadius: 18,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  cardContent: {
    padding: 20,
    gap: 10,
  },
  cardHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    marginBottom: 8,
  },
  arabicTitle: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 6,
    lineHeight: 28,
  },
  russianTitle: {
    lineHeight: 28,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  difficultyChip: {
    alignSelf: 'flex-start',
    borderWidth: 0,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + '10',
  },
  infoText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
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
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  ctaText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

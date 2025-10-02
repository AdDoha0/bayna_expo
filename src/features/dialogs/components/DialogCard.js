import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Surface, Card as PaperCard } from 'react-native-paper';
import { Card, Chip } from '../../../shared/components';
import { colors } from '../../../shared/constants';

export function DialogCard({ dialog, onPress }) {
  function getDifficultyColor(difficulty) {
    return colors.difficulty[difficulty] || '#6366F1';
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
            {getDifficultyText(dialog.difficulty)}
          </Chip>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={styles.dialogInfo}>
            <Surface style={styles.infoChip} elevation={1}>
              <Text variant="labelLarge" style={styles.infoText}>
                📚 {dialog.dialogues.length} реплик
              </Text>
            </Surface>
          </View>
          <Surface style={styles.arrowButton} elevation={2}>
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor="#6366F1"
              style={styles.arrowIcon}
            />
          </Surface>
        </View>
      </PaperCard.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
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
    color: '#4338CA',
    marginBottom: 8,
    lineHeight: 32,
  },
  russianTitle: {
    lineHeight: 28,
    fontWeight: '600',
    color: '#1E293B',
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
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  infoText: {
    color: '#6366F1',
    fontWeight: '600',
  },
  arrowButton: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    marginLeft: 12,
  },
  arrowIcon: {
    margin: 0,
  },
});


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card } from '../../../shared/components';

export function AchievementCard({ achievement }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return (
    <Card 
      style={[
        styles.achievementCard,
        achievement.completed && styles.achievementCompleted
      ]} 
      elevation={2}
    >
      <PaperCard.Content style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text variant="titleMedium" style={[
              styles.achievementTitle,
              achievement.completed && styles.achievementTitleCompleted
            ]}>
              {achievement.title}
            </Text>
            <Text variant="bodyMedium" style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>
          {achievement.completed && (
            <IconButton
              icon="check-circle"
              iconColor={theme.colors.success}
              size={24}
            />
          )}
        </View>
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  achievementCard: {
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    marginBottom: 12,
  },
  achievementCompleted: {
    backgroundColor: theme.dark ? 'rgba(16, 185, 129, 0.15)' : '#F0FDF4',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  achievementContent: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  achievementTitleCompleted: {
    color: theme.dark ? theme.colors.success : '#065F46',
  },
  achievementDescription: {
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
  },
});


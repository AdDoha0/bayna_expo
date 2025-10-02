import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Card as PaperCard } from 'react-native-paper';
import { Card } from '../../../shared/components';

export function AchievementCard({ achievement }) {
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
              iconColor="#10B981"
              size={24}
            />
          )}
        </View>
      </PaperCard.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  achievementCard: {
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    marginBottom: 12,
  },
  achievementCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
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
    color: '#64748B',
    marginBottom: 4,
  },
  achievementTitleCompleted: {
    color: '#065F46',
  },
  achievementDescription: {
    color: '#94A3B8',
  },
});


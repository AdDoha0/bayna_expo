import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card as PaperCard, useTheme } from 'react-native-paper';
import { AchievementCard } from '../components';
import { Card } from '../../../shared/components';



export function AchievementsSection({ achievements }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    
    return (
      <Card style={styles.achievementsCard} elevation={3}>
        <PaperCard.Content style={styles.achievementsContent}>
          <Text variant="titleLarge" style={styles.achievementsTitle}>
            {'🏆 Достижения'}
          </Text>
          <View style={styles.achievementsList}>
            {achievements.map((a) => (
              <AchievementCard key={a.id} achievement={a} />
            ))}
          </View>
        </PaperCard.Content>
      </Card>
    );
  }
  
  const createStyles = (theme) => StyleSheet.create({
    achievementsCard: {
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
    achievementsContent: { padding: 20 },
    achievementsTitle: {
      fontWeight: '700',
      color: theme.colors.onSurface,
      marginBottom: 20,
      textAlign: 'center',
    },
    achievementsList: { gap: 12 },
  });
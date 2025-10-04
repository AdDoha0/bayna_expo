import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card } from '../../../shared/components';

export function WeeklyChart({ weeklyProgress }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  function BarItem({ day, minutes }) {
    return (
      <View style={styles.barContainer}>
        <View style={styles.barWrapper}>
          <View
            style={[
              styles.bar,
              {
                height: Math.max((minutes / 40) * 80, 4),
                backgroundColor: minutes > 0 ? theme.colors.primary : theme.colors.surfaceVariant,
              }
            ]}
          />
        </View>
        <Text variant="bodySmall" style={styles.dayLabel}>
          {day}
        </Text>
        <Text variant="bodySmall" style={styles.minutesLabel}>
          {minutes}м
        </Text>
      </View>
    );
  }

  return (
    <Card style={styles.chartCard} elevation={3}>
      <PaperCard.Content style={styles.chartContent}>
        <Text variant="titleLarge" style={styles.chartTitle}>
          📊 Активность за неделю
        </Text>
        <View style={styles.chartContainer}>
          {weeklyProgress.map((dayData, index) => (
            <BarItem 
              key={index}
              day={dayData.day}
              minutes={dayData.minutes}
            />
          ))}
        </View>
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  chartCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginBottom: 20,
  },
  chartContent: {
    padding: 20,
  },
  chartTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  dayLabel: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 2,
  },
  minutesLabel: {
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
    fontSize: 11,
  },
});


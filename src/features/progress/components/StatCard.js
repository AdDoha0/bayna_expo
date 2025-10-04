import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card } from '../../../shared/components';

const { width } = Dimensions.get('window');

export function StatCard({ title, value, subtitle, icon, color }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  return (
    <Card 
      style={[styles.statCard, { borderLeftColor: color }]} 
      elevation={3}
    >
      <PaperCard.Content style={styles.statContent}>
        <View style={styles.statHeader}>
          <Text style={[styles.statIcon, { color }]}>{icon}</Text>
          <Text variant="headlineLarge" style={[styles.statValue, { color }]}>
            {value}
          </Text>
        </View>
        <Text variant="titleMedium" style={styles.statTitle}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={styles.statSubtitle}>
          {subtitle}
        </Text>
      </PaperCard.Content>
    </Card>
  );
}

const createStyles = (theme) => StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 6,
  },
  statContent: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statValue: {
    fontWeight: '800',
  },
  statTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  statSubtitle: {
    color: theme.colors.onSurfaceVariant,
  },
});


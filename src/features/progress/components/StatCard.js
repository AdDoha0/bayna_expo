import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card } from '../../../shared/components';

const { width } = Dimensions.get('window');

export function StatCard({ title, value, subtitle, icon, color }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const accentStyle = { borderColor: color + '33' };
  
  return (
    <Card 
      style={[styles.statCard, accentStyle]} 
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
    backgroundColor: theme.dark ? '#0B172A' : '#FFFFFF',
    borderWidth: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  statContent: {
    padding: 16,
    gap: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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

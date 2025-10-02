import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Divider, Card as PaperCard } from 'react-native-paper';
import { Card } from '../../../shared/components';

export function SettingsSection({ title, children }) {
  // Добавляем разделители между элементами
  const childrenWithDividers = React.Children.toArray(children).reduce((acc, child, index, array) => {
    acc.push(child);
    if (index < array.length - 1) {
      acc.push(<Divider key={`divider-${index}`} style={styles.divider} />);
    }
    return acc;
  }, []);

  return (
    <Card style={styles.settingsCard} elevation={3}>
      <PaperCard.Content style={styles.cardContent}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          {title}
        </Text>
        {childrenWithDividers}
      </PaperCard.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  settingsCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 0,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1E293B',
    padding: 20,
    paddingBottom: 16,
  },
  divider: {
    marginHorizontal: 20,
    backgroundColor: '#F3F4F6',
  },
});


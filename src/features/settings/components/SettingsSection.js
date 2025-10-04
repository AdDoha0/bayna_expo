import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Divider, Card as PaperCard, useTheme } from 'react-native-paper';
import { Card } from '../../../shared/components';

export function SettingsSection({ title, children }) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
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

const createStyles = (theme) => StyleSheet.create({
  settingsCard: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    marginBottom: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 0,
  },
  sectionTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    padding: 20,
    paddingBottom: 16,
  },
  divider: {
    marginHorizontal: 20,
    backgroundColor: theme.colors.surfaceVariant,
  },
});


import React from 'react';
import { StyleSheet } from 'react-native';
import { List, Switch, useTheme } from 'react-native-paper';

export function SettingItem({ 
  title, 
  subtitle, 
  value, 
  onToggle, 
  icon 
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <List.Item
      title={title}
      description={subtitle}
      left={(props) => <List.Icon {...props} icon={icon} color={theme.colors.primary} />}
      right={() => (
        <Switch
          value={value}
          onValueChange={onToggle}
          color={theme.colors.primary}
        />
      )}
      style={styles.settingItem}
      titleStyle={styles.settingTitle}
      descriptionStyle={styles.settingDescription}
    />
  );
}

const createStyles = (theme) => StyleSheet.create({
  settingItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingTitle: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  settingDescription: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
});


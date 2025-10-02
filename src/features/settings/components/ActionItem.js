import React from 'react';
import { StyleSheet } from 'react-native';
import { List, IconButton, useTheme } from 'react-native-paper';

export function ActionItem({ 
  title, 
  subtitle, 
  onPress, 
  icon, 
  iconColor 
}) {
  const theme = useTheme();

  return (
    <List.Item
      title={title}
      description={subtitle}
      left={(props) => <List.Icon {...props} icon={icon} color={iconColor || theme.colors.primary} />}
      right={() => (
        <IconButton
          icon="chevron-right"
          size={20}
          iconColor={theme.colors.outline}
        />
      )}
      onPress={onPress}
      style={styles.settingItem}
      titleStyle={styles.settingTitle}
      descriptionStyle={styles.settingDescription}
    />
  );
}

const styles = StyleSheet.create({
  settingItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingTitle: {
    fontWeight: '600',
    color: '#374151',
  },
  settingDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
});


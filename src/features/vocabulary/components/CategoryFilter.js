import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { Chip } from '../../../shared/components';

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  function renderCategoryChip({ item }) {
    const value = typeof item === 'string' ? item : item.value;
    const label = typeof item === 'string' ? item : (item.label || item.value);
    const isSelected = selectedCategory === value;
    
    return (
      <Chip
        key={value}
        mode={isSelected ? 'flat' : 'outlined'}
        onPress={() => onCategorySelect(value)}
        style={[
          styles.filterChip,
          isSelected && { backgroundColor: theme.colors.primary + '20' }
        ]}
        textColor={isSelected ? theme.colors.primary : theme.colors.onSurface}
      >
        {label}
      </Chip>
    );
  }

  return (
    <Surface style={styles.filtersContainer} elevation={1}>
      <FlatList
        data={categories}
        renderItem={renderCategoryChip}
        keyExtractor={(item) => (typeof item === 'string' ? item : item.value)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      />
    </Surface>
  );
}

const createStyles = (theme) => StyleSheet.create({
  filtersContainer: {
    backgroundColor: theme.dark ? '#0B1220' : '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + '12',
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
});

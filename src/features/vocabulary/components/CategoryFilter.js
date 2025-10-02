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

  function renderCategoryChip({ item: category }) {
    const isSelected = selectedCategory === category;
    
    return (
      <Chip
        key={category}
        mode={isSelected ? 'flat' : 'outlined'}
        onPress={() => onCategorySelect(category)}
        style={[
          styles.filterChip,
          isSelected && { backgroundColor: theme.colors.primary + '20' }
        ]}
        textColor={isSelected ? theme.colors.primary : theme.colors.onSurface}
      >
        {category}
      </Chip>
    );
  }

  return (
    <Surface style={styles.filtersContainer} elevation={1}>
      <FlatList
        data={categories}
        renderItem={renderCategoryChip}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    paddingVertical: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
});


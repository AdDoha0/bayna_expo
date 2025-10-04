import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Searchbar, useTheme } from 'react-native-paper';

export function VocabularySearchBar({ 
  searchQuery, 
  onSearchChange, 
  placeholder = "Поиск слов..." 
}) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Surface style={styles.searchContainer} elevation={2}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onSearchChange}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />
    </Surface>
  );
}

const createStyles = (theme) => StyleSheet.create({
  searchContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
  },
  searchBar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
});


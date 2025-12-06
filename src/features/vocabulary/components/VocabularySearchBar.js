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
        inputStyle={styles.searchInput}
      />
    </Surface>
  );
}

const createStyles = (theme) => StyleSheet.create({
  searchContainer: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: theme.dark ? '#0B172A' : '#FFFFFF',
    elevation: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.primary + '14',
  },
  searchInput: {
    fontWeight: '600',
  }
});

import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  Searchbar,
  Card,
  Chip,
} from 'react-native-paper';
import AnimatedHeader from '../components/AnimatedHeader';

// Словарь с основными арабскими словами
const vocabularyData = [
  { id: 1, arabic: 'كتاب', transcription: 'kitāb', russian: 'книга', category: 'предметы' },
  { id: 2, arabic: 'بيت', transcription: 'bayt', russian: 'дом', category: 'места' },
  { id: 3, arabic: 'معلم', transcription: 'muʿallim', russian: 'учитель', category: 'профессии' },
  { id: 4, arabic: 'طالب', transcription: 'ṭālib', russian: 'студент', category: 'профессии' },
  { id: 5, arabic: 'ماء', transcription: 'māʾ', russian: 'вода', category: 'еда' },
  { id: 6, arabic: 'طعام', transcription: 'ṭaʿām', russian: 'еда', category: 'еда' },
  { id: 7, arabic: 'مدرسة', transcription: 'madrasa', russian: 'школа', category: 'места' },
  { id: 8, arabic: 'سوق', transcription: 'sūq', russian: 'рынок', category: 'места' },
  { id: 9, arabic: 'كبير', transcription: 'kabīr', russian: 'большой', category: 'прилагательные' },
  { id: 10, arabic: 'صغير', transcription: 'ṣaghīr', russian: 'маленький', category: 'прилагательные' },
  { id: 11, arabic: 'جميل', transcription: 'jamīl', russian: 'красивый', category: 'прилагательные' },
  { id: 12, arabic: 'طيب', transcription: 'ṭayyib', russian: 'добрый', category: 'прилагательные' },
  { id: 13, arabic: 'اسم', transcription: 'ism', russian: 'имя', category: 'основные' },
  { id: 14, arabic: 'ريال', transcription: 'riyāl', russian: 'риал', category: 'деньги' },
  { id: 15, arabic: 'أرز', transcription: 'aruzz', russian: 'рис', category: 'еда' },
  { id: 16, arabic: 'لحم', transcription: 'laḥm', russian: 'мясо', category: 'еда' },
  { id: 17, arabic: 'مكتبة', transcription: 'maktaba', russian: 'библиотека', category: 'места' },
  { id: 18, arabic: 'شارع', transcription: 'shāriʿ', russian: 'улица', category: 'места' },
  { id: 19, arabic: 'تاريخ', transcription: 'tārīkh', russian: 'история', category: 'наука' },
  { id: 20, arabic: 'جيد', transcription: 'jayyid', russian: 'хороший', category: 'прилагательные' },
];

const categories = ['все', 'места', 'еда', 'профессии', 'прилагательные', 'основные', 'деньги', 'наука', 'предметы'];

export default function VocabularyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('все');
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'مفردات',
    title: '📚 Словарь',
    subtitle: 'Изучайте арабские слова с транскрипцией',
  });

  const getCategoryColor = (category) => {
    const colors = {
      'места': '#10B981',
      'еда': '#F59E0B',
      'профессии': '#EF4444',
      'прилагательные': '#8B5CF6',
      'основные': '#3B82F6',
      'деньги': '#F97316',
      'наука': '#06B6D4',
      'предметы': '#84CC16',
    };
    return colors[category] || theme.colors.primary;
  };

  const filteredVocabulary = vocabularyData.filter(word => {
    const matchesSearch = word.arabic.includes(searchQuery) || 
                         word.russian.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.transcription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'все' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderWordItem = ({ item }) => (
    <Card style={styles.wordCard} mode="elevated" elevation={4}>
      <Card.Content style={styles.wordContent}>
        <View style={styles.wordHeader}>
          <Text variant="headlineSmall" style={styles.arabicWord}>
            {item.arabic}
          </Text>
          <Chip
            mode="flat"
            textStyle={styles.categoryChipText}
            style={[
              styles.categoryChip,
              { backgroundColor: getCategoryColor(item.category) + '20' }
            ]}
            textColor={getCategoryColor(item.category)}
          >
            {item.category}
          </Chip>
        </View>
        <Text variant="titleMedium" style={styles.transcription}>
          {item.transcription}
        </Text>
        <Text variant="titleLarge" style={styles.russianWord}>
          {item.russian}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderCategoryChip = (category) => (
    <Chip
      key={category}
      mode={selectedCategory === category ? 'flat' : 'outlined'}
      selected={selectedCategory === category}
      onPress={() => setSelectedCategory(category)}
      style={[
        styles.filterChip,
        selectedCategory === category && { backgroundColor: theme.colors.primary + '20' }
      ]}
      textColor={selectedCategory === category ? theme.colors.primary : theme.colors.onSurface}
    >
      {category}
    </Chip>
  );

  return (
    <View style={styles.container}>
      {headerComponent}

      <Animated.View style={[styles.contentContainer, { paddingTop: contentPaddingTop }]}>
        <Surface style={styles.searchContainer} elevation={2}>
          <Searchbar
            placeholder="Поиск слов..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={theme.colors.primary}
          />
        </Surface>

        <Surface style={styles.filtersContainer} elevation={1}>
          <FlatList
            data={categories}
            renderItem={({ item }) => renderCategoryChip(item)}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          />
        </Surface>

        <FlatList
          data={filteredVocabulary}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={Platform.OS !== 'web'}
          style={styles.wordsList}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: Platform.OS === 'web' ? 0 : 70, // Отступ для навигационной панели
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0, // Теперь управляется анимацией
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 2,
  },
  searchBar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
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
  wordsList: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  wordCard: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  wordContent: {
    padding: 20,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  arabicWord: {
    color: '#4338CA',
    fontWeight: '800',
    textAlign: 'right',
    writingDirection: 'rtl',
    flex: 1,
  },
  categoryChip: {
    marginLeft: 12,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transcription: {
    color: '#8B5CF6',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  russianWord: {
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'center',
  },
}); 
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { WordCard, CategoryFilter, VocabularySearchBar } from '../components';
import { LoadingScreen } from '../../../shared/components/feedback/LoadingScreen';
import { getVocabularyByCategory, PARTS_OF_SPEECH_LABELS } from '../../../db';

export function VocabularyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vocabulary, setVocabulary] = useState([]);
  const [categories, setCategories] = useState([{ value: 'all', label: 'Все' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const theme = useTheme();
  const styles = createStyles(theme);

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'مفردات',
    title: '📚 Словарь',
    subtitle: 'Изучайте арабские слова с транскрипцией',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadVocabulary() {
      setLoading(true);
      setError(null);
      try {
        const words = await getVocabularyByCategory();
        if (!isMounted) return;

        setVocabulary(words);

        const uniqueCategories = Array.from(
          new Set(words.map(word => word.part_of_speech).filter(Boolean))
        );

        const categoriesList = [
          { value: 'all', label: 'Все' },
          ...uniqueCategories.map(value => ({
            value,
            label: PARTS_OF_SPEECH_LABELS[value] || value,
          })),
        ];

        setCategories(categoriesList);
      } catch (err) {
        console.warn('loadVocabulary error', err);
        if (isMounted) {
          setError('Не удалось загрузить словарь');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadVocabulary();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVocabulary = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return vocabulary.filter(word => {
      const lowerArabic = (word.arabic || '').toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        lowerArabic.includes(normalizedQuery) ||
        (word.transcription || '').toLowerCase().includes(normalizedQuery) ||
        (word.translation_ru || '').toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === 'all' || word.part_of_speech === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, vocabulary]);

  if (loading) {
    return <LoadingScreen message="Загрузка словаря..." />;
  }

  if (error) {
    return (
      <Screen>
        {headerComponent}
        <Animated.View style={{ paddingHorizontal: 20, paddingTop: contentPaddingTop }}>
          <Text variant="titleLarge" style={{ textAlign: 'center' }}>{error}</Text>
        </Animated.View>
      </Screen>
    );
  }

  return (
    <Screen>
      {headerComponent}

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
      <Animated.View style={[
          styles.content, 
          { paddingTop: contentPaddingTop }
        ]}> 
          <VocabularySearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          <Surface style={styles.summaryCard} elevation={2}>
            <View style={styles.summaryHeader}>
              <Text variant="titleMedium" style={styles.summaryTitle}>Подборка слов</Text>
              <Text variant="bodySmall" style={styles.summarySubtitle}>
                Быстрый обзор результатов поиска
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>Всего слов</Text>
              <Text variant="titleMedium" style={styles.summaryValue}>{vocabulary.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text variant="bodyMedium" style={styles.summaryLabel}>В подборке</Text>
              <Text variant="titleMedium" style={[styles.summaryValue, { color: theme.colors.primary }]}>
                {filteredVocabulary.length}
              </Text>
            </View>
          </Surface>

          {filteredVocabulary.length === 0 ? (
            <Text variant="bodyLarge" style={styles.emptyText}>
              Ничего не найдено
            </Text>
          ) : (
            filteredVocabulary.map((word) => (
              <WordCard key={word.id} word={word} />
            ))
          )}
        </Animated.View>
      </Animated.ScrollView>
    </Screen>
  );
}

const createStyles = (theme) => StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 12,
  },
  summaryCard: {
    marginBottom: 14,
    borderRadius: 18,
    backgroundColor: theme.dark ? '#0B172A' : '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.primary + '10',
    padding: 16,
  },
  summaryHeader: {
    marginBottom: 8,
  },
  summaryTitle: {
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  summarySubtitle: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  summaryLabel: {
    color: theme.colors.onSurfaceVariant,
  },
  summaryValue: {
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
});

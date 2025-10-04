import React, { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { WordCard, CategoryFilter, VocabularySearchBar } from '../components';
import { vocabularyData, categories } from '../data';

export function VocabularyScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('все');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'مفردات',
    title: '📚 Словарь',
    subtitle: 'Изучайте арабские слова с транскрипцией',
  });

  const filteredVocabulary = vocabularyData.filter(word => {
    const matchesSearch = word.arabic.includes(searchQuery) || 
                         word.russian.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.transcription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'все' || word.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          { 
            paddingHorizontal: 20,
            paddingBottom: 20,
          }, 
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

          {filteredVocabulary.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </Animated.View>
      </Animated.ScrollView>
    </Screen>
  );
}


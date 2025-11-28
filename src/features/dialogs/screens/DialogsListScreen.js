import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, ScrollView, Pressable } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { LoadingScreen } from '../../../shared/components/feedback/LoadingScreen';
import { DialogsList } from '../components';
import { getLessonsByTextbook, getTextbooks } from '../../../db';

export function DialogsListScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [textbooks, setTextbooks] = useState([]);
  const [selectedTextbookId, setSelectedTextbookId] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'بين يديك',
    title: '📖 Диалоги для изучения',
    subtitle: 'Изучайте арабский язык через интересные диалоги',
    decorativeElement: (
      <View style={styles.decorativeElement}>
        <View style={styles.decorativeDot} />
        <View style={styles.decorativeLine} />
        <View style={styles.decorativeDot} />
      </View>
    ),
  });

  useEffect(() => {
    let isMounted = true;

    async function loadLessons() {
      setLoading(true);
      setError(null);
      try {
        const textbooks = await getTextbooks();
        if (!isMounted) return;
        setTextbooks(textbooks);

        const defaultTextbookId = textbooks[0]?.id;

        if (!defaultTextbookId) {
          if (isMounted) {
            setError('Учебники не найдены');
            setLessons([]);
          }
          return;
        }

        setSelectedTextbookId(defaultTextbookId);
        await loadLessonsByTextbook(defaultTextbookId, isMounted);
      } catch (err) {
        console.warn('loadLessons error', err);
        if (isMounted) {
          setError('Не удалось загрузить диалоги');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadLessons();

    return () => {
      isMounted = false;
    };
  }, []);

  async function loadLessonsByTextbook(textbookId, isMountedFlag = true) {
    setLoading(true);
    setError(null);
    try {
      const lessonsFromDb = await getLessonsByTextbook(textbookId);
      if (isMountedFlag) {
        setLessons(lessonsFromDb);
        setSelectedTextbookId(textbookId);
      }
    } catch (err) {
      console.warn('loadLessonsByTextbook error', err);
      if (isMountedFlag) {
        setError('Не удалось загрузить диалоги');
      }
    } finally {
      if (isMountedFlag) {
        setLoading(false);
      }
    }
  }

  function handleDialogPress(dialog) {
    navigation.navigate('DialogDetail', { 
      dialogId: dialog.id,
      title: dialog.subtitle 
    });
  }

  function renderTextbookSwitcher() {
    if (!textbooks.length) return null;

    return (
      <Surface style={styles.textbookSwitcher} elevation={1}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.textbookSwitcherContent}
        >
          {textbooks.map((book) => {
            const isActive = book.id === selectedTextbookId;
            return (
              <Pressable
                key={book.id}
                onPress={() => {
                  if (book.id !== selectedTextbookId) {
                    loadLessonsByTextbook(book.id, true);
                  }
                }}
                style={[
                  styles.textbookButton,
                  isActive && { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary },
                ]}
              >
                <Text variant="titleSmall" style={[styles.textbookTitle, isActive && { color: theme.colors.primary }]}>
                  {book.title}
                </Text>
                <Text variant="labelMedium" style={styles.textbookSubtitle}>
                  {book.level || '—'}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Surface>
    );
  }

  if (loading) {
    return <LoadingScreen message="Загрузка диалогов..." />;
  }

  if (error) {
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
          <Animated.View style={{ paddingTop: contentPaddingTop }}>
            <View style={styles.emptyState}>
              <Text variant="titleLarge" style={styles.emptyText}>{error}</Text>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </Screen>
    );
  }

  if (!lessons.length) {
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
          <Animated.View style={{ paddingTop: contentPaddingTop }}>
            <View style={styles.topContentWrapper}>
              {renderTextbookSwitcher()}
            </View>
            <View style={styles.emptyState}>
              <Text variant="titleLarge" style={styles.emptyText}>
                Пока нет уроков в базе
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Добавьте учебники и уроки, чтобы начать учиться.
              </Text>
            </View>
          </Animated.View>
        </Animated.ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      {headerComponent}
      <DialogsList
        data={lessons}
        onDialogPress={handleDialogPress}
        scrollY={scrollY}
        contentPaddingTop={contentPaddingTop}
        renderHeaderContent={renderTextbookSwitcher}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  decorativeElement: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E7FF',
    opacity: 0.8,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E7FF',
    opacity: 0.6,
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.7,
  },
  topContentWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  textbookSwitcher: {
    marginTop: 0,
    marginHorizontal: 0,
    marginBottom: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  textbookSwitcherContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
  textbookButton: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 160,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  textbookTitle: {
    fontWeight: '700',
  },
  textbookSubtitle: {
    opacity: 0.7,
  },
});

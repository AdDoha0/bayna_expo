import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { LoadingScreen } from '../../../shared/components/feedback/LoadingScreen';
import { DialogsList } from '../components';
import { getLessonsByTextbook, getTextbooks } from '../../../db';

export function DialogsListScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const defaultTextbookId = textbooks[0]?.id;

        if (!defaultTextbookId) {
          if (isMounted) {
            setError('Учебники не найдены');
            setLessons([]);
          }
          return;
        }

        const lessonsFromDb = await getLessonsByTextbook(defaultTextbookId);
        if (isMounted) {
          setLessons(lessonsFromDb);
        }
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

  function handleDialogPress(dialog) {
    navigation.navigate('DialogDetail', { 
      dialogId: dialog.id,
      title: dialog.subtitle 
    });
  }

  if (loading) {
    return <LoadingScreen message="Загрузка диалогов..." />;
  }

  if (error) {
    return (
      <Screen>
        {headerComponent}
        <View style={styles.emptyState}>
          <Text variant="titleLarge" style={styles.emptyText}>{error}</Text>
        </View>
      </Screen>
    );
  }

  if (!lessons.length) {
    return (
      <Screen>
        {headerComponent}
        <View style={styles.emptyState}>
          <Text variant="titleLarge" style={styles.emptyText}>
            Пока нет уроков в базе
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Добавьте учебники и уроки, чтобы начать учиться.
          </Text>
        </View>
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
});

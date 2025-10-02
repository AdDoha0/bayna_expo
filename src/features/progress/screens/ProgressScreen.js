import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Card as PaperCard } from 'react-native-paper';
import { Screen, AnimatedHeader, Card } from '../../../shared/components';
import { StatCard, AchievementCard, ProgressChart, WeeklyChart } from '../components';

export function ProgressScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'التقدم',
    title: '📈 Ваш прогресс',
    subtitle: 'Отслеживайте свои достижения в изучении арабского языка',
  });

  const progressData = {
    totalLessons: 6,
    completedLessons: 3,
    totalWords: 120,
    learnedWords: 45,
    studyStreak: 7,
    totalStudyTime: 125, // в минутах
  };

  const achievements = [
    { id: 1, title: 'Первые шаги', description: 'Завершен первый урок', icon: '🎯', completed: true },
    { id: 2, title: 'Знаток слов', description: 'Изучено 50 слов', icon: '📚', completed: false },
    { id: 3, title: 'Постоянство', description: '7 дней подряд', icon: '🔥', completed: true },
    { id: 4, title: 'Мастер диалогов', description: 'Завершено 5 диалогов', icon: '💬', completed: false },
  ];

  const weeklyProgress = [
    { day: 'Пн', minutes: 25 },
    { day: 'Вт', minutes: 30 },
    { day: 'Ср', minutes: 15 },
    { day: 'Чт', minutes: 20 },
    { day: 'Пт', minutes: 35 },
    { day: 'Сб', minutes: 0 },
    { day: 'Вс', minutes: 0 },
  ];

  const progressPercentage = (progressData.completedLessons / progressData.totalLessons) * 100;

  return (
    <Screen>
      {headerComponent}

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <Animated.View style={{ paddingTop: contentPaddingTop }}>
        {/* Основная статистика */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Завершено уроков"
            value={`${progressData.completedLessons}/${progressData.totalLessons}`}
            subtitle={`${Math.round(progressPercentage)}% завершено`}
            icon="📖"
            color="#6366F1"
          />
          <StatCard
            title="Изучено слов"
            value={`${progressData.learnedWords}`}
            subtitle={`из ${progressData.totalWords} слов`}
            icon="📚"
            color="#10B981"
          />
          <StatCard
            title="Дней подряд"
            value={`${progressData.studyStreak}`}
            subtitle="дней изучения"
            icon="🔥"
            color="#F59E0B"
          />
          <StatCard
            title="Время обучения"
            value={`${Math.floor(progressData.totalStudyTime / 60)}ч ${progressData.totalStudyTime % 60}м`}
            subtitle="общее время"
            icon="⏱️"
            color="#8B5CF6"
          />
        </View>

        {/* Прогресс-бары */}
        <ProgressChart progressData={progressData} />

        {/* График активности */}
        <WeeklyChart weeklyProgress={weeklyProgress} />

        {/* Достижения */}
        <Card style={styles.achievementsCard} elevation={3}>
          <PaperCard.Content style={styles.achievementsContent}>
            <Text variant="titleLarge" style={styles.achievementsTitle}>
              🏆 Достижения
            </Text>
            <View style={styles.achievementsList}>
              {achievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </View>
          </PaperCard.Content>
        </Card>
        </Animated.View>
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0, // Теперь управляется анимацией
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  achievementsCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  achievementsContent: {
    padding: 20,
  },
  achievementsTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  achievementsList: {
    gap: 12,
  },
});


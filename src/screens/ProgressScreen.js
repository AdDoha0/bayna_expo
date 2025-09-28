import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  Card,
  ProgressBar,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedHeader from '../components/AnimatedHeader';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const theme = useTheme();
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
  const wordsPercentage = (progressData.learnedWords / progressData.totalWords) * 100;

  const renderStatCard = (title, value, subtitle, icon, color) => (
    <Card style={[styles.statCard, { borderLeftColor: color }]} mode="elevated" elevation={3}>
      <Card.Content style={styles.statContent}>
        <View style={styles.statHeader}>
          <Text style={[styles.statIcon, { color }]}>{icon}</Text>
          <Text variant="headlineLarge" style={[styles.statValue, { color }]}>
            {value}
          </Text>
        </View>
        <Text variant="titleMedium" style={styles.statTitle}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={styles.statSubtitle}>
          {subtitle}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderAchievement = (achievement) => (
    <Card 
      key={achievement.id} 
      style={[
        styles.achievementCard,
        achievement.completed && styles.achievementCompleted
      ]} 
      mode="elevated" 
      elevation={2}
    >
      <Card.Content style={styles.achievementContent}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text variant="titleMedium" style={[
              styles.achievementTitle,
              achievement.completed && styles.achievementTitleCompleted
            ]}>
              {achievement.title}
            </Text>
            <Text variant="bodyMedium" style={styles.achievementDescription}>
              {achievement.description}
            </Text>
          </View>
          {achievement.completed && (
            <IconButton
              icon="check-circle"
              iconColor="#10B981"
              size={24}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderWeeklyChart = () => (
    <Card style={styles.chartCard} mode="elevated" elevation={3}>
      <Card.Content style={styles.chartContent}>
        <Text variant="titleLarge" style={styles.chartTitle}>
          📊 Активность за неделю
        </Text>
        <View style={styles.chartContainer}>
          {weeklyProgress.map((day, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max((day.minutes / 40) * 80, 4),
                      backgroundColor: day.minutes > 0 ? '#6366F1' : '#E5E7EB',
                    }
                  ]}
                />
              </View>
              <Text variant="bodySmall" style={styles.dayLabel}>
                {day.day}
              </Text>
              <Text variant="bodySmall" style={styles.minutesLabel}>
                {day.minutes}м
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {headerComponent}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingTop: contentPaddingTop }]}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
      >
        {/* Основная статистика */}
        <View style={styles.statsGrid}>
          {renderStatCard(
            'Завершено уроков',
            `${progressData.completedLessons}/${progressData.totalLessons}`,
            `${Math.round(progressPercentage)}% завершено`,
            '📖',
            '#6366F1'
          )}
          {renderStatCard(
            'Изучено слов',
            `${progressData.learnedWords}`,
            `из ${progressData.totalWords} слов`,
            '📚',
            '#10B981'
          )}
          {renderStatCard(
            'Дней подряд',
            `${progressData.studyStreak}`,
            'дней изучения',
            '🔥',
            '#F59E0B'
          )}
          {renderStatCard(
            'Время обучения',
            `${Math.floor(progressData.totalStudyTime / 60)}ч ${progressData.totalStudyTime % 60}м`,
            'общее время',
            '⏱️',
            '#8B5CF6'
          )}
        </View>

        {/* Прогресс-бары */}
        <Card style={styles.progressCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.progressContent}>
            <Text variant="titleLarge" style={styles.progressTitle}>
              🎯 Общий прогресс
            </Text>
            
            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text variant="titleMedium">Уроки</Text>
                <Text variant="bodyMedium" style={styles.progressValue}>
                  {progressData.completedLessons}/{progressData.totalLessons}
                </Text>
              </View>
              <ProgressBar
                progress={progressPercentage / 100}
                color="#6366F1"
                style={styles.progressBar}
              />
            </View>

            <View style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text variant="titleMedium">Словарь</Text>
                <Text variant="bodyMedium" style={styles.progressValue}>
                  {progressData.learnedWords}/{progressData.totalWords}
                </Text>
              </View>
              <ProgressBar
                progress={wordsPercentage / 100}
                color="#10B981"
                style={styles.progressBar}
              />
            </View>
          </Card.Content>
        </Card>

        {/* График активности */}
        {renderWeeklyChart()}

        {/* Достижения */}
        <Card style={styles.achievementsCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.achievementsContent}>
            <Text variant="titleLarge" style={styles.achievementsTitle}>
              🏆 Достижения
            </Text>
            <View style={styles.achievementsList}>
              {achievements.map(renderAchievement)}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: Platform.OS === 'web' ? 0 : 70, // Отступ для навигационной панели
  },
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
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 6,
  },
  statContent: {
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  statValue: {
    fontWeight: '800',
  },
  statTitle: {
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  statSubtitle: {
    color: '#64748B',
  },
  progressCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  progressContent: {
    padding: 20,
  },
  progressTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressValue: {
    fontWeight: '600',
    color: '#6366F1',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  chartCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  chartContent: {
    padding: 20,
  },
  chartTitle: {
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    paddingHorizontal: 10,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  dayLabel: {
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
  },
  minutesLabel: {
    color: '#94A3B8',
    fontSize: 11,
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
  achievementCard: {
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
  },
  achievementCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  achievementContent: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  achievementTitleCompleted: {
    color: '#065F46',
  },
  achievementDescription: {
    color: '#94A3B8',
  },
}); 
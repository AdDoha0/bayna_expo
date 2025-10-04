import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StatCard } from '../components';

export function StatsSection({ progressData }) {
    const theme = useTheme();
    const progressPercentage = useMemo(
      () => Math.round((progressData.completedLessons / progressData.totalLessons) * 100),
      [progressData]
    );
  
    return (
      <View style={styles.statsGrid}>
        <StatCard
          title="Завершено уроков"
          value={`${progressData.completedLessons}/${progressData.totalLessons}`}
          subtitle={`${progressPercentage}% завершено`}
          icon="📖"
          color={theme.colors.primary}
        />
        <StatCard
          title="Изучено слов"
          value={`${progressData.learnedWords}`}
          subtitle={`из ${progressData.totalWords} слов`}
          icon="📚"
          color={theme.colors.success}
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
          color={theme.colors.secondary}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 20,
    },
  });
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatCard } from '../components';

export function StatsSection({ progressData }) {
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
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressChart , WeeklyChart} from '../components';


export function ProgressBarSection({ progressData, weeklyProgress }) {
    return (
      <View style={styles.container}>
        <ProgressChart progressData={progressData} />
        <WeeklyChart weeklyProgress={weeklyProgress} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { gap: 16, marginBottom: 20 },
  });
import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { DialogsList } from '../components';
import { dialogsData } from '../data';

export function DialogsListScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;

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

  function handleDialogPress(dialog) {
    navigation.navigate('DialogDetail', { 
      dialogId: dialog.id,
      title: dialog.subtitle 
    });
  }

  return (
    <Screen>
      {headerComponent}
      <DialogsList
        data={dialogsData}
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
});


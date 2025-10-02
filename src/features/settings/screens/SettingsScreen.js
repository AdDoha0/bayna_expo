import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { SettingItem, ActionItem, SettingsSection } from '../components';

export function SettingsScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    autoTranscription: false,
    dailyReminder: true,
    darkTheme: false,
    arabicFont: 'standard',
  });

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'الإعدادات',
    title: '⚙️ Настройки',
    subtitle: 'Персонализируйте ваше обучение арабскому языку',
  });

  function toggleSetting(key) {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }

  function showInfo(title, message) {
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  function resetProgress() {
    Alert.alert(
      'Сброс прогресса',
      'Вы уверены, что хотите сбросить весь прогресс обучения? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', style: 'destructive', onPress: () => {
          // Здесь будет логика сброса прогресса
          Alert.alert('Прогресс сброшен', 'Ваш прогресс был успешно сброшен.');
        }}
      ]
    );
  }

  function exportData() {
    Alert.alert(
      'Экспорт данных',
      'Ваши данные будут экспортированы в файл для резервного копирования.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Экспортировать', onPress: () => {
          // Здесь будет логика экспорта данных
          Alert.alert('Успешно', 'Данные экспортированы в файл exports/backup.json');
        }}
      ]
    );
  }

  return (
    <Screen>
      {headerComponent}

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={{ paddingTop: contentPaddingTop }}>
        {/* Основные настройки */}
        <SettingsSection title="🔔 Уведомления и звуки">
          <SettingItem
            title="Push-уведомления"
            subtitle="Получать напоминания об изучении"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
            icon="bell"
          />
          
          <SettingItem
            title="Звуковые эффекты"
            subtitle="Воспроизводить звуки в приложении"
            value={settings.soundEffects}
            onToggle={() => toggleSetting('soundEffects')}
            icon="volume-high"
          />
          
          <SettingItem
            title="Ежедневные напоминания"
            subtitle="Напоминать о занятиях каждый день"
            value={settings.dailyReminder}
            onToggle={() => toggleSetting('dailyReminder')}
            icon="calendar-clock"
          />
        </SettingsSection>

        {/* Настройки обучения */}
        <SettingsSection title="📚 Обучение">
          <SettingItem
            title="Автопоказ транскрипции"
            subtitle="Показывать транскрипцию автоматически"
            value={settings.autoTranscription}
            onToggle={() => toggleSetting('autoTranscription')}
            icon="text"
          />
          
          <ActionItem
            title="Размер арабского шрифта"
            subtitle="Настроить размер текста на арабском"
            onPress={() => showInfo('Размер шрифта', 'Функция будет доступна в следующем обновлении')}
            icon="format-size"
          />
          
          <ActionItem
            title="Скорость воспроизведения"
            subtitle="Настроить скорость аудио"
            onPress={() => showInfo('Скорость аудио', 'Функция будет доступна в следующем обновлении')}
            icon="speedometer"
          />
        </SettingsSection>

        {/* Внешний вид */}
        <SettingsSection title="🎨 Внешний вид">
          <SettingItem
            title="Тёмная тема"
            subtitle="Использовать тёмное оформление"
            value={settings.darkTheme}
            onToggle={() => toggleSetting('darkTheme')}
            icon="weather-night"
          />
          
          <ActionItem
            title="Язык интерфейса"
            subtitle="Русский"
            onPress={() => showInfo('Язык', 'Сейчас доступен только русский язык')}
            icon="translate"
          />
        </SettingsSection>

        {/* Данные и хранение */}
        <SettingsSection title="💾 Данные">
          <ActionItem
            title="Экспорт прогресса"
            subtitle="Сохранить данные в файл"
            onPress={exportData}
            icon="download"
          />
          
          <ActionItem
            title="Сброс прогресса"
            subtitle="Удалить все данные обучения"
            onPress={resetProgress}
            icon="delete-forever"
            iconColor="#EF4444"
          />
        </SettingsSection>

        {/* О приложении */}
        <SettingsSection title="ℹ️ О приложении">
          <ActionItem
            title="Версия приложения"
            subtitle="1.0.0"
            onPress={() => showInfo('Версия', 'Байна Ядайк v1.0.0\nПриложение для изучения арабского языка')}
            icon="information"
          />
          
          <ActionItem
            title="Обратная связь"
            subtitle="Сообщить об ошибке или предложить улучшение"
            onPress={() => showInfo('Обратная связь', 'Отправьте ваши предложения на support@bayna-yadayk.com')}
            icon="message-text"
          />
          
          <ActionItem
            title="Оценить приложение"
            subtitle="Поставить оценку в магазине приложений"
            onPress={() => showInfo('Оценка', 'Спасибо за использование приложения! Ваша оценка очень важна для нас.')}
            icon="star"
          />
        </SettingsSection>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={styles.footerText}>
            بين يديك - Байна Ядайк
          </Text>
          <Text variant="bodySmall" style={styles.footerSubtext}>
            Изучение арабского языка стало проще
          </Text>
        </View>
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
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 20,
  },
  footerText: {
    fontWeight: '700',
    color: '#4338CA',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubtext: {
    color: '#6B7280',
    textAlign: 'center',
  },
});


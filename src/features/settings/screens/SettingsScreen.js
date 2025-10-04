import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { Screen, AnimatedHeader } from '../../../shared/components';
import { SettingItem, ActionItem, SettingsSection } from '../components';
import { useSettings } from '../model/SettingsContext';

export function SettingsScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Используем глобальный стейт настроек из Context
  const { settings, toggle, appVersion, actions } = useSettings();

  // Используем AnimatedHeader компонент
  const { headerComponent, contentPaddingTop } = AnimatedHeader({
    scrollY,
    arabicTitle: 'الإعدادات',
    title: '⚙️ Настройки',
    subtitle: 'Персонализируйте ваше обучение арабскому языку',
  });

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
            onToggle={() => toggle('notifications')}
            icon="bell"
          />
          
          <SettingItem
            title="Звуковые эффекты"
            subtitle="Воспроизводить звуки в приложении"
            value={settings.soundEffects}
            onToggle={() => toggle('soundEffects')}
            icon="volume-high"
          />
          
          <SettingItem
            title="Ежедневные напоминания"
            subtitle="Напоминать о занятиях каждый день"
            value={settings.dailyReminder}
            onToggle={() => toggle('dailyReminder')}
            icon="calendar-clock"
          />
        </SettingsSection>

        {/* Настройки обучения */}
        <SettingsSection title="📚 Обучение">
          <SettingItem
            title="Автопоказ транскрипции"
            subtitle="Показывать транскрипцию автоматически"
            value={settings.autoTranscription}
            onToggle={() => toggle('autoTranscription')}
            icon="text"
          />
          
          <ActionItem
            title="Размер арабского шрифта"
            subtitle="Настроить размер текста на арабском"
            onPress={() => {}}
            icon="format-size"
          />
          
          <ActionItem
            title="Скорость воспроизведения"
            subtitle="Настроить скорость аудио"
            onPress={() => {}}
            icon="speedometer"
          />
        </SettingsSection>

        {/* Внешний вид */}
        <SettingsSection title="🎨 Внешний вид">
          <SettingItem
            title="Тёмная тема"
            subtitle="Использовать тёмное оформление"
            value={settings.darkTheme}
            onToggle={() => toggle('darkTheme')}
            icon="weather-night"
          />
          
          <ActionItem
            title="Язык интерфейса"
            subtitle="Русский"
            onPress={() => {}}
            icon="translate"
          />
        </SettingsSection>


        {/* О приложении */}
        <SettingsSection title="ℹ️ О приложении">
          <ActionItem
            title="Версия приложения"
            subtitle={appVersion}
            onPress={() => {}}
            icon="information"
          />
          
          <ActionItem
            title="Обратная связь"
            subtitle="Сообщить об ошибке или предложить улучшение"
            onPress={actions.openFeedback}
            icon="message-text"
          />
          
          <ActionItem
            title="Оценить приложение"
            subtitle="Поставить оценку в магазине приложений"
            onPress={actions.rateApp}
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


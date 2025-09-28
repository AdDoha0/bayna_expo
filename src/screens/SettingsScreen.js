import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  Card,
  Switch,
  Button,
  Divider,
  IconButton,
  List,
} from 'react-native-paper';
import AnimatedHeader from '../components/AnimatedHeader';

export default function SettingsScreen() {
  const theme = useTheme();
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

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const showInfo = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const resetProgress = () => {
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
  };

  const exportData = () => {
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
  };

  const renderSettingItem = (title, subtitle, value, onToggle, icon) => (
    <List.Item
      title={title}
      description={subtitle}
      left={(props) => <List.Icon {...props} icon={icon} color={theme.colors.primary} />}
      right={() => (
        <Switch
          value={value}
          onValueChange={onToggle}
          color={theme.colors.primary}
        />
      )}
      style={styles.settingItem}
      titleStyle={styles.settingTitle}
      descriptionStyle={styles.settingDescription}
    />
  );

  const renderActionItem = (title, subtitle, onPress, icon, iconColor) => (
    <List.Item
      title={title}
      description={subtitle}
      left={(props) => <List.Icon {...props} icon={icon} color={iconColor || theme.colors.primary} />}
      right={() => (
        <IconButton
          icon="chevron-right"
          size={20}
          iconColor={theme.colors.outline}
        />
      )}
      onPress={onPress}
      style={styles.settingItem}
      titleStyle={styles.settingTitle}
      descriptionStyle={styles.settingDescription}
    />
  );

  return (
    <View style={styles.container}>
      {headerComponent}

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingTop: contentPaddingTop }]}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        {/* Основные настройки */}
        <Card style={styles.settingsCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🔔 Уведомления и звуки
            </Text>
            
            {renderSettingItem(
              'Push-уведомления',
              'Получать напоминания об изучении',
              settings.notifications,
              () => toggleSetting('notifications'),
              'bell'
            )}
            
            <Divider style={styles.divider} />
            
            {renderSettingItem(
              'Звуковые эффекты',
              'Воспроизводить звуки в приложении',
              settings.soundEffects,
              () => toggleSetting('soundEffects'),
              'volume-high'
            )}
            
            <Divider style={styles.divider} />
            
            {renderSettingItem(
              'Ежедневные напоминания',
              'Напоминать о занятиях каждый день',
              settings.dailyReminder,
              () => toggleSetting('dailyReminder'),
              'calendar-clock'
            )}
          </Card.Content>
        </Card>

        {/* Настройки обучения */}
        <Card style={styles.settingsCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              📚 Обучение
            </Text>
            
            {renderSettingItem(
              'Автопоказ транскрипции',
              'Показывать транскрипцию автоматически',
              settings.autoTranscription,
              () => toggleSetting('autoTranscription'),
              'text'
            )}
            
            <Divider style={styles.divider} />
            
            {renderActionItem(
              'Размер арабского шрифта',
              'Настроить размер текста на арабском',
              () => showInfo('Размер шрифта', 'Функция будет доступна в следующем обновлении'),
              'format-size',
            )}
            
            <Divider style={styles.divider} />
            
            {renderActionItem(
              'Скорость воспроизведения',
              'Настроить скорость аудио',
              () => showInfo('Скорость аудио', 'Функция будет доступна в следующем обновлении'),
              'speedometer',
            )}
          </Card.Content>
        </Card>

        {/* Внешний вид */}
        <Card style={styles.settingsCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              🎨 Внешний вид
            </Text>
            
            {renderSettingItem(
              'Тёмная тема',
              'Использовать тёмное оформление',
              settings.darkTheme,
              () => toggleSetting('darkTheme'),
              'weather-night'
            )}
            
            <Divider style={styles.divider} />
            
            {renderActionItem(
              'Язык интерфейса',
              'Русский',
              () => showInfo('Язык', 'Сейчас доступен только русский язык'),
              'translate',
            )}
          </Card.Content>
        </Card>

        {/* Данные и хранение */}
        <Card style={styles.settingsCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              💾 Данные
            </Text>
            
            {renderActionItem(
              'Экспорт прогресса',
              'Сохранить данные в файл',
              exportData,
              'download',
            )}
            
            <Divider style={styles.divider} />
            
            {renderActionItem(
              'Сброс прогресса',
              'Удалить все данные обучения',
              resetProgress,
              'delete-forever',
              '#EF4444'
            )}
          </Card.Content>
        </Card>

        {/* О приложении */}
        <Card style={styles.settingsCard} mode="elevated" elevation={3}>
          <Card.Content style={styles.cardContent}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              ℹ️ О приложении
            </Text>
            
            {renderActionItem(
              'Версия приложения',
              '1.0.0',
              () => showInfo('Версия', 'Байна Ядайк v1.0.0\nПриложение для изучения арабского языка'),
              'information',
            )}
            
            <Divider style={styles.divider} />
            
            {renderActionItem(
              'Обратная связь',
              'Сообщить об ошибке или предложить улучшение',
              () => showInfo('Обратная связь', 'Отправьте ваши предложения на support@bayna-yadayk.com'),
              'message-text',
            )}
            
            <Divider style={styles.divider} />
            
            {renderActionItem(
              'Оценить приложение',
              'Поставить оценку в магазине приложений',
              () => showInfo('Оценка', 'Спасибо за использование приложения! Ваша оценка очень важна для нас.'),
              'star',
            )}
          </Card.Content>
        </Card>

        <View style={styles.footer}>
          <Text variant="bodyMedium" style={styles.footerText}>
            بين يديك - Байна Ядайк
          </Text>
          <Text variant="bodySmall" style={styles.footerSubtext}>
            Изучение арабского языка стало проще
          </Text>
        </View>
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
  settingsCard: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 0,
  },
  sectionTitle: {
    fontWeight: '700',
    color: '#1E293B',
    padding: 20,
    paddingBottom: 16,
  },
  settingItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingTitle: {
    fontWeight: '600',
    color: '#374151',
  },
  settingDescription: {
    color: '#6B7280',
    fontSize: 14,
  },
  divider: {
    marginHorizontal: 20,
    backgroundColor: '#F3F4F6',
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
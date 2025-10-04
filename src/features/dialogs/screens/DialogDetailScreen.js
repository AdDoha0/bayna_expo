import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import {
  Text,
  Surface,
  useTheme,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '../../../shared/components';
import { ArabicTextCard } from '../components';
import { dialogsData } from '../data';

export function DialogDetailScreen({ route }) {
  const { dialogId } = route.params;
  const dialog = dialogsData.find(d => d.id === dialogId);
  const [showTranscription, setShowTranscription] = useState(false);
  const theme = useTheme();
  const styles = createStyles(theme);

  // Динамические цвета градиента в зависимости от темы
  const headerGradientColors = theme.dark
    ? [theme.colors.primary, theme.colors.secondary, theme.colors.tertiary]
    : ['#4338CA', '#6366F1', '#8B5CF6'];
    
  const footerGradientColors = theme.dark
    ? [theme.colors.surfaceVariant, theme.colors.surface]
    : ['#EEF2FF', '#F8FAFC'];

  if (!dialog) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={{ color: theme.colors.error }}>
            Диалог не найден
          </Text>
        </View>
      </Screen>
    );
  }

  function renderDialogueItem(item, index) {
    return (
      <ArabicTextCard
        key={`${item.id}-${index}`}
        arabic={item.arabic}
        transcription={item.transcription}
        russian={item.russian}
        speaker={item.speaker}
        showTranscription={showTranscription}
        style={{ 
          marginHorizontal: 4,
        }}
      />
    );
  }

  return (
    <Screen>
      <LinearGradient
        colors={headerGradientColors}
        style={styles.headerGradient}
      >
        <Surface style={styles.headerSurface} elevation={0}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            {dialog.subtitle}
          </Text>
          <Text variant="titleSmall" style={styles.headerSubtitle}>
            {dialog.dialogues.length} реплик в диалоге
          </Text>
          
          <Surface style={styles.controlsContainer} elevation={3}>
            <Button
              mode="contained"
              icon={showTranscription ? "eye-off" : "eye"}
              onPress={() => setShowTranscription(!showTranscription)}
              style={styles.transcriptionButton}
              buttonColor={theme.dark ? theme.colors.surface : "rgba(255,255,255,0.9)"}
              textColor={theme.colors.primary}
              compact={false}
            >
              {showTranscription ? 'Скрыть' : 'Показать'} транскрипцию
            </Button>
          </Surface>
        </Surface>
      </LinearGradient>

      <ScrollView
        style={[styles.scrollContainer, Platform.OS === 'web' && styles.webScrollContainer]}
        contentContainerStyle={[styles.scrollContent, Platform.OS === 'web' && styles.webScrollContent]}
        showsVerticalScrollIndicator={Platform.OS !== 'web'}
        bounces={Platform.OS !== 'web'}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
        {...(Platform.OS === 'web' && {
          overScrollMode: 'auto',
          scrollEnabled: true,
          alwaysBounceVertical: false,
        })}
      >
        <View style={[styles.dialogsContainer, Platform.OS === 'web' && styles.webDialogsContainer]}>
          {dialog.dialogues.map((item, index) => renderDialogueItem(item, index))}
        </View>
        
        <Surface style={styles.footer} elevation={0}>
          <LinearGradient
            colors={footerGradientColors}
            style={styles.footerGradient}
          >
            <View style={styles.footerContent}>
              <Text variant="titleMedium" style={styles.footerText}>
                🎉 Диалог завершён!
              </Text>
              <Text variant="bodyMedium" style={styles.footerSubtext}>
                Вы изучили {dialog.dialogues.length} реплик
              </Text>
              <Surface style={styles.successBadge} elevation={2}>
                <Text variant="labelLarge" style={styles.successText}>
                  ✅ Отлично!
                </Text>
              </Surface>
            </View>
          </LinearGradient>
        </Surface>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (theme) => StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    paddingBottom: 28,
    paddingTop: Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0),
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...(Platform.OS === 'web' && {
      position: 'relative',
      zIndex: 1,
    }),
  },
  headerSurface: {
    backgroundColor: 'transparent',
    padding: 24,
    paddingTop: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    color: '#E0E7FF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 20,
  },
  controlsContainer: {
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 4,
    alignSelf: 'center',
  },
  transcriptionButton: {
    borderRadius: 16,
    minWidth: 200,
  },
  scrollContainer: {
    flex: 1,
  },
  webScrollContainer: {
    height: '100%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 40,
  },
  webScrollContent: {
    minHeight: '100%',
    paddingBottom: 80,
  },
  dialogsContainer: {
    paddingHorizontal: 20,
  },
  webDialogsContainer: {
    minHeight: 'auto',
  },
  footer: {
    marginTop: 32,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  footerGradient: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerText: {
    fontWeight: '700',
    marginBottom: 8,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  footerSubtext: {
    opacity: 0.8,
    marginBottom: 16,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  successBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});


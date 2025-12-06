import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';

export function ArabicTextCard({ 
  arabic, 
  transcription, 
  russian, 
  speaker, 
  showTranscription = false,
  style 
}) {
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const speakerName = speaker === 'А' ? 'هشام' : 'بلال';
  const speakerNameRussian = speaker === 'А' ? 'Хишам' : 'Биляль';
  const isFirstSpeaker = speaker === 'А';
  const toneColor = isFirstSpeaker ? theme.colors.primary : theme.colors.secondary;

  return (
    <Surface style={[styles.container, style]} elevation={3}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Surface style={[styles.speakerBadge, { borderColor: toneColor, backgroundColor: toneColor + '20' }]} elevation={0}>
            <Text variant="titleMedium" style={[styles.speakerNameArabic, { color: toneColor }]}>
              {speakerName}
            </Text>
          </Surface>
          <Text variant="bodyLarge" style={[styles.speakerNameRussian, { color: toneColor }]}>
            {speakerNameRussian}
          </Text>
        </View>
        
        <View style={styles.arabicContainer}>
          <Text 
            variant="headlineLarge" 
            style={[
              styles.arabicText,
              Platform.OS === 'web' && styles.webArabicText
            ]}
          >
            {arabic}
          </Text>
        </View>
        
        <Text variant="titleLarge" style={styles.russianText}>
          {russian}
        </Text>
        
        {showTranscription && (
          <View style={[styles.transcriptionContainer, { borderLeftColor: toneColor, backgroundColor: toneColor + '12' }]}>
            <Text variant="bodyMedium" style={[styles.transcriptionText, { color: toneColor }]}>
              {transcription}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.dark ? '#0F172A' : '#FFFFFF',
    borderRadius: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
    }),
  },
  content: {
    padding: 22,
    gap: 12,
  },
  arabicContainer: {
    backgroundColor: theme.dark ? '#0B1220' : theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 20,
    ...(Platform.OS === 'web' && {
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    }),
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '400',
    lineHeight: 40,
    fontSize: 24,
    color: theme.colors.onSurface,
    fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : 'System',
  },
  webArabicText: {
    direction: 'rtl',
    unicodeBidi: 'bidi-override',
    wordBreak: 'keep-all',
    overflowWrap: 'normal',
  },
  russianText: {
    textAlign: 'left',
    color: theme.colors.onSurface,
    fontWeight: '400',
    lineHeight: 28,
    fontSize: 18,
  },
  transcriptionContainer: {
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderLeftWidth: 4,
  },
  transcriptionText: {
    textAlign: 'left',
    fontStyle: 'italic',
    lineHeight: 20,
    fontSize: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  speakerBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  speakerNameArabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '700',
    fontSize: 16,
    ...(Platform.OS === 'web' && {
      direction: 'rtl',
      unicodeBidi: 'bidi-override',
    }),
  },
  speakerNameRussian: {
    fontWeight: '700',
  },
}); 

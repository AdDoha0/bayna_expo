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
  
  const speakerName = speaker === 'А' ? 'هشام' : 'بلال';
  const speakerNameRussian = speaker === 'А' ? 'Хишам' : 'Биляль';
  const isFirstSpeaker = speaker === 'А';

  return (
    <Surface style={[styles.container, style]} elevation={2}>
      <View style={styles.content}>
        {/* Заголовок с именем говорящего */}
        <View style={styles.speakerHeader}>
          <Text variant="titleMedium" style={styles.speakerNameArabic}>
            {speakerName}:
          </Text>
        </View>
        
        {/* Арабский текст */}
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
        
        {/* Имя говорящего на русском */}
        <View style={styles.russianNameContainer}>
          <Text variant="bodyMedium" style={styles.speakerNameRussian}>
            {speakerNameRussian}:
          </Text>
        </View>
        
        {/* Русский перевод */}
        <View style={styles.russianContainer}>
          <Text variant="titleLarge" style={styles.russianText}>
            {russian}
          </Text>
        </View>
        
        {/* Транскрипция (если включена) */}
        {showTranscription && (
          <View style={styles.transcriptionContainer}>
            <Text variant="bodyMedium" style={styles.transcriptionText}>
              {transcription}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }),
  },
  content: {
    padding: 20,
  },
  speakerHeader: {
    marginBottom: 12,
  },
  speakerNameArabic: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    ...(Platform.OS === 'web' && {
      direction: 'rtl',
      unicodeBidi: 'bidi-override',
    }),
  },
  arabicContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    }),
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '400',
    lineHeight: 40,
    fontSize: 24,
    color: '#000',
    fontFamily: Platform.OS === 'web' ? 'Arial, sans-serif' : 'System',
  },
  webArabicText: {
    direction: 'rtl',
    unicodeBidi: 'bidi-override',
    wordBreak: 'keep-all',
    overflowWrap: 'normal',
  },
  russianNameContainer: {
    marginBottom: 8,
  },
  speakerNameRussian: {
    fontWeight: '600',
    fontSize: 14,
    color: '#666',
  },
  russianContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    }),
  },
  russianText: {
    textAlign: 'left',
    color: '#000',
    fontWeight: '400',
    lineHeight: 28,
    fontSize: 18,
  },
  transcriptionContainer: {
    backgroundColor: '#FFFBF0',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  transcriptionText: {
    textAlign: 'left',
    fontStyle: 'italic',
    color: '#92400E',
    lineHeight: 20,
    fontSize: 14,
  },
}); 
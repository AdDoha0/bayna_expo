import { useEffect, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import * as MailComposer from 'expo-mail-composer';
import * as StoreReview from 'expo-store-review';
import { Linking, Platform } from 'react-native';

const STORAGE_KEY = 'app.settings.v1';

const DEFAULTS = {
  notifications: true,
  soundEffects: true,
  autoTranscription: false,
  dailyReminder: true,
  darkTheme: false,
  arabicFont: 'standard',
};

/**
 * Custom hook managing application settings state with persistence
 * @returns {Object} Settings state and actions
 */
export function useSettingsState() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [isReady, setReady] = useState(false);
  const appVersion = Application.nativeApplicationVersion || '1.0.0';

  // Hydrate settings from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored = JSON.parse(raw);
          setSettings(prev => ({ ...prev, ...stored }));
        }
      } catch (error) {
        console.warn('Failed to load settings:', error);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Persist settings to AsyncStorage whenever they change
  useEffect(() => {
    if (!isReady) return;
    
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.warn('Failed to save settings:', error);
      }
    })();
  }, [settings, isReady]);

  // Toggle helper for boolean settings
  const toggle = useCallback((key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Side effect: Handle notification permissions
  useEffect(() => {
    if (!isReady) return;

    (async () => {
      if (settings.notifications) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') {
          await Notifications.requestPermissionsAsync();
        }
      } else {
        // Future: Cancel scheduled notifications when disabled
        // await Notifications.cancelAllScheduledNotificationsAsync();
      }
    })();
  }, [settings.notifications, isReady]);

  // Action: Open feedback email composer
  const openFeedback = useCallback(async () => {
    const subject = 'Обратная связь - Байна Ядайк';
    const body = 'Опишите вашу идею или сообщите об ошибке:\n\n';
    
    try {
      // Try native mail composer first (better UX)
      if (await MailComposer.isAvailableAsync()) {
        await MailComposer.composeAsync({
          recipients: ['support@bayna-yadayk.com'],
          subject,
          body,
        });
      } else {
        // Fallback to mailto: link
        const url = `mailto:support@bayna-yadayk.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          console.warn('Cannot open email client');
        }
      }
    } catch (error) {
      console.warn('Failed to open feedback:', error);
    }
  }, []);

  // Action: Request in-app review
  const rateApp = useCallback(async () => {
    try {
      if (await StoreReview.hasAction()) {
        // Use native in-app review (best UX)
        await StoreReview.requestReview();
      } else if (Platform.OS === 'android' && Application.applicationId) {
        // Fallback to Play Store
        await Linking.openURL(`market://details?id=${Application.applicationId}`);
      } else if (Platform.OS === 'ios') {
        // Fallback to App Store (need to configure app ID)
        console.warn('iOS App Store review not configured');
      }
    } catch (error) {
      console.warn('Failed to open review:', error);
    }
  }, []);

  return {
    isReady,
    settings,
    setSettings,
    toggle,
    appVersion,
    actions: {
      openFeedback,
      rateApp,
    },
  };
}


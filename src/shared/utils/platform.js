import { Platform, StatusBar } from 'react-native';

export function getStatusBarHeight() {
  return Platform.OS === 'web' ? 0 : (StatusBar.currentHeight || 0);
}

export function getPlatformStyles(webStyles = {}, nativeStyles = {}) {
  return Platform.OS === 'web' ? webStyles : nativeStyles;
}

export function isWeb() {
  return Platform.OS === 'web';
}

